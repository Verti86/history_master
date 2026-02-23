const CHALLENGES: { title: string; targetXp: number; description: string }[] = [
  { title: "Wyzwanie tygodnia", targetXp: 20, description: "Zdobądź 20 XP w tym tygodniu" },
  { title: "Wyzwanie tygodnia", targetXp: 30, description: "Zdobądź 30 XP w tym tygodniu" },
  { title: "Wyzwanie tygodnia", targetXp: 50, description: "Zdobądź 50 XP w tym tygodniu" },
];

/** Numer tygodnia w roku (ISO) – do rotacji wyzwań */
function getIsoWeekNumber(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/** Tekst wyzwania na bieżący tydzień (poniedziałek–niedziela). Rotacja 20/30/50 XP. */
export function getCurrentWeekChallenge(): { title: string; targetXp: number; description: string } {
  const idx = getIsoWeekNumber() % CHALLENGES.length;
  return CHALLENGES[idx];
}

/** Początek bieżącego tygodnia (poniedziałek) w ISO date */
export function getCurrentWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - (day === 0 ? 6 : day - 1);
  const monday = new Date(d);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().slice(0, 10);
}
