import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "History Master Online | Quiz z historii – klasa 6",
  description: "Quiz, fiszki i oś czasu z historii – zgodne z podstawą programową dla klasy 6 SP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className="antialiased min-h-screen bg-[#0e1117] text-[#fafafa]">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
