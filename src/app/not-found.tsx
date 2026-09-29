import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { getSetting } from "@/lib/settings";
import { Button } from "@/components/ui/button";

export default async function NotFound() {
  const phone = await getSetting("phone");

  return (
    <SiteShell phone={phone}>
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-7xl font-extrabold tracking-tight text-brand-600">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900">
          Страница не найдена
        </h1>
        <p className="mt-2 max-w-md text-zinc-500">
          Возможно, ссылка устарела или страница была удалена.
        </p>
        <Button
          render={<Link href="/" />}
          className="mt-6 h-12 px-6 text-base"
        >
          На главную
        </Button>
      </div>
    </SiteShell>
  );
}