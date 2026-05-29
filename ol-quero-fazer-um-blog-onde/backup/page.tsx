"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? "Nexus Member");

    if (mode === "login") {
      login(email, password);
    } else {
      register(name, email, password);
    }

    router.push("/perfil");
  }

  return (
    <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
      <section>
        <p className="mb-3 text-xs font-black uppercase text-nexus-400">Nexus ID</p>
        <h1 className="text-4xl font-black leading-tight sm:text-6xl">Sua conta geek em modo premium.</h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-white/62">
          Entre para comentar, curtir teorias, salvar categorias favoritas e acessar recursos editoriais do portal.
        </p>
      </section>

      <section className="glass rounded-lg p-5 sm:p-7">
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-md bg-black/30 p-1">
          <button
            onClick={() => setMode("login")}
            className={`rounded-md px-4 py-3 text-sm font-black transition ${mode === "login" ? "bg-nexus-500" : "text-white/58"}`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`rounded-md px-4 py-3 text-sm font-black transition ${mode === "register" ? "bg-nexus-500" : "text-white/58"}`}
          >
            Cadastro
          </button>
        </div>

        <form onSubmit={submit} className="grid gap-4">
          {mode === "register" ? (
            <label className="grid gap-2 text-sm font-bold text-white/72">
              Nome
              <input name="name" required className="min-h-12 rounded-md border border-white/10 bg-black/30 px-4 outline-none focus:border-nexus-400" />
            </label>
          ) : null}
          <label className="grid gap-2 text-sm font-bold text-white/72">
            E-mail
            <input
              name="email"
              type="email"
              defaultValue={mode === "login" ? "admin@nexusnerd.com" : ""}
              required
              className="min-h-12 rounded-md border border-white/10 bg-black/30 px-4 outline-none focus:border-nexus-400"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-white/72">
            Senha
            <input
              name="password"
              type="password"
              defaultValue={mode === "login" ? "nexus123" : ""}
              required
              className="min-h-12 rounded-md border border-white/10 bg-black/30 px-4 outline-none focus:border-nexus-400"
            />
          </label>
          <button className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-nexus-500 px-5 text-sm font-black transition hover:bg-nexus-400">
            {mode === "login" ? <LogIn size={18} /> : <UserPlus size={18} />}
            {mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>
      </section>
    </div>
  );
}
