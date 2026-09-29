import Link from "next/link";
import { Briefcase } from "lucide-react";
import { logout } from "@/lib/actions/auth";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/admin/vacancies", label: "Вакансии" },
  { href: "/admin/settings", label: "Настройки" },
  { href: "/admin/pages", label: "Страницы" },
  { href: "/admin/applications", label: "Заявки" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    return <div className="min-h-screen bg-zinc-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-brand-600 text-white">
              <Briefcase size={18} aria-hidden="true" />
            </span>
            <span className="font-bold tracking-tight text-zinc-900">Админка</span>
          </div>
          <nav className="flex flex-wrap items-center gap-1">
            {NAV.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                render={<Link href={item.href} />}
                className="h-8 text-zinc-600"
              >
                {item.label}
              </Button>
            ))}
            <Button
              variant="ghost"
              render={<Link href="/" />}
              className="h-8 text-zinc-400"
            >
              На сайт
            </Button>
          </nav>
          <form action={logout} className="ml-auto">
            <Button
              type="submit"
              variant="ghost"
              className="h-8 text-zinc-500 hover:bg-brand-50 hover:text-brand-700"
            >
              Выйти
            </Button>
          </form>
        </div>
      </div>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}