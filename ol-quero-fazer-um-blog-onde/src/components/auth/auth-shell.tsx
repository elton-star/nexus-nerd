"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function AuthShell({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_12%,rgba(139,61,255,.32),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(236,72,153,.2),transparent_28%),linear-gradient(135deg,#05020a,#100720_48%,#05020a)]" />
      <div className="absolute left-1/2 top-16 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-nexus-500/20 blur-3xl" />

      <div className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1fr_460px]">
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          className="max-w-2xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-nexus-400/30 bg-nexus-500/18 px-3 py-2 text-xs font-black uppercase text-nexus-400">
            <Sparkles size={15} /> Nexus ID
          </div>
          <h1 className="text-4xl font-black leading-tight sm:text-6xl">{title}</h1>
          <p className="mt-5 text-base leading-7 text-white/62">{subtitle}</p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="glass rounded-lg p-5 shadow-glow sm:p-7"
        >
          {children}
        </motion.section>
      </div>
    </div>
  );
}
