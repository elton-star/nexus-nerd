import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { SectionHeading } from "@/components/section-heading";
import { getCategory, categories } from "@/lib/categories";
import { getPostsByCategory } from "@/lib/posts";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);

  if (!category) {
    return {};
  }

  return {
    title: category.label,
    description: category.description
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = getCategory(slug);

  if (!category) {
    notFound();
  }

  const categoryPosts = getPostsByCategory(slug);

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
