export const APP_NAME = "Flowify";

export const SPOTIFY_SCOPES = [
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-read-playback-state",
  "user-modify-playback-state",
  "streaming",
  "user-read-recently-played",
  "user-library-read",
] as const;

/**
 * Uses the explicit public origin first. Vercel provides a deployment host as a
 * safe fallback, so a production deployment never builds an OAuth callback URL
 * pointing at localhost when NEXT_PUBLIC_APP_URL was accidentally omitted.
 */
export function appUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL;
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  const deploymentOrigin = vercelUrl
    ? (vercelUrl.startsWith("http://") || vercelUrl.startsWith("https://") ? vercelUrl : `https://${vercelUrl}`)
    : undefined;
  return (configuredUrl || deploymentOrigin || "http://localhost:3000").replace(/\/$/, "");
}

export function callbackUrl(): string {
  return `${appUrl()}/api/auth/spotify/callback`;
}

export function hasSpotifyServerConfiguration(): boolean {
  return Boolean(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET && process.env.SESSION_SECRET);
}
