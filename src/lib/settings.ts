import { cache } from "react";
import { db } from "@/lib/db";

export const SETTING_KEYS = {
  phone: "phone",
  contactEmail: "contactEmail",
  smtpHost: "smtpHost",
  smtpPort: "smtpPort",
  smtpSecure: "smtpSecure",
  smtpUser: "smtpUser",
  smtpPass: "smtpPass",
  smtpFrom: "smtpFrom",
  ymCounter: "ymCounter",
} as const;

export type SettingsMap = Record<string, string | null>;

export const getSettings = cache(async (): Promise<SettingsMap> => {
  const rows = await db.setting.findMany();
  const map: SettingsMap = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map;
});

export async function getSetting(key: string): Promise<string | null> {
  const settings = await getSettings();
  return settings[key] ?? null;
}

export function isSmtpConfigured(settings: SettingsMap): boolean {
  return Boolean(settings.smtpHost && settings.smtpPort && settings.smtpUser);
}