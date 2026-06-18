"use client";

import { Send } from "lucide-react";
import { useState } from "react";

export function Newsletter() {
  const [sent, setSent] = useState(false);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="glass grid gap-6 rounded-lg p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
        <div>
          <p className="mb-2 text-xs font-black uppercase text-nexus-400">Newsletter</p>
          <h2 className="text-2xl font-black sm:text-3xl">Entre no radar do multiverso geek</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
            Curadoria semanal com notícias, teorias, listas e estreias que valem seu tempo.
          </p>
        </div>
        <form
          className="flex min-w-0 flex-col gap-3 sm:w-[420px] sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
          }}
        >
          <input
            className="min-h-12 flex-1 rounded-md border border-white/10 bg-black/30 px-4 text-sm outline-none transition placeholder:text-white/32 focus:border-nexus-400"
            type="email"
            placeholder="seu@email.com"
            required
          />
          <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-nexus-500 px-5 text-sm font-black transition hover:bg-nexus-400">
            <Send size={17} /> {sent ? "Enviado" : "Assinar"}
          </button>
        </form>
      </div>
    </section>
  );
}
