import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/cn";

export function SiteShell({
  phone,
  children,
}: {
  phone: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader phone={phone} />
      <main className={cn("flex-1")}>{children}</main>
      <SiteFooter />
    </div>
  );
}