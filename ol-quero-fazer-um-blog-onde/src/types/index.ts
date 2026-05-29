export type CategorySlug =
  | "noticias"
  | "marvel"
  | "dc-comics"
  | "mangas"
  | "animes"
  | "games"
  | "filmes-series"
  | "teorias";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: CategorySlug;
  cover: string;
  author: string;
  date: string;
  readTime: string;
  likes: number;
  comments: number;
  featured?: boolean;
  trending?: boolean;
  tags: string[];
};

export type Comment = {
  id: string;
  postSlug: string;
  user: string;
  message: string;
  date: string;
};

export type UserRole = "admin" | "editor" | "member";

export type NexusUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
};
