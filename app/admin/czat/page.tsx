"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { deleteChatMessage } from "./actions";

type Message = {
  id: string;
  user_id: string;
  nickname: string;
  content: string;
  created_at: string;
};

export default function AdminCzatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data, error: e } = await supabase
        .from("chat_messages")
        .select("id, user_id, nickname, content, created_at")
        .order("created_at", { ascending: false })
        .limit(200);
      if (e) {
        setError("Nie udało się załadować wiadomości.");
        setLoading(false);
        return;
      }
      setMessages(data ?? []);
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel("admin_chat")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_messages" },
        () => load()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  async function handleDelete(id: string) {
    if (!confirm("Usunąć tę wiadomość?")) return;
    setDeletingId(id);
    setError(null);
    const result = await deleteChatMessage(id);
    setDeletingId(null);
    if (!result.ok) {
      setError(result.error ?? "Nie udało się usunąć.");
      return;
    }
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }

  function formatDate(s: string) {
    try {
      return new Date(s).toLocaleString("pl-PL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return s;
    }
  }

  if (loading) {
    return <p style={{ color: "var(--hm-muted)" }}>Ładowanie…</p>;
  }

  return (
    <main>
      <h2 className="text-lg font-bold mb-4" style={{ color: "var(--hm-text)" }}>💬 Moderacja czatu</h2>
      <p className="text-sm mb-6" style={{ color: "var(--hm-muted)" }}>
        Ostatnie wiadomości (najnowsze na górze). Usuń nieodpowiednie – po kliknięciu „Usuń” wiadomość znika na stałe.
      </p>
      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}
      <div className="space-y-3">
        {messages.length === 0 && (
          <p style={{ color: "var(--hm-muted)" }}>Brak wiadomości w czacie.</p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className="flex flex-wrap items-start justify-between gap-2 rounded-lg border p-3"
            style={{ borderColor: "var(--hm-border)", background: "var(--hm-card)" }}
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs" style={{ color: "var(--hm-muted)" }}>
                <strong style={{ color: "var(--hm-text)" }}>{m.nickname}</strong> · {formatDate(m.created_at)}
              </p>
              <p className="text-sm break-words mt-1" style={{ color: "var(--hm-text)" }}>{m.content}</p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(m.id)}
              disabled={deletingId === m.id}
              className="shrink-0 rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-500/20 disabled:opacity-50"
            >
              {deletingId === m.id ? "Usuwanie…" : "Usuń"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
