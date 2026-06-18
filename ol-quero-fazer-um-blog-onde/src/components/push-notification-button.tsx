"use client";

import { Bell } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
}

export function PushNotificationButton() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);

  async function enableNotifications() {
    if (!user || loading) {
      return;
    }

    setLoading(true);

    try {
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

      if (!publicKey || !("serviceWorker" in navigator) || !("PushManager" in window)) {
        alert("Notificações push ainda não estão configuradas neste site.");
        return;
      }

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        alert("Permissão de notificação não foi liberada.");
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      const existingSubscription = await registration.pushManager.getSubscription();
      const subscription =
        existingSubscription ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey)
        }));

      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user.id,
          subscription: subscription.toJSON()
        })
      });

      if (!response.ok) {
        throw new Error("Não foi possível salvar a inscrição push.");
      }

      setEnabled(true);
    } catch (error) {
      console.error(error);
      alert("Não foi possível ativar as notificações agora.");
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={enableNotifications}
      disabled={loading || enabled}
      className={`grid h-10 w-10 place-items-center rounded-md border border-white/10 text-white/78 transition ${
        enabled ? "bg-nexus-500/40" : "bg-white/6 hover:bg-white/12"
      } disabled:cursor-not-allowed disabled:opacity-70`}
      aria-label={enabled ? "Notificações ativadas" : "Ativar notificações"}
      title={enabled ? "Notificações ativadas" : "Ativar notificações"}
    >
      <Bell size={18} />
    </button>
  );
}
