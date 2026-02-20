"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { QuizQuestion } from "@/lib/quiz-data";

const QUESTIONS_PER_ROUND = 10;

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function QuizGame({ questions, userId }: { questions: QuizQuestion[]; userId: string }) {
  const [order] = useState(() => shuffle(questions).slice(0, QUESTIONS_PER_ROUND));
  const [answerOrders] = useState(() => order.map(() => shuffle([0, 1, 2, 3])));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"ok" | "wrong" | null>(null);
  const [saved, setSaved] = useState(false);
  const savingRef = useRef(false);

  const current = order[index];
  const total = order.length;
  const finished = index >= total;

  useEffect(() => {
    if (finished && !saved && !savingRef.current) {
      savingRef.current = true;
      saveScore(score).then(() => setSaved(true));
    }
  }, [finished, saved, score]);

  const answers = useMemo(() => {
    if (!current || !answerOrders[index]) return [];
    return answerOrders[index].map((i) => current.answers[i]);
  }, [current, answerOrders, index]);

  async function handleAnswer(ans: string) {
    if (feedback !== null) return;
    const correct = current.answers[current.correct_index];
    if (ans === correct) {
      setFeedback("ok");
      setScore((s) => s + 1);
    } else {
      setFeedback("wrong");
    }
  }

  async function saveScore(finalScore: number) {
    const supabase = createClient();
    await supabase.from("game_stats").insert({
      user_id: userId,
      game_mode: "Quiz",
      points: finalScore,
    });
  }

  function nextQuestion() {
    setFeedback(null);
    setIndex((i) => i + 1);
  }

  if (finished) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">🎉 Koniec quizu!</h1>
        <p className="text-[#ffbd45] text-xl">
          Wynik: <strong>{score}</strong> / {total}
        </p>
        {!saved && <p className="text-gray-400">Zapisywanie wyniku...</p>}
        <Link href="/menu" className="inline-block px-6 py-3 rounded-lg bg-[#ffbd45] text-[#0e1117] font-medium hover:opacity-90">
          Wróć do menu
        </Link>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between text-sm text-[#888]">
        <span>Pytanie {index + 1} / {total}</span>
        <span>Punkty: {score}</span>
      </div>
      <div className="h-2 bg-[#262730] rounded-full overflow-hidden">
        <div className="h-full bg-[#ffbd45] transition-all" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      <h2 className="text-xl font-medium">{current.question}</h2>

      {feedback === "wrong" && (
        <div className="p-4 rounded-lg bg-red-900/30 border border-red-700 text-red-200 text-sm">
          Źle. Poprawna odpowiedź: <strong>{current.answers[current.correct_index]}</strong>
          <p className="mt-2 text-[#aaa]">{current.explanation}</p>
        </div>
      )}
      {feedback === "ok" && (
        <div className="p-4 rounded-lg bg-green-900/30 border border-green-700 text-green-200 text-sm">
          Brawo!
        </div>
      )}

      <div className="grid gap-2">
        {answers.map((ans) => (
          <button
            key={ans}
            type="button"
            onClick={() => handleAnswer(ans)}
            disabled={feedback !== null}
            className="p-4 rounded-xl bg-[#262730] border border-[#444] hover:border-[#ffbd45] text-left disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {ans}
          </button>
        ))}
      </div>

      {feedback !== null && (
        <button
          type="button"
          onClick={nextQuestion}
          className="w-full py-3 rounded-lg bg-[#ffbd45] text-[#0e1117] font-medium hover:opacity-90"
        >
          Dalej →
        </button>
      )}

      <p className="text-center">
        <Link href="/menu" className="text-sm text-[#888] hover:text-[#ffbd45]">← Przerwij i wróć do menu</Link>
      </p>
    </div>
  );
}
