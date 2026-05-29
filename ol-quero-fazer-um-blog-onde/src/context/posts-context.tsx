"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { posts as seedPosts } from "@/lib/posts";
import type { Post } from "@/types";

type PostsContextValue = {
  posts: Post[];
  createPost: (post: Post) => void;
  updatePost: (id: string, post: Partial<Post>) => void;
  deletePost: (id: string) => void;
  getPostBySlug: (slug: string) => Post | undefined;
};

const PostsContext = createContext<PostsContextValue | null>(null);
const storageKey = "nexus-nerd-posts";

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(seedPosts);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);

    if (saved) {
      setPosts(JSON.parse(saved) as Post[]);
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(storageKey, JSON.stringify(posts));
    }
  }, [hydrated, posts]);

  const value = useMemo<PostsContextValue>(
    () => ({
      posts,
      createPost: (post: Post) => setPosts((current) => [post, ...current]),
      updatePost: (id: string, post: Partial<Post>) => {
        setPosts((current) => current.map((candidate) => (candidate.id === id ? { ...candidate, ...post } : candidate)));
      },
      deletePost: (id: string) => setPosts((current) => current.filter((candidate) => candidate.id !== id)),
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
