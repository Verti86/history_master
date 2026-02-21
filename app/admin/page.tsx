import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="max-w-2xl">
      <p className="text-[#aaa] mb-8">
        Zarządzaj użytkownikami i moderuj czat.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/uzytkownicy"
          className="block p-6 rounded-xl border border-[#444] bg-[#262730]/80 hover:border-[#ffbd45] transition-colors"
        >
          <span className="text-2xl block mb-2">👥</span>
          <strong className="text-[#fafafa]">Użytkownicy</strong>
          <p className="text-sm text-[#888] mt-1">
            Lista kont, nicki, statystyki XP
          </p>
        </Link>
        <Link
          href="/admin/czat"
          className="block p-6 rounded-xl border border-[#444] bg-[#262730]/80 hover:border-[#ffbd45] transition-colors"
        >
          <span className="text-2xl block mb-2">💬</span>
          <strong className="text-[#fafafa]">Moderacja czatu</strong>
          <p className="text-sm text-[#888] mt-1">
            Ostatnie wiadomości, usuń nieodpowiednie
          </p>
        </Link>
      </div>
    </main>
  );
}
