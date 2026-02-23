/**
 * Drabina społeczna – progi XP co ok. 20 pkt na początku.
 * Od chłopa przez mieszczan i szlachtę po króla i „kustosza dziejów”.
 */
const LEVELS: { minXp: number; name: string; icon: string }[] = [
  { minXp: 0, name: "Poddany", icon: "🌾" },
  { minXp: 20, name: "Kmieć", icon: "🌾" },
  { minXp: 40, name: "Zagrodnik", icon: "🏠" },
  { minXp: 60, name: "Rzemieślnik", icon: "🔨" },
  { minXp: 80, name: "Mieszczanin", icon: "🏘️" },
  { minXp: 100, name: "Kupiec", icon: "📦" },
  { minXp: 120, name: "Ławnik", icon: "📜" },
  { minXp: 140, name: "Patrycjusz", icon: "🏛️" },
  { minXp: 160, name: "Szlachcic zagrodowy", icon: "⚔️" },
  { minXp: 180, name: "Szlachcic", icon: "⚔️" },
  { minXp: 200, name: "Szlachcic posesjonat", icon: "🏰" },
  { minXp: 220, name: "Podstoli", icon: "🍷" },
  { minXp: 240, name: "Stolnik", icon: "🍽️" },
  { minXp: 260, name: "Kasztelan", icon: "🛡️" },
  { minXp: 280, name: "Wojewoda", icon: "📋" },
  { minXp: 300, name: "Magnat", icon: "💎" },
  { minXp: 320, name: "Senator", icon: "🏛️" },
  { minXp: 340, name: "Hetman", icon: "🎖️" },
  { minXp: 360, name: "Kanclerz", icon: "📜" },
  { minXp: 380, name: "Marszałek koronny", icon: "⚜️" },
  { minXp: 400, name: "Prymas", icon: "✝️" },
  { minXp: 430, name: "Król", icon: "👑" },
  { minXp: 460, name: "Rex et Dux", icon: "👑" },
  { minXp: 500, name: "Kustosz dziejów", icon: "🌟" },
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
