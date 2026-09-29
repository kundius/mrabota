"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const PageSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1, "Укажите заголовок страницы").trim(),
  content: z.string().min(1, "Заполните содержимое страницы"),
});

export type PageState =
  | { ok?: boolean; errors?: Record<string, string[]> }
  | undefined;

export async function updatePage(
  _prev: PageState,
  formData: FormData
): Promise<PageState> {
  await requireAdmin();
  const parsed = PageSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    content: formData.get("content"),
  });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }
  await db.sitePage.update({
    where: { slug: parsed.data.slug },
    data: { title: parsed.data.title, content: parsed.data.content },
  });
  revalidatePath(`/${parsed.data.slug}`);
  return { ok: true };
}