"use client";

import Link from "next/link";
import { Bookmark, Heart, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { posts } from "@/lib/posts";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const favorites = posts.slice(0, 3);

  if (!user) {
    return (
      <div className="mx-auto min-h-screen max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black">Entre para acessar seu perfil</h1>
        <Link className="mt-6 inline-flex rounded-md bg-nexus-500 px-5 py-3 text-sm font-black" href="/login">
          Fazer login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="glass rounded-lg p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-20 w-20 place-items-center rounded-lg bg-nexus-500 text-2xl font-black shadow-glow">
              {user.avatar}
            </div>
            <div>
              <p className="text-xs font-black uppercase text-nexus-400">Perfil Nexus</p>
              <h1 className="text-3xl font-black">{user.name}</h1>
              <p className="text-sm text-white/52">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/6 px-4 text-sm font-black"
          >
            <LogOut size={17} /> Sair
          </button>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          { label: "Posts curtidos", value: "24", icon: Heart },
          { label: "Salvos", value: "12", icon: Bookmark },
          { label: "Permissão", value: user.role, icon: Shield }
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-white/10 bg-white/6 p-5">
            <item.icon className="mb-4 text-nexus-400" size={22} />
            <p className="text-sm text-white/52">{item.label}</p>
            <strong className="mt-1 block text-2xl capitalize">{item.value}</strong>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="mb-5 text-2xl font-black">Sua lista</h2>
        <div className="grid gap-3">
          {favorites.map((post) => (
            <Link key={post.id} href={`/artigo/${post.slug}`} className="rounded-lg border border-white/10 bg-white/6 p-4 transition hover:bg-white/10">
              <strong>{post.title}</strong>
              <p className="mt-1 text-sm text-white/54">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
