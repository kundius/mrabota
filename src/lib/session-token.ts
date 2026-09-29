import { SignJWT, jwtVerify } from "jose";

const SESSION_SECRET = process.env.SESSION_SECRET || "dev-secret-change-me";
const encodedSecret = new TextEncoder().encode(SESSION_SECRET);

export const SESSION_COOKIE = "mrabota_session";

export async function encryptSession(payload: { login: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedSecret);
}

export async function decryptSession(
  token: string | undefined = ""
): Promise<{ login: string } | null> {
  try {
    const { payload } = await jwtVerify(token, encodedSecret, {
      algorithms: ["HS256"],
    });
    return { login: String(payload.login ?? "") };
  } catch {
    return null;
  }
}