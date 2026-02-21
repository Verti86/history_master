import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

type Props = {
  baseUrl: string;
  title: string;
  subtitle: string;
  showAllOption?: boolean;
  /** Liczba działów (jeśli podana, używana zamiast CATEGORIES.length – gwarantuje aktualną wartość po deployu) */
  categoryCount?: number;
  /** Opcjonalny link np. "Powtórka słabych stron" */
  extraLink?: { href: string; label: string };
  /** Opcjonalny progres per kategoria, np. "Ostatni: 7 pkt" */
  progress?: { categoryId: string; text: string }[];
};

const ICON_ANIMATIONS: Record<string, string> = {
  "🧭": "animate-spin-slow",
  "✨": "animate-pulse",
  "🌊": "animate-bounce-slow",
  "⚔️": "animate-shake",
  "🗡️": "animate-shake",
  "💡": "animate-pulse",
  "🔥": "animate-flicker",
  "🐴": "animate-bounce-slow",
  "👑": "animate-float",
  "🦅": "animate-float",
  "🦁": "animate-shake",
};

export default function CategoryPicker({ baseUrl, title, subtitle, showAllOption = true, categoryCount, extraLink, progress }: Props) {
  const count = categoryCount ?? CATEGORIES.length;
  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto" style={{ background: "var(--hm-bg)", color: "var(--hm-text)" }}>
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-[var(--hm-muted)] mb-6">{subtitle}</p>

      <div className="grid gap-2">
        {extraLink && (
          <Link
            href={extraLink.href}
            className="p-4 rounded-xl bg-gradient-to-r from-amber-700 to-orange-700 border border-amber-500 hover:border-amber-300 hover:scale-[1.02] transition-all flex items-center gap-3 group"
          >
            <span className="text-2xl">🔄</span>
            <span className="font-medium">{extraLink.label}</span>
          </Link>
        )}
        {showAllOption && (
          <Link
            href={`${baseUrl}/wszystkie`}
            className="p-4 rounded-xl bg-gradient-to-r from-purple-700 to-blue-700 border border-purple-500 hover:border-purple-300 hover:scale-[1.02] transition-all flex items-center gap-3 group"
          >
            <span className="text-2xl group-hover:animate-bounce">📚</span>
            <div>
              <span className="font-medium">Wszystkie tematy</span>
              <span className="text-sm text-gray-300 ml-2">({count} działów)</span>
            </div>
          </Link>
        )}
        
        {CATEGORIES.map((cat) => {
          const prog = progress?.find((p) => p.categoryId === cat.id);
          return (
            <Link
              key={cat.id}
              href={`${baseUrl}/${cat.id}`}
              className="p-3 rounded-xl bg-[var(--hm-card)] border border-[var(--hm-border)] hover:border-blue-500 transition-all flex items-center gap-3 group"
            >
              <span className={`text-xl inline-block ${ICON_ANIMATIONS[cat.icon] || ""} group-hover:scale-125 transition-transform`}>
                {cat.icon}
              </span>
              <div className="flex-1">
                <span className="font-medium text-sm">{cat.name}</span>
                {cat.dateRange && (
                  <span className="text-xs text-[var(--hm-muted)] ml-2">({cat.dateRange})</span>
                )}
                {prog && <span className="block text-xs text-[#ffbd45] mt-0.5">{prog.text}</span>}
              </div>
              <span className="text-[var(--hm-muted)] group-hover:text-gray-400 transition-colors">→</span>
            </Link>
          );
        })}
      </div>

      <p className="mt-8 text-center">
        <Link href="/menu" className="text-[var(--hm-muted)] hover:opacity-90 text-sm transition-colors">
          ← Powrót do menu
        </Link>
      </p>
    </main>
  );
}
