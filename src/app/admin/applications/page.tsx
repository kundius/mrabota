import type { Metadata } from "next";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Заявки",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

export default async function AdminApplicationsPage() {
  await requireAdmin();

  const applications = await db.application.findMany({
    include: { vacancy: { select: { title: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold tracking-tight text-zinc-900">
        Заявки
      </h1>
      <p className="mb-6 text-sm text-zinc-500">Всего: {applications.length}</p>

      {applications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-500">
          Заявок пока нет.
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow className="border-zinc-200 text-xs uppercase tracking-wide text-zinc-400 hover:bg-transparent">
                <TableHead className="px-4 py-3 font-medium">Дата</TableHead>
                <TableHead className="px-4 py-3 font-medium">Вакансия</TableHead>
                <TableHead className="px-4 py-3 font-medium">Имя</TableHead>
                <TableHead className="px-4 py-3 font-medium">Телефон</TableHead>
                <TableHead className="px-4 py-3 font-medium">Город</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((a) => (
                <TableRow key={a.id} className="border-zinc-100 last:border-0">
                  <TableCell className="px-4 py-3 text-zinc-500">
                    {formatDate(a.createdAt)}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {a.vacancy ? (
                      <a
                        href={`/vacancy/${a.vacancy.slug}`}
                        target="_blank"
                        className="text-brand-600 hover:underline"
                      >
                        {a.vacancy.title}
                      </a>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3">{a.name || "—"}</TableCell>
                  <TableCell className="px-4 py-3">{a.phone}</TableCell>
                  <TableCell className="px-4 py-3">{a.city}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}