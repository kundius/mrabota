import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Container } from "@/components/container";
import { VacancyCard } from "@/components/vacancy-card";

export const metadata: Metadata = {
  title: "Вакансии",
  description:
    "Актуальные вакансии компании в Ногинске. Узнайте об условиях работы, графике и зарплате — оставьте заявку.",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const vacancies = await db.vacancy.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <Container className="py-10 sm:py-16">
      <section className="max-w-2xl">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-4xl">
          Работа в Ногинске
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-zinc-500">
          Актуальные вакансии компании. Официальное оформление, стабильная
          зарплата, работа рядом с домом.
        </p>
      </section>

      {vacancies.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center text-zinc-500">
          Сейчас открытых вакансий нет. Загляните позже.
        </div>
      ) : (
        <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vacancies.map((v) => (
            <VacancyCard
              key={v.id}
              vacancy={{
                slug: v.slug,
                title: v.title,
                shortDescription: v.shortDescription,
                schedule: v.schedule,
                address: v.address,
                salary: v.salary,
                imageUrl: v.imageUrl,
              }}
            />
          ))}
        </section>
      )}
    </Container>
  );
}