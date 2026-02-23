"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { XpToast } from "@/components/XpToast";

type QuoteItem = {
  quote: string;
  answer: string;
  context?: string;
};

type Props = {
  quotes: QuoteItem[];
  userId: string;
  backHref?: string;
};

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function normalizeForCompare(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function isAnswerCorrect(userGuess: string, correctAnswer: string): boolean {
  const u = normalizeForCompare(userGuess);
  const c = normalizeForCompare(correctAnswer);
  if (u === c) return true;
  if (c.includes(u) || u.includes(c)) return true;
  const cParts = c.split(" ");
  const lastPart = cParts[cParts.length - 1];
  if (lastPart && u.includes(lastPart)) return true;
  return false;
}

export default function QuotesGame({ quotes, userId, backHref = "/menu" }: Props) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showXpToast, setShowXpToast] = useState(false);
  const MAX_WRONG_ATTEMPTS = 2;

  useEffect(() => {
    setItems(shuffleArray(quotes));
  }, [quotes]);

  const currentItem = items[currentIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim() || result || !currentItem) return;

    if (isAnswerCorrect(guess.trim(), currentItem.answer)) {
      setScore((s) => s + 1);
      setResult("correct");
      setTimeout(goNext, 2000);
    } else {
      const nextWrong = wrongAttempts + 1;
      setWrongAttempts(nextWrong);
      setResult("wrong");
      if (nextWrong >= MAX_WRONG_ATTEMPTS) {
        setTimeout(goNext, 2000);
      }
    }
  };

  const goNext = () => {
    if (currentIndex + 1 >= items.length) {
      finishGame();
    } else {
      setCurrentIndex((i) => i + 1);
      setGuess("");
      setResult(null);
      setWrongAttempts(0);
    }
  };

  const tryAgain = () => {
    setResult(null);
    setWrongAttempts((w) => w + 1);
    setGuess("");
  };

  const handleSkip = () => {
    setResult("wrong");
    setTimeout(goNext, 2000);
  };

  const finishGame = async () => {
    setFinished(true);
    setSaving(true);
    setSaveError(null);
    setShowXpToast(true);
    const supabase = createClient();
    const { error } = await supabase.from("game_stats").insert({
      user_id: userId,
      game_mode: "Kto to powiedział?",
      points: score,
    });
    setSaving(false);
    if (error) setSaveError("Nie udało się zapisać wyniku. Spróbuj ponownie.");
  };

  const retrySave = async () => {
    setSaveError(null);
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("game_stats").insert({
      user_id: userId,
      game_mode: "Kto to powiedział?",
      points: score,
    });
    setSaving(false);
    if (error) setSaveError("Nie udało się zapisać wyniku. Spróbuj ponownie.");
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
          <h1 className="text-3xl font-bold mb-4">💬 Koniec!</h1>
          <p className="text-xl mb-6">
            Wynik: <span className="text-green-400 font-bold">{score}</span> / {items.length}
          </p>
          {saving && !saveError && <p className="mb-4" style={{ color: "var(--hm-muted)" }}>Zapisywanie...</p>}
          {saveError && (
            <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-700 text-red-200 text-sm">
              <p className="mb-2">{saveError}</p>
              <button type="button" onClick={retrySave} className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white font-medium text-sm">
                Spróbuj zapisać ponownie
              </button>
            </div>
          )}
          <Link
            href={backHref}
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
            Cytat {currentIndex + 1} / {items.length}
          </span>
          <span className="text-green-600 font-medium">Punkty: {score}</span>
        </div>

        <h2 className="text-xl text-center mb-4" style={{ color: "var(--hm-text)" }}>
          💬 Kto to powiedział?
        </h2>

        <div className="rounded-xl p-6 mb-6 border text-center" style={{ background: "var(--hm-card)", borderColor: "var(--hm-border)" }}>
          <p className="text-lg italic mb-2">„{currentItem.quote}”</p>
          {currentItem.context && (
            <p className="text-sm" style={{ color: "var(--hm-muted)" }}>{currentItem.context}</p>
          )}
        </div>

        {result ? (
          <div className="text-center">
            <p className={`text-xl font-bold ${result === "correct" ? "text-green-600" : "text-red-600"}`}>
              {result === "correct" ? "✓ Dobrze!" : "✗ Źle!"}
            </p>
            {result === "wrong" && wrongAttempts < MAX_WRONG_ATTEMPTS ? (
              <p className="mt-2 text-sm" style={{ color: "var(--hm-muted)" }}>
                Masz jeszcze {MAX_WRONG_ATTEMPTS - wrongAttempts} {MAX_WRONG_ATTEMPTS - wrongAttempts === 1 ? "próbę" : "próby"}.
              </p>
            ) : null}
            {result === "wrong" && wrongAttempts < MAX_WRONG_ATTEMPTS ? (
              <button type="button" onClick={tryAgain} className="mt-4 px-6 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium">
                Spróbuj jeszcze raz
              </button>
            ) : (
              <div className="mt-4 p-4 rounded-xl border-2 border-amber-500/50 bg-amber-500/10">
                <p className="text-sm mb-1" style={{ color: "var(--hm-muted)" }}>Poprawna odpowiedź:</p>
                <p className="text-xl font-bold" style={{ color: "var(--hm-text)" }}>{currentItem.answer}</p>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Wpisz imię i nazwisko..."
              className="w-full px-4 py-3 rounded-lg border focus:border-amber-500 focus:outline-none"
              style={{ background: "var(--hm-card)", borderColor: "var(--hm-border)", color: "var(--hm-text)" }}
            />
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={!guess.trim()}
                className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition"
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
          <Link href={backHref} className="text-sm hover:opacity-90" style={{ color: "var(--hm-muted)" }}>
            ← Powrót do menu
          </Link>
        </div>
      </div>
    </main>
  );
}
