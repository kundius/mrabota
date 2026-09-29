"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { SETTING_KEYS } from "@/lib/settings";

const CONTACT_KEYS: Array<keyof typeof SETTING_KEYS> = [
  "phone",
  "contactEmail",
];

const SMTP_KEYS: Array<keyof typeof SETTING_KEYS> = [
  "smtpHost",
  "smtpPort",
  "smtpSecure",
  "smtpUser",
  "smtpPass",
  "smtpFrom",
];

const ANALYTICS_KEYS: Array<keyof typeof SETTING_KEYS> = ["ymCounter"];

async function upsertMany(
  keys: Array<keyof typeof SETTING_KEYS>,
  raw: FormData,
  skipEmptyFor: Array<keyof typeof SETTING_KEYS> = []
) {
  for (const key of keys) {
    const value = String(raw.get(SETTING_KEYS[key]) ?? "").trim();
    if (skipEmptyFor.includes(key) && value === "") continue;
    const settingKey = SETTING_KEYS[key];
    const existing = await db.setting.findUnique({ where: { key: settingKey } });
    if (existing) {
      await db.setting.update({ where: { key: settingKey }, data: { value } });
    } else {
      await db.setting.create({ data: { key: settingKey, value } });
    }
  }
}

export type SettingsState = { ok?: boolean; message?: string } | undefined;

export async function updateContacts(
  _prev: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  await requireAdmin();
  await upsertMany(CONTACT_KEYS, formData);
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function updateSmtp(
  _prev: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  await requireAdmin();
  await upsertMany(SMTP_KEYS, formData, ["smtpPass"]);
  return { ok: true };
}

export async function updateAnalytics(
  _prev: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  await requireAdmin();
  await upsertMany(ANALYTICS_KEYS, formData);
  revalidatePath("/", "layout");
  return { ok: true };
}