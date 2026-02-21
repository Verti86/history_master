export type AchievementDef = {
  id: string;
  name: string;
  description: string;
  icon: string;
  /** Warunek: (totalXp, stats) => czy odblokowane */
  check: (totalXp: number, stats: { quizCount: number; flashcardCount: number; categoryIds: Set<string> }) => boolean;
};

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first_quiz",
    name: "Pierwszy quiz",
    description: "Ukończ pierwszy quiz",
    icon: "📝",
    check: (_, s) => s.quizCount >= 1,
  },
  {
    id: "five_quiz",
    name: "Piątka z quizu",
    description: "Ukończ 5 quizów",
    icon: "🎯",
    check: (_, s) => s.quizCount >= 5,
  },
  {
    id: "xp_50",
    name: "50 XP",
    description: "Zdobądź 50 XP",
    icon: "⭐",
    check: (xp) => xp >= 50,
  },
  {
    id: "xp_100",
    name: "100 XP",
    description: "Zdobądź 100 XP",
    icon: "🌟",
    check: (xp) => xp >= 100,
  },
  {
    id: "three_categories",
    name: "Różnorodność",
    description: "Ukończ aktywność w 3 różnych działach",
    icon: "📚",
    check: (_, s) => s.categoryIds.size >= 3,
  },
  {
    id: "flashcards_10",
    name: "Fiszki",
    description: "Zdobądź 10 XP z fiszek",
    icon: "🧠",
    check: (_, s) => s.flashcardCount >= 10,
  },
];
