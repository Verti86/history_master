"use client";

import { useState } from "react";

type Props = { all: [string, number][]; week: [string, number][] };

export default function MenuRanking({ all, week }: Props) {
  const [tab, setTab] = useState<"all" | "week">("all");
  const list = tab === "all" ? all : week;
  return (
    <div>
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setTab("all")}
          className={`px-3 py-1 rounded text-sm ${tab === "all" ? "bg-[#ffbd45] text-[#0e1117]" : "bg-[#262730] text-[#aaa]"}`}
        >
          Cały czas
        </button>
        <button
          type="button"
          onClick={() => setTab("week")}
          className={`px-3 py-1 rounded text-sm ${tab === "week" ? "bg-[#ffbd45] text-[#0e1117]" : "bg-[#262730] text-[#aaa]"}`}
        >
          Ten tydzień
        </button>
      </div>
      <ul className="space-y-1 text-sm">
        {list.map(([name, pts], i) => (
          <li key={name}>
            {i + 1}. {name}: <strong>{pts}</strong>
          </li>
        ))}
        {list.length === 0 && <li className="text-[var(--hm-muted)]">Brak wyników.</li>}
      </ul>
    </div>
  );
}
