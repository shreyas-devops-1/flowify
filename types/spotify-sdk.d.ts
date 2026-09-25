declare namespace Spotify {
  type ErrorCallback = (data: { message: string }) => void;
  interface Player {
    connect(): Promise<boolean>; disconnect(): void; togglePlay(): Promise<void>;
    previousTrack(): Promise<void>; nextTrack(): Promise<void>; seek(position_ms: number): Promise<void>; setVolume(volume: number): Promise<void>;
    addListener(event: "ready", callback: (data: { device_id: string }) => void): boolean;
    addListener(event: "not_ready", callback: (data: { device_id: string }) => void): boolean;
    addListener(event: "player_state_changed", callback: (state: unknown) => void): boolean;
    addListener(event: "initialization_error" | "authentication_error" | "account_error" | "playback_error", callback: ErrorCallback): boolean;
  }
  const Player: { new(options: { name: string; getOAuthToken(callback: (token: string) => void): void }): Player };
}
declare global { interface Window { Spotify: typeof Spotify; onSpotifyWebPlaybackSDKReady?: () => void; } }
export {};
