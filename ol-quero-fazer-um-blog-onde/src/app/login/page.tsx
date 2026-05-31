"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthMessage } from "@/components/auth/auth-message";
import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleButton } from "@/components/auth/google-button";
import { LoadingSpinner } from "@/components/auth/loading-spinner";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { authReady, login, loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const form = new FormData(event.currentTarget);
    const result = await login(String(form.get("email") ?? ""), String(form.get("password") ?? ""));

    setLoading(false);
    setMessageType(result.ok ? "success" : "error");
    setMessage(result.message);

    if (result.ok) {
      router.push("/perfil");
    }
  }

  async function googleLogin() {
    setGoogleLoading(true);
    const result = await loginWithGoogle();
    setGoogleLoading(false);
    setMessageType(result.ok ? "success" : "error");
    setMessage(result.message);

    if (result.ok) {
      router.push("/perfil");
    }
  }

  return (
    <AuthShell
      title="Entre no Nexus Nerd."
      subtitle="Acesse seu perfil, favorite posts, participe dos comentários e acompanhe o universo geek com sua própria conta."
    >
      <div className="mb-6">
        <h2 className="text-2xl font-black">Login</h2>
        <p className="mt-2 text-sm leading-6 text-white/56">Use a conta que você criou no Nexus Nerd.</p>
      </div>

      <form onSubmit={submit} className="grid gap-4">
        <AuthInput label="Email ou usuário" name="email" autoComplete="username" placeholder="adminnexus ou voce@email.com" />
        <AuthInput label="Senha" name="password" type="password" autoComplete="current-password" placeholder="Sua senha" />
        <AuthMessage message={message} type={messageType} />
        <button
          disabled={loading || !authReady}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-nexus-500 px-5 text-sm font-black transition hover:bg-nexus-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <LoadingSpinner /> : <LogIn size={18} />}
          {authReady ? "Entrar" : "Carregando conta..."}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-xs font-bold uppercase text-white/38">ou</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <GoogleButton loading={googleLoading} onClick={googleLogin} />

      <p className="mt-6 text-center text-sm text-white/56">
        Ainda não tem conta?{" "}
        <Link href="/register" className="font-black text-nexus-400 hover:text-nexus-300">
          Criar conta
        </Link>
      </p>
    </AuthShell>
  );
}
