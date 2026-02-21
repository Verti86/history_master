import type { User } from "@supabase/supabase-js";

export function isAdmin(user: User | null): boolean {
  if (!user?.user_metadata) return false;
  return user.user_metadata?.role === "admin";
}
