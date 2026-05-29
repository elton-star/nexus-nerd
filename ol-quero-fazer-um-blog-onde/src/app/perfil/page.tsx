"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark, Edit3, Heart, LogOut, MessageCircle, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { comments, posts } from "@/lib/posts";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const favorites = posts.slice(0, 3);
  const recentComments = comments.slice(0, 3);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  if (!user) {
    return (
      <div className="mx-auto grid min-h-screen max-w-3xl place-items-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="glass rounded-lg p-7">
          <h1 className="text-4xl font-black">Entre para acessar seu perfil</h1>
          <p className="mt-3 text-sm leading-6 text-white/58">Seu perfil Nexus aparece apenas depois do login.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link className="rounded-md bg-white/8 px-5 py-3 text-sm font-black" href="/login">
              Entrar
            </Link>
            <Link className="rounded-md bg-nexus-500 px-5 py-3 text-sm font-black" href="/register">
              Criar Conta
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="glass overflow-hidden rounded-lg"
      >
        <div className="h-36 bg-[radial-gradient(circle_at_20%_0%,rgba(139,61,255,.58),transparent_32%),linear-gradient(90deg,#140a27,#05020a)]" />
        <div className="p-6 pt-0 sm:p-8 sm:pt-0">
          <div className="-mt-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="grid h-24 w-24 place-items-center rounded-lg border-4 border-void bg-nexus-500 text-3xl font-black shadow-glow">
                {user.avatar}
              </div>
              <div className="pb-1">
                <p className="text-xs font-black uppercase text-nexus-400">Perfil Nexus</p>
                <h1 className="text-3xl font-black">{user.name}</h1>
                <p className="text-sm text-white/52">{user.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/6 px-4 text-sm font-black transition hover:bg-white/12">
                <Edit3 size={17} /> Editar perfil
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-nexus-500 px-4 text-sm font-black transition hover:bg-nexus-400"
              >
                <LogOut size={17} /> Logout
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          { label: "Posts curtidos", value: "24", icon: Heart },
          { label: "Favoritos", value: favorites.length, icon: Bookmark },
          { label: "Permissão", value: user.role, icon: Shield }
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-white/10 bg-white/6 p-5">
            <item.icon className="mb-4 text-nexus-400" size={22} />
            <p className="text-sm text-white/52">{item.label}</p>
            <strong className="mt-1 block text-2xl capitalize">{item.value}</strong>
          </div>
        ))}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-lg p-5">
          <h2 className="mb-5 flex items-center gap-2 text-2xl font-black">
            <Bookmark size={22} className="text-nexus-400" /> Posts Favoritos
          </h2>
          <div className="grid gap-3">
            {favorites.map((post) => (
              <Link key={post.id} href={`/artigo/${post.slug}`} className="rounded-lg border border-white/10 bg-white/6 p-4 transition hover:bg-white/10">
                <strong>{post.title}</strong>
                <p className="mt-1 text-sm text-white/54">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="glass rounded-lg p-5">
          <h2 className="mb-5 flex items-center gap-2 text-2xl font-black">
            <MessageCircle size={22} className="text-nexus-400" /> Comentários Recentes
          </h2>
          <div className="grid gap-3">
            {recentComments.map((comment) => (
              <div key={comment.id} className="rounded-lg border border-white/10 bg-white/6 p-4">
                <p className="text-sm leading-6 text-white/72">{comment.message}</p>
                <span className="mt-2 block text-xs font-bold text-white/42">{new Date(comment.date).toLocaleDateString("pt-BR")}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
