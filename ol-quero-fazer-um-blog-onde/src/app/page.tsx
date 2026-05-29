"use client";

import { ContentRow } from "@/components/content-row";
import { Hero } from "@/components/hero";
import { Newsletter } from "@/components/newsletter";
import { PostCard } from "@/components/post-card";
import { SectionHeading } from "@/components/section-heading";
import { usePosts } from "@/context/posts-context";

export default function HomePage() {
  const { posts } = usePosts();
  const featured = posts.find((post) => post.featured) ?? posts[0];
  const trending = posts.filter((post) => post.trending);
  const featuredPosts = posts.filter((post) => post.featured);

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
      <Hero posts={posts.slice(0, 6)} post={featured} />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading title="Posts em destaque" kicker="Prime Video Geek" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(featuredPosts.length ? featuredPosts : posts.slice(0, 3)).map((post) => (
            <PostCard key={post.id} post={post} large />
          ))}
        </div>
      </section>

      <ContentRow title="Trending da semana" kicker="Mais comentados" posts={trending.length ? trending : posts.slice(0, 6)} />
      <ContentRow title="Marvel" posts={posts.filter((post) => post.category === "marvel")} />
      <ContentRow title="DC Comics" posts={posts.filter((post) => post.category === "dc-comics")} />
      <ContentRow title="Mangás" posts={posts.filter((post) => post.category === "mangas")} />
      <ContentRow title="Teorias populares" posts={posts.filter((post) => post.category === "teorias")} />
      <ContentRow title="Últimas notícias" posts={posts.slice(0, 8)} />
      <Newsletter />
    </>
  );
}
