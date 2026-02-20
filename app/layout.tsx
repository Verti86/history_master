import type { Metadata, Viewport } from "next";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import { SITE_NAME, SITE_DESCRIPTION, getBaseUrl } from "@/lib/site-config";

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${SITE_NAME} | Quiz z historii – klasa 6 SP`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "historia",
    "quiz z historii",
    "klasa 6",
    "szkoła podstawowa",
    "fiszki historia",
    "oś czasu",
    "Rzeczpospolita Obojga Narodów",
    "podstawa programowa",
    "nauka historii",
  ],
  authors: [{ name: "History Master Online" }],
  creator: "History Master Online",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: baseUrl,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Quiz, fiszki i oś czasu z historii`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Quiz z historii`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: baseUrl },
  category: "education",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: baseUrl,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "PLN" },
  author: { "@type": "Organization", name: SITE_NAME },
  inLanguage: "pl",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen bg-[#0e1117] text-[#fafafa]">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
