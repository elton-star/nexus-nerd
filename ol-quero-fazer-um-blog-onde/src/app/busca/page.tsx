"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { PostCard } from "@/components/post-card";
import { SectionHeading } from "@/components/section-heading";
import { searchPosts } from "@/lib/posts";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchPosts(query), [query]);

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading title="Busca inteligente" kicker="Nexus Finder" />
      <label className="mb-8 flex min-h-14 items-center gap-3 rounded-lg border border-white/10 bg-white/6 px-4 focus-within:border-nexus-400">
        <Search size={20} className="text-white/44" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-full flex-1 bg-transparent text-base font-semibold outline-none placeholder:text-white/34"
          placeholder="Buscar por Marvel, DC, animes, teorias..."
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
