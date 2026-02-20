import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/site-config";
import { CATEGORIES } from "@/lib/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/rejestracja`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/menu`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/quiz`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/fiszki`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/os-czasu`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/skojarzenia`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];

  const quizCategoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/quiz/${cat.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const fiszkiCategoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/fiszki/${cat.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...quizCategoryPages, ...fiszkiCategoryPages];
}
