"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Share2, Timer } from "lucide-react";
import type { Comment, Post } from "@/types";
import { comments as seedComments, posts } from "@/lib/posts";
import { getCategory } from "@/lib/categories";
import { ContentRow } from "@/components/content-row";

export function PostDetail({ post }: { post: Post }) {
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>(seedComments.filter((comment) => comment.postSlug === post.slug));
  const category = getCategory(post.category);

  const related = useMemo(
    () => posts.filter((candidate) => candidate.category === post.category && candidate.id !== post.id),
    [post.category, post.id]
  );

  function addComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = String(form.get("message") ?? "").trim();

    if (!message) {
      return;
    }

    setComments((current) => [
      {
        id: crypto.randomUUID(),
        postSlug: post.slug,
        user: "Você",
        message,
        date: new Date().toISOString().slice(0, 10)
      },
      ...current
    ]);
    event.currentTarget.reset();
  }

  return (
    <>
      <article>
        <section
          className="relative min-h-[68vh] bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(5,2,10,.98), rgba(5,2,10,.58)), linear-gradient(0deg, #05020a 0%, transparent 38%), url(${post.cover})`
          }}
        >
          <div className="mx-auto flex min-h-[68vh] max-w-5xl flex-col justify-end px-4 pb-16 pt-20 sm:px-6 lg:px-8">
            <Link href={`/${post.category}`} className="mb-5 text-xs font-black uppercase text-nexus-400">
              {category?.label}
            </Link>
            <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-6xl">{post.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/68">{post.excerpt}</p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-white/54">
              <span>{post.author}</span>
              <span>{new Date(post.date).toLocaleDateString("pt-BR")}</span>
              <span className="flex items-center gap-1">
                <Timer size={16} /> {post.readTime}
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_220px] lg:px-8">
          <div className="prose prose-invert max-w-none prose-p:text-white/72 prose-p:leading-8">
            <p>{post.content}</p>
            <p>
              No Nexus Nerd, a análise olha para a experiência do fã: o impacto nas comunidades, as possibilidades de
              continuidade e a forma como cada lançamento conversa com outras mídias. Esse é o tipo de assunto que cresce
              depois da estreia, quando teorias, leituras e detalhes começam a se conectar.
            </p>
          </div>

          <aside className="glass h-fit rounded-lg p-4">
            <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
              <button
                onClick={() => {
                  setLiked((current) => !current);
                  setLikes((current) => current + (liked ? -1 : 1));
                }}
                className={`flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/10 text-sm font-black transition ${
                  liked ? "bg-nexus-500 text-white" : "bg-white/6 text-white/78 hover:bg-white/12"
                }`}
              >
                <Heart size={17} fill={liked ? "currentColor" : "none"} /> {likes}
              </button>
              <a
                href="#comentarios"
                className="flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/6 text-sm font-black text-white/78 transition hover:bg-white/12"
              >
                <MessageCircle size={17} /> {comments.length}
              </a>
              <button className="flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/6 text-sm font-black text-white/78 transition hover:bg-white/12">
                <Share2 size={17} /> Enviar
              </button>
            </div>
          </aside>
        </section>

        <section id="comentarios" className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="glass rounded-lg p-5 sm:p-6">
            <h2 className="text-2xl font-black">Comentários</h2>
            <form onSubmit={addComment} className="mt-5 grid gap-3">
              <textarea
                name="message"
                required
                className="min-h-28 rounded-md border border-white/10 bg-black/30 p-4 text-sm outline-none placeholder:text-white/32 focus:border-nexus-400"
                placeholder="Entre na conversa..."
              />
              <button className="w-fit rounded-md bg-nexus-500 px-5 py-3 text-sm font-black transition hover:bg-nexus-400">
                Publicar
              </button>
            </form>
            <div className="mt-6 grid gap-3">
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <strong>{comment.user}</strong>
                    <span className="text-xs text-white/42">{new Date(comment.date).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/66">{comment.message}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </article>

      {related.length ? <ContentRow title="Relacionados" posts={related} /> : null}
    </>
  );
}
