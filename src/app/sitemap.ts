import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function siteUrl(path: string): string {
  const origin = process.env.SITE_URL || "http://localhost:3000";
  return `${origin}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const vacancies = await db.vacancy.findMany({
    where: { published: true },
    orderBy: { updatedAt: "desc" },
  });

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl("/"), changeFrequency: "weekly", priority: 1 },
    {
      url: siteUrl("/privacy"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: siteUrl("/consent"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const vacancyPages: MetadataRoute.Sitemap = vacancies.map((v) => ({
    url: siteUrl(`/vacancy/${v.slug}`),
    lastModified: v.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...vacancyPages];
}