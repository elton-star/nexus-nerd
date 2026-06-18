"use client";

import { ContentRow } from "@/components/content-row";
import { Hero } from "@/components/hero";
import { Newsletter } from "@/components/newsletter";
import { PostCard } from "@/components/post-card";
import { SectionHeading } from "@/components/section-heading";
import { usePosts } from "@/context/posts-context";

export default function HomePage() {
  const { posts } = usePosts();
  const sortedPosts = posts.slice().sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime());
  const latestPosts = sortedPosts.slice(0, 3);
  const latestNews = sortedPosts.filter((post) => post.category === "noticias").slice(0, 3);
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const trending = sortedPosts.filter((post) => new Date(post.date).getTime() >= weekAgo);
  const featured = sortedPosts[0];

  if (!featured) {
    return (
      <div className="mx-auto grid min-h-screen max-w-3xl place-items-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="glass rounded-lg p-7">
          <h1 className="text-4xl font-black">Nenhum post publicado ainda</h1>
          <p className="mt-3 text-sm leading-6 text-white/58">Publique o primeiro post pelo painel admin.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Hero posts={sortedPosts.slice(0, 6)} post={featured} />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading title="Posts em destaque" kicker="Prime Video Geek" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map((post) => (
            <PostCard key={post.id} post={post} large />
          ))}
        </div>
      </section>

      <ContentRow title="Trending da semana" kicker="Publicados nos últimos 7 dias" posts={trending} />
      <ContentRow title="Marvel" posts={posts.filter((post) => post.category === "marvel")} />
      <ContentRow title="DC Comics" posts={posts.filter((post) => post.category === "dc-comics")} />
      <ContentRow title="Mangás" posts={posts.filter((post) => post.category === "mangas")} />
      <ContentRow title="Teorias populares" posts={posts.filter((post) => post.category === "teorias")} />
      <ContentRow title="Últimas notícias" posts={latestNews} />
      <Newsletter />
    </>
  );
}
