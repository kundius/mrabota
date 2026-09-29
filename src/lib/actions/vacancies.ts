"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { toSlug } from "@/lib/slug";
import { SITE_CITY } from "@/lib/constants";

const VacancySchema = z.object({
  title: z.string().min(1, "Укажите название вакансии").trim(),
  shortDescription: z.string().min(1, "Добавьте краткое описание").trim(),
  description: z.string().min(1, "Заполните описание вакансии"),
  schedule: z.string().min(1, "Укажите график").trim(),
  address: z.string().min(1, "Укажите адрес").trim(),
  salary: z.string().min(1, "Укажите зарплату").trim(),
  imageUrl: z.string().trim().optional(),
  slug: z.string().trim().optional(),
});

export type VacancyFieldErrors = {
  title?: string[];
  shortDescription?: string[];
  description?: string[];
  schedule?: string[];
  address?: string[];
  salary?: string[];
  slug?: string[];
  form?: string;
};

export type VacancyActionResult =
  | { ok?: boolean; errors?: VacancyFieldErrors }
  | undefined;

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const slug = toSlug(base) || "vacancy";
  let candidate = slug;
  let i = 2;
  for (;;) {
    const existing = await db.vacancy.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${slug}-${i}`;
    i += 1;
  }
}

function parseVacancy(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  return VacancySchema.safeParse({
    title,
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    description: String(formData.get("description") ?? ""),
    schedule: String(formData.get("schedule") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    salary: String(formData.get("salary") ?? "").trim(),
    imageUrl: String(formData.get("imageUrl") ?? "").trim(),
    slug: rawSlug || undefined,
  });
}

export async function createVacancy(
  _prevState: VacancyActionResult,
  formData: FormData
): Promise<VacancyActionResult> {
  await requireAdmin();
  const parsed = parseVacancy(formData);
  if (!parsed.success) {
    return { errors: { ...parsed.error.flatten().fieldErrors } };
  }

  const data = parsed.data;
  const city = SITE_CITY;
  const slug = await uniqueSlug(data.slug || data.title);

  await db.vacancy.create({
    data: {
      title: data.title,
      slug,
      shortDescription: data.shortDescription,
      description: data.description,
      schedule: data.schedule,
      address: data.address,
      salary: data.salary,
      city,
      imageUrl: data.imageUrl || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  return { ok: true };
}

export async function updateVacancy(
  _prevState: VacancyActionResult,
  formData: FormData
): Promise<VacancyActionResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { errors: { form: "Не указан ID вакансии" } };

  const parsed = parseVacancy(formData);
  if (!parsed.success) {
    return { errors: { ...parsed.error.flatten().fieldErrors } };
  }

  const data = parsed.data;
  const existing = await db.vacancy.findUnique({ where: { id } });
  if (!existing) return { errors: { form: "Вакансия не найдена" } };

  const slug = await uniqueSlug(data.slug || data.title, id);

  await db.vacancy.update({
    where: { id },
    data: {
      title: data.title,
      slug,
      shortDescription: data.shortDescription,
      description: data.description,
      schedule: data.schedule,
      address: data.address,
      salary: data.salary,
      imageUrl: data.imageUrl || null,
      published: formData.get("published") === "on",
    },
  });

  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  revalidatePath(`/vacancy/${existing.slug}`);
  revalidatePath(`/vacancy/${slug}`);
  return { ok: true };
}

export async function deleteVacancy(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const vacancy = await db.vacancy.findUnique({ where: { id } });
  await db.vacancy.delete({ where: { id } });
  if (vacancy) revalidatePath(`/vacancy/${vacancy.slug}`);
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
}

export async function reorderVacancy(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const direction = String(formData.get("direction") ?? "") as "up" | "down";
  if (!id || (direction !== "up" && direction !== "down")) return;

  const current = await db.vacancy.findUnique({ where: { id } });
  if (!current) return;

  const sibling = await db.vacancy.findFirst({
    where: direction === "up" ? { order: { lt: current.order } } : { order: { gt: current.order } },
    orderBy: { order: direction === "up" ? "desc" : "asc" },
  });
  if (!sibling) return;

  await db.$transaction([
    db.vacancy.update({ where: { id: current.id }, data: { order: sibling.order } }),
    db.vacancy.update({ where: { id: sibling.id }, data: { order: current.order } }),
  ]);
  revalidatePath("/");
}

export async function togglePublish(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const vacancy = await db.vacancy.findUnique({ where: { id } });
  if (!vacancy) return;
  await db.vacancy.update({
    where: { id },
    data: { published: !vacancy.published },
  });
  revalidatePath("/");
  revalidatePath(`/vacancy/${vacancy.slug}`);
}

export type { VacancyActionResult as VacancyResult };