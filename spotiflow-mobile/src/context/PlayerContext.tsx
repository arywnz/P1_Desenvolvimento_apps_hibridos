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
import { INITIAL_TRACK_QUERY } from '../constants/mockData';
import { api } from '../services/api';
import type { Track } from '../types/music';
import { useAuth } from './AuthContext';

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
  stopPlayback: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);

  const player = useAudioPlayer(null, { updateInterval: 250 });
  const status = useAudioPlayerStatus(player);

  const finishHandledRef = useRef<boolean>(false);
  const nextTrackRef = useRef<() => void>(() => {});
  const hasSelectedTrackRef = useRef<boolean>(false);
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const stopPlayback = useCallback(() => {
    hasSelectedTrackRef.current = false;
    finishHandledRef.current = false;
    try {
      player.pause();
      player.clearLockScreenControls();
      player.replace(null);
    } catch {
      // Ignora erro caso o player ainda não tenha fonte ativa
    }
    void Promise.resolve().then(() => {
      setCurrentTrack(null);
      setQueue([]);
    });
  }, [player]);

  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      interruptionMode: 'doNotMix',
    }).catch(() => {});
  }, []);

  // Carrega "Exagerado" + fila inicial real da Deezer (em pausa) com prévia de áudio garantida
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const preloadInitialQueue = async () => {
      try {
        const [initialMatch, chart] = await Promise.all([
          api.resolveTrackByQuery(INITIAL_TRACK_QUERY).catch(() => null),
          api.getChart(10).catch(() => null),
        ]);
        const playableChart = (chart?.tracks ?? []).filter((track) =>
          Boolean(track.previewUrl)
        );
        const initialQueue = initialMatch?.previewUrl
          ? [
              initialMatch,
              ...playableChart.filter((track) => track.id !== initialMatch.id),
            ]
          : playableChart;

        if (!cancelled && !hasSelectedTrackRef.current && initialQueue.length > 0) {
          setCurrentTrack(initialQueue[0]);
          setQueue(initialQueue);
          player.replace(initialQueue[0].previewUrl ?? null);
        }
      } catch {
        // Sem conexão no boot; o usuário ainda pode tocar assim que carregar qualquer lista
      }
    };

    if (!hasSelectedTrackRef.current) {
      void preloadInitialQueue();
    }

    return () => {
      cancelled = true;
    };
  }, [player, user]);

  const loadAndPlayTrack = useCallback(
    (track: Track) => {
      if (!userRef.current) return;
      hasSelectedTrackRef.current = true;
      finishHandledRef.current = false;
      setCurrentTrack(track);

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
      if (!userRef.current) return;
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
    if (!userRef.current || !currentTrack || queue.length === 0) return;

    if (isRepeat) {
      finishHandledRef.current = false;
      if (currentTrack.previewUrl) {
        void player.seekTo(0).then(() => {
          player.play();
        });
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
  const positionSeconds = hasPreview ? status.currentTime : 0;
  const durationSeconds = hasPreview
    ? status.duration > 0
      ? status.duration
      : 30
    : currentTrack?.durationSeconds || 0;
  const isPlaying = hasPreview ? status.playing : false;
  const isBuffering = hasPreview
    ? status.isBuffering || (status.playing && !status.isLoaded)
    : false;
  const audioError = hasPreview ? status.error : null;

  const previousTrack = useCallback(() => {
    if (!currentTrack || queue.length === 0) return;

    if (positionSeconds > 3 && currentTrack.previewUrl) {
      void player.seekTo(0);
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
    if (!userRef.current || !currentTrack?.previewUrl) return;

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
  }, [
    currentTrack,
    player,
    status.currentTime,
    status.didJustFinish,
    status.duration,
    status.playing,
  ]);

  const toggleLike = useCallback(() => {
    if (!currentTrack) return;
    const nextLiked = !currentTrack.liked;
    setCurrentTrack((prev) =>
      prev && prev.id === currentTrack.id ? { ...prev, liked: nextLiked } : prev
    );
    setQueue((queueItems) =>
      queueItems.map((item) =>
        item.id === currentTrack.id ? { ...item, liked: nextLiked } : item
      )
    );
  }, [currentTrack]);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setIsRepeat((prev) => !prev);
  }, []);

  const seekTo = useCallback(
    (seconds: number) => {
      if (!currentTrack?.previewUrl) return;
      const clampedSeconds = Math.max(0, seconds);
      void player.seekTo(clampedSeconds);
    },
    [currentTrack, player]
  );

  useEffect(() => {
    nextTrackRef.current = nextTrack;
  }, [nextTrack]);

  useEffect(() => {
    if (!user) {
      stopPlayback();
    }
  }, [stopPlayback, user]);

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
      stopPlayback,
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
      stopPlayback,
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
