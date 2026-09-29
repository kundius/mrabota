import { SiteShell } from "@/components/site-shell";
import { getSetting } from "@/lib/settings";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const phone = await getSetting("phone");
  return <SiteShell phone={phone}>{children}</SiteShell>;
}