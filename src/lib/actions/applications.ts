"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { sendApplicationEmail } from "@/lib/mail";
import { getSetting } from "@/lib/settings";
import { SITE_CITY } from "@/lib/constants";

const ApplicationSchema = z.object({
  name: z.string().trim().optional(),
  phone: z
    .string()
    .trim()
    .refine(
      (v) => /^\d{10,15}$/.test(v.replace(/\D/g, "")),
      "Введите корректный номер телефона"
    ),
  consent: z.literal("on", {
    message: "Необходимо согласие на обработку персональных данных",
  }),
});

export type ApplicationState =
  | { ok?: boolean; errors?: Record<string, string[]> }
  | undefined;

export async function submitApplication(
  _prevState: ApplicationState,
  formData: FormData
): Promise<ApplicationState> {
  const honeypot = formData.get("website");
  const vacancyId = String(formData.get("vacancyId") ?? "") || null;

  if (typeof honeypot === "string" && honeypot.length > 0) {
    return { ok: true };
  }

  const phone = String(formData.get("phone") ?? "");
  const parsed = ApplicationSchema.safeParse({
    name: String(formData.get("name") ?? "").trim(),
    phone,
    consent: formData.get("consent"),
  });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const name = parsed.data.name || null;
  const vacancy = vacancyId
    ? await db.vacancy.findUnique({ where: { id: vacancyId } })
    : null;

  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for") ?? "";
  const ip =
    forwarded.split(",")[0]?.trim() || headerList.get("x-real-ip") || null;

  await db.application.create({
    data: {
      vacancyId: vacancy?.id ?? null,
      name,
      phone,
      city: SITE_CITY,
      consent: true,
      ip,
    },
  });

  const contactEmail = await getSetting("contactEmail");
  if (contactEmail) {
    await sendApplicationEmail({
      to: contactEmail,
      vacancyTitle: vacancy?.title,
      name: name ?? undefined,
      phone,
      city: SITE_CITY,
    });
  }

  return { ok: true };
}