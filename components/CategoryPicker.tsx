import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

type Props = {
  baseUrl: string;
  title: string;
  subtitle: string;
  showAllOption?: boolean;
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

export default function CategoryPicker({ baseUrl, title, subtitle, showAllOption = true }: Props) {
  return (
    <main className="min-h-screen bg-gray-900 text-white p-8 max-w-2xl mx-auto">
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-shake { animation: shake 1s ease-in-out infinite; }
        .animate-flicker { animation: flicker 0.5s ease-in-out infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>

      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-gray-400 mb-6">{subtitle}</p>

      <div className="grid gap-2">
        {showAllOption && (
          <Link
            href={`${baseUrl}/wszystkie`}
            className="p-4 rounded-xl bg-gradient-to-r from-purple-700 to-blue-700 border border-purple-500 hover:border-purple-300 hover:scale-[1.02] transition-all flex items-center gap-3 group"
          >
            <span className="text-2xl group-hover:animate-bounce">📚</span>
            <div>
              <span className="font-medium">Wszystkie tematy</span>
              <span className="text-sm text-gray-300 ml-2">({CATEGORIES.length} działów)</span>
            </div>
          </Link>
        )}
        
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`${baseUrl}/${cat.id}`}
            className="p-3 rounded-xl bg-gray-800 border border-gray-700 hover:border-blue-500 hover:bg-gray-750 transition-all flex items-center gap-3 group"
          >
            <span className={`text-xl inline-block ${ICON_ANIMATIONS[cat.icon] || ""} group-hover:scale-125 transition-transform`}>
              {cat.icon}
            </span>
            <div className="flex-1">
              <span className="font-medium text-sm">{cat.name}</span>
              {cat.dateRange && (
                <span className="text-xs text-gray-500 ml-2">({cat.dateRange})</span>
              )}
            </div>
            <span className="text-gray-600 group-hover:text-gray-400 transition-colors">→</span>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-center">
        <Link href="/menu" className="text-gray-400 hover:text-white text-sm transition-colors">
          ← Powrót do menu
        </Link>
      </p>
    </main>
  );
}
