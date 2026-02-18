import zlotyWiek from "./data/quiz-zloty-wiek.json";

export type QuizQuestion = {
  category: string;
  question: string;
  answers: string[];
  correct_index: number;
  explanation: string;
};

export function getQuizQuestions(): QuizQuestion[] {
  return zlotyWiek as QuizQuestion[];
}
