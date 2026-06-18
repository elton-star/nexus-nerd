"use client";

export function AuthMessage({ message, type }: { message: string; type: "success" | "error" }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`rounded-md border px-4 py-3 text-sm font-semibold ${
        type === "success"
          ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
          : "border-red-400/25 bg-red-400/10 text-red-200"
      }`}
    >
      {message}
    </div>
  );
}
