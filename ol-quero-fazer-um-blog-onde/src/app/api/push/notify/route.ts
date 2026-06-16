import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import webpush from "web-push";

type PushRow = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

type NotifyBody = {
  title?: string;
  body?: string;
  url?: string;
  image?: string;
  tag?: string;
};

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

function configureWebPush() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:admin@nexusnerd.com";

  if (!publicKey || !privateKey) {
    return false;
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  return true;
}

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();

  if (!supabase || !configureWebPush()) {
    return NextResponse.json({ ok: false, message: "Push/Supabase não configurado." }, { status: 500 });
  }

  const body = (await request.json()) as NotifyBody;
  const { data, error } = await supabase.from("push_subscriptions").select("endpoint,p256dh,auth");

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  const payload = JSON.stringify({
    title: body.title || "Nexus Nerd",
    body: body.body || "Tem artigo novo para ler agora.",
    url: body.url || "/",
    image: body.image || "/nexus-nerd-logo.png",
    tag: body.tag || "nexus-nerd-new-post"
  });

  const rows = (data ?? []) as PushRow[];
  const results = await Promise.allSettled(
    rows.map((row) =>
      webpush.sendNotification(
        {
          endpoint: row.endpoint,
          keys: {
            p256dh: row.p256dh,
            auth: row.auth
          }
        },
        payload
      )
    )
  );

  const staleEndpoints = results
    .map((result, index) => ({ result, endpoint: rows[index]?.endpoint }))
    .filter(({ result }) => result.status === "rejected" && [404, 410].includes((result.reason as { statusCode?: number }).statusCode ?? 0))
    .map(({ endpoint }) => endpoint)
    .filter(Boolean);

  if (staleEndpoints.length) {
    await supabase.from("push_subscriptions").delete().in("endpoint", staleEndpoints);
  }

  return NextResponse.json({
    ok: true,
    sent: results.filter((result) => result.status === "fulfilled").length,
    failed: results.filter((result) => result.status === "rejected").length
  });
}
