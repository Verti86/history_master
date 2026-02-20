export type Category = {
  id: string;
  file: string;
  name: string;
  icon: string;
  dateRange?: string;
};

export const CATEGORIES: Category[] = [
  { id: "odkrycia", file: "bazawielkie_odkrycia_geograficzne.json", name: "Wielkie odkrycia geograficzne", icon: "🌍", dateRange: "Koniec XV – XVI wiek" },
  { id: "zloty-wiek", file: "bazazolty_wiek_polska.json", name: "Złoty wiek w Polsce", icon: "🏛️", dateRange: "XVI wiek" },
  { id: "reformacja", file: "bazareformacja_wyznania.json", name: "Reformacja i wyznania", icon: "📜", dateRange: "XVI–XVII wiek" },
  { id: "poczatki-ron", file: "bazapoczatki_ron.json", name: "Początki Rzeczypospolitej Obojga Narodów", icon: "📜", dateRange: "1572–1586" },
  { id: "zygmunt-wazowie", file: "bazazygmunt_iii_wazowie.json", name: "Zygmunt III Waza i Wazowie", icon: "👑", dateRange: "1587–1668" },
  { id: "wojny-rosja", file: "bazapoczatki_panowania_wazow_i_wojny_z_rosja.json", name: "Wojny z Rosją", icon: "🇷🇺" },
  { id: "wojny-polnoc-wschod", file: "bazawojny_polnoc_wschod.json", name: "Wojny: Północ i Wschód", icon: "⚔️" },
  { id: "powstanie-kozackie", file: "bazapowstanie_kozackie.json", name: "Powstanie Chmielnickiego", icon: "🇺🇦", dateRange: "1648–1657" },
  { id: "potop-szwedzki", file: "bazawojny_szwecja.json", name: "Potop szwedzki", icon: "🇸🇪", dateRange: "1655–1660" },
  { id: "kryzys-rp", file: "bazakryzys_rzeczypospolitej.json", name: "Kryzys Rzeczypospolitej", icon: "📉" },
  { id: "wojny-turcja", file: "bazawojny_turcja.json", name: "Wojny z Turcją", icon: "🏰" },
  { id: "wojny-turcja-kultura", file: "bazawojny_turcja_i_kultura.json", name: "Wojny z Turcją i kultura", icon: "🏰" },
  { id: "bitwy-xvii", file: "bazabitwy_xvii_wieku.json", name: "Wielkie bitwy XVII wieku", icon: "⚔️" },
  { id: "spoleczenstwo-xvii", file: "bazaspoleczenstwo_gospodarka_xvii.json", name: "Społeczeństwo i gospodarka", icon: "🏘️" },
  { id: "barok-kultura", file: "bazabarok_i_kultura.json", name: "Barok i kultura sarmacka", icon: "🎨" },
  { id: "francja-monarchia", file: "bazamonarchia_we_francji.json", name: "Francja: Monarchia absolutna", icon: "👑" },
  { id: "anglia-parlament", file: "bazamonarchia_parlamentarna_w_anglii.json", name: "Anglia: Monarchia parlamentarna", icon: "🇬🇧" },
  { id: "europa-kryzys", file: "bazaeuropa_i_kryzys.json", name: "Europa i kryzys", icon: "🌍" },
  { id: "oswiecenie", file: "bazaoswiecenie_reformy.json", name: "Oświecenie i reformy", icon: "💡", dateRange: "XVIII wiek" },
];

export function getCategoryById(id: string): Category | undefined {
  if (id === "wszystkie") {
    return { id: "wszystkie", file: "", name: "Wszystkie tematy", icon: "📚" };
  }
  return CATEGORIES.find((c) => c.id === id);
}

export function getCategoryByFile(file: string): Category | undefined {
  return CATEGORIES.find((c) => c.file === file);
}
