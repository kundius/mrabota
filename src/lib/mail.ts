import nodemailer from "nodemailer";
import { isSmtpConfigured, getSettings } from "@/lib/settings";

export async function sendApplicationEmail(opts: {
  to: string;
  vacancyTitle?: string;
  name?: string;
  phone: string;
  city: string;
}) {
  const settings = await getSettings();
  if (!isSmtpConfigured(settings)) return { sent: false, reason: "smtp-not-configured" };

  const host = settings.smtpHost;
  const port = Number(settings.smtpPort || 465);
  const secure =
    settings.smtpSecure === "true" ||
    settings.smtpSecure === "on" ||
    port === 465;
  const user = settings.smtpUser;
  const pass = settings.smtpPass ?? "";
  const from = settings.smtpFrom || user || undefined;

  if (!host || !user) return { sent: false, reason: "smtp-not-configured" };

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  const subject = opts.vacancyTitle
    ? `Новая заявка: ${opts.vacancyTitle}`
    : "Новая заявка";

  const text = [
    subject,
    "",
    `Вакансия: ${opts.vacancyTitle ?? "—"}`,
    `Имя: ${opts.name ?? "—"}`,
    `Телефон: ${opts.phone}`,
    `Город: ${opts.city}`,
  ].join("\n");

  try {
    await transporter.sendMail({
      from,
      to: opts.to,
      subject,
      text,
    });
    return { sent: true, reason: null } as const;
  } catch (error) {
    console.error("SMTP send failed", error);
    return { sent: false, reason: "send-error" } as const;
  }
}

export async function sendResetEmail(opts: { to: string; link: string }) {
  const settings = await getSettings();
  if (!isSmtpConfigured(settings)) return { sent: false, reason: "smtp-not-configured" };

  const host = settings.smtpHost;
  const port = Number(settings.smtpPort || 465);
  const secure =
    settings.smtpSecure === "true" ||
    settings.smtpSecure === "on" ||
    port === 465;
  const user = settings.smtpUser;
  const pass = settings.smtpPass ?? "";
  const from = settings.smtpFrom || user || undefined;

  if (!host || !user) return { sent: false, reason: "smtp-not-configured" };

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from,
      to: opts.to,
      subject: "Восстановление пароля",
      text: `Для восстановления пароля пройдите по ссылке: ${opts.link}`,
    });
    return { sent: true, reason: null } as const;
  } catch (error) {
    console.error("SMTP reset failed", error);
    return { sent: false, reason: "send-error" } as const;
  }
}