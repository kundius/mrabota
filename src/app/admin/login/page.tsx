import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Вход",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded bg-brand-600 text-white">
            <Briefcase size={20} aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight text-zinc-900">
            Вход в админку
          </span>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <LoginForm />
        </div>
        <p className="mt-4 text-center text-sm text-zinc-500">
          <Link
            href="/admin/password/reset"
            className="text-brand-600 hover:underline"
          >
            Забыли пароль?
          </Link>
        </p>
      </div>
    </div>
  );
}