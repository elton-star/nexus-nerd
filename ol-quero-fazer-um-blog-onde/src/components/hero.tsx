"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";
import type { Post } from "@/types";

export function Hero({ post }: { post: Post }) {
  return (
    <section
      className="relative min-h-[78vh] overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(5,2,10,.97) 0%, rgba(5,2,10,.72) 48%, rgba(5,2,10,.22) 100%), linear-gradient(0deg, #05020a 0%, transparent 34%), url(${post.cover})`
      }}
    >
      <div className="mx-auto flex min-h-[78vh] max-w-7xl items-center px-4 pb-16 pt-14 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="max-w-3xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-nexus-400/30 bg-nexus-500/18 px-3 py-2 text-xs font-black uppercase text-nexus-400">
            <Sparkles size={15} /> Destaque Nexus
          </div>
          <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-normal text-white sm:text-6xl lg:text-7xl">
            Nexus Nerd
          </h1>
          <p className="mt-5 max-w-2xl text-xl font-semibold leading-8 text-white/78">{post.title}</p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/58">{post.excerpt}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/artigo/${post.slug}`}
              className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-black text-void transition hover:bg-nexus-400 hover:text-white"
            >
              <Play size={18} fill="currentColor" /> Ler agora
            </Link>
            <Link
              href="/teorias"
              className="inline-flex items-center rounded-md border border-white/12 bg-white/8 px-5 py-3 text-sm font-black text-white transition hover:bg-white/14"
            >
              Explorar teorias
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
