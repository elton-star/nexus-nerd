"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Timer } from "lucide-react";
import type { Post } from "@/types";
import { getCategory } from "@/lib/categories";
import { RelativeTime } from "@/components/relative-time";

export function PostCard({ post, large = false }: { post: Post; large?: boolean }) {
  const category = getCategory(post.category);

  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`card-shine group min-w-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] shadow-2xl ${
        large ? "h-[430px]" : "h-[330px]"
      }`}
    >
      <Link href={`/artigo/${post.slug}`} className="flex h-full flex-col">
        <div
          className="relative flex-1 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(5,2,10,.08), rgba(5,2,10,.92)), url(${post.cover})`
          }}
        >
          <div className="absolute left-4 top-4 rounded-md bg-nexus-500/90 px-3 py-1 text-xs font-black uppercase">
            {category?.label}
          </div>
        </div>
        <div className="p-4">
          <h3 className={`${large ? "text-2xl" : "text-lg"} line-clamp-2 font-black leading-tight text-white`}>
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/60">{post.excerpt}</p>
          <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-white/48">
            <RelativeTime date={post.date} />
            <span className="flex items-center gap-1">
              <Timer size={14} /> {post.readTime}
            </span>
            <span className="flex items-center gap-1">
              <Heart size={14} /> {post.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle size={14} /> {post.comments}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
