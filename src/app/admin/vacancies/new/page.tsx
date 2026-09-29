import type { Metadata } from "next";
import { VacancyForm } from "../_components/vacancy-form";

export const metadata: Metadata = {
  title: "Новая вакансия",
  robots: { index: false, follow: false },
};

export default function NewVacancyPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900">
        Новая вакансия
      </h1>
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <VacancyForm mode="create" />
      </div>
    </div>
  );
}