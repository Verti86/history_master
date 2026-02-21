/** Zwraca liczbę kolejnych dni z aktywnością (wstecz od dziś). dates = posortowane unikalne daty ISO (YYYY-MM-DD) malejąco. */
export function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const today = new Date().toISOString().slice(0, 10);
  const sorted = [...new Set(dates)].sort().reverse();
  if (sorted[0] !== today && sorted[0] !== yesterday()) return 0;
  let streak = 0;
  let expect = today;
  for (const d of sorted) {
    if (d === expect) {
      streak++;
      expect = prevDay(expect);
    } else if (d < expect) {
      break;
    }
  }
  return streak;
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function prevDay(iso: string): string {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}
