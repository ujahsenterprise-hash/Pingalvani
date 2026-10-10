import { cookies } from "next/headers";
import crypto from "node:crypto";

const COOKIE_NAME = "poet_admin_session";

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "change-this-secret";
}

export function createAdminToken() {
  const timestamp = Date.now().toString();
  const signature = crypto.createHmac("sha256", secret()).update(timestamp).digest("hex");
  return `${timestamp}.${signature}`;
}

export function isValidAdminToken(token: string | undefined) {
  if (!token) return false;
  const [timestamp, signature] = token.split(".");
  if (!timestamp || !signature) return false;

  const age = Date.now() - Number(timestamp);
  if (!Number.isFinite(age) || age < 0 || age > 1000 * 60 * 60 * 12) return false;

  const expected = crypto.createHmac("sha256", secret()).update(timestamp).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function isAdmin() {
  const store = await cookies();
  return isValidAdminToken(store.get(COOKIE_NAME)?.value);
}

export const adminCookieName = COOKIE_NAME;
