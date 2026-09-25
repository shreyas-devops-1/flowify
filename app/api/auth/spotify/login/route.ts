import { createHash, randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { callbackUrl, hasSpotifyServerConfiguration, SPOTIFY_SCOPES } from "@/lib/config";

export async function GET() {
  if (!hasSpotifyServerConfiguration()) {
    return NextResponse.redirect(new URL("/login?error=configuration", callbackUrl()));
  }

  const verifier = randomBytes(64).toString("base64url");
  const state = randomBytes(24).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const authorizationUrl = new URL("https://accounts.spotify.com/authorize");
  authorizationUrl.search = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    response_type: "code",
    redirect_uri: callbackUrl(),
    state,
    code_challenge_method: "S256",
    code_challenge: challenge,
    scope: SPOTIFY_SCOPES.join(" "),
  }).toString();

  const response = NextResponse.redirect(authorizationUrl);
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/api/auth/spotify/callback",
    maxAge: 600,
  };
  response.cookies.set("flowify_oauth_state", state, cookieOptions);
  response.cookies.set("flowify_oauth_verifier", verifier, cookieOptions);
  return response;
}
