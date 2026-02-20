import { getBaseUrl } from "@/lib/site-config";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config";
import { CATEGORIES } from "@/lib/categories";

export async function GET() {
  const baseUrl = getBaseUrl();
  const lines = [
    `# ${SITE_NAME}`,
    "",
    SITE_DESCRIPTION,
    "",
    `Strona: ${baseUrl}`,
    "Język: polski (pl)",
    "Kategoria: edukacja, historia, szkoła podstawowa, klasa 6",
    "",
    "## Tryby nauki",
    "- Quiz (pytania wielokrotnego wyboru)",
    "- Fiszki (nauka pojęć)",
    "- Oś czasu (układanie wydarzeń chronologicznie)",
    "- Skojarzenia (odgadywanie po podpowiedziach)",
    "",
    "## Tematy (działy historii)",
    ...CATEGORIES.map((c) => `- ${c.name} (/${c.id})`),
    "",
    "Strona wymaga logowania do gry. Strona główna, logowanie i rejestracja są publiczne.",
  ];
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
