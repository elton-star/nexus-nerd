"use client";

import { motion } from "framer-motion";

export function AuthInput({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <motion.label className="grid gap-2 text-sm font-bold text-white/72" whileFocus={{ scale: 1.01 }}>
      {label}
      <input
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="min-h-12 rounded-md border border-white/10 bg-black/35 px-4 outline-none transition placeholder:text-white/30 focus:border-nexus-400 focus:bg-black/50 focus:shadow-[0_0_0_4px_rgba(139,61,255,.14)]"
      />
    </motion.label>
  );
}
