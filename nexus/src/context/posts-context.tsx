"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { posts as seedPosts } from "@/lib/posts";
import { supabase } from "@/lib/supabase";
import type { Post } from "@/types";
import { calculateReadTime } from "@/lib/read-time";

type PostsContextValue = {
  posts: Post[];
  createPost: (post: Post) => Promise<void>;
  updatePost: (id: string, post: Partial<Post>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  incrementPostCounter: (id: string, field: "likes" | "comments", amount: number) => Promise<void>;
  migrateLocalPostsToSupabase: () => Promise<{ ok: boolean; message: string; migrated: number; skipped: number }>;
  getPostBySlug: (slug: string) => Post | undefined;
};

const PostsContext = createContext<PostsContextValue | null>(null);
const storageKey = "nexus-nerd-posts";

function normalizeSavedPosts(savedPosts: Post[]) {
  return savedPosts.map((post) => {
    const originalPost = seedPosts.find((candidate) => candidate.id === post.id);

    if (!originalPost) {
      return post;
    }

    return {
      ...post,
      slug: originalPost.slug
    };
  });
}

type SupabasePost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: Post["category"];
  cover: string;
  gallery: string[] | null;
  affiliate_link: string | null;
  author: string | null;
  date: string | null;
  read_time: string | null;
  likes: number | null;
  comments: number | null;
  featured: boolean | null;
  trending: boolean | null;
  tags: string[] | null;
};

function fromSupabase(row: SupabasePost): Post {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    cover: row.cover,
    gallery: row.gallery ?? [],
    affiliateLink: row.affiliate_link ?? undefined,
    author: row.author ?? "Editor Nexus",
    date: row.date ?? new Date().toISOString(),
    readTime: row.read_time ?? "4 min",
    likes: row.likes ?? 0,
    comments: row.comments ?? 0,
    featured: row.featured ?? false,
    trending: row.trending ?? false,
    tags: row.tags ?? [row.category]
  };
}

function toSupabase(post: Post) {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    cover: post.cover,
    gallery: post.gallery ?? [],
    affiliate_link: post.affiliateLink ?? null,
    author: post.author,
    date: post.date,
    read_time: calculateReadTime(post.content),
    likes: post.likes,
    comments: post.comments,
    featured: post.featured ?? false,
    trending: post.trending ?? false,
    tags: post.tags
  };
}

async function notifyNewPost(post: Post) {
  try {
    await fetch("/api/push/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: "Nexus Nerd | Post novo",
        body: post.title,
        url: `/artigo/${post.slug}`,
        image: post.cover || "/nexus-nerd-logo.png",
        tag: `nexus-nerd-${post.slug}`
      })
    });
  } catch (error) {
    console.error("Could not send push notification", error);
  }
}

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(seedPosts);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    async function loadPosts() {
      if (supabase) {
        const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });

        if (!error && data) {
          setPosts((data as SupabasePost[]).map(fromSupabase));
          setHydrated(true);
          return;
        }
      }

      const saved = window.localStorage.getItem(storageKey);

      if (saved) {
        setPosts(normalizeSavedPosts(JSON.parse(saved) as Post[]));
      }

      setHydrated(true);
    }

    loadPosts();
  }, []);

  useEffect(() => {
    function syncPosts(event: StorageEvent) {
      if (event.key === storageKey && event.newValue) {
        setPosts(normalizeSavedPosts(JSON.parse(event.newValue) as Post[]));
      }
    }

    window.addEventListener("storage", syncPosts);

    return () => window.removeEventListener("storage", syncPosts);
  }, []);

  useEffect(() => {
    if (hydrated && !supabase) {
      window.localStorage.setItem(storageKey, JSON.stringify(posts));
    }
  }, [hydrated, posts]);

  const value = useMemo<PostsContextValue>(
    () => ({
      posts,
      createPost: async (post: Post) => {
        setPosts((current) => [post, ...current]);

        if (supabase) {
          const { error } = await supabase.from("posts").insert(toSupabase(post));

          if (error) {
            console.error("Could not publish post to Supabase", error);
          }
        }

        await notifyNewPost(post);
      },
      updatePost: async (id: string, post: Partial<Post>) => {
        setPosts((current) => current.map((candidate) => (candidate.id === id ? { ...candidate, ...post } : candidate)));

        if (supabase) {
          const currentPost = posts.find((candidate) => candidate.id === id);

          if (currentPost) {
            const { error } = await supabase.from("posts").update(toSupabase({ ...currentPost, ...post })).eq("id", id);

            if (error) {
              console.error("Could not update post in Supabase", error);
            }
          }
        }
      },
      deletePost: async (id: string) => {
        setPosts((current) => current.filter((candidate) => candidate.id !== id));

        if (supabase) {
          const { error } = await supabase.from("posts").delete().eq("id", id);

          if (error) {
            console.error("Could not delete post from Supabase", error);
          }
        }
      },
      incrementPostCounter: async (id: string, field: "likes" | "comments", amount: number) => {
        let nextValue = 0;

        setPosts((current) =>
          current.map((candidate) => {
            if (candidate.id !== id) {
              return candidate;
            }

            nextValue = Math.max(0, candidate[field] + amount);
            return {
              ...candidate,
              [field]: nextValue
            };
          })
        );

        if (supabase) {
          const { error } = await supabase.from("posts").update({ [field]: nextValue }).eq("id", id);

          if (error) {
            console.error(`Could not update post ${field}`, error);
          }
        }
      },      migrateLocalPostsToSupabase: async () => {
        if (!supabase) {
          return {
            ok: false,
            message: "Configure o Supabase antes de migrar os posts antigos.",
            migrated: 0,
            skipped: 0
          };
        }

        const saved = window.localStorage.getItem(storageKey);

        if (!saved) {
          return {
            ok: true,
            message: "Nenhum post antigo encontrado no navegador.",
            migrated: 0,
            skipped: 0
          };
        }

        const localPosts = normalizeSavedPosts(JSON.parse(saved) as Post[]);
        const { data: existingRows, error: readError } = await supabase.from("posts").select("slug");

        if (readError) {
          return {
            ok: false,
            message: "Não foi possível consultar os posts do Supabase.",
            migrated: 0,
            skipped: 0
          };
        }

        const existingSlugs = new Set((existingRows ?? []).map((row) => row.slug as string));
        const postsToMigrate = localPosts.filter((post) => !existingSlugs.has(post.slug));
        const skipped = localPosts.length - postsToMigrate.length;

        if (!postsToMigrate.length) {
          return {
            ok: true,
            message: "Todos os posts antigos já existem no Supabase.",
            migrated: 0,
            skipped
          };
        }

        const { error: insertError } = await supabase.from("posts").insert(postsToMigrate.map(toSupabase));

        if (insertError) {
          return {
            ok: false,
            message: "Não foi possível enviar os posts antigos para o Supabase.",
            migrated: 0,
            skipped
          };
        }

        setPosts((current) => {
          const currentSlugs = new Set(current.map((post) => post.slug));
          return [...postsToMigrate.filter((post) => !currentSlugs.has(post.slug)), ...current];
        });

        return {
          ok: true,
          message: `${postsToMigrate.length} post(s) migrado(s). ${skipped} duplicado(s) ignorado(s).`,
          migrated: postsToMigrate.length,
          skipped
        };
      },
      getPostBySlug: (slug: string) => posts.find((post) => post.slug === slug)
    }),
    [posts]
  );

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}

export function usePosts() {
  const context = useContext(PostsContext);

  if (!context) {
    throw new Error("usePosts must be used inside PostsProvider");
  }

  return context;
}


