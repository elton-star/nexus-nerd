"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Shield, UserRound, X } from "lucide-react";
import { useState } from "react";
import { categories } from "@/lib/categories";
import { useAuth } from "@/context/auth-context";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const links = [
    { href: "/", label: "Home" },
    ...categories.map((category) => ({ href: `/${category.slug}`, label: category.label }))
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-void/82 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Nexus Nerd">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-nexus-500 text-lg font-black shadow-glow">N</span>
          <span className="min-w-max text-xl font-black tracking-normal">
            Nexus <span className="text-nexus-400">Nerd</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                pathname === link.href ? "bg-white/12 text-white" : "text-white/66 hover:bg-white/8 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/busca"
            className="grid h-10 w-10 place-items-center rounded-md border border-white/10 bg-white/6 text-white/78 transition hover:bg-white/12"
            aria-label="Buscar"
            title="Buscar"
          >
            <Search size={18} />
          </Link>
          <Link
            href="/admin"
            className="grid h-10 w-10 place-items-center rounded-md border border-white/10 bg-white/6 text-white/78 transition hover:bg-white/12"
            aria-label="Painel admin"
            title="Painel admin"
          >
            <Shield size={18} />
          </Link>
          <Link
            href={user ? "/perfil" : "/login"}
            className="grid h-10 w-10 place-items-center rounded-md bg-nexus-500 text-white shadow-glow transition hover:bg-nexus-400"
            aria-label={user ? "Perfil" : "Login"}
            title={user ? "Perfil" : "Login"}
          >
            <UserRound size={18} />
          </Link>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-md border border-white/10 bg-white/6 lg:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-label="Abrir menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-obsidian px-4 py-4 lg:hidden">
          <div className="grid gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-semibold text-white/78 hover:bg-white/8"
              >
                {link.label}
              </Link>
            ))}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <Link className="rounded-md bg-white/8 p-3 text-center text-sm" href="/busca">
                Busca
              </Link>
              <Link className="rounded-md bg-white/8 p-3 text-center text-sm" href="/admin">
                Admin
              </Link>
              <Link className="rounded-md bg-nexus-500 p-3 text-center text-sm" href={user ? "/perfil" : "/login"}>
                {user ? "Perfil" : "Login"}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
