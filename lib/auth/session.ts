import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
const COOKIE = "flowify_session";
type Session = { accessToken: string; refreshToken: string; expiresAt: number };
function key() { const secret = process.env.SESSION_SECRET; if (!secret || secret.length < 32) throw new Error("Server session configuration is incomplete."); return createHash("sha256").update(secret).digest(); }
function encrypt(value: Session) { const iv = randomBytes(12); const cipher = createCipheriv("aes-256-gcm", key(), iv); const encrypted = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]); return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url"); }
function decrypt(value: string): Session | null { try { const data=Buffer.from(value,"base64url"), decipher=createDecipheriv("aes-256-gcm",key(),data.subarray(0,12)); decipher.setAuthTag(data.subarray(12,28)); return JSON.parse(Buffer.concat([decipher.update(data.subarray(28)),decipher.final()]).toString("utf8")) as Session; } catch { return null; } }
export async function getSession() { const value=(await cookies()).get(COOKIE)?.value; return value ? decrypt(value) : null; }
export async function setSession(session: Session) { (await cookies()).set(COOKIE, encrypt(session), { httpOnly:true, secure:process.env.NODE_ENV === "production", sameSite:"lax", path:"/", maxAge: 60 * 60 * 24 * 30 }); }
export async function clearSession() { (await cookies()).set(COOKIE,"",{httpOnly:true,path:"/",maxAge:0}); }
