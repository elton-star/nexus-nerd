"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { NexusUser, UserRole } from "@/types";

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
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<AuthResult>;
  loginWithGoogle: () => Promise<AuthResult>;
  logout: () => void;
  updateRole: (id: string, role: UserRole) => void;
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
  avatar: "AN"
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
  return safeUser;
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
      const parsed = JSON.parse(saved) as StoredUser[];
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
      login: async (email: string, password: string) => {
        await new Promise((resolve) => setTimeout(resolve, 650));
        const identifier = email.toLowerCase();
        const existing = storedUsers.find(
          (candidate) => candidate.email.toLowerCase() === identifier || candidate.name.toLowerCase() === identifier
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

        if (storedUsers.some((candidate) => candidate.email.toLowerCase() === email.toLowerCase())) {
          return {
            ok: false,
            message: "Já existe uma conta com esse email."
          };
        }

        const created: StoredUser = {
          id: crypto.randomUUID(),
          name,
          email,
          password,
          role: storedUsers.length === 0 ? "admin" : "member",
          avatar: getAvatar(name)
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
            avatar: "NG"
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
      }
    }),
    [storedUsers, user, users]
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
