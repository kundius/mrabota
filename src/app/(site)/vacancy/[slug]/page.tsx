import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { db } from "@/lib/db";
import { Container } from "@/components/container";
import { ApplicationForm } from "@/components/application-form";
import { SITE_CITY } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

function siteUrl(path = ""): string {
  const origin = process.env.SITE_URL || "http://localhost:3000";
  return `${origin}${path}`;
}

function parseSalary(salary: string): number | null {
  const digits = salary.replace(/\s/g, "").match(/\d[\d\u00a0]*/)?.[0];
  if (!digits) return null;
  const value = Number(digits.replace(/[^\d]/g, ""));
  return Number.isFinite(value) && value > 0 ? value : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vacancy = await db.vacancy.findUnique({ where: { slug } });
  if (!vacancy || !vacancy.published) return {};
  return {
    title: vacancy.title,
    description: vacancy.shortDescription,
    openGraph: {
      title: vacancy.title,
      description: vacancy.shortDescription,
      url: siteUrl(`/vacancy/${vacancy.slug}`),
      images: vacancy.imageUrl
        ? [{ url: siteUrl(vacancy.imageUrl) }]
        : undefined,
    },
  };
}

export default async function VacancyPage({ params }: Props) {
  const { slug } = await params;
  const vacancy = await db.vacancy.findUnique({ where: { slug } });
  if (!vacancy || !vacancy.published) notFound();

  const salaryValue = parseSalary(vacancy.salary);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: vacancy.title,
    description: vacancy.shortDescription,
    datePosted: vacancy.createdAt.toISOString(),
    employmentType: "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: "Вакансии Ногинск",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: SITE_CITY,
        addressCountry: "RU",
        streetAddress: vacancy.address,
      },
    },
    ...(vacancy.imageUrl ? { image: siteUrl(vacancy.imageUrl) } : {}),
    ...(salaryValue
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "RUB",
            value: {
              "@type": "QuantitativeValue",
              value: salaryValue,
              unitText: "MONTH",
            },
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Container className="py-8 sm:py-12">
        <nav className="mb-6 text-sm text-zinc-400">
          <Link href="/" className="transition-colors hover:text-brand-600">
            Главная
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-600">{vacancy.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge className="px-3 py-1 text-sm bg-brand-50 text-brand-700">
                {vacancy.salary}
              </Badge>
              <Badge
                variant="secondary"
                className="px-3 py-1 text-sm bg-zinc-100 text-zinc-600"
              >
                {vacancy.schedule}
              </Badge>
            </div>
            <span className="mt-4 mb-4 flex items-start gap-1.5 text-sm text-zinc-500">
              <MapPin size={15} aria-hidden="true" className="mt-0.5 shrink-0" />
              {vacancy.address}
            </span>

            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-4xl">
              {vacancy.title}
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-zinc-500">
              {vacancy.shortDescription}
            </p>

            {vacancy.imageUrl ? (
              <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl bg-zinc-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={vacancy.imageUrl}
                  alt={vacancy.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}

            <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
              <div
                className="rich-content text-base"
                dangerouslySetInnerHTML={{ __html: vacancy.description }}
              />
            </div>
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div
              id="apply"
              className="scroll-mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-6"
            >
              <h2 className="mb-1 text-lg font-bold text-zinc-900">
                Оставить заявку
              </h2>
              <p className="mb-5 text-sm text-zinc-500">
                Заполните форму — мы свяжемся с вами.
              </p>
              <ApplicationForm vacancyId={vacancy.id} />
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}