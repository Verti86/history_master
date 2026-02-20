"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type TimelineEvent = {
  event: string;
  year: number;
};

type Props = {
  events: TimelineEvent[];
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

function generatePairs(events: TimelineEvent[], count: number) {
  const pairs: { event1: TimelineEvent; event2: TimelineEvent }[] = [];
  const shuffled = shuffleArray(events);

  for (let i = 0; i < count && i < shuffled.length - 1; i++) {
    const idx1 = i;
    const idx2 = (i + 1 + Math.floor(Math.random() * (shuffled.length - 1))) % shuffled.length;
    if (shuffled[idx1].year !== shuffled[idx2].year) {
      pairs.push({
        event1: shuffled[idx1],
        event2: shuffled[idx2],
      });
    }
  }

  return pairs;
}

export default function TimelineGame({ events, userId }: Props) {
  const [pairs, setPairs] = useState<{ event1: TimelineEvent; event2: TimelineEvent }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<"correct" | "wrong" | null>(null);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const totalRounds = 10;

  useEffect(() => {
    setPairs(generatePairs(events, totalRounds));
  }, [events]);

  const currentPair = pairs[currentIndex];

  const handleAnswer = (selectedEvent: TimelineEvent) => {
    if (answered) return;

    const earlier = currentPair.event1.year < currentPair.event2.year ? currentPair.event1 : currentPair.event2;
    const isCorrect = selectedEvent.event === earlier.event;

    if (isCorrect) {
      setScore((s) => s + 1);
      setAnswered("correct");
    } else {
      setAnswered("wrong");
    }

    setTimeout(() => {
      if (currentIndex + 1 >= pairs.length) {
        finishGame(isCorrect ? score + 1 : score);
      } else {
        setCurrentIndex((i) => i + 1);
        setAnswered(null);
      }
    }, 1500);
  };

  const finishGame = async (finalScore: number) => {
    setFinished(true);
    setSaving(true);
    try {
      const supabase = createClient();
      await supabase.from("game_stats").insert({
        user_id: userId,
        game_mode: "Oś czasu",
        points: finalScore,
      });
    } catch (e) {
      console.error("Błąd zapisu:", e);
    }
    setSaving(false);
  };

  if (pairs.length === 0) {
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
          <h1 className="text-3xl font-bold mb-4">⏳ Koniec!</h1>
          <p className="text-xl mb-6">
            Wynik: <span className="text-green-400 font-bold">{score}</span> / {totalRounds}
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
      <div className="w-full max-w-xl">
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-400">
            Runda {currentIndex + 1} / {pairs.length}
          </span>
          <span className="text-green-400">Wynik: {score}</span>
        </div>

        <h2 className="text-xl text-center mb-6">
          Które wydarzenie było <span className="text-yellow-400 font-bold">WCZEŚNIEJ</span>?
        </h2>

        <div className="flex flex-col gap-4">
          {[currentPair.event1, currentPair.event2].map((event, idx) => {
            const earlier = currentPair.event1.year < currentPair.event2.year ? currentPair.event1 : currentPair.event2;
            const isEarlier = event.event === earlier.event;

            let bgColor = "bg-gray-700 hover:bg-gray-600";
            if (answered) {
              bgColor = isEarlier ? "bg-green-600" : "bg-red-600";
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(event)}
                disabled={answered !== null}
                className={`${bgColor} text-white font-semibold py-4 px-6 rounded-lg transition text-left`}
              >
                {event.event}
                {answered && (
                  <span className="float-right text-sm opacity-75">({event.year})</span>
                )}
              </button>
            );
          })}
        </div>

        {answered && (
          <p className={`text-center mt-4 text-lg ${answered === "correct" ? "text-green-400" : "text-red-400"}`}>
            {answered === "correct" ? "✓ Dobrze!" : "✗ Źle!"}
          </p>
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
