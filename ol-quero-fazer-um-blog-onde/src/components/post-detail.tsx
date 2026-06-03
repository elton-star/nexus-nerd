"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { Bookmark, ExternalLink, Heart, MessageCircle, Share2, Timer } from "lucide-react";
import type { Comment, Post } from "@/types";
import { comments as seedComments } from "@/lib/posts";
import { getCategory } from "@/lib/categories";
import { ContentRow } from "@/components/content-row";
import { usePosts } from "@/context/posts-context";
import { useAuth } from "@/context/auth-context";
import { RelativeTime } from "@/components/relative-time";

export function PostDetail({ post }: { post: Post }) {
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState<Comment[]>(seedComments.filter((comment) => comment.postSlug === post.slug));
  const category = getCategory(post.category);
  const { posts } = usePosts();
  const { user, toggleLike, toggleFavorite, addRecentComment } = useAuth();
  const liked = user?.likedPostIds.includes(post.id) ?? false;
  const favorite = user?.favoritePostIds.includes(post.id) ?? false;
  const articleBlocks = chunkArticleLines(buildArticleLines(post.content), 13);

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
    addRecentComment({
      id: crypto.randomUUID(),
      postSlug: post.slug,
      user: user?.name ?? "Visitante",
      message,
      date: new Date().toISOString().slice(0, 10)
    });
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
              <RelativeTime date={post.date} />
              <span className="flex items-center gap-1">
                <Timer size={16} /> {post.readTime}
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_220px] lg:px-8">
          <div className="prose prose-invert max-w-none prose-p:text-white/72 prose-p:leading-8">
            {articleBlocks.map((block, blockIndex) => (
              <div key={`block-${blockIndex}`} className="not-prose">
                <div className="grid gap-5">
                  {mergeDisplayParagraphs(block).map((paragraph, paragraphIndex) => (
                    paragraph.kind === "heading" ? (
                      <h2 key={`${paragraph.text}-${paragraphIndex}`} className="pt-3 text-2xl font-black leading-tight text-white">
                        {paragraph.text}
                      </h2>
                    ) : (
                      <p key={`${paragraph.text}-${paragraphIndex}`} className="text-base leading-8 text-white/72">
                        {paragraph.text}
                      </p>
                    )
                  ))}
                </div>
                {post.gallery?.[blockIndex] ? (
                  <ArticleImage image={post.gallery[blockIndex]} title={post.title} index={blockIndex} />
                ) : null}
              </div>
            ))}
            {post.gallery?.slice(articleBlocks.length).map((image, index) => (
              <ArticleImage key={image} image={image} title={post.title} index={index + articleBlocks.length} />
            ))}
            {post.affiliateLink ? (
              <div className="not-prose my-8 rounded-lg border border-nexus-400/24 bg-nexus-500/12 p-5">
                <p className="mb-4 text-sm font-semibold leading-6 text-white/70">
                  Produto citado no artigo disponível pelo link de afiliado Nexus.
                </p>
                <a
                  href={post.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-nexus-500 px-5 text-sm font-black text-white shadow-glow transition hover:bg-nexus-400"
                >
                  Ver produto <ExternalLink size={17} />
                </a>
              </div>
            ) : null}
          </div>

          <aside className="glass h-fit rounded-lg p-4">
            <div className="grid grid-cols-4 gap-2 lg:grid-cols-1">
              <button
                onClick={() => {
                  if (!user) {
                    return;
                  }

                  const nextLiked = toggleLike(post.id);
                  setLikes((current) => current + (nextLiked ? 1 : -1));
                }}
                className={`flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/10 text-sm font-black transition ${
                  liked ? "bg-nexus-500 text-white" : "bg-white/6 text-white/78 hover:bg-white/12"
                }`}
              >
                <Heart size={17} fill={liked ? "currentColor" : "none"} /> {likes}
              </button>
              <button
                onClick={() => toggleFavorite(post.id)}
                className={`flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/10 text-sm font-black transition ${
                  favorite ? "bg-nexus-500 text-white" : "bg-white/6 text-white/78 hover:bg-white/12"
                }`}
                title={user ? "Salvar nos favoritos" : "Entre para salvar"}
              >
                <Bookmark size={17} fill={favorite ? "currentColor" : "none"} />
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

type ArticleTextLine = {
  text: string;
  paragraphEnd: boolean;
  kind: "paragraph" | "heading";
};

function buildArticleLines(content: string): ArticleTextLine[] {
  return content
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .flatMap((paragraph) => {
      if (paragraph.startsWith("##")) {
        return [
          {
            text: paragraph.replace(/^##\s*/, ""),
            paragraphEnd: true,
            kind: "heading" as const
          }
        ];
      }

      return wrapParagraph(paragraph, 78);
    });
}

function wrapParagraph(paragraph: string, maxCharacters: number): ArticleTextLine[] {
  const words = paragraph.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length > maxCharacters && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = nextLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.map((text, index) => ({
    text,
    paragraphEnd: index === lines.length - 1,
    kind: "paragraph" as const
  }));
}

function chunkArticleLines(lines: ArticleTextLine[], size: number) {
  const chunks: ArticleTextLine[][] = [];

  for (let index = 0; index < lines.length; index += size) {
    chunks.push(lines.slice(index, index + size));
  }

  return chunks;
}

function mergeDisplayParagraphs(lines: ArticleTextLine[]) {
  const paragraphs: Array<{ text: string; kind: "paragraph" | "heading" }> = [];
  let currentParagraph = "";

  lines.forEach((line) => {
    if (line.kind === "heading") {
      if (currentParagraph) {
        paragraphs.push({ text: currentParagraph, kind: "paragraph" });
        currentParagraph = "";
      }

      paragraphs.push({ text: line.text, kind: "heading" });
      return;
    }

    currentParagraph = currentParagraph ? `${currentParagraph} ${line.text}` : line.text;

    if (line.paragraphEnd) {
      paragraphs.push({ text: currentParagraph, kind: "paragraph" });
      currentParagraph = "";
    }
  });

  if (currentParagraph) {
    paragraphs.push({ text: currentParagraph, kind: "paragraph" });
  }

  return paragraphs;
}

function ArticleImage({ image, title, index }: { image: string; title: string; index: number }) {
  return (
    <div className="not-prose my-8">
      <img
        src={image}
        alt={`Imagem interna ${index + 1} de ${title}`}
        className="h-auto max-h-[680px] w-full rounded-lg border border-white/10 object-cover shadow-2xl"
        loading={index === 0 ? "eager" : "lazy"}
      />
    </div>
  );
}
