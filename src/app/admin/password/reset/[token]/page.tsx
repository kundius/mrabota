import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ResetForm } from "./reset-form";

export const metadata: Metadata = {
  title: "Новый пароль",
  robots: { index: false, follow: false },
};

async function isValidToken(token: string): Promise<boolean> {
  const user = await db.adminUser.findFirst({
    where: { resetToken: token, resetTokenExpiresAt: { gt: new Date() } },
  });
  return Boolean(user);
}

export default async function PasswordResetTokenPage(props: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await props.params;
  if (!(await isValidToken(token))) {
    notFound();
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-lg font-bold tracking-tight text-zinc-900">
            Новый пароль
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Придумайте новый пароль для входа.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <ResetForm token={token} />
        </div>
      </div>
    </div>
  );
}