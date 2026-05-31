"use client";

import { useEffect, useState } from "react";

export function RelativeTime({ date }: { date: string }) {
  const [label, setLabel] = useState(() => formatRelativeTime(date));

  useEffect(() => {
    setLabel(formatRelativeTime(date));

    const timer = window.setInterval(() => {
      setLabel(formatRelativeTime(date));
    }, 60_000);

    return () => window.clearInterval(timer);
  }, [date]);

  return <span title={formatExactDate(date)}>{label}</span>;
}

function formatRelativeTime(date: string) {
  const timestamp = new Date(date).getTime();

  if (Number.isNaN(timestamp)) {
    return "Data indisponível";
  }

  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));

  if (elapsedSeconds < 60) {
    return "Agora mesmo";
  }

  const minutes = Math.floor(elapsedSeconds / 60);

  if (minutes < 60) {
    return `Há ${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `Há ${hours} h`;
  }

  const days = Math.floor(hours / 24);

  if (days < 30) {
    return `Há ${days} dia${days === 1 ? "" : "s"}`;
  }

  return formatExactDate(date);
}

function formatExactDate(date: string) {
  return new Date(date).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  });
}
