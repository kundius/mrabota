import Link from "next/link";
import type { Metadata } from "next";
import { ChevronUp, ChevronDown } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { reorderVacancy, togglePublish } from "@/lib/actions/vacancies";
import { DeleteVacancyButton } from "./_components/delete-vacancy-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Вакансии",
  robots: { index: false, follow: false },
};

export default async function AdminVacanciesPage() {
  await requireAdmin();

  const vacancies = await db.vacancy.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Вакансии
        </h1>
        <Button
          render={<Link href="/admin/vacancies/new" />}
          className="h-9 px-4"
        >
          Новая вакансия
        </Button>
      </div>

      {vacancies.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-500">
          Пока нет ни одной вакансии. Создайте первую.
        </div>
      ) : (
        <div className="space-y-2">
          {vacancies.map((v, index) => (
            <div
              key={v.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-zinc-200 bg-white px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <form action={reorderVacancy}>
                    <input type="hidden" name="id" value={v.id} />
                    <input type="hidden" name="direction" value="up" />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon-sm"
                      disabled={index === 0}
                      aria-label="Вверх"
                      title="Выше"
                      className="text-zinc-400"
                    >
                      <ChevronUp size={16} aria-hidden="true" />
                    </Button>
                  </form>
                  <form action={reorderVacancy}>
                    <input type="hidden" name="id" value={v.id} />
                    <input type="hidden" name="direction" value="down" />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon-sm"
                      disabled={index === vacancies.length - 1}
                      aria-label="Вниз"
                      title="Ниже"
                      className="text-zinc-400"
                    >
                      <ChevronDown size={16} aria-hidden="true" />
                    </Button>
                  </form>
                </div>
                <Badge
                  className={
                    v.published
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-zinc-100 text-zinc-500"
                  }
                >
                  {v.published ? "опубликована" : "черновик"}
                </Badge>
              </div>

              <Link
                href={`/vacancy/${v.slug}`}
                target="_blank"
                className="min-w-0 flex-1 truncate font-semibold text-zinc-900 hover:text-brand-600"
              >
                {v.title}
              </Link>

              <div className="flex items-center gap-1">
                <form action={togglePublish}>
                  <input type="hidden" name="id" value={v.id} />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    className="text-zinc-500"
                  >
                    {v.published ? "Скрыть" : "Опубликовать"}
                  </Button>
                </form>
                <Button
                  variant="ghost"
                  size="sm"
                  render={<Link href={`/admin/vacancies/${v.id}/edit`} />}
                  className="text-zinc-500"
                >
                  Редактировать
                </Button>
                <DeleteVacancyButton id={v.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}