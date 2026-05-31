"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Comment, NexusUser, UserRole } from "@/types";

type StoredUser = NexusUser & {
  password: string;
};

type AuthResult = {
  ok: boolean;
  message: string;
};

type AuthContextValue = {
  user: NexusUser | null;
  users: NexusUser[];
  authReady: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<AuthResult>;
  loginWithGoogle: () => Promise<AuthResult>;
  logout: () => void;
  updateRole: (id: string, role: UserRole) => void;
  toggleLike: (postId: string) => boolean;
  toggleFavorite: (postId: string) => boolean;
  addRecentComment: (comment: Comment) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const storageKey = "nexus-nerd-users";
const sessionStorageKey = "nexus-nerd-session";
const defaultAdmin: StoredUser = {
  id: "admin-nexus",
  name: "adminnexus",
  email: "adminnexus@nexusnerd.local",
  password: "Nexus100#",
  role: "admin",
  avatar: "AN",
  likedPostIds: [],
  favoritePostIds: [],
  recentComments: []
};

function getAvatar(name: string) {
  return name
    .split(" ")
    .map((piece) => piece[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function withoutPassword(user: StoredUser): NexusUser {
  const { password: _password, ...safeUser } = user;
  return {
    ...safeUser,
    likedPostIds: safeUser.likedPostIds ?? [],
    favoritePostIds: safeUser.favoritePostIds ?? [],
    recentComments: safeUser.recentComments ?? []
  };
}

function normalizeIdentifier(value: string) {
  return value.trim().toLowerCase();
}

function normalizeStoredUser(user: StoredUser): StoredUser {
  return {
    ...user,
    name: user.name.trim(),
    email: normalizeIdentifier(user.email),
    likedPostIds: user.likedPostIds ?? [],
    favoritePostIds: user.favoritePostIds ?? [],
    recentComments: user.recentComments ?? []
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [storedUsers, setStoredUsers] = useState<StoredUser[]>([]);
  const [user, setUser] = useState<NexusUser | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const users = useMemo(() => storedUsers.map(withoutPassword), [storedUsers]);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    const savedSessionId = window.localStorage.getItem(sessionStorageKey);

    if (saved) {
      const parsed = (JSON.parse(saved) as StoredUser[]).map(normalizeStoredUser);
      const hasDefaultAdmin = parsed.some((candidate) => candidate.name === defaultAdmin.name);
      const availableUsers = hasDefaultAdmin ? parsed : [defaultAdmin, ...parsed];
      setStoredUsers(availableUsers);

      if (savedSessionId) {
        const savedUser = availableUsers.find((candidate) => candidate.id === savedSessionId);

        if (savedUser) {
          setUser(withoutPassword(savedUser));
        }
      }
    } else {
      setStoredUsers([defaultAdmin]);
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(storageKey, JSON.stringify(storedUsers));
    }
  }, [hydrated, storedUsers]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      users,
      authReady: hydrated,
      login: async (email: string, password: string) => {
        await new Promise((resolve) => setTimeout(resolve, 650));

        if (!hydrated) {
          return {
            ok: false,
            message: "Aguarde um instante e tente entrar novamente."
          };
        }

        const identifier = normalizeIdentifier(email);
        const existing = storedUsers.find(
          (candidate) =>
            normalizeIdentifier(candidate.email) === identifier || normalizeIdentifier(candidate.name) === identifier
        );

        if (!existing || existing.password !== password) {
          return {
            ok: false,
            message: "Email ou senha inválidos."
          };
        }

        setUser(withoutPassword(existing));
        window.localStorage.setItem(sessionStorageKey, existing.id);

        return {
          ok: true,
          message: "Login realizado com sucesso."
        };
      },
      register: async (name: string, email: string, password: string, confirmPassword: string) => {
        await new Promise((resolve) => setTimeout(resolve, 650));
        const normalizedName = name.trim();
        const normalizedEmail = normalizeIdentifier(email);

        if (!hydrated) {
          return {
            ok: false,
            message: "Aguarde um instante e tente criar a conta novamente."
          };
        }

        if (password.length < 6) {
          return {
            ok: false,
            message: "A senha precisa ter pelo menos 6 caracteres."
          };
        }

        if (password !== confirmPassword) {
          return {
            ok: false,
            message: "As senhas não conferem."
          };
        }

        if (
          storedUsers.some(
            (candidate) =>
              normalizeIdentifier(candidate.email) === normalizedEmail ||
              normalizeIdentifier(candidate.name) === normalizeIdentifier(normalizedName)
          )
        ) {
          return {
            ok: false,
            message: "Já existe uma conta com esse email."
          };
        }

        const created: StoredUser = {
          id: crypto.randomUUID(),
          name: normalizedName,
          email: normalizedEmail,
          password,
          role: storedUsers.length === 0 ? "admin" : "member",
          avatar: getAvatar(normalizedName),
          likedPostIds: [],
          favoritePostIds: [],
          recentComments: []
        };
        setStoredUsers((current) => [created, ...current]);
        setUser(withoutPassword(created));
        window.localStorage.setItem(sessionStorageKey, created.id);

        return {
          ok: true,
          message: "Conta criada com sucesso."
        };
      },
      loginWithGoogle: async () => {
        await new Promise((resolve) => setTimeout(resolve, 650));
        const googleEmail = "google-user@nexusnerd.com";
        const existing = storedUsers.find((candidate) => candidate.email === googleEmail);

        if (existing) {
          setUser(withoutPassword(existing));
          window.localStorage.setItem(sessionStorageKey, existing.id);
        } else {
          const created: StoredUser = {
            id: crypto.randomUUID(),
            name: "Nexus Google",
            email: googleEmail,
            password: crypto.randomUUID(),
            role: storedUsers.length === 0 ? "admin" : "member",
            avatar: "NG",
            likedPostIds: [],
            favoritePostIds: [],
            recentComments: []
          };
          setStoredUsers((current) => [created, ...current]);
          setUser(withoutPassword(created));
          window.localStorage.setItem(sessionStorageKey, created.id);
        }

        return {
          ok: true,
          message: "Conta Google conectada."
        };
      },
      logout: () => {
        window.localStorage.removeItem(sessionStorageKey);
        setUser(null);
      },
      updateRole: (id: string, role: UserRole) => {
        setStoredUsers((current) => current.map((candidate) => (candidate.id === id ? { ...candidate, role } : candidate)));
        setUser((current) => (current?.id === id ? { ...current, role } : current));
      },
      toggleLike: (postId: string) => {
        if (!user) {
          return false;
        }

        const liked = !user.likedPostIds.includes(postId);
        const likedPostIds = liked ? [...user.likedPostIds, postId] : user.likedPostIds.filter((id) => id !== postId);
        setStoredUsers((current) => current.map((candidate) => (candidate.id === user.id ? { ...candidate, likedPostIds } : candidate)));
        setUser((current) => (current ? { ...current, likedPostIds } : current));
        return liked;
      },
      toggleFavorite: (postId: string) => {
        if (!user) {
          return false;
        }

        const favorite = !user.favoritePostIds.includes(postId);
        const favoritePostIds = favorite
          ? [...user.favoritePostIds, postId]
          : user.favoritePostIds.filter((id) => id !== postId);
        setStoredUsers((current) => current.map((candidate) => (candidate.id === user.id ? { ...candidate, favoritePostIds } : candidate)));
        setUser((current) => (current ? { ...current, favoritePostIds } : current));
        return favorite;
      },
      addRecentComment: (comment: Comment) => {
        if (!user) {
          return;
        }

        const recentComments = [comment, ...user.recentComments].slice(0, 10);
        setStoredUsers((current) => current.map((candidate) => (candidate.id === user.id ? { ...candidate, recentComments } : candidate)));
        setUser((current) => (current ? { ...current, recentComments } : current));
      }
    }),
    [hydrated, storedUsers, user, users]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
