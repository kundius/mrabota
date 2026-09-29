"use client";

import { useState } from "react";
import { useActionState } from "react";
import { Check } from "lucide-react";
import { RichEditor } from "@/components/rich-editor";
import { updatePage } from "@/lib/actions/pages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function PageForm({
  slug,
  title,
  content,
}: {
  slug: string;
  title: string;
  content: string;
}) {
  const [state, action, pending] = useActionState(updatePage, undefined);
  const [html, setHtml] = useState(content);
  const errors = state && "errors" in state ? state.errors : undefined;

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="content" value={html} />

      <div className="space-y-2">
        <Label htmlFor="title">Заголовок страницы</Label>
        <Input id="title" name="title" defaultValue={title} className="h-10" />
      </div>

      <div className="space-y-2">
        <Label>Содержимое</Label>
        <RichEditor initialContent={content} onChange={setHtml} />
      </div>

      {errors?.content ? (
        <Alert className="border-brand-200 bg-brand-50">
          <AlertDescription className="text-brand-800">
            {errors.content[0]}
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending} className="h-10 px-4">
          {pending ? "Сохраняем…" : "Сохранить"}
        </Button>
        {state?.ok ? (
          <span className="inline-flex items-center gap-1 text-sm text-emerald-700">
            <Check size={16} aria-hidden="true" />
            Сохранено
          </span>
        ) : null}
      </div>
    </form>
  );
}
