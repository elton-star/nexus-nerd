"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PostDetail } from "@/components/post-detail";
import { usePosts } from "@/context/posts-context";

export default function ArticlePage() {
  const params = useParams<{ slug: string }>();
  const { getPostBySlug } = usePosts();
  const post = getPostBySlug(params.slug);

  if (!post) {
    return (
      <div className="mx-auto grid min-h-screen max-w-3xl place-items-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="glass rounded-lg p-7">
          <h1 className="text-4xl font-black">Post não encontrado</h1>
          <p className="mt-3 text-sm leading-6 text-white/58">Esse artigo pode ter sido editado ou removido no painel.</p>
          <Link className="mt-6 inline-flex rounded-md bg-nexus-500 px-5 py-3 text-sm font-black" href="/">
            Voltar para Home
          </Link>
        </div>
      </div>
    );
  }

  return <PostDetail post={post} />;
}
