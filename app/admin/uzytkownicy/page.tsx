import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { UserRowActions } from "./UserRowActions";

type AuthUser = {
  id: string;
  email?: string;
  created_at?: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
  banned_until?: string | null;
};

export default async function AdminUzytkownicyPage() {
  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  const currentUserId = currentUser?.id ?? null;

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, nickname")
    .order("nickname");
  const { data: stats } = await supabase
    .from("game_stats")
    .select("user_id, points");

  const xpByUser: Record<string, number> = {};
  (stats || []).forEach((r) => {
    const id = r.user_id ?? "";
    xpByUser[id] = (xpByUser[id] || 0) + (r.points || 0);
  });
  const profileByUser: Record<string, string> = {};
  (profiles || []).forEach((p) => {
    profileByUser[p.id] = p.nickname?.trim() || "(brak nicka)";
  });

  let authUsers: AuthUser[] = [];
  let authError: string | null = null;
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
    if (error) authError = error.message;
    else authUsers = (data?.users ?? []) as AuthUser[];
  } catch (e) {
    authError = e instanceof Error ? e.message : "Brak klucza service_role?";
  }

  const hasAuthData = authUsers.length > 0 && !authError;

  const rows = hasAuthData
    ? authUsers.map((u) => ({
        id: u.id,
        email: u.email ?? "—",
        nickname: profileByUser[u.id] ?? "(brak nicka)",
        xp: xpByUser[u.id] ?? 0,
        created_at: u.created_at ?? null,
        last_sign_in_at: u.last_sign_in_at ?? null,
        banned_until: u.banned_until ?? null,
      }))
    : (profiles || []).map((p) => ({
        id: p.id,
        email: null as string | null,
        nickname: profileByUser[p.id] ?? "(brak nicka)",
        xp: xpByUser[p.id] ?? 0,
        created_at: null as string | null,
        last_sign_in_at: null as string | null,
        banned_until: null as string | null,
      }));

  const sorted = [...rows].sort((a, b) => b.xp - a.xp);

  function formatDate(s: string | null) {
    if (!s) return "—";
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

  return (
    <main>
      <h2 className="text-lg font-bold mb-4" style={{ color: "var(--hm-text)" }}>👥 Użytkownicy</h2>
      {authError && (
        <p className="text-amber-500 text-sm mb-4">
          Pełne dane (email, daty) wymagają klucza <strong>SUPABASE_SERVICE_ROLE_KEY</strong> w .env.local (serwer). Obecnie: tylko nick i XP. Zobacz docs/ADMIN-PANEL.md.
        </p>
      )}
      <p className="text-sm mb-6" style={{ color: "var(--hm-muted)" }}>
        Zablokuj, odblokuj lub usuń konto użytkownika. Własnego konta nie można zablokować ani usunąć z tego panelu.
      </p>
      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--hm-border)" }}>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--hm-border)", background: "var(--hm-card)" }}>
              {hasAuthData && <th className="p-3 font-medium" style={{ color: "var(--hm-muted)" }}>Email</th>}
              <th className="p-3 font-medium" style={{ color: "var(--hm-muted)" }}>Nick</th>
              <th className="p-3 font-medium" style={{ color: "var(--hm-muted)" }}>XP</th>
              {hasAuthData && (
                <>
                  <th className="p-3 font-medium" style={{ color: "var(--hm-muted)" }}>Rejestracja</th>
                  <th className="p-3 font-medium" style={{ color: "var(--hm-muted)" }}>Ostatnie logowanie</th>
                  <th className="p-3 font-medium" style={{ color: "var(--hm-muted)" }}>Status</th>
                </>
              )}
              <th className="p-3 font-medium" style={{ color: "var(--hm-muted)" }}>ID (fragment)</th>
              {hasAuthData && <th className="p-3 font-medium" style={{ color: "var(--hm-muted)" }}>Akcje</th>}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.id} className="border-b" style={{ borderColor: "var(--hm-border)" }}>
                {hasAuthData && <td className="p-3" style={{ color: "var(--hm-text)" }}>{r.email}</td>}
                <td className="p-3" style={{ color: "var(--hm-text)" }}>{r.nickname}</td>
                <td className="p-3 font-medium text-[#ffbd45]">{r.xp}</td>
                {hasAuthData && (
                  <>
                    <td className="p-3" style={{ color: "var(--hm-muted)" }}>{formatDate(r.created_at)}</td>
                    <td className="p-3" style={{ color: "var(--hm-muted)" }}>{formatDate(r.last_sign_in_at)}</td>
                    <td className="p-3" style={{ color: "var(--hm-text)" }}>
                      {r.banned_until && new Date(r.banned_until) > new Date() ? (
                        <span className="text-amber-500">Zablokowany</span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </>
                )}
                <td className="p-3 font-mono text-xs" style={{ color: "var(--hm-muted)" }}>{r.id.slice(0, 8)}…</td>
                {hasAuthData && (
                  <td className="p-3">
                    <UserRowActions
                      userId={r.id}
                      isBanned={!!(r.banned_until && new Date(r.banned_until) > new Date())}
                      isCurrentUser={currentUserId === r.id}
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sorted.length === 0 && (
        <p className="mt-4" style={{ color: "var(--hm-muted)" }}>Brak użytkowników w bazie.</p>
      )}
    </main>
  );
}
