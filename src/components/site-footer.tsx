import Link from "next/link";
import { Container } from "@/components/container";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-zinc-100 bg-white py-8 sm:mt-24">
      <Container className="flex flex-col items-start justify-between gap-4 text-sm text-zinc-500 sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} Вакансии Ногинск</p>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          <Link
            href="/privacy"
            className="transition-colors hover:text-brand-600"
          >
            Политика конфиденциальности
          </Link>
          <Link
            href="/consent"
            className="transition-colors hover:text-brand-600"
          >
            Согласие на обработку ПД
          </Link>
        </nav>
      </Container>
    </footer>
  );
}