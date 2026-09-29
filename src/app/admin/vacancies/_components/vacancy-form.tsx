"use client";

import { useState } from "react";
import { useActionState } from "react";
import Image from "next/image";
import { RotateCcw, Check } from "lucide-react";
import { RichEditor } from "@/components/rich-editor";
import { toSlug } from "@/lib/slug";
import { cn } from "@/lib/cn";
import { createVacancy, updateVacancy } from "@/lib/actions/vacancies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

export type VacancyFormValues = {
  id?: string;
  slug?: string;
  title?: string;
  shortDescription?: string;
  description?: string;
  schedule?: string;
  address?: string;
  salary?: string;
  imageUrl?: string | null;
  published?: boolean;
};

export function VacancyForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: VacancyFormValues;
}) {
  const action = mode === "create" ? createVacancy : updateVacancy;
  const [state, formAction, pending] = useActionState(action, undefined);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [uploading, setUploading] = useState(false);

  const errors = state && "errors" in state ? state.errors : undefined;

  function handleTitle(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setTitle(value);
    if (!slugTouched) setSlug(toSlug(value));
  }

  async function uploadImage(file: File | null) {
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/admin/api/upload", { method: "POST", body: form });
      const data = (await res.json()) as { url?: string; error?: string };
      if (res.ok && data.url) setImageUrl(data.url);
      else alert(data.error || "Не удалось загрузить картинку");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={formAction} className="space-y-5">
      {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}
      <input type="hidden" name="description" value={description} />
      <input type="hidden" name="imageUrl" value={imageUrl} />

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Название вакансии *</Label>
            <Input
              id="title"
              name="title"
              required
              value={title}
              onChange={handleTitle}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortDescription">
              Краткое описание * (показывается в карточке на главной)
            </Label>
            <Textarea
              id="shortDescription"
              name="shortDescription"
              required
              rows={3}
              defaultValue={initial?.shortDescription ?? ""}
              className="resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <div className="flex gap-2">
              <Input
                id="slug"
                name="slug"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugTouched(true);
                }}
                className="h-10"
                placeholder="avtomoika"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setSlug(toSlug(title))}
                title="Сгенерировать из названия"
                className="size-10 shrink-0 text-zinc-600"
              >
                <RotateCcw size={16} aria-hidden="true" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Заполняется автоматически. URL вакансии будет /vacancy/…
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="schedule">График *</Label>
              <Input
                id="schedule"
                name="schedule"
                required
                defaultValue={initial?.schedule ?? ""}
                className="h-10"
                placeholder="5/2, с 9:00 до 18:00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Зарплата *</Label>
              <Input
                id="salary"
                name="salary"
                required
                defaultValue={initial?.salary ?? ""}
                className="h-10"
                placeholder="от 50 000 ₽"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Адрес *</Label>
            <Input
              id="address"
              name="address"
              required
              defaultValue={initial?.address ?? ""}
              className="h-10"
              placeholder="г. Ногинск, ул. …"
            />
            <p className="text-xs text-muted-foreground">
              Город всегда «Ногинск».
            </p>
          </div>
          <div className="space-y-2">
            <Label>Превью-картинка</Label>
            <div className="overflow-hidden rounded-md border border-zinc-200 bg-zinc-50">
              {imageUrl ? (
                <div className="relative aspect-video w-full">
                  <Image src={imageUrl} alt="Превью" fill className="object-cover" unoptimized />
                </div>
              ) : (
                <div className="flex aspect-video w-full items-center justify-center text-sm text-zinc-400">
                  16:9 — превью не задано
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="h-10"
                placeholder="https://…/image.jpg или /uploads/…"
              />
              <Button
                type="button"
                variant="outline"
                render={<label className="cursor-pointer" />}
                className={cn("h-10 shrink-0", uploading && "opacity-60")}
              >
                {uploading ? "Загружаю…" : "Загрузить"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => uploadImage(e.target.files?.[0] ?? null)}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Полное описание * (обязанности, требования, условия)</Label>
        <RichEditor initialContent={initial?.description} onChange={setDescription} />
      </div>

      {mode === "edit" ? (
        <Label className="font-normal text-zinc-700">
          <Checkbox
            name="published"
            defaultChecked={initial?.published ?? true}
          />
          Вакансия опубликована (видна на сайте)
        </Label>
      ) : null}

      {errors?.form ? (
        <Alert className="border-brand-200 bg-brand-50">
          <AlertDescription className="text-brand-800">
            {errors.form}
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending} className="h-10 px-5">
          {pending
            ? "Сохраняем…"
            : mode === "create"
              ? "Создать вакансию"
              : "Сохранить изменения"}
        </Button>
        {state && "ok" in state && state.ok ? (
          <span className="inline-flex items-center gap-1 text-sm text-emerald-700">
            <Check size={16} aria-hidden="true" />
            Сохранено
          </span>
        ) : null}
      </div>
    </form>
  );
}
