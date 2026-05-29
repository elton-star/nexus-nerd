"use client";

import { FormEvent, useMemo, useState } from "react";
import { BarChart3, Edit3, ImagePlus, MessageSquare, Plus, Trash2, Users } from "lucide-react";
import { categories } from "@/lib/categories";
import type { CategorySlug, Post, UserRole } from "@/types";
import { useAuth } from "@/context/auth-context";
import { usePosts } from "@/context/posts-context";

const emptyDraft = {
  title: "",
  excerpt: "",
  category: "noticias" as CategorySlug,
  cover: "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?auto=format&fit=crop&w=1600&q=80",
  gallery: "",
  affiliateLink: "",
  content: ""
};

export default function AdminPage() {
  const { user, users, updateRole } = useAuth();
  const { posts, createPost, updatePost, deletePost } = usePosts();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft);

  const stats = useMemo(
    () => [
      { label: "Posts", value: posts.length, icon: BarChart3 },
      { label: "Usuários", value: users.length, icon: Users },
      { label: "Comentários", value: posts.reduce((total, post) => total + post.comments, 0), icon: MessageSquare },
      { label: "Curtidas", value: posts.reduce((total, post) => total + post.likes, 0), icon: Plus }
    ],
    [posts, users.length]
  );

  function submitPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editingId) {
      updatePost(editingId, {
        title: draft.title,
        excerpt: draft.excerpt,
        content: draft.content,
        category: draft.category,
        cover: draft.cover,
        gallery: draft.gallery
          .split("\n")
          .map((image) => image.trim())
          .filter(Boolean),
        affiliateLink: draft.affiliateLink.trim() || undefined
      });
    } else {
      const created: Post = {
        id: crypto.randomUUID(),
        slug: draft.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        title: draft.title,
        excerpt: draft.excerpt,
                content: draft.content,
                category: draft.category,
                cover: draft.cover,
                gallery: draft.gallery
                  .split("\n")
                  .map((image) => image.trim())
                  .filter(Boolean),
                affiliateLink: draft.affiliateLink.trim() || undefined,
                author: user?.name ?? "Editor Nexus",
        date: new Date().toISOString().slice(0, 10),
        readTime: "4 min",
        likes: 0,
        comments: 0,
        tags: [draft.category]
      };
      createPost(created);
    }

    setEditingId(null);
    setDraft(emptyDraft);
  }

  function editPost(post: Post) {
    setEditingId(post.id);
    setDraft({
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      cover: post.cover,
      gallery: post.gallery?.join("\n") ?? "",
      affiliateLink: post.affiliateLink ?? "",
      content: post.content
    });
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="mx-auto min-h-screen max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black">Painel reservado para administradores</h1>
        <p className="mt-4 text-white/58">Use o login demo admin@nexusnerd.com para acessar os recursos editoriais.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-black uppercase text-nexus-400">Command Center</p>
          <h1 className="text-4xl font-black sm:text-5xl">Painel Admin</h1>
        </div>
        <span className="rounded-md border border-nexus-400/30 bg-nexus-500/14 px-4 py-2 text-sm font-black text-nexus-400">
          {user.name}
        </span>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-white/10 bg-white/6 p-5">
            <stat.icon className="mb-4 text-nexus-400" size={22} />
            <p className="text-sm text-white/52">{stat.label}</p>
            <strong className="mt-1 block text-3xl">{stat.value.toLocaleString("pt-BR")}</strong>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[420px_1fr]">
        <form onSubmit={submitPost} className="glass h-fit rounded-lg p-5">
          <div className="mb-5 flex items-center gap-2">
            <ImagePlus size={20} className="text-nexus-400" />
            <h2 className="text-xl font-black">{editingId ? "Editar post" : "Criar post"}</h2>
          </div>
          <div className="grid gap-4">
            <input
              value={draft.title}
              onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
              required
              placeholder="Título"
              className="min-h-12 rounded-md border border-white/10 bg-black/30 px-4 outline-none placeholder:text-white/32 focus:border-nexus-400"
            />
            <textarea
              value={draft.excerpt}
              onChange={(event) => setDraft((current) => ({ ...current, excerpt: event.target.value }))}
              required
              placeholder="Resumo"
              className="min-h-24 rounded-md border border-white/10 bg-black/30 p-4 outline-none placeholder:text-white/32 focus:border-nexus-400"
            />
            <select
              value={draft.category}
              onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value as CategorySlug }))}
              className="min-h-12 rounded-md border border-white/10 bg-black/30 px-4 outline-none focus:border-nexus-400"
            >
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.label}
                </option>
              ))}
            </select>
            <input
              value={draft.cover}
              onChange={(event) => setDraft((current) => ({ ...current, cover: event.target.value }))}
              required
              placeholder="URL da imagem"
              className="min-h-12 rounded-md border border-white/10 bg-black/30 px-4 outline-none placeholder:text-white/32 focus:border-nexus-400"
            />
            <textarea
              value={draft.gallery}
              onChange={(event) => setDraft((current) => ({ ...current, gallery: event.target.value }))}
              placeholder="Imagens internas em alta qualidade: cole uma URL por linha"
              className="min-h-28 rounded-md border border-white/10 bg-black/30 p-4 outline-none placeholder:text-white/32 focus:border-nexus-400"
            />
            <input
              value={draft.affiliateLink}
              onChange={(event) => setDraft((current) => ({ ...current, affiliateLink: event.target.value }))}
              placeholder="Link de afiliado do produto"
              className="min-h-12 rounded-md border border-white/10 bg-black/30 px-4 outline-none placeholder:text-white/32 focus:border-nexus-400"
            />
            <textarea
              value={draft.content}
              onChange={(event) => setDraft((current) => ({ ...current, content: event.target.value }))}
              required
              placeholder="Conteúdo do post: escreva em linhas/parágrafos. A cada 13 linhas, uma imagem interna será inserida automaticamente."
              className="min-h-32 rounded-md border border-white/10 bg-black/30 p-4 outline-none placeholder:text-white/32 focus:border-nexus-400"
            />
            <button className="rounded-md bg-nexus-500 px-5 py-3 text-sm font-black transition hover:bg-nexus-400">
              {editingId ? "Salvar alterações" : "Publicar"}
            </button>
          </div>
        </form>

        <div className="grid gap-6">
          <section className="glass rounded-lg p-5">
            <h2 className="mb-4 text-xl font-black">Posts</h2>
            <div className="grid gap-3">
              {posts.map((post) => (
                <div key={post.id} className="grid gap-3 rounded-lg border border-white/10 bg-white/5 p-4 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <strong>{post.title}</strong>
                    <p className="mt-1 text-sm text-white/52">{post.excerpt}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editPost(post)}
                      className="grid h-10 w-10 place-items-center rounded-md bg-white/8 text-white/74 hover:bg-white/14"
                      aria-label="Editar"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="grid h-10 w-10 place-items-center rounded-md bg-red-500/18 text-red-200 hover:bg-red-500/28"
                      aria-label="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass rounded-lg p-5">
            <h2 className="mb-4 text-xl font-black">Usuários e permissões</h2>
            <div className="grid gap-3">
              {users.map((member) => (
                <div key={member.id} className="grid gap-3 rounded-lg border border-white/10 bg-white/5 p-4 md:grid-cols-[1fr_180px] md:items-center">
                  <div>
                    <strong>{member.name}</strong>
                    <p className="mt-1 text-sm text-white/52">{member.email}</p>
                  </div>
                  <select
                    value={member.role}
                    onChange={(event) => updateRole(member.id, event.target.value as UserRole)}
                    className="min-h-10 rounded-md border border-white/10 bg-black/30 px-3 text-sm outline-none focus:border-nexus-400"
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="member">Membro</option>
                  </select>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
