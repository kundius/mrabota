import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Страницы",
  robots: { index: false, follow: false },
};

export default async function AdminPagesPage() {
  await requireAdmin();
  const pages = await db.sitePage.findMany({ orderBy: { slug: "asc" } });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900">
        Страницы
      </h1>
      <div className="space-y-2">
        {pages.map((p) => (
          <div
            key={p.slug}
            className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3"
          >
            <div>
              <div className="font-semibold text-zinc-900">{p.title}</div>
              <div className="text-sm text-zinc-400">/{p.slug}</div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              render={<Link href={`/admin/pages/${p.slug}/edit`} />}
              className="text-zinc-500"
            >
              Редактировать
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}