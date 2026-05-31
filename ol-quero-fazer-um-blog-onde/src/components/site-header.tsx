"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, Menu, Search, Shield, UserRound, X } from "lucide-react";
import { useState } from "react";
import { categories } from "@/lib/categories";
import { useAuth } from "@/context/auth-context";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();

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
          {user?.role === "admin" ? (
            <Link
              href="/admin"
              className="grid h-10 w-10 place-items-center rounded-md border border-white/10 bg-white/6 text-white/78 transition hover:bg-white/12"
              aria-label="Painel admin"
              title="Painel admin"
            >
              <Shield size={18} />
            </Link>
          ) : null}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((current) => !current)}
                className="inline-flex min-h-10 items-center gap-2 rounded-md bg-nexus-500 px-3 text-sm font-black text-white shadow-glow transition hover:bg-nexus-400"
              >
                <span className="grid h-7 w-7 place-items-center rounded-md bg-white/18 text-xs">{user.avatar}</span>
                <ChevronDown size={16} />
              </button>
              {profileOpen ? (
                <div className="absolute right-0 top-12 w-64 rounded-lg border border-white/10 bg-obsidian p-3 shadow-2xl">
                  <div className="border-b border-white/10 px-2 pb-3">
                    <p className="font-black">{user.name}</p>
                    <p className="text-xs text-white/48">{user.email}</p>
                  </div>
                  <Link
                    href="/perfil"
                    onClick={() => setProfileOpen(false)}
                    className="mt-2 flex items-center gap-2 rounded-md px-3 py-3 text-sm font-bold text-white/72 hover:bg-white/8"
                  >
                    <UserRound size={16} /> Ver perfil
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-3 text-left text-sm font-bold text-white/72 hover:bg-white/8"
                  >
                    <LogOut size={16} /> Fazer logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md border border-white/10 bg-white/6 px-4 py-3 text-sm font-black text-white/78 transition hover:bg-white/12"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-nexus-500 px-4 py-3 text-sm font-black text-white shadow-glow transition hover:bg-nexus-400"
              >
                Criar Conta
              </Link>
            </>
          )}
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
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link className="rounded-md bg-white/8 p-3 text-center text-sm" href="/busca">
                Busca
              </Link>
              {user?.role === "admin" ? (
                <Link className="rounded-md bg-white/8 p-3 text-center text-sm" href="/admin">
                  Admin
                </Link>
              ) : null}
            </div>
            {user ? (
              <div className="grid gap-2 pt-2">
                <Link className="rounded-md bg-nexus-500 p-3 text-center text-sm font-black" href="/perfil">
                  {user.avatar} Perfil
                </Link>
                <button onClick={logout} className="rounded-md bg-white/8 p-3 text-center text-sm font-black">
                  Sair
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link className="rounded-md bg-white/8 p-3 text-center text-sm font-black" href="/login">
                  Entrar
                </Link>
                <Link className="rounded-md bg-nexus-500 p-3 text-center text-sm font-black" href="/register">
                  Criar Conta
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
