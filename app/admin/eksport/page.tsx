import Link from "next/link";

export default function AdminEksportPage() {
  return (
    <main>
      <h2 className="text-lg font-bold mb-4" style={{ color: "var(--hm-text)" }}>📥 Eksport treści</h2>
      <p className="mb-6" style={{ color: "var(--hm-muted)" }}>Pobierz kopię treści do backupu lub edycji.</p>
      <div className="flex flex-col gap-3">
        <a
          href="/api/export/quiz"
          className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium hover:border-[#ffbd45] transition-colors w-fit"
          style={{ borderColor: "var(--hm-border)", background: "var(--hm-card)", color: "var(--hm-text)" }}
        >
          Pobierz pytania quizu (JSON)
        </a>
        <a
          href="/api/export/timeline"
          className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium hover:border-[#ffbd45] transition-colors w-fit"
          style={{ borderColor: "var(--hm-border)", background: "var(--hm-card)", color: "var(--hm-text)" }}
        >
          Pobierz oś czasu (JSON)
        </a>
      </div>
      <p className="mt-6">
        <Link href="/admin" className="hover:underline" style={{ color: "#b45309" }}>← Panel główny</Link>
      </p>
    </main>
  );
}
