import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (!isAdmin(user)) redirect("/menu");

  return (
    <div className="min-h-screen p-6" style={{ background: "var(--hm-bg)", color: "var(--hm-text)" }}>
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-bold">⚙️ Panel administracyjny</h1>
        <nav className="flex flex-wrap items-center gap-3">
          <Link href="/admin" className="text-sm hover:opacity-90 transition-opacity" style={{ color: "var(--hm-muted)" }}>
            Strona główna
          </Link>
          <Link href="/admin/uzytkownicy" className="text-sm hover:opacity-90 transition-opacity" style={{ color: "var(--hm-muted)" }}>
            Użytkownicy
          </Link>
          <Link href="/admin/czat" className="text-sm hover:opacity-90 transition-opacity" style={{ color: "var(--hm-muted)" }}>
            Moderacja czatu
          </Link>
          <Link href="/admin/eksport" className="text-sm hover:opacity-90 transition-opacity" style={{ color: "var(--hm-muted)" }}>
            Eksport
          </Link>
          <Link href="/menu" className="text-sm hover:opacity-90 transition-opacity" style={{ color: "var(--hm-muted)" }}>
            ← Powrót do menu
          </Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
