"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { NexusUser, UserRole } from "@/types";

type AuthContextValue = {
  user: NexusUser | null;
  users: NexusUser[];
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
  updateRole: (id: string, role: UserRole) => void;
};

const demoUsers: NexusUser[] = [
  {
    id: "u1",
    name: "Admin Nexus",
    email: "admin@nexusnerd.com",
    role: "admin",
    avatar: "AN"
  },
  {
    id: "u2",
    name: "Membro Prime",
    email: "membro@nexusnerd.com",
    role: "member",
    avatar: "MP"
  }
];

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<NexusUser[]>(demoUsers);
  const [user, setUser] = useState<NexusUser | null>(demoUsers[0]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      users,
      login: (email: string) => {
        const existing = users.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase());
        setUser(existing ?? users[0]);
      },
      register: (name: string, email: string) => {
        const created: NexusUser = {
          id: crypto.randomUUID(),
          name,
          email,
          role: "member",
          avatar: name
            .split(" ")
            .map((piece) => piece[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        };
        setUsers((current) => [created, ...current]);
        setUser(created);
      },
      logout: () => setUser(null),
      updateRole: (id: string, role: UserRole) => {
        setUsers((current) => current.map((candidate) => (candidate.id === id ? { ...candidate, role } : candidate)));
        setUser((current) => (current?.id === id ? { ...current, role } : current));
      }
    }),
    [user, users]
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
