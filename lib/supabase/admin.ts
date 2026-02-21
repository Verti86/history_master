import { createClient } from "@supabase/supabase-js";

/**
 * Klient Supabase z kluczem service_role – TYLKO na serwerze (API routes, Server Components).
 * Używany do odczytu auth.users (np. email, daty). Nigdy nie eksponuj SUPABASE_SERVICE_ROLE_KEY w kliencie.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Brak SUPABASE_SERVICE_ROLE_KEY lub NEXT_PUBLIC_SUPABASE_URL. Dodaj SUPABASE_SERVICE_ROLE_KEY w .env.local (tylko na serwerze)."
    );
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
