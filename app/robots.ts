import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/auth/", "/ustaw-nick"] },
      { userAgent: "Googlebot", allow: "/", disallow: ["/auth/", "/ustaw-nick"] },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "Anthropic-AI", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Bingbot", allow: "/", disallow: ["/auth/", "/ustaw-nick"] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl.replace(/^https?:\/\//, ""),
  };
}
