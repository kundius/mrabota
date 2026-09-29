"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import {
  updateContacts,
  updateSmtp,
  updateAnalytics,
  type SettingsState,
} from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function SaveBar({ state, pending }: { state: SettingsState; pending: boolean }) {
  return (
    <div className="mt-2 flex items-center gap-3 sm:col-span-2">
      <Button type="submit" disabled={pending} className="h-9 px-4">
        {pending ? "Сохраняем…" : "Сохранить"}
      </Button>
      {state?.ok ? (
        <span className="inline-flex items-center gap-1 text-sm text-emerald-700">
          <Check size={16} aria-hidden="true" />
          Сохранено
        </span>
      ) : null}
      {state?.message ? (
        <span className="text-sm text-brand-700">{state.message}</span>
      ) : null}
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-zinc-900">
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function SettingsForms({
  settings,
}: {
  settings: Record<string, string | null>;
}) {
  const [contactsState, contactsAction, contactsPending] = useActionState(
    updateContacts,
    undefined
  );
  const [smtpState, smtpAction, smtpPending] = useActionState(
    updateSmtp,
    undefined
  );
  const [analyticsState, analyticsAction, analyticsPending] = useActionState(
    updateAnalytics,
    undefined
  );

  return (
    <div className="space-y-6">
      <Section
        title="Контакты"
        description="Телефон в шапке сайта и email — на него приходят заявки и ссылки восстановления пароля."
      >
        <form action={contactsAction} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">Телефон</Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={settings.phone ?? ""}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Email (получатель заявок)</Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              defaultValue={settings.contactEmail ?? ""}
              className="h-10"
            />
          </div>
          <SaveBar state={contactsState} pending={contactsPending} />
        </form>
      </Section>

      <Section
        title="SMTP"
        description="Если заполнено — на контактный email отправляются письма с заявками. Если нет — заявки только сохраняются в БД."
      >
        <form action={smtpAction} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="smtpHost">Хост</Label>
            <Input
              id="smtpHost"
              name="smtpHost"
              defaultValue={settings.smtpHost ?? ""}
              className="h-10"
              placeholder="smtp.example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpPort">Порт</Label>
            <Input
              id="smtpPort"
              name="smtpPort"
              defaultValue={settings.smtpPort ?? "465"}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpUser">Логин</Label>
            <Input
              id="smtpUser"
              name="smtpUser"
              defaultValue={settings.smtpUser ?? ""}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpPass">Пароль</Label>
            <Input
              id="smtpPass"
              name="smtpPass"
              type="password"
              placeholder="Оставьте пустым, чтобы не менять"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpFrom">Отправитель (From)</Label>
            <Input
              id="smtpFrom"
              name="smtpFrom"
              defaultValue={settings.smtpFrom ?? ""}
              className="h-10"
              placeholder="noreply@example.com"
            />
          </div>
          <Label className="items-center self-end pb-2 font-normal text-zinc-700">
            <Checkbox
              name="smtpSecure"
              defaultChecked={
                settings.smtpSecure === "true" || settings.smtpSecure === "on"
              }
            />
            Использовать SSL/TLS
          </Label>
          <SaveBar state={smtpState} pending={smtpPending} />
        </form>
      </Section>

      <Section
        title="Яндекс.Метрика"
        description="Номер счётчика. Виртуальные просмотры при переходах регистрируются автоматически."
      >
        <form action={analyticsAction} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ymCounter">Номер счётчика</Label>
            <Input
              id="ymCounter"
              name="ymCounter"
              defaultValue={settings.ymCounter ?? ""}
              className="h-10"
              inputMode="numeric"
              placeholder="Например: 12345678"
            />
          </div>
          <SaveBar state={analyticsState} pending={analyticsPending} />
        </form>
      </Section>
    </div>
  );
}
