"use client";

import Link from "next/link";
import { useActionState } from "react";
import { CircleCheck } from "lucide-react";
import { submitApplication } from "@/lib/actions/applications";
import { PhoneInput } from "@/components/phone-input";
import { SITE_CITY } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ApplicationForm({ vacancyId }: { vacancyId?: string }) {
  const [state, action, pending] = useActionState(submitApplication, undefined);
  const errors = state && "errors" in state ? state.errors : undefined;

  if (state?.ok) {
    return (
      <Alert className="border-emerald-200 bg-emerald-50 p-6 text-center">
        <CircleCheck
          size={40}
          strokeWidth={2}
          className="mx-auto mb-3 !size-10 !translate-y-0 text-emerald-600"
          aria-hidden="true"
        />
        <AlertTitle className="text-lg font-bold text-zinc-900">
          Спасибо!
        </AlertTitle>
        <AlertDescription className="text-zinc-600">
          Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="vacancyId" value={vacancyId ?? ""} />
      <input type="hidden" name="city" value={SITE_CITY} />

      {/* honeypot: скрытое поле для защиты от спама */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="website">Не заполняйте это поле</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Имя</Label>
        <Input id="name" name="name" autoComplete="name" className="h-10 bg-white" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Телефон *</Label>
        <PhoneInput />
        {errors?.phone ? (
          <p className="text-xs text-brand-700">{errors.phone[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="consent"
          className="items-start font-normal text-muted-foreground"
        >
          <Checkbox id="consent" name="consent" required className="mt-0.5 bg-white" />
          <span>
            Я соглашаюсь на{" "}
            <Link
              href="/consent"
              className="text-brand-600 underline underline-offset-2 hover:text-brand-700"
            >
              обработку персональных данных
            </Link>
          </span>
        </Label>
        {errors?.consent ? (
          <p className="text-xs text-brand-700">{errors.consent[0]}</p>
        ) : null}
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="h-11 w-full text-base"
      >
        {pending ? "Отправляем…" : "Оставить заявку"}
      </Button>
    </form>
  );
}
