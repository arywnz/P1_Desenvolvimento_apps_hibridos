import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from 'expo-audio';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CURRENT_TRACK, MOCK_PLAYLISTS, type Track } from '../constants/mockData';

interface PlayerContextType {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  positionSeconds: number;
  durationSeconds: number;
  isBuffering: boolean;
  hasPreview: boolean;
  audioError: string | null;
  isShuffle: boolean;
  isRepeat: boolean;
  playTrack: (track: Track, list?: Track[]) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  togglePlayPause: () => void;
  toggleLike: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  seekTo: (seconds: number) => void;
}

const DEFAULT_QUEUE: Track[] = MOCK_PLAYLISTS[0]?.tracks.length
  ? MOCK_PLAYLISTS[0].tracks
  : [CURRENT_TRACK];

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(CURRENT_TRACK);
  const [queue, setQueue] = useState<Track[]>(DEFAULT_QUEUE);
  const [fallbackIsPlaying, setFallbackIsPlaying] = useState<boolean>(false);
  const [fallbackPositionSeconds, setFallbackPositionSeconds] =
    useState<number>(0);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);

  const player = useAudioPlayer(null, { updateInterval: 250 });
  const status = useAudioPlayerStatus(player);

  const finishHandledRef = useRef<boolean>(false);
  const nextTrackRef = useRef<() => void>(() => {});

  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      interruptionMode: 'doNotMix',
    }).catch(() => {});
  }, []);

  const loadAndPlayTrack = useCallback(
    (track: Track) => {
      finishHandledRef.current = false;
      setCurrentTrack(track);
      setFallbackPositionSeconds(0);
      setFallbackIsPlaying(false);

      if (track.previewUrl) {
        player.replace(track.previewUrl);
        player.play();
      } else {
        player.pause();
        player.replace(null);
      }
    },
    [player]
  );

  const playTrack = useCallback(
    (track: Track, list?: Track[]) => {
      loadAndPlayTrack(track);
      if (list && list.length > 0) {
        setQueue(list);
      } else {
        setQueue((prev) =>
          prev.some((item) => item.id === track.id) ? prev : [track, ...prev]
        );
      }
    },
    [loadAndPlayTrack]
  );

  const nextTrack = useCallback(() => {
    if (!currentTrack || queue.length === 0) return;

    if (isRepeat) {
      finishHandledRef.current = false;
      if (currentTrack.previewUrl) {
        void player.seekTo(0).then(() => {
          player.play();
        });
      } else {
        setFallbackPositionSeconds(0);
        setFallbackIsPlaying(true);
      }
      return;
    }

    if (isShuffle && queue.length > 1) {
      const candidates = queue.filter((item) => item.id !== currentTrack.id);
      const randomTrack =
        candidates[Math.floor(Math.random() * candidates.length)] ?? queue[0];
      loadAndPlayTrack(randomTrack);
      return;
    }

    const currentIndex = queue.findIndex((item) => item.id === currentTrack.id);
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % queue.length : 0;
    loadAndPlayTrack(queue[nextIndex]);
  }, [currentTrack, isRepeat, isShuffle, loadAndPlayTrack, player, queue]);

  const hasPreview = Boolean(currentTrack?.previewUrl);
  const positionSeconds = hasPreview
    ? status.currentTime
    : fallbackPositionSeconds;
  const durationSeconds = hasPreview
    ? status.duration > 0
      ? status.duration
      : 30
    : currentTrack?.durationSeconds || 0;
  const isPlaying = hasPreview ? status.playing : fallbackIsPlaying;
  const isBuffering = hasPreview
    ? status.isBuffering || (status.playing && !status.isLoaded)
    : false;
  const audioError = hasPreview ? status.error : null;

  const previousTrack = useCallback(() => {
    if (!currentTrack || queue.length === 0) return;

    if (positionSeconds > 3) {
      if (currentTrack.previewUrl) {
        void player.seekTo(0);
      } else {
        setFallbackPositionSeconds(0);
      }
      return;
    }

    const currentIndex = queue.findIndex((item) => item.id === currentTrack.id);
    const prevIndex =
      currentIndex > 0 ? currentIndex - 1 : Math.max(queue.length - 1, 0);
    loadAndPlayTrack(queue[prevIndex]);
  }, [currentTrack, loadAndPlayTrack, player, positionSeconds, queue]);

  const addToQueue = useCallback((track: Track) => {
    setQueue((prev) =>
      prev.some((item) => item.id === track.id) ? prev : [...prev, track]
    );
  }, []);

  const removeFromQueue = useCallback((trackId: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== trackId));
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!currentTrack) return;

    if (currentTrack.previewUrl) {
      if (status.playing) {
        player.pause();
      } else if (
        status.didJustFinish ||
        (status.duration > 0 && status.currentTime >= status.duration)
      ) {
        finishHandledRef.current = false;
        void player.seekTo(0).then(() => {
          player.play();
        });
      } else {
        player.play();
      }
      return;
    }

    setFallbackIsPlaying((prev) => !prev);
  }, [
    currentTrack,
    player,
    status.currentTime,
    status.didJustFinish,
    status.duration,
    status.playing,
  ]);

  const toggleLike = useCallback(() => {
    setCurrentTrack((prev) =>
      prev ? { ...prev, liked: !prev.liked } : prev
    );
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setIsRepeat((prev) => !prev);
  }, []);

  const seekTo = useCallback(
    (seconds: number) => {
      if (!currentTrack) return;
      const clampedSeconds = Math.max(0, seconds);
      if (currentTrack.previewUrl) {
        void player.seekTo(clampedSeconds);
      } else {
        setFallbackPositionSeconds(clampedSeconds);
      }
    },
    [currentTrack, player]
  );

  useEffect(() => {
    nextTrackRef.current = nextTrack;
  }, [nextTrack]);

  useEffect(() => {
    const subscription = player.addListener(
      'playbackStatusUpdate',
      (nextStatus) => {
        if (nextStatus.didJustFinish) {
          if (!finishHandledRef.current) {
            finishHandledRef.current = true;
            nextTrackRef.current();
          }
        } else {
          finishHandledRef.current = false;
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [player]);

  const value = useMemo(
    () => ({
      currentTrack,
      queue,
      isPlaying,
      positionSeconds,
      durationSeconds,
      isBuffering,
      hasPreview,
      audioError,
      isShuffle,
      isRepeat,
      playTrack,
      nextTrack,
      previousTrack,
      addToQueue,
      removeFromQueue,
      togglePlayPause,
      toggleLike,
      toggleShuffle,
      toggleRepeat,
      seekTo,
    }),
    [
      currentTrack,
      queue,
      isPlaying,
      positionSeconds,
      durationSeconds,
      isBuffering,
      hasPreview,
      audioError,
      isShuffle,
      isRepeat,
      playTrack,
      nextTrack,
      previousTrack,
      addToQueue,
      removeFromQueue,
      togglePlayPause,
      toggleLike,
      toggleShuffle,
      toggleRepeat,
      seekTo,
    ]
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer deve ser usado dentro de um PlayerProvider');
  }
  return context;
}
