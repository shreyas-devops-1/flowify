export interface SpotifyImage { url: string; height: number | null; width: number | null }
export interface SpotifyArtist { id: string; name: string; uri?: string; images?: SpotifyImage[] }
export interface SpotifyAlbum { id: string; name: string; images: SpotifyImage[] }
export interface SpotifyTrack { id: string; uri: string; name: string; duration_ms: number; explicit: boolean; artists: SpotifyArtist[]; album: SpotifyAlbum; is_playable?: boolean }
export interface SpotifyUser { id: string; display_name: string | null; images: SpotifyImage[]; product?: string }
export interface SpotifyPlaylist { id: string; name: string; description: string | null; images: SpotifyImage[]; owner: { display_name: string; id: string }; tracks: { total: number }; uri: string }
export interface SpotifyPlaylistDetail extends SpotifyPlaylist { tracks: { total: number; items: Array<{ track: SpotifyTrack | null }> } }
export interface SearchResults { tracks: { items: SpotifyTrack[] }; artists: { items: SpotifyArtist[] }; albums: { items: SpotifyAlbum[] }; playlists: { items: SpotifyPlaylist[] } }
