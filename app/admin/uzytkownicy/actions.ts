"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/admin";

async function ensureAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user)) {
    return { ok: false, error: "Brak uprawnień." };
  }
  return { ok: true, user };
}

export async function banUser(userId: string): Promise<{ ok: boolean; error?: string }> {
  const check = await ensureAdmin();
  if (!check.ok) return { ok: false, error: check.error };
  try {
    const admin = createAdminClient();
    // ban_duration w formatach np. "876000h" (100 lat) – Supabase przyjmuje czas w godzinach
    // 876000h ≈ 100 lat
    const { error } = await admin.auth.admin.updateUserById(userId, {
      ban_duration: "876000h",
    });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/uzytkownicy");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Błąd blokowania." };
  }
}

export async function unbanUser(userId: string): Promise<{ ok: boolean; error?: string }> {
  const check = await ensureAdmin();
  if (!check.ok) return { ok: false, error: check.error };
  try {
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.updateUserById(userId, {
      ban_duration: "none",
    });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/uzytkownicy");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Błąd odblokowania." };
  }
}

export async function deleteUser(userId: string): Promise<{ ok: boolean; error?: string }> {
  const check = await ensureAdmin();
  if (!check.ok) return { ok: false, error: check.error };
  if (check.user?.id === userId) {
    return { ok: false, error: "Nie możesz usunąć własnego konta z tego panelu." };
  }
  try {
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(userId);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/uzytkownicy");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Błąd usuwania." };
  }
}
