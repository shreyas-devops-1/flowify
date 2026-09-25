export const APP_NAME = "Flowify";
export const SPOTIFY_SCOPES = ["playlist-read-private", "playlist-read-collaborative", "user-read-playback-state", "user-modify-playback-state", "streaming", "user-read-recently-played", "user-library-read"] as const;
export const appUrl = () => (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
export const callbackUrl = () => `${appUrl()}/api/auth/spotify/callback`;
