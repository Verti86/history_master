"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { XpToast } from "@/components/XpToast";

type Flashcard = {
  question: string;
  answer: string;
  explanation: string;
};

type Props = {
  flashcards: Flashcard[];
  userId: string;
  categoryName: string;
  categoryId: string;
  /** Link powrotu do wyboru tematu (np. /fiszki?klasa=6) */
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

export default function FlashcardsGame({ flashcards, userId, categoryName, categoryId, backHref = "/fiszki" }: Props) {
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [wrongCards, setWrongCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isRepeatMode, setIsRepeatMode] = useState(false);
  const [showXpToast, setShowXpToast] = useState(false);

  useEffect(() => {
    setDeck(shuffleArray(flashcards));
  }, [flashcards]);

  const currentCard = deck[currentIndex];
  const totalCards = deck.length;

  useEffect(() => {
    if (finished && score > 0) setShowXpToast(true);
  }, [finished, score]);

  const saveOnePoint = async (): Promise<boolean> => {
    const supabase = createClient();
    const { error } = await supabase.from("game_stats").insert({
      user_id: userId,
      game_mode: "Fiszki",
      points: 1,
      category_id: categoryId,
    });
    return !error;
  };

  const handleKnow = async () => {
    setSaveError(null);
    const ok = await saveOnePoint();
    if (!ok) {
      setSaveError("Nie udało się zapisać punktu. Spróbuj ponownie.");
      return;
    }
    setScore((s) => s + 1);
    nextCard();
  };

  const retrySave = async () => {
    setSaveError(null);
    const ok = await saveOnePoint();
    if (ok) {
      setScore((s) => s + 1);
      nextCard();
    } else {
      setSaveError("Nie udało się zapisać punktu. Spróbuj ponownie.");
    }
  };

  const handleDontKnow = () => {
    setWrongCards((w) => [...w, currentCard]);
    nextCard();
  };

  const nextCard = () => {
    setFlipped(false);
    if (currentIndex + 1 >= deck.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const repeatWrongCards = () => {
    setDeck(shuffleArray(wrongCards));
    setWrongCards([]);
    setCurrentIndex(0);
    setFlipped(false);
    setFinished(false);
    setIsRepeatMode(true);
  };

  if (deck.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--hm-bg)", color: "var(--hm-text)" }}>
        <p>Ładowanie fiszek...</p>
      </main>
    );
  }

  if (finished) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: "var(--hm-bg)", color: "var(--hm-text)" }}>
        <XpToast xp={score} show={showXpToast} onDone={() => setShowXpToast(false)} />
        <div className="rounded-xl p-8 max-w-md w-full text-center border border-[var(--hm-border)]" style={{ background: "var(--hm-card)" }}>
          <h1 className="text-3xl font-bold mb-4">🎉 Koniec!</h1>
          <p className="text-xl mb-2">
            Zdobyłeś <span className="text-green-400 font-bold">{score}</span> XP
          </p>
          
          {wrongCards.length > 0 && (
            <div className="my-6 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
              <p className="text-yellow-300 mb-3">
                🤔 Karty do powtórki: <strong>{wrongCards.length}</strong>
              </p>
              <button
                onClick={repeatWrongCards}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                🔄 Powtórz niezapamiętane
              </button>
            </div>
          )}

          {wrongCards.length === 0 && isRepeatMode && (
            <p className="text-green-400 my-4">✓ Wszystko zapamiętane!</p>
          )}

          <div className="flex flex-col gap-3 mt-4">
            <Link
              href={backHref}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              📚 Wybierz inny temat
            </Link>
            <Link
              href="/menu"
              className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              ← Powrót do menu
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: "var(--hm-bg)", color: "var(--hm-text)" }}>
      <div className="w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <span style={{ color: "var(--hm-muted)" }}>
            Karta {currentIndex + 1} / {totalCards}
            {isRepeatMode && <span className="text-yellow-600 ml-2">(powtórka)</span>}
          </span>
          <span className="text-green-600 font-medium">XP: {score}</span>
        </div>

        <div
          className="relative h-72 cursor-pointer perspective-1000"
          onClick={() => setFlipped(!flipped)}
        >
          <div
            className={`absolute inset-0 rounded-xl transition-transform duration-500 transform-style-preserve-3d ${
              flipped ? "rotate-y-180" : ""
            }`}
          >
            <div className="absolute inset-0 rounded-xl flex items-center justify-center p-6 backface-hidden" style={{ background: "var(--hm-flashcard-front-bg)", color: "var(--hm-flashcard-front-text)" }}>
              <p className="text-xl text-center">{currentCard.question}</p>
            </div>
            <div className="absolute inset-0 rounded-xl flex flex-col items-center justify-center p-6 backface-hidden rotate-y-180" style={{ background: "var(--hm-flashcard-back-bg)", color: "var(--hm-flashcard-back-text)" }}>
              <p className="text-sm opacity-90 mb-2">Odpowiedź:</p>
              <p className="text-xl text-center font-bold mb-4">
                {currentCard.answer}
              </p>
              {currentCard.explanation && (
                <p className="text-sm opacity-90 text-center border-t border-current pt-3 mt-2">
                  {currentCard.explanation}
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="text-center mt-3 text-sm" style={{ color: "var(--hm-muted)" }}>
          {flipped ? "Oceń się:" : "Kliknij kartę, aby obrócić"}
        </p>

        {flipped && (
          <div className="space-y-2 mt-4">
            {saveError && (
              <div className="p-3 rounded-lg bg-red-900/30 border border-red-700 text-red-200 text-sm flex items-center justify-between gap-2">
                <span>{saveError}</span>
                <button type="button" onClick={retrySave} className="px-3 py-1 rounded bg-red-700 hover:bg-red-600 text-white text-xs font-medium">
                  Spróbuj ponownie
                </button>
              </div>
            )}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleDontKnow}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                🔴 Nie pamiętam
              </button>
              <button
                onClick={handleKnow}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                🟢 Umiem! (+1 XP)
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href={backHref} className="text-sm hover:opacity-90" style={{ color: "var(--hm-muted)" }}>
            ← Zmień temat
          </Link>
        </div>
      </div>
    </main>
  );
}
