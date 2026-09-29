import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type CardData = {
  slug: string;
  title: string;
  shortDescription: string;
  schedule: string;
  address: string;
  salary: string;
  imageUrl: string | null;
};

export function VacancyCard({ vacancy }: { vacancy: CardData }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-shadow hover:shadow-lg">
      <Link
        href={`/vacancy/${vacancy.slug}`}
        className="relative block aspect-video w-full overflow-hidden bg-zinc-100"
      >
        {vacancy.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vacancy.imageUrl}
            alt={vacancy.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
            Вакансии · Ногинск
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-brand-50 text-brand-700">{vacancy.salary}</Badge>
          <Badge variant="secondary" className="bg-zinc-100 text-zinc-600">
            {vacancy.schedule}
          </Badge>
        </div>

        <h2 className="text-lg font-bold leading-snug text-zinc-900">
          <Link
            href={`/vacancy/${vacancy.slug}`}
            className="transition-colors group-hover:text-brand-600"
          >
            {vacancy.title}
          </Link>
        </h2>

        <p className="line-clamp-2 text-sm leading-relaxed text-zinc-500">
          {vacancy.shortDescription}
        </p>

        <div className="mt-auto flex flex-col items-start gap-5">
          <span className="flex items-start gap-1.5 text-sm text-zinc-500">
            <MapPin size={15} aria-hidden="true" className="mt-0.5 shrink-0" />
            {vacancy.address}
          </span>
          <Button
            render={<Link href={`/vacancy/${vacancy.slug}`} />}
            className="h-9 px-4"
          >
            Подробнее
          </Button>
        </div>
      </div>
    </article>
  );
}