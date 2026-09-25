# Flowify

Flowify is a responsive, personal Spotify web player built with Next.js. It uses the official Spotify Web API and the official Web Playback SDK—never audio scraping, downloads, DRM workarounds, or unofficial streaming endpoints.

## Features

- OAuth 2.0 Authorization Code flow with PKCE, state validation, encrypted HTTP-only session cookies, automatic server-side token refresh, and logout.
- Playlist dashboard, playlist track views, debounced cross-category search, and authenticated server route handlers.
- A persistent Web Playback SDK player with dynamic device ID, play/pause, previous/next, seek, volume, live state, SDK error messages, and Media Session controls.
- Dark, responsive interface with loading skeletons and useful empty/error states.

## Tech stack

Next.js, React, TypeScript (strict), Tailwind CSS, Spotify Web API/Web Playback SDK, and Vercel-compatible Route Handlers.

## Prerequisites

- Node.js 20.9 or newer and npm.
- A Spotify account; **Spotify Premium is required for Web Playback SDK streaming**.
- A Spotify Developer account and Spotify application.
- GitHub and Vercel accounts for deployment.

## Spotify developer setup

1. Create an app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Copy its Client ID and Client Secret.
3. Add `http://localhost:3000/api/auth/spotify/callback` to Redirect URIs for local development.
4. For this production deployment, add `https://flowify-theta.vercel.app/api/auth/spotify/callback` exactly (including HTTPS and path).
5. Copy `.env.example` to `.env.local`, fill every value, and keep it out of Git.

Flowify centralizes the minimal required scopes in `lib/config.ts`: private/collaborative playlist reading, playback state and control, streaming, recently played, and liked-song reading. Remove optional scopes there if those sections are not enabled.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Validate before shipping with:

```bash
npm run lint
npm run typecheck
npm run build
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `SPOTIFY_CLIENT_ID` | Spotify app client ID, used only by server authorization routes. |
| `SPOTIFY_CLIENT_SECRET` | Server-only confidential-client token exchange/refresh secret. |
| `NEXT_PUBLIC_APP_URL` | Public app origin, used to form the exact callback URL. On Vercel production set this to `https://flowify-theta.vercel.app`. |
| `SESSION_SECRET` | 32+ character random secret for AES-GCM encrypted session cookies. |

Never expose a client secret, access token, refresh token, or `SESSION_SECRET` in client code or Git.

## Deployment (GitHub → Vercel)

1. Commit and push: `git push origin work`.
2. Import the GitHub repository in Vercel.
3. Set all environment variables above for the **Production** environment, with `NEXT_PUBLIC_APP_URL=https://flowify-theta.vercel.app`.
4. Deploy, copy the Vercel URL, then add `${NEXT_PUBLIC_APP_URL}/api/auth/spotify/callback` in Spotify Dashboard.
5. Redeploy if configuration changed; test login, playlists, search, SDK connection, and controls.

## Troubleshooting and limitations

- **`/login?error=configuration`:** Vercel is missing one or more of `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, or `SESSION_SECRET`. Add them to the Production environment and redeploy.
- **Login fails after reaching Spotify:** ensure the redirect URI is an exact Dashboard match and `NEXT_PUBLIC_APP_URL` is the production origin.
- **Player account error:** Web Playback SDK requires Premium and a supported browser/device.
- **No sound/background playback:** browser, OS, device power-saving behavior, and Spotify policy determine whether background/locked-screen playback continues. Flowify does not bypass these restrictions. Media Session improves supported lock-screen/headset controls.
- **Playback unavailable/rate limited:** select Flowify as an active device after SDK connection, retry later, and check Spotify’s service/account state.
- **Autoplay blocked:** start playback from a user interaction.

## Manual testing checklist

- [ ] Login, declined/invalid callback, refresh, and logout.
- [ ] Profile, playlists, track list, empty/unavailable playlist, and search errors.
- [ ] Premium SDK connect, play, pause, previous, next, seek, volume, track change, and Media Session actions.
- [ ] Desktop, tablet, and mobile layouts plus expired session/network/API failure messages.
