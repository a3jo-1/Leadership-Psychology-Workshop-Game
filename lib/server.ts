import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

export type Condition = "transparency" | "relationships" | "achievement";
const CONDITIONS: Condition[] = ["transparency", "relationships", "achievement"];

export function assignCondition(): Condition {
  return CONDITIONS[crypto.randomInt(0, CONDITIONS.length)];
}

export function signSession(payload: object) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", process.env.SESSION_SECRET!).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifySession(token: string) {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = crypto.createHmac("sha256", process.env.SESSION_SECRET!).update(body).digest();
  let actual: Buffer;
  try { actual = Buffer.from(sig, "base64url"); } catch { return null; }
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString());
    if (Date.now() - data.issuedAt > 4 * 60 * 60 * 1000) return null;
    return data as { participantId: string; condition: Condition; issuedAt: number; classCode: string };
  } catch { return null; }
}

export function teacherAuthorized(password: string | null) {
  const expected = process.env.TEACHER_PASSWORD || "";
  if (!expected || !password) return false;
  const supplied = Buffer.from(password);
  const wanted = Buffer.from(expected);
  return supplied.length === wanted.length && crypto.timingSafeEqual(supplied, wanted);
}
