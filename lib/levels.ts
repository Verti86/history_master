/** Progi XP → nazwa poziomu */
const LEVELS: { minXp: number; name: string; icon: string }[] = [
  { minXp: 0, name: "Początkujący", icon: "🌱" },
  { minXp: 50, name: "Uczeń", icon: "📖" },
  { minXp: 150, name: "Opanowany", icon: "⚔️" },
  { minXp: 350, name: "Ekspert", icon: "🏆" },
  { minXp: 700, name: "Mistrz historii", icon: "👑" },
];

export function getLevelForXp(xp: number): { name: string; icon: string; nextLevelAt: number | null; progress: number } {
  let current = LEVELS[0];
  let nextLevelAt: number | null = LEVELS[1]?.minXp ?? null;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      current = LEVELS[i];
      nextLevelAt = LEVELS[i + 1]?.minXp ?? null;
      break;
    }
  }
  const progress =
    nextLevelAt === null ? 1 : (xp - current.minXp) / (nextLevelAt - current.minXp);
  return { name: current.name, icon: current.icon, nextLevelAt, progress: Math.min(1, progress) };
}
