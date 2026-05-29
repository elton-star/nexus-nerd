"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Post } from "@/types";

export function Hero({ post, posts }: { post?: Post; posts?: Post[] }) {
  const slides = useMemo(() => (posts?.length ? posts : post ? [post] : []), [post, posts]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activePost = slides[activeIndex] ?? slides[0];

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  function previousSlide() {
    setActiveIndex((current) => (current === 0 ? slides.length - 1 : current - 1));
  }

  function nextSlide() {
    setActiveIndex((current) => (current + 1) % slides.length);
  }

  if (!activePost) {
    return null;
  }

  return (
    <section
      className="relative min-h-[78vh] overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(5,2,10,.97) 0%, rgba(5,2,10,.72) 48%, rgba(5,2,10,.22) 100%), linear-gradient(0deg, #05020a 0%, transparent 34%), url(${activePost.cover})`
      }}
    >
      <div className="mx-auto grid min-h-[78vh] max-w-7xl items-center gap-8 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePost.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-nexus-400/30 bg-nexus-500/18 px-3 py-2 text-xs font-black uppercase text-nexus-400">
              <Sparkles size={15} /> Carrossel Nexus
            </div>
            <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-normal text-white sm:text-6xl lg:text-7xl">
              Nexus Nerd
            </h1>
            <p className="mt-5 max-w-2xl text-xl font-semibold leading-8 text-white/78">{activePost.title}</p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/58">{activePost.excerpt}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/artigo/${activePost.slug}`}
                className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-black text-void transition hover:bg-nexus-400 hover:text-white"
              >
                <Play size={18} fill="currentColor" /> Ler agora
              </Link>
              <Link
                href={`/${activePost.category}`}
                className="inline-flex items-center rounded-md border border-white/12 bg-white/8 px-5 py-3 text-sm font-black text-white transition hover:bg-white/14"
              >
                Ver categoria
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {slides.length > 1 ? (
          <div className="glass rounded-lg p-3">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-black uppercase text-white/46">Posts em destaque</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={previousSlide}
                  className="grid h-9 w-9 place-items-center rounded-md bg-white/8 text-white/72 transition hover:bg-white/14"
                  aria-label="Post anterior"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="grid h-9 w-9 place-items-center rounded-md bg-white/8 text-white/72 transition hover:bg-white/14"
                  aria-label="Próximo post"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
            <div className="grid gap-2">
              {slides.slice(0, 5).map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`grid min-h-[86px] grid-cols-[88px_1fr] gap-3 rounded-md border p-2 text-left transition ${
                    activeIndex === index ? "border-nexus-400/50 bg-nexus-500/18" : "border-white/10 bg-white/6 hover:bg-white/10"
                  }`}
                >
                  <span
                    className="h-full min-h-[70px] rounded-md bg-cover bg-center"
                    style={{ backgroundImage: `url(${slide.cover})` }}
                  />
                  <span className="min-w-0">
                    <span className="line-clamp-2 text-sm font-black leading-5 text-white">{slide.title}</span>
                    <span className="mt-1 line-clamp-2 text-xs leading-5 text-white/50">{slide.excerpt}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
