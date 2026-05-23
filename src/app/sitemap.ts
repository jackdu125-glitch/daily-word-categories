import type { MetadataRoute } from "next";
import { getRecentPuzzles } from "@/lib/puzzles-data";

const siteUrl = "https://www.jackdu2.me";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/how-to-play`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/archive`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  const puzzles = await getRecentPuzzles(60);
  const answerRoutes: MetadataRoute.Sitemap = puzzles.map((puzzle) => ({
    url: `${siteUrl}/answers/${puzzle.date}`,
    lastModified: new Date(`${puzzle.date}T00:00:00.000Z`),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...answerRoutes];
}
