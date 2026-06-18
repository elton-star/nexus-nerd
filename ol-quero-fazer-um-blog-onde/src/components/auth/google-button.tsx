"use client";

import { Chrome } from "lucide-react";
import { LoadingSpinner } from "@/components/auth/loading-spinner";

export function GoogleButton({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-white/8 px-5 text-sm font-black transition hover:bg-white/14 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? <LoadingSpinner /> : <Chrome size={18} />}
      Continuar com Google
    </button>
  );
}
