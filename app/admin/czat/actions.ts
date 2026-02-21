"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/admin";

/** Usuwa wiadomość z czatu. Tylko admin. Używa service_role, więc zapis jest trwały. */
export async function deleteChatMessage(messageId: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user)) {
    return { ok: false, error: "Brak uprawnień." };
  }
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("chat_messages").delete().eq("id", messageId);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/czat");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Błąd usuwania." };
  }
}
