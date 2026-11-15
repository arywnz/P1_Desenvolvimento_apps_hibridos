import type { ImageProps } from 'expo-image';

/**
 * Modelos principais do domínio Spotiflow e DTOs das APIs públicas (Deezer + DummyJSON).
 */

export interface Track {
  id: string;
  artistId?: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  durationSeconds: number;
  coverUrl: string;
  previewUrl?: string;
  liked: boolean;
}

export interface Playlist {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  coverUrl: string;
  coverSource?: ImageProps['source'];
  isMixed?: boolean;
  isPinned?: boolean;
  isDownloaded?: boolean;
  tracksCount: number;
  tracks: Track[];
  trackQueries?: string[];
}

export interface ArtistProfile {
  id: string;
  name: string;
  pictureUrl: string;
  fansCount?: number;
  albumsCount?: number;
  topTracks: Track[];
}

export interface ChartCatalog {
  tracks: Track[];
  playlists: Playlist[];
  artists: ArtistProfile[];
}

export interface PaginatedTracksResult {
  tracks: Track[];
  total: number;
  hasMore: boolean;
  nextIndex: number;
}

// --- DTOs da Deezer API ---

export interface DeezerArtistDto {
  id: number;
  name: string;
  picture?: string;
  picture_medium?: string;
  picture_big?: string;
  picture_xl?: string;
  nb_fan?: number;
  nb_album?: number;
}

export interface DeezerAlbumDto {
  id: number;
  title: string;
  cover?: string;
  cover_medium?: string;
  cover_big?: string;
  cover_xl?: string;
}

export interface DeezerTrackDto {
  id: number;
  title: string;
  duration: number;
  preview?: string;
  artist: DeezerArtistDto;
  album?: DeezerAlbumDto;
}

export interface DeezerPlaylistDto {
  id: number;
  title: string;
  description?: string;
  nb_tracks?: number;
  picture?: string;
  picture_medium?: string;
  picture_big?: string;
  picture_xl?: string;
  user?: {
    id: number;
    name: string;
  };
  tracks?: {
    data: DeezerTrackDto[];
  };
}

export interface DeezerChartResponseDto {
  tracks: {
    data: DeezerTrackDto[];
  };
  playlists: {
    data: DeezerPlaylistDto[];
  };
  artists: {
    data: DeezerArtistDto[];
  };
}

export interface DeezerSearchResponseDto<T> {
  data: T[];
  total: number;
  next?: string;
}

// --- DTOs da DummyJSON Auth API ---

export interface DummyAuthLoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface DummyAuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}
