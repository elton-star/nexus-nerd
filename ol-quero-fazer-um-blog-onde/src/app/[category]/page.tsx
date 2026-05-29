"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { SectionHeading } from "@/components/section-heading";
import { getCategory } from "@/lib/categories";
import { usePosts } from "@/context/posts-context";

export default function CategoryPage() {
  const params = useParams<{ category: string }>();
  const category = getCategory(params.category);
  const { posts } = usePosts();

  if (!category) {
    return (
      <div className="mx-auto grid min-h-screen max-w-3xl place-items-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="glass rounded-lg p-7">
          <h1 className="text-4xl font-black">Categoria não encontrada</h1>
          <Link className="mt-6 inline-flex rounded-md bg-nexus-500 px-5 py-3 text-sm font-black" href="/">
            Voltar para Home
          </Link>
        </div>
      </div>
    );
  }

  const categoryPosts = posts.filter((post) => post.category === params.category);

  return (
    <div className="min-h-screen">
      <section className="border-b border-white/10 bg-black/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="mb-3 text-xs font-black uppercase text-nexus-400">Nexus Channel</p>
          <h1 className="text-4xl font-black sm:text-6xl">{category.label}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/62">{category.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading title={`Tudo sobre ${category.label}`} />
        {categoryPosts.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-white/10 bg-white/6 p-6 text-white/58">
            Nenhum post publicado nesta categoria ainda.
          </div>
        )}
      </section>
    </div>
  );
}
