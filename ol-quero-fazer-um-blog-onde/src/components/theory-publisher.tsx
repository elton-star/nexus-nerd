"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Lightbulb, Send } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { usePosts } from "@/context/posts-context";
import type { Post } from "@/types";

const defaultCover =
  "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1600&q=80";

export function TheoryPublisher() {
  const { user } = useAuth();
  const { createPost } = usePosts();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function publishTheory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      return;
    }

    setLoading(true);
    setMessage("");

    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const slugBase = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const created: Post = {
      id: crypto.randomUUID(),
      slug: `${slugBase}-${Date.now().toString().slice(-6)}`,
      title,
      excerpt: String(form.get("excerpt") ?? "").trim(),
      content: String(form.get("content") ?? "").trim(),
      category: "teorias",
      cover: String(form.get("cover") ?? "").trim() || defaultCover,
      author: user.name,
      date: new Date().toISOString(),
      readTime: "4 min",
      likes: 0,
      comments: 0,
      tags: ["Teorias", "Comunidade"]
    };

    await createPost(created);

    event.currentTarget.reset();
    setLoading(false);
    setMessage("Teoria publicada com sucesso.");
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="glass rounded-lg p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-2xl font-black">
            <Lightbulb className="text-nexus-400" size={22} /> Publique sua teoria
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/58">
            Entre na sua conta para compartilhar teorias com a comunidade Nexus Nerd.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link className="rounded-md bg-nexus-500 px-5 py-3 text-sm font-black transition hover:bg-nexus-400" href="/login">
              Entrar
            </Link>
            <Link className="rounded-md border border-white/10 bg-white/6 px-5 py-3 text-sm font-black transition hover:bg-white/12" href="/register">
              Criar conta
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
      <form onSubmit={publishTheory} className="glass rounded-lg p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="flex items-center gap-2 text-2xl font-black">
            <Lightbulb className="text-nexus-400" size={22} /> Publique sua teoria
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/58">
            Compartilhe sua ideia como {user.name}. Sua publicação aparecerá nesta página.
          </p>
        </div>

        <div className="grid gap-4">
          <input
            name="title"
            required
            placeholder="Título da teoria"
            className="min-h-12 rounded-md border border-white/10 bg-black/30 px-4 outline-none placeholder:text-white/32 focus:border-nexus-400"
          />
          <textarea
            name="excerpt"
            required
            placeholder="Resumo da sua teoria"
            className="min-h-20 rounded-md border border-white/10 bg-black/30 p-4 outline-none placeholder:text-white/32 focus:border-nexus-400"
          />
          <textarea
            name="content"
            required
            placeholder="Explique sua teoria"
            className="min-h-36 rounded-md border border-white/10 bg-black/30 p-4 outline-none placeholder:text-white/32 focus:border-nexus-400"
          />
          <input
            name="cover"
            placeholder="URL da imagem de capa (opcional)"
            className="min-h-12 rounded-md border border-white/10 bg-black/30 px-4 outline-none placeholder:text-white/32 focus:border-nexus-400"
          />
          {message ? <p className="rounded-md border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-200">{message}</p> : null}
          <button
            disabled={loading}
            className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-md bg-nexus-500 px-5 text-sm font-black transition hover:bg-nexus-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={17} /> {loading ? "Publicando..." : "Publicar teoria"}
          </button>
        </div>
      </form>
    </section>
  );
}
