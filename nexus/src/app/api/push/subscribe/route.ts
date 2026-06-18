import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type PushSubscriptionBody = {
  userId?: string;
  subscription?: PushSubscriptionJSON;
};

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({ ok: false, message: "Supabase service role não configurado." }, { status: 500 });
  }

  const body = (await request.json()) as PushSubscriptionBody;
  const endpoint = body.subscription?.endpoint;
  const p256dh = body.subscription?.keys?.p256dh;
  const auth = body.subscription?.keys?.auth;

  if (!body.userId || !endpoint || !p256dh || !auth) {
    return NextResponse.json({ ok: false, message: "Inscrição push inválida." }, { status: 400 });
  }

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: body.userId,
      endpoint,
      p256dh,
      auth,
      updated_at: new Date().toISOString()
    },
    { onConflict: "endpoint" }
  );

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
