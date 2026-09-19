import React, { createContext, useContext, useState } from 'react';
import { Track, CURRENT_TRACK } from '../constants/mockData';

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  positionSeconds: number;
  playTrack: (track: Track) => void;
  togglePlayPause: () => void;
  toggleLike: () => void;
  seekTo: (seconds: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(CURRENT_TRACK);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [positionSeconds, setPositionSeconds] = useState<number>(2);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setPositionSeconds(0);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleLike = () => {
    if (!currentTrack) return;
    setCurrentTrack({
      ...currentTrack,
      liked: !currentTrack.liked,
    });
  };

  const seekTo = (seconds: number) => {
    setPositionSeconds(seconds);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        positionSeconds,
        playTrack,
        togglePlayPause,
        toggleLike,
        seekTo,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer deve ser usado dentro de um PlayerProvider');
  }
  return context;
}
