"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

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
      <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Ładowanie...</p>
      </main>
    );
  }

  if (finished) {
    return (
      <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full text-center">
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
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-400">
            Postać {currentIndex + 1} / {items.length}
          </span>
          <span className="text-green-400">Punkty: {score}</span>
        </div>

        <h2 className="text-xl text-center mb-4">
          🕵️ Kim jest ta postać?
        </h2>

        <p className="text-center text-sm text-gray-400 mb-4">
          Im mniej podpowiedzi odkryjesz, tym więcej punktów! (3-1 pkt)
        </p>

        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <div className="space-y-3">
            {currentItem.hints.map((hint, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg transition ${
                  idx < revealedHints
                    ? "bg-gray-700 text-white"
                    : "bg-gray-600 text-gray-500"
                }`}
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
            <p className={`text-xl font-bold ${result === "correct" ? "text-green-400" : "text-red-400"}`}>
              {result === "correct" ? "✓ Dobrze!" : "✗ Źle!"}
            </p>
            <p className="text-gray-300 mt-2">
              Odpowiedź: <span className="font-bold">{currentItem.answer}</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Wpisz imię i nazwisko..."
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-blue-500 focus:outline-none"
            />
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={!guess.trim()}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                Sprawdź
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                Poddaję się
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link href="/menu" className="text-gray-400 hover:text-white text-sm">
            ← Powrót do menu
          </Link>
        </div>
      </div>
    </main>
  );
}
