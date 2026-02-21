"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { banUser, unbanUser, deleteUser } from "./actions";

type Props = {
  userId: string;
  isBanned: boolean;
  isCurrentUser: boolean;
};

export function UserRowActions({ userId, isBanned, isCurrentUser }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleBan() {
    setError(null);
    setLoading("ban");
    const res = await banUser(userId);
    setLoading(null);
    if (res.ok) router.refresh();
    else setError(res.error ?? "Błąd");
  }

  async function handleUnban() {
    setError(null);
    setLoading("unban");
    const res = await unbanUser(userId);
    setLoading(null);
    if (res.ok) router.refresh();
    else setError(res.error ?? "Błąd");
  }

  async function handleDelete() {
    if (!confirm("Na pewno usunąć konto tego użytkownika? Tej operacji nie można cofnąć.")) return;
    setError(null);
    setLoading("delete");
    const res = await deleteUser(userId);
    setLoading(null);
    if (res.ok) router.refresh();
    else setError(res.error ?? "Błąd");
  }

  const busy = loading !== null;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap gap-2">
        {isBanned ? (
          <button
            type="button"
            onClick={handleUnban}
            disabled={busy}
            className="px-2 py-1 text-xs rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white"
          >
            {loading === "unban" ? "…" : "Odblokuj"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleBan}
            disabled={busy || isCurrentUser}
            title={isCurrentUser ? "Nie możesz zablokować siebie" : undefined}
            className="px-2 py-1 text-xs rounded bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white"
          >
            {loading === "ban" ? "…" : "Zablokuj"}
          </button>
        )}
        <button
          type="button"
          onClick={handleDelete}
          disabled={busy || isCurrentUser}
          title={isCurrentUser ? "Nie możesz usunąć własnego konta" : undefined}
          className="px-2 py-1 text-xs rounded bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white"
        >
          {loading === "delete" ? "…" : "Usuń konto"}
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
