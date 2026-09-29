"use client";

import { useActionState } from "react";
import {
  requestPasswordReset,
  type RequestResetState,
} from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const initialState: RequestResetState = undefined;

export function RequestResetForm() {
  const [state, action, pending] = useActionState(
    requestPasswordReset,
    initialState
  );

  return (
    <form action={action} className="space-y-4">
      {state?.message ? (
        <Alert className="bg-zinc-50">
          <AlertDescription className="text-zinc-700">
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
      </div>
      <Button type="submit" disabled={pending} className="h-10 w-full">
        {pending ? "Отправляем…" : "Отправить ссылку"}
      </Button>
    </form>
  );
}
