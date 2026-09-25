import { getSession, setSession } from "@/lib/auth/session";

const API = "https://api.spotify.com/v1";

type TokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
};

async function refresh(refreshToken: string): Promise<TokenResponse> {
  const body = new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken });
  const credentials = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64");
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { Authorization: `Basic ${credentials}`, "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Your Spotify session has expired.");
  return response.json() as Promise<TokenResponse>;
}

export async function accessToken(): Promise<string | null> {
  const session = await getSession();
  if (!session) return null;
  if (session.expiresAt > Date.now() + 60_000) return session.accessToken;

  const next = await refresh(session.refreshToken);
  await setSession({
    accessToken: next.access_token,
    refreshToken: next.refresh_token ?? session.refreshToken,
    expiresAt: Date.now() + next.expires_in * 1000,
  });
  return next.access_token;
}

export async function spotifyFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await accessToken();
  if (!token) throw new Error("Unauthenticated");

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API}${path}`, { ...init, headers, cache: "no-store" });

  if (response.status === 204) return null as T;
  if (!response.ok) {
    if (response.status === 401) throw new Error("Your Spotify session has expired.");
    if (response.status === 429) throw new Error("Spotify is busy. Please try again shortly.");
    throw new Error("Spotify could not complete that request.");
  }
  return response.json() as Promise<T>;
}

export function safeId(id: string): boolean {
  return /^[A-Za-z0-9]{22}$/.test(id);
}
