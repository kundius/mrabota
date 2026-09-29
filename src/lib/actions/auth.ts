"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  createSession,
  deleteSession,
  generateToken,
  getSession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import { sendResetEmail } from "@/lib/mail";
import { getSetting } from "@/lib/settings";

const LoginSchema = z.object({
  login: z.string().min(1, "Введите логин").trim(),
  password: z.string().min(1, "Введите пароль"),
});

export type LoginState =
  | { message?: string; errors?: Record<string, string[]> }
  | undefined;

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({
    login: formData.get("login"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { login: loginValue, password } = parsed.data;
  const user = await db.adminUser.findUnique({ where: { login: loginValue } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { message: "Неверный логин или пароль" };
  }

  await createSession(user.login);
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}

const RequestResetSchema = z.object({
  login: z.string().min(1, "Введите логин").trim(),
});

export type RequestResetState = { message?: string } | undefined;

export async function requestPasswordReset(
  _prevState: RequestResetState,
  formData: FormData
): Promise<RequestResetState> {
  const parsed = RequestResetSchema.safeParse({
    login: formData.get("login"),
  });
  if (!parsed.success) {
    return { message: "Введите логин" };
  }

  const user = await db.adminUser.findUnique({ where: { login: parsed.data.login } });
  const contactEmail = await getSetting("contactEmail");

  if (user && contactEmail) {
    const token = generateToken();
    await db.adminUser.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60),
      },
    });

    const origin = process.env.SITE_URL || "http://localhost:3000";
    await sendResetEmail({
      to: contactEmail,
      link: `${origin}/admin/password/reset/${token}`,
    });
  }

  return {
    message:
      "Если такой логин существует и SMTP настроен, ссылка для восстановления отправлена на контактный email.",
  };
}

const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Пароль должен быть не короче 8 символов"),
});

export type ResetPasswordState =
  | { message?: string; ok?: boolean }
  | undefined;

export async function resetPassword(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const parsed = ResetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { message: "Пароль должен быть не короче 8 символов" };
  }

  const now = new Date();
  const user = await db.adminUser.findFirst({
    where: {
      resetToken: parsed.data.token,
      resetTokenExpiresAt: { gt: now },
    },
  });
  if (!user) {
    return { message: "Ссылка недействительна или истекла" };
  }

  await db.adminUser.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(parsed.data.password),
      resetToken: null,
      resetTokenExpiresAt: null,
    },
  });

  return { ok: true, message: "Пароль обновлён. Теперь войдите с новым паролем." };
}

export async function currentAdminLogin(): Promise<string | null> {
  const session = await getSession();
  return session?.login ?? null;
}