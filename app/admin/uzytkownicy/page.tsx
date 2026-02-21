import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type AuthUser = {
  id: string;
  email?: string;
  created_at?: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
};

export default async function AdminUzytkownicyPage() {
  const supabase = await createClient();
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
      }))
    : (profiles || []).map((p) => ({
        id: p.id,
        email: null as string | null,
        nickname: profileByUser[p.id] ?? "(brak nicka)",
        xp: xpByUser[p.id] ?? 0,
        created_at: null as string | null,
        last_sign_in_at: null as string | null,
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
      <h2 className="text-lg font-bold mb-4">👥 Użytkownicy</h2>
      {authError && (
        <p className="text-amber-400 text-sm mb-4">
          Pełne dane (email, daty) wymagają klucza <strong>SUPABASE_SERVICE_ROLE_KEY</strong> w .env.local (serwer). Obecnie: tylko nick i XP. Zobacz docs/ADMIN-PANEL.md.
        </p>
      )}
      <p className="text-sm text-[#888] mb-6">
        Zarządzanie kontem (blokada, usunięcie) w Supabase Dashboard → Authentication → Users.
      </p>
      <div className="overflow-x-auto rounded-xl border border-[#444]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#444] bg-[#262730]/80">
              {hasAuthData && <th className="p-3 font-medium text-[#aaa]">Email</th>}
              <th className="p-3 font-medium text-[#aaa]">Nick</th>
              <th className="p-3 font-medium text-[#aaa]">XP</th>
              {hasAuthData && (
                <>
                  <th className="p-3 font-medium text-[#aaa]">Rejestracja</th>
                  <th className="p-3 font-medium text-[#aaa]">Ostatnie logowanie</th>
                </>
              )}
              <th className="p-3 font-medium text-[#aaa]">ID (fragment)</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.id} className="border-b border-[#333]">
                {hasAuthData && (
                  <td className="p-3 text-[#e0e0e0]">{r.email}</td>
                )}
                <td className="p-3">{r.nickname}</td>
                <td className="p-3 font-medium text-[#ffbd45]">{r.xp}</td>
                {hasAuthData && (
                  <>
                    <td className="p-3 text-[#888]">{formatDate(r.created_at)}</td>
                    <td className="p-3 text-[#888]">{formatDate(r.last_sign_in_at)}</td>
                  </>
                )}
                <td className="p-3 text-[#666] font-mono text-xs">{r.id.slice(0, 8)}…</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sorted.length === 0 && (
        <p className="text-[#888] mt-4">Brak użytkowników w bazie.</p>
      )}
    </main>
  );
}
