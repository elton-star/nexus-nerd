import { ContentRow } from "@/components/content-row";
import { Hero } from "@/components/hero";
import { Newsletter } from "@/components/newsletter";
import { PostCard } from "@/components/post-card";
import { SectionHeading } from "@/components/section-heading";
import { posts } from "@/lib/posts";

export default function HomePage() {
  const featured = posts.find((post) => post.featured) ?? posts[0];
  const trending = posts.filter((post) => post.trending);

  return (
    <>
      <Hero post={featured} />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading title="Posts em destaque" kicker="Prime Video Geek" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.filter((post) => post.featured).map((post) => (
            <PostCard key={post.id} post={post} large />
          ))}
        </div>
      </section>

      <ContentRow title="Trending da semana" kicker="Mais comentados" posts={trending} />
      <ContentRow title="Marvel" posts={posts.filter((post) => post.category === "marvel")} />
      <ContentRow title="DC Comics" posts={posts.filter((post) => post.category === "dc-comics")} />
      <ContentRow title="Mangás" posts={posts.filter((post) => post.category === "mangas")} />
      <ContentRow title="Teorias populares" posts={posts.filter((post) => post.category === "teorias")} />
      <ContentRow title="Últimas notícias" posts={posts.slice().reverse()} />
      <Newsletter />
    </>
  );
}
