import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { VacancyForm } from "../../_components/vacancy-form";

export const metadata: Metadata = {
  title: "Редактирование вакансии",
  robots: { index: false, follow: false },
};

export default async function EditVacancyPage(props: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await props.params;
  const vacancy = await db.vacancy.findUnique({ where: { id } });
  if (!vacancy) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900">
        Редактирование: {vacancy.title}
      </h1>
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <VacancyForm
          mode="edit"
          initial={{
            id: vacancy.id,
            slug: vacancy.slug,
            title: vacancy.title,
            shortDescription: vacancy.shortDescription,
            description: vacancy.description,
            schedule: vacancy.schedule,
            address: vacancy.address,
            salary: vacancy.salary,
            imageUrl: vacancy.imageUrl,
            published: vacancy.published,
          }}
        />
      </div>
    </div>
  );
}