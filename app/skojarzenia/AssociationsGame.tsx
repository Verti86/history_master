"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { XpToast } from "@/components/XpToast";

type AssociationItem = {
  answer: string;
  hints: string[];
};

type Props = {
  associations: AssociationItem[];
  userId: string;
};

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function AssociationsGame({ associations, userId }: Props) {
  const [items, setItems] = useState<AssociationItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealedHints, setRevealedHints] = useState(0);
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showXpToast, setShowXpToast] = useState(false);
  const maxScore = associations.length * 3;

  useEffect(() => {
    setItems(shuffleArray(associations));
  }, [associations]);

  const currentItem = items[currentIndex];

  const revealNextHint = () => {
    if (revealedHints < currentItem.hints.length) {
      setRevealedHints((r) => r + 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim() || result) return;

    const correct = currentItem.answer.toLowerCase();
    const userGuess = guess.trim().toLowerCase();

    const isCorrect =
      userGuess === correct ||
      correct.includes(userGuess) ||
      userGuess.includes(correct.split(" ").pop() || "");

    if (isCorrect) {
      const points = Math.max(1, 4 - revealedHints);
      setScore((s) => s + points);
      setResult("correct");
    } else {
      setResult("wrong");
    }

    setTimeout(() => {
      if (currentIndex + 1 >= items.length) {
        finishGame();
      } else {
        setCurrentIndex((i) => i + 1);
        setRevealedHints(0);
        setGuess("");
        setResult(null);
      }
    }, 2000);
  };

  const handleSkip = () => {
    setResult("wrong");
    setTimeout(() => {
      if (currentIndex + 1 >= items.length) {
        finishGame();
      } else {
        setCurrentIndex((i) => i + 1);
        setRevealedHints(0);
        setGuess("");
        setResult(null);
      }
    }, 2000);
  };

  const finishGame = async () => {
    setFinished(true);
    setSaving(true);
    setShowXpToast(true);
    try {
      const supabase = createClient();
      await supabase.from("game_stats").insert({
        user_id: userId,
        game_mode: "Skojarzenia",
        points: score,
      });
    } catch (e) {
      console.error("Błąd zapisu:", e);
    }
    setSaving(false);
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--hm-bg)", color: "var(--hm-text)" }}>
        <p>Ładowanie...</p>
      </main>
    );
  }

  if (finished) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: "var(--hm-bg)", color: "var(--hm-text)" }}>
        <XpToast xp={score} show={showXpToast} onDone={() => setShowXpToast(false)} />
        <div className="rounded-xl p-8 max-w-md w-full text-center border border-[var(--hm-border)]" style={{ background: "var(--hm-card)" }}>
          <h1 className="text-3xl font-bold mb-4">🕵️ Koniec!</h1>
          <p className="text-xl mb-6">
            Wynik: <span className="text-green-400 font-bold">{score}</span> / {maxScore}
          </p>
          {saving && <p className="text-gray-400 mb-4">Zapisywanie...</p>}
          <Link
            href="/menu"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            ← Powrót do menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: "var(--hm-bg)", color: "var(--hm-text)" }}>
      <div className="w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <span style={{ color: "var(--hm-muted)" }}>
            Postać {currentIndex + 1} / {items.length}
          </span>
          <span className="text-green-600 font-medium">Punkty: {score}</span>
        </div>

        <h2 className="text-xl text-center mb-4" style={{ color: "var(--hm-text)" }}>
          🕵️ Kim jest ta postać?
        </h2>

        <p className="text-center text-sm mb-4" style={{ color: "var(--hm-muted)" }}>
          Im mniej podpowiedzi odkryjesz, tym więcej punktów! (3-1 pkt)
        </p>

        <div className="rounded-xl p-6 mb-6 border" style={{ background: "var(--hm-card)", borderColor: "var(--hm-border)" }}>
          <div className="space-y-3">
            {currentItem.hints.map((hint, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border transition"
                style={{
                  background: idx < revealedHints ? "var(--hm-option-bg)" : "var(--hm-progress-track)",
                  color: idx < revealedHints ? "var(--hm-option-text)" : "var(--hm-muted)",
                  borderColor: "var(--hm-border)",
                }}
              >
                {idx < revealedHints ? (
                  <span>💡 {hint}</span>
                ) : (
                  <span>🔒 Podpowiedź {idx + 1}</span>
                )}
              </div>
            ))}
          </div>

          {revealedHints < currentItem.hints.length && !result && (
            <button
              onClick={revealNextHint}
              className="w-full mt-4 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Odkryj podpowiedź ({3 - revealedHints} pkt)
            </button>
          )}
        </div>

        {result ? (
          <div className="text-center">
            <p className={`text-xl font-bold ${result === "correct" ? "text-green-600" : "text-red-600"}`}>
              {result === "correct" ? "✓ Dobrze!" : "✗ Źle!"}
            </p>
            <p className="mt-2" style={{ color: "var(--hm-muted)" }}>
              Odpowiedź: <span className="font-bold" style={{ color: "var(--hm-text)" }}>{currentItem.answer}</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Wpisz imię i nazwisko..."
              className="w-full px-4 py-3 rounded-lg border focus:border-blue-500 focus:outline-none"
              style={{ background: "var(--hm-card)", borderColor: "var(--hm-border)", color: "var(--hm-text)" }}
            />
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={!guess.trim()}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                Sprawdź
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="font-semibold py-3 px-6 rounded-lg border transition"
                style={{ background: "var(--hm-option-bg)", color: "var(--hm-option-text)", borderColor: "var(--hm-option-border)" }}
              >
                Poddaję się
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link href="/menu" className="text-sm hover:opacity-90" style={{ color: "var(--hm-muted)" }}>
            ← Powrót do menu
          </Link>
        </div>
      </div>
    </main>
  );
}
