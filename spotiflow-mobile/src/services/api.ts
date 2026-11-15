import type {
  ArtistProfile,
  ChartCatalog,
  DeezerArtistDto,
  DeezerChartResponseDto,
  DeezerPlaylistDto,
  DeezerSearchResponseDto,
  DeezerTrackDto,
  DummyAuthLoginRequest,
  DummyAuthResponse,
  PaginatedTracksResult,
  Playlist,
  Track,
} from '../types/music';

const DEEZER_BASE =
  process.env.EXPO_PUBLIC_DEEZER_API_URL ?? 'https://api.deezer.com';
const AUTH_BASE =
  process.env.EXPO_PUBLIC_AUTH_API_URL ?? 'https://dummyjson.com';

const DEFAULT_TIMEOUT_MS = 10_000;

function formatDuration(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function mapDeezerTrack(dto: DeezerTrackDto): Track {
  const coverUrl =
    dto.album?.cover_big ||
    dto.album?.cover_medium ||
    dto.artist.picture_big ||
    dto.artist.picture_medium ||
    '';

  return {
    id: String(dto.id),
    artistId: String(dto.artist.id),
    title: dto.title,
    artist: dto.artist.name,
    album: dto.album?.title || 'Single',
    duration: formatDuration(dto.duration),
    durationSeconds: dto.duration,
    coverUrl,
    previewUrl: dto.preview,
    liked: false,
  };
}

export function mapDeezerPlaylist(dto: DeezerPlaylistDto): Playlist {
  const tracks = (dto.tracks?.data ?? []).map(mapDeezerTrack);
  const coverUrl =
    dto.picture_big || dto.picture_xl || dto.picture_medium || dto.picture || '';

  return {
    id: String(dto.id),
    title: dto.title,
    subtitle:
      dto.description?.trim() ||
      `Playlist de ${dto.user?.name || 'Deezer Editorial'}`,
    author: dto.user?.name || 'Deezer Editorial',
    coverUrl,
    tracksCount: dto.nb_tracks ?? tracks.length,
    tracks,
  };
}

export function mapDeezerArtist(
  dto: DeezerArtistDto,
  topTracks: Track[] = []
): ArtistProfile {
  return {
    id: String(dto.id),
    name: dto.name,
    pictureUrl:
      dto.picture_big || dto.picture_xl || dto.picture_medium || dto.picture || '',
    fansCount: dto.nb_fan,
    albumsCount: dto.nb_album,
    topTracks,
  };
}

async function requestJson<T>(
  baseUrl: string,
  path: string,
  init?: RequestInit & { timeoutMs?: number }
): Promise<T> {
  const controller = new AbortController();
  const timeoutMs = init?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        // Aula 11: adicionar Authorization: `Bearer ${token}` aqui quando houver JWT.
        ...(init?.headers ?? {}),
      },
      ...init,
      signal: controller.signal,
    });

    const data = (await response.json().catch(() => null)) as
      | (T & { message?: string; error?: { message?: string; code?: number } })
      | null;

    if (response.status === 404) {
      throw new Error('Conteúdo não encontrado (404).');
    }

    if (!response.ok) {
      const serverMessage =
        data?.message || data?.error?.message || `Erro HTTP ${response.status}`;
      throw new Error(serverMessage);
    }

    if (data && typeof data === 'object' && 'error' in data && data.error) {
      throw new Error(data.error.message || 'Erro retornado pela API.');
    }

    if (!data) {
      throw new Error('Resposta vazia do servidor.');
    }

    return data as T;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Tempo limite da requisição esgotado. Verifique sua rede.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const api = {
  async getChart(limit = 12): Promise<ChartCatalog> {
    const params = new URLSearchParams({ limit: String(limit) });
    const dto = await requestJson<DeezerChartResponseDto>(
      DEEZER_BASE,
      `/chart/0?${params.toString()}`
    );

    return {
      tracks: (dto.tracks?.data ?? []).map(mapDeezerTrack),
      playlists: (dto.playlists?.data ?? []).map(mapDeezerPlaylist),
      artists: (dto.artists?.data ?? []).map((artist) =>
        mapDeezerArtist(artist)
      ),
    };
  },

  async getPlaylist(id: string): Promise<Playlist> {
    const dto = await requestJson<DeezerPlaylistDto>(
      DEEZER_BASE,
      `/playlist/${encodeURIComponent(id)}`
    );
    return mapDeezerPlaylist(dto);
  },

  async getArtist(id: string): Promise<ArtistProfile> {
    const encodedId = encodeURIComponent(id);
    const [artistDto, topDto] = await Promise.all([
      requestJson<DeezerArtistDto>(DEEZER_BASE, `/artist/${encodedId}`),
      requestJson<DeezerSearchResponseDto<DeezerTrackDto>>(
        DEEZER_BASE,
        `/artist/${encodedId}/top?limit=15`
      ),
    ]);

    return mapDeezerArtist(
      artistDto,
      (topDto.data ?? []).map(mapDeezerTrack)
    );
  },

  async searchTracks(
    query: string,
    index = 0,
    limit = 20
  ): Promise<PaginatedTracksResult> {
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      return { tracks: [], total: 0, hasMore: false, nextIndex: 0 };
    }

    const params = new URLSearchParams({
      q: cleanQuery,
      index: String(index),
      limit: String(limit),
    });

    const dto = await requestJson<DeezerSearchResponseDto<DeezerTrackDto>>(
      DEEZER_BASE,
      `/search/track?${params.toString()}`
    );

    const tracks = (dto.data ?? []).map(mapDeezerTrack);
    const nextIndex = index + tracks.length;

    return {
      tracks,
      total: dto.total ?? tracks.length,
      hasMore: Boolean(dto.next) && nextIndex < (dto.total ?? 0),
      nextIndex,
    };
  },

  async login(payload: DummyAuthLoginRequest): Promise<DummyAuthResponse> {
    return requestJson<DummyAuthResponse>(AUTH_BASE, '/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: payload.username,
        password: payload.password,
        expiresInMins: payload.expiresInMins ?? 60,
      }),
    });
  },
};
