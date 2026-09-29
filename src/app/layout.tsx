import type { Metadata } from "next";
import { Analytics } from "@/components/analytics";
import { getSetting } from "@/lib/settings";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: {
    default: "Работа в Ногинске — вакансии",
    template: "%s — Работа в Ногинске",
  },
  description:
    "Актуальные вакансии компании в Ногинске. Работа рядом с домом: график, зарплата, официальное оформление.",
};

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  const ymCounter = (await getSetting("ymCounter")) ?? "";

  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full bg-white">
        {children}
        <Analytics counter={ymCounter} />
      </body>
    </html>
  );
}