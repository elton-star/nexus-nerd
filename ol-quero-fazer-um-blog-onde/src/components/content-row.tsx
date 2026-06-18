"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Post } from "@/types";
import { PostCard } from "@/components/post-card";

export function ContentRow({ title, kicker, posts }: { title: string; kicker?: string; posts: Post[] }) {
  const rowRef = useRef<HTMLDivElement>(null);

  function scrollRow(direction: "left" | "right") {
    rowRef.current?.scrollBy({
      left: direction === "right" ? 760 : -760,
      behavior: "smooth"
    });
  }

  if (!posts.length) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          {kicker ? <p className="mb-2 text-xs font-black uppercase text-nexus-400">{kicker}</p> : null}
          <h2 className="text-2xl font-black tracking-normal text-white sm:text-3xl">{title}</h2>
        </div>
        {posts.length > 1 ? (
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => scrollRow("left")}
              className="grid h-10 w-10 place-items-center rounded-md border border-white/10 bg-white/8 text-white/78 transition hover:bg-white/14"
              aria-label={`Voltar ${title}`}
              title="Voltar"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => scrollRow("right")}
              className="grid h-10 w-10 place-items-center rounded-md border border-white/10 bg-nexus-500 text-white shadow-glow transition hover:bg-nexus-400"
              aria-label={`Avançar ${title}`}
              title="Avançar"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        ) : null}
      </div>
      <div ref={rowRef} className="scrollbar-none flex snap-x gap-4 overflow-x-auto scroll-smooth pb-3">
        {posts.map((post) => (
          <div key={post.id} className="w-[280px] shrink-0 snap-start sm:w-[340px]">
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </section>
  );
}
