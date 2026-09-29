"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const initialState: LoginState = undefined;

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <form action={action} className="space-y-4">
      {state?.message ? (
        <Alert variant="destructive" className="border-brand-200 bg-brand-50">
          <AlertDescription className="text-brand-800">
            {state.message}
          </AlertDescription>
        </Alert>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="login">Логин</Label>
        <Input
          id="login"
          name="login"
          autoComplete="username"
          required
          className="h-10"
        />
        {state?.errors?.login?.map((e) => (
          <p key={e} className="text-xs text-brand-700">
            {e}
          </p>
        ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Пароль</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="h-10"
        />
        {state?.errors?.password?.map((e) => (
          <p key={e} className="text-xs text-brand-700">
            {e}
          </p>
        ))}
      </div>
      <Button type="submit" disabled={pending} className="h-10 w-full">
        {pending ? "Входим…" : "Войти"}
      </Button>
    </form>
  );
}
