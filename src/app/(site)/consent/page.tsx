import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Container } from "@/components/container";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await db.sitePage.findUnique({ where: { slug: "consent" } });
  if (!page) return {};
  return { title: page.title };
}

export default async function ConsentPage() {
  const page = await db.sitePage.findUnique({ where: { slug: "consent" } });
  if (!page) notFound();

  return (
    <Container className="py-10 sm:py-16">
      <article className="max-w-3xl">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-4xl">
          {page.title}
        </h1>
        <div
          className="mt-6 rich-content text-base"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </article>
    </Container>
  );
}