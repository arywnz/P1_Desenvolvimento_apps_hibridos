import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CURRENT_TRACK, MOCK_PLAYLISTS, type Track } from '../constants/mockData';

interface PlayerContextType {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  positionSeconds: number;
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
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [positionSeconds, setPositionSeconds] = useState<number>(2);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);

  const playTrack = useCallback((track: Track, list?: Track[]) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setPositionSeconds(0);
    if (list && list.length > 0) {
      setQueue(list);
    } else {
      setQueue((prev) =>
        prev.some((item) => item.id === track.id) ? prev : [track, ...prev]
      );
    }
  }, []);

  const nextTrack = useCallback(() => {
    if (!currentTrack || queue.length === 0) return;

    if (isRepeat) {
      setPositionSeconds(0);
      setIsPlaying(true);
      return;
    }

    if (isShuffle && queue.length > 1) {
      const candidates = queue.filter((item) => item.id !== currentTrack.id);
      const randomTrack =
        candidates[Math.floor(Math.random() * candidates.length)] ?? queue[0];
      setCurrentTrack(randomTrack);
      setPositionSeconds(0);
      setIsPlaying(true);
      return;
    }

    const currentIndex = queue.findIndex((item) => item.id === currentTrack.id);
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % queue.length : 0;
    setCurrentTrack(queue[nextIndex]);
    setPositionSeconds(0);
    setIsPlaying(true);
  }, [currentTrack, isRepeat, isShuffle, queue]);

  const previousTrack = useCallback(() => {
    if (!currentTrack || queue.length === 0) return;

    if (positionSeconds > 3) {
      setPositionSeconds(0);
      return;
    }

    const currentIndex = queue.findIndex((item) => item.id === currentTrack.id);
    const prevIndex =
      currentIndex > 0 ? currentIndex - 1 : Math.max(queue.length - 1, 0);
    setCurrentTrack(queue[prevIndex]);
    setPositionSeconds(0);
    setIsPlaying(true);
  }, [currentTrack, positionSeconds, queue]);

  const addToQueue = useCallback((track: Track) => {
    setQueue((prev) =>
      prev.some((item) => item.id === track.id) ? prev : [...prev, track]
    );
  }, []);

  const removeFromQueue = useCallback((trackId: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== trackId));
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

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

  const seekTo = useCallback((seconds: number) => {
    setPositionSeconds(seconds);
  }, []);

  const value = useMemo(
    () => ({
      currentTrack,
      queue,
      isPlaying,
      positionSeconds,
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
