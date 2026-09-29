import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "@/lib/db";
import {
  SESSION_COOKIE,
  decryptSession,
  encryptSession,
} from "@/lib/session-token";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export { encryptSession, SESSION_COOKIE };

export async function createSession(login: string) {
  const token = await encryptSession({ login });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(Date.now() + SESSION_DURATION_MS),
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export const getSession = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = await decryptSession(token);
  if (!session?.login) return null;
  return session;
});

export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const user = await db.adminUser.findUnique({ where: { login: session.login } });
  if (!user) redirect("/admin/login");
  return user;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}