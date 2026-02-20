import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

type Props = {
  baseUrl: string;
  title: string;
  subtitle: string;
  showAllOption?: boolean;
};

export default function CategoryPicker({ baseUrl, title, subtitle, showAllOption = true }: Props) {
  return (
    <main className="min-h-screen bg-gray-900 text-white p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-gray-400 mb-6">{subtitle}</p>

      <div className="grid gap-2">
        {showAllOption && (
          <Link
            href={`${baseUrl}/wszystkie`}
            className="p-4 rounded-xl bg-gradient-to-r from-purple-700 to-blue-700 border border-purple-500 hover:border-purple-300 transition flex items-center gap-3"
          >
            <span className="text-2xl">📚</span>
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
            className="p-3 rounded-xl bg-gray-800 border border-gray-700 hover:border-blue-500 transition flex items-center gap-3"
          >
            <span className="text-xl">{cat.icon}</span>
            <div className="flex-1">
              <span className="font-medium text-sm">{cat.name}</span>
              {cat.dateRange && (
                <span className="text-xs text-gray-500 ml-2">({cat.dateRange})</span>
              )}
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-center">
        <Link href="/menu" className="text-gray-400 hover:text-white text-sm">
          ← Powrót do menu
        </Link>
      </p>
    </main>
  );
}
