import type { Metadata } from "next";
import Link from "next/link";
import { RequestResetForm } from "./request-form";

export const metadata: Metadata = {
  title: "Восстановление пароля",
  robots: { index: false, follow: false },
};

export default function PasswordResetPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-lg font-bold tracking-tight text-zinc-900">
            Восстановление пароля
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Укажите логин — ссылка придёт на контактный email.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <RequestResetForm />
        </div>
        <p className="mt-4 text-center text-sm text-zinc-500">
          <Link href="/admin/login" className="text-brand-600 hover:underline">
            Назад ко входу
          </Link>
        </p>
      </div>
    </div>
  );
}