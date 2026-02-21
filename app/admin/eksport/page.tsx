import Link from "next/link";

export default function AdminEksportPage() {
  return (
    <main>
      <h2 className="text-lg font-bold mb-4">📥 Eksport treści</h2>
      <p className="text-[#888] mb-6">Pobierz kopię treści do backupu lub edycji.</p>
      <div className="flex flex-col gap-3">
        <a
          href="/api/export/quiz"
          className="inline-flex items-center gap-2 rounded-xl border border-[#444] bg-[#262730]/80 px-4 py-3 text-sm font-medium text-[#fafafa] hover:border-[#ffbd45] transition-colors w-fit"
        >
          Pobierz pytania quizu (JSON)
        </a>
        <a
          href="/api/export/timeline"
          className="inline-flex items-center gap-2 rounded-xl border border-[#444] bg-[#262730]/80 px-4 py-3 text-sm font-medium text-[#fafafa] hover:border-[#ffbd45] transition-colors w-fit"
        >
          Pobierz oś czasu (JSON)
        </a>
      </div>
      <p className="mt-6">
        <Link href="/admin" className="text-[#ffbd45] hover:underline">← Panel główny</Link>
      </p>
    </main>
  );
}
