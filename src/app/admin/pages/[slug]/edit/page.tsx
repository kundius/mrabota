import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { PageForm } from "./page-form";

export const metadata: Metadata = {
  title: "Редактирование страницы",
  robots: { index: false, follow: false },
};

export default async function EditPage(props: {
  params: Promise<{ slug: string }>;
}) {
  await requireAdmin();
  const { slug } = await props.params;
  const page = await db.sitePage.findUnique({ where: { slug } });
  if (!page) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900">
        Редактирование: {page.title}
      </h1>
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <PageForm
          slug={page.slug}
          title={page.title}
          content={page.content}
        />
      </div>
    </div>
  );
}