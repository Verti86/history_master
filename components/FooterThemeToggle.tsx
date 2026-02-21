"use client";

import { useTheme } from "./ThemeProvider";

export function FooterThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="text-gray-400 hover:text-[#ffbd45] transition-colors"
      title={theme === "dark" ? "Tryb jasny" : "Tryb ciemny"}
      aria-label={theme === "dark" ? "Włącz tryb jasny" : "Włącz tryb ciemny"}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
