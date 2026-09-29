import { Container, formatPhoneHref } from "@/components/container";
import { Logo } from "@/components/logo";

export function SiteHeader({ phone }: { phone: string | null }) {
  return (
    <header className="border-b border-zinc-100 bg-white">
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Logo />
        {phone ? (
          <a
            href={formatPhoneHref(phone)}
            className="text-base font-semibold text-zinc-900 transition-colors hover:text-brand-600 sm:text-lg"
          >
            {phone}
          </a>
        ) : null}
      </Container>
    </header>
  );
}