"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type Flashcard = {
  question: string;
  answer: string;
};

type Props = {
  flashcards: Flashcard[];
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

export default function FlashcardsGame({ flashcards, userId }: Props) {
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDeck(shuffleArray(flashcards).slice(0, 10));
  }, [flashcards]);

  const currentCard = deck[currentIndex];

  const handleKnow = async () => {
    setScore((s) => s + 1);
    nextCard();
  };

  const handleDontKnow = () => {
    setDeck((d) => [...d, currentCard]);
    nextCard();
  };

  const nextCard = () => {
    setFlipped(false);
    if (currentIndex + 1 >= deck.length) {
      finishGame();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const finishGame = async () => {
    setFinished(true);
    setSaving(true);
    try {
      const supabase = createClient();
      await supabase.from("game_stats").insert({
        user_id: userId,
        game_mode: "Fiszki",
        points: score,
      });
    } catch (e) {
      console.error("Błąd zapisu:", e);
    }
    setSaving(false);
  };

  if (deck.length === 0) {
    return (
      <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Ładowanie fiszek...</p>
      </main>
    );
  }

  if (finished) {
    return (
      <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-4">🎉 Koniec!</h1>
          <p className="text-xl mb-6">
            Zdobyłeś <span className="text-green-400 font-bold">{score}</span>{" "}
            XP
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
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-400">
            Karta {currentIndex + 1} / {deck.length}
          </span>
          <span className="text-green-400">XP: {score}</span>
        </div>

        <div
          className="relative h-64 cursor-pointer perspective-1000"
          onClick={() => setFlipped(!flipped)}
        >
          <div
            className={`absolute inset-0 rounded-xl transition-transform duration-500 transform-style-preserve-3d ${
              flipped ? "rotate-y-180" : ""
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center p-6 backface-hidden">
              <p className="text-xl text-center">{currentCard.question}</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center p-6 backface-hidden rotate-y-180">
              <p className="text-xl text-center font-bold">
                {currentCard.answer}
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-400 mt-3 text-sm">
          Kliknij kartę, aby obrócić
        </p>

        {flipped && (
          <div className="flex gap-4 mt-6 justify-center">
            <button
              onClick={handleDontKnow}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              🔴 Nie pamiętam
            </button>
            <button
              onClick={handleKnow}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              🟢 Umiem!
            </button>
          </div>
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
