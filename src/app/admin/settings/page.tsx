import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { requireAdmin } from "@/lib/auth";
import { SettingsForms } from "./settings-forms";

export const metadata: Metadata = {
  title: "Настройки",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getSettings();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900">
        Настройки
      </h1>
      <SettingsForms settings={settings} />
    </div>
  );
}