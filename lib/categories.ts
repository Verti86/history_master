import { DEFAULT_GRADE } from "./grades";
import type { GradeValue } from "./grades";

export type Category = {
  id: string;
  file: string;
  name: string;
  icon: string;
  dateRange?: string;
  /** Klasa SP (4–8) – zgodnie z podstawą programową 2017 */
  grade: GradeValue;
};

/** Wszystkie kategorie z przypisaniem do klasy. Podstawa programowa historia SP 2017. */
export const CATEGORIES: Category[] = [
  // Klasa 4 – zgodnie z podstawą programową (działy I–IV)
  { id: "klasa4-historia-nauka", file: "klasa4_historia_jako_nauka.json", name: "Historia jako nauka – czas i źródła", icon: "📜", dateRange: "—", grade: 4 },
  { id: "klasa4-symbole-legendy", file: "klasa4_symbole_i_legendy.json", name: "Symbole narodowe i legendy", icon: "🏴", dateRange: "—", grade: 4 },
  { id: "klasa4-mieszko-chrzest", file: "klasa4_mieszko_chrzest.json", name: "Początki Polski – Mieszko I i chrzest", icon: "⛪", dateRange: "X wiek", grade: 4 },
  { id: "klasa4-boleslaw-gniezno", file: "klasa4_boleslaw_gniezno.json", name: "Bolesław Chrobry i zjazd gnieźnieński", icon: "👑", dateRange: "ok. 1000", grade: 4 },
  { id: "klasa4-kazimierz-grunwald", file: "klasa4_kazimierz_grunwald.json", name: "Kazimierz Wielki, Jadwiga, Jagiełło, Grunwald", icon: "⚔️", dateRange: "XIV–XV w.", grade: 4 },
  { id: "klasa4-kopernik-zakowie", file: "klasa4_kopernik_zakowie.json", name: "Mikołaj Kopernik i krakowscy żacy", icon: "🔬", dateRange: "XVI w.", grade: 4 },
  { id: "klasa4-jan-zamoyski", file: "klasa4_jan_zamoyski.json", name: "Jan Zamoyski – wódz i mąż stanu", icon: "⚔️", dateRange: "XVI w.", grade: 4 },
  { id: "klasa4-bohaterowie-xvii", file: "klasa4_bohaterowie_xvii.json", name: "Kordecki, Czarniecki, Jan III Sobieski", icon: "🛡️", dateRange: "XVII w.", grade: 4 },
  { id: "klasa4-kosciuszko-raclawice", file: "klasa4_kosciuszko_raclawice.json", name: "Kościuszko i kosynierzy spod Racławic", icon: "🌾", dateRange: "XVIII w.", grade: 4 },
  { id: "klasa4-dabrowski-hymn", file: "klasa4_dabrowski_hymn.json", name: "Dąbrowski, Wybicki i polski hymn", icon: "🎵", dateRange: "XVIII–XIX w.", grade: 4 },
  { id: "klasa4-traugutt-powstanie", file: "klasa4_traugutt_powstanie.json", name: "Romuald Traugutt i powstańcze państwo", icon: "📜", dateRange: "XIX w.", grade: 4 },
  { id: "klasa4-sklodowska-curie", file: "klasa4_sklodowska_curie.json", name: "Maria Skłodowska-Curie", icon: "🧪", dateRange: "XIX–XX w.", grade: 4 },
  { id: "klasa4-pilsudski", file: "klasa4_pilsudski.json", name: "Józef Piłsudski i jego żołnierze", icon: "🎖️", dateRange: "XX w.", grade: 4 },
  { id: "klasa4-gdynia-kwiatkowski", file: "klasa4_gdynia_kwiatkowski.json", name: "Eugeniusz Kwiatkowski i budowa Gdyni", icon: "🚢", dateRange: "XX w.", grade: 4 },
  { id: "klasa4-szare-szeregi", file: "klasa4_szare_szeregi.json", name: "Zośka, Alek, Rudy – Szare Szeregi", icon: "🦅", dateRange: "XX w.", grade: 4 },
  { id: "klasa4-zolnierze-niezlomni", file: "klasa4_zolnierze_niezlomni.json", name: "Żołnierze niezłomni – Pilecki, Inka", icon: "💪", dateRange: "XX w.", grade: 4 },
  { id: "klasa4-jan-pawel-2", file: "klasa4_jan_pawel_2.json", name: "Jan Paweł II", icon: "✝️", dateRange: "XX w.", grade: 4 },
  { id: "klasa4-solidarnosc", file: "klasa4_solidarnosc.json", name: "Solidarność i jej bohaterowie", icon: "✊", dateRange: "XX w.", grade: 4 },
  // Klasa 5 – średniowiecze Polski i świata, Jagiellonowie (do XV w.)
  { id: "klasa5-cywilizacje-starozytne", file: "klasa5_cywilizacje_starozytne.json", name: "Cywilizacje starożytne", icon: "🏛️", dateRange: "Starożytność", grade: 5 },
  { id: "klasa5-bizancjum-islam", file: "klasa5_bizancjum_islam.json", name: "Bizancjum i świat islamu", icon: "🕌", dateRange: "V–XV w.", grade: 5 },
  { id: "klasa5-sredniowieczna-europa", file: "klasa5_sredniowieczna_europa.json", name: "Średniowieczna Europa", icon: "⚔️", dateRange: "V–XIII w.", grade: 5 },
  { id: "klasa5-spoleczenstwo-kultura-sredniowiecza", file: "klasa5_spoleczenstwo_kultura_sredniowiecza.json", name: "Społeczeństwo i kultura średniowiecza", icon: "📜", dateRange: "Średniowiecze", grade: 5 },
  { id: "klasa5-polska-wczesnopiastowska", file: "klasa5_polska_wczesnopiastowska.json", name: "Polska w okresie wczesnopiastowskim", icon: "⛪", dateRange: "X–XII w.", grade: 5 },
  { id: "klasa5-rozbicie-dzielnicowe", file: "klasa5_rozbicie_dzielnicowe.json", name: "Polska w okresie rozbicia dzielnicowego", icon: "🗡️", dateRange: "XII–XIV w.", grade: 5 },
  { id: "klasa5-polska-xiv-xv", file: "klasa5_polska_xiv_xv.json", name: "Polska w XIV i XV wieku", icon: "🏰", dateRange: "XIV–XV w.", grade: 5 },
  // Klasa 6 – czasy nowożytne, RON (obecna zawartość)
  { id: "odkrycia", file: "bazawielkie_odkrycia_geograficzne.json", name: "Wielkie odkrycia geograficzne", icon: "🧭", dateRange: "Koniec XV – XVI wiek", grade: 6 },
  { id: "zloty-wiek", file: "bazazolty_wiek_polska.json", name: "Złoty wiek w Polsce", icon: "✨", dateRange: "XVI wiek", grade: 6 },
  { id: "reformacja", file: "bazareformacja_wyznania.json", name: "Reformacja i wyznania", icon: "⛪", dateRange: "XVI–XVII wiek", grade: 6 },
  { id: "poczatki-ron", file: "bazapoczatki_ron.json", name: "Początki Rzeczypospolitej Obojga Narodów", icon: "🦅", dateRange: "1572–1586", grade: 6 },
  { id: "zygmunt-wazowie", file: "bazazygmunt_iii_wazowie.json", name: "Zygmunt III Waza i Wazowie", icon: "👑", dateRange: "1587–1668", grade: 6 },
  { id: "wojny-rosja", file: "bazapoczatki_panowania_wazow_i_wojny_z_rosja.json", name: "Wojny z Rosją", icon: "🐻", grade: 6 },
  { id: "wojny-polnoc-wschod", file: "bazawojny_polnoc_wschod.json", name: "Wojny: Północ i Wschód", icon: "🗡️", grade: 6 },
  { id: "powstanie-kozackie", file: "bazapowstanie_kozackie.json", name: "Powstanie Chmielnickiego", icon: "🐴", dateRange: "1648–1657", grade: 6 },
  { id: "potop-szwedzki", file: "bazawojny_szwecja.json", name: "Potop szwedzki", icon: "🌊", dateRange: "1655–1660", grade: 6 },
  { id: "kryzys-rp", file: "bazakryzys_rzeczypospolitej.json", name: "Kryzys Rzeczypospolitej", icon: "⚠️", grade: 6 },
  { id: "wojny-turcja", file: "bazawojny_turcja.json", name: "Wojny z Turcją", icon: "🌙", grade: 6 },
  { id: "wojny-turcja-kultura", file: "bazawojny_turcja_i_kultura.json", name: "Wojny z Turcją i kultura", icon: "🕌", grade: 6 },
  { id: "bitwy-xvii", file: "bazabitwy_xvii_wieku.json", name: "Wielkie bitwy XVII wieku", icon: "⚔️", grade: 6 },
  { id: "spoleczenstwo-xvii", file: "bazaspoleczenstwo_gospodarka_xvii.json", name: "Społeczeństwo i gospodarka", icon: "🌾", grade: 6 },
  { id: "barok-kultura", file: "bazabarok_i_kultura.json", name: "Barok i kultura sarmacka", icon: "🎭", grade: 6 },
  { id: "francja-monarchia", file: "bazamonarchia_we_francji.json", name: "Francja: Monarchia absolutna", icon: "🏰", grade: 6 },
  { id: "anglia-parlament", file: "bazamonarchia_parlamentarna_w_anglii.json", name: "Anglia: Monarchia parlamentarna", icon: "🦁", grade: 6 },
  { id: "europa-kryzys", file: "bazaeuropa_i_kryzys.json", name: "Europa i kryzys", icon: "🔥", grade: 6 },
  { id: "oswiecenie", file: "bazaoswiecenie_reformy.json", name: "Oświecenie i reformy", icon: "💡", dateRange: "XVIII wiek", grade: 6 },
  { id: "usa-niepodleglosc", file: "bazapowstanie_stanow_zjednoczonych.json", name: "Powstanie Stanów Zjednoczonych", icon: "🗽", dateRange: "1775–1787", grade: 6 },
  { id: "rewolucja-francuska", file: "bazarewolucja_francuska.json", name: "Wielka rewolucja we Francji", icon: "🔴", dateRange: "1789–1799", grade: 6 },
  { id: "rozbiory-kosciuszko", file: "bazarozbiory_walka_o_niepodleglosc.json", name: "Walka o niepodległość – rozbiory, Kościuszko", icon: "🕊️", dateRange: "1772–1795", grade: 6 },
  { id: "epoka-napoleonska", file: "bazaepoka_napoleonska.json", name: "Epoka napoleońska", icon: "🎖️", dateRange: "1799–1815", grade: 6 },
  // Klasa 7 – podstawa programowa działy XIX–XXVI
  { id: "klasa7-xix", file: "klasa7_kongres_wiedenski.json", name: "Europa po kongresie wiedeńskim", icon: "🏛️", dateRange: "1815–1848", grade: 7 },
  { id: "klasa7-xx", file: "klasa7_ziemie_polskie_1815_1848.json", name: "Ziemie polskie 1815–1848", icon: "🗡️", dateRange: "1815–1848", grade: 7 },
  { id: "klasa7-xxi", file: "klasa7_wiosna_ludow.json", name: "Wiosna Ludów", icon: "🌍", dateRange: "1848–1849", grade: 7 },
  { id: "klasa7-xxii", file: "klasa7_powstanie_styczniowe.json", name: "Powstanie styczniowe", icon: "⚔️", dateRange: "1863–1864", grade: 7 },
  { id: "klasa7-xxiii", file: "klasa7_europa_swiat_ii_pol_xix.json", name: "Europa i świat II poł. XIX i pocz. XX w.", icon: "🌐", dateRange: "II poł. XIX–1914", grade: 7 },
  { id: "klasa7-xxiv", file: "klasa7_ziemie_polskie_pod_zaborami.json", name: "Ziemie polskie pod zaborami", icon: "📜", dateRange: "II poł. XIX–1914", grade: 7 },
  { id: "klasa7-xxv", file: "klasa7_i_wojna_swiatowa.json", name: "I wojna światowa", icon: "🎖️", dateRange: "1914–1918", grade: 7 },
  { id: "klasa7-xxvi", file: "klasa7_sprawa_polska_i_wojna.json", name: "Sprawa polska w I wojnie światowej", icon: "🕊️", dateRange: "1914–1918", grade: 7 },
  // Klasa 8 – XX wiek
  { id: "klasa8-xx", file: "klasa8_xx_wiek.json", name: "XX wiek – wojny i odzyskanie wolności", icon: "🕊️", dateRange: "XX wiek", grade: 8 },
];

export function getCategoriesByGrade(grade: GradeValue): Category[] {
  return CATEGORIES.filter((c) => c.grade === grade);
}

export function getCategoryById(id: string, grade?: GradeValue): Category | undefined {
  if (id === "wszystkie") {
    return { id: "wszystkie", file: "", name: "Wszystkie tematy", icon: "📚", grade: grade ?? DEFAULT_GRADE };
  }
  const cat = CATEGORIES.find((c) => c.id === id);
  if (grade != null && cat && cat.grade !== grade) return undefined;
  return cat;
}

export function getCategoryByFile(file: string): Category | undefined {
  return CATEGORIES.find((c) => c.file === file);
}
