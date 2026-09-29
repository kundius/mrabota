"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resetPassword } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ResetForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(resetPassword, undefined);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      {state?.message ? (
        <Alert
          className={
            state.ok
              ? "border-emerald-200 bg-emerald-50"
              : "border-brand-200 bg-brand-50"
          }
        >
          <AlertDescription
            className={state.ok ? "text-emerald-800" : "text-brand-800"}
          >
            {state.message}
          </AlertDescription>
        </Alert>
      ) : null}
      {state?.ok ? (
        <Button render={<Link href="/admin/login" />} className="h-10 w-full">
          Войти
        </Button>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="password">Новый пароль</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="h-10"
            />
            <p className="text-xs text-muted-foreground">
              Не короче 8 символов
            </p>
          </div>
          <Button type="submit" disabled={pending} className="h-10 w-full">
            {pending ? "Сохраняем…" : "Сохранить пароль"}
          </Button>
        </>
      )}
    </form>
  );
}
