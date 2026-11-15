import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  CURATED_PLAYLISTS,
  DEFAULT_PLAYLIST_COVER_SOURCE,
  DEFAULT_PLAYLIST_COVER_URL,
  FRIENDS_ACTIVITY,
  type Playlist,
} from '../constants/mockData';

interface CreatePlaylistInput {
  title: string;
  subtitle?: string;
  authorName: string;
  isPinned?: boolean;
}

interface LibraryContextValue {
  playlists: Playlist[];
  allPlaylists: Playlist[];
  savedIds: string[];
  followedArtists: string[];
  createPlaylist: (input: CreatePlaylistInput) => Playlist;
  toggleSavePlaylist: (playlistId: string) => void;
  toggleFollowArtist: (artistKey: string) => void;
}

const LibraryContext = createContext<LibraryContextValue>(
  {} as LibraryContextValue
);

const FRIEND_PLAYLISTS = FRIENDS_ACTIVITY.flatMap((f) => f.playlists);

export function LibraryProvider({ children }: { children: ReactNode }) {
  // Aula 10: playlists criadas e salvamentos podem ser persistidos em SQLite/AsyncStorage.
  const [playlists, setPlaylists] = useState<Playlist[]>(CURATED_PLAYLISTS);
  const [savedIds, setSavedIds] = useState<string[]>([
    'liked-songs',
    'echos-of-us',
    'my-peace',
  ]);
  const [followedArtists, setFollowedArtists] = useState<string[]>([]);

  const allPlaylists = useMemo(
    () => [...playlists, ...FRIEND_PLAYLISTS],
    [playlists]
  );

  const createPlaylist = useCallback(
    ({ title, subtitle, authorName, isPinned = false }: CreatePlaylistInput) => {
      const cleanTitle = title.trim();
      const cleanSubtitle = subtitle?.trim() || 'Playlist criada por você';
      const newPlaylist: Playlist = {
        id: `custom-${Date.now()}`,
        title: cleanTitle,
        subtitle: cleanSubtitle,
        author: authorName,
        coverUrl: DEFAULT_PLAYLIST_COVER_URL,
        coverSource: DEFAULT_PLAYLIST_COVER_SOURCE,
        tracksCount: 0,
        isPinned,
        isDownloaded: false,
        tracks: [],
      };

      setPlaylists((prev) => [newPlaylist, ...prev]);
      setSavedIds((prev) => [newPlaylist.id, ...prev]);
      return newPlaylist;
    },
    []
  );

  const toggleSavePlaylist = useCallback((playlistId: string) => {
    setSavedIds((prev) =>
      prev.includes(playlistId)
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId]
    );
  }, []);

  const toggleFollowArtist = useCallback((artistKey: string) => {
    setFollowedArtists((prev) =>
      prev.includes(artistKey)
        ? prev.filter((key) => key !== artistKey)
        : [...prev, artistKey]
    );
  }, []);

  const value = useMemo(
    () => ({
      playlists,
      allPlaylists,
      savedIds,
      followedArtists,
      createPlaylist,
      toggleSavePlaylist,
      toggleFollowArtist,
    }),
    [
      playlists,
      allPlaylists,
      savedIds,
      followedArtists,
      createPlaylist,
      toggleSavePlaylist,
      toggleFollowArtist,
    ]
  );

  return (
    <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
  );
}

export function useLibrary() {
  return useContext(LibraryContext);
}
