import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export function useOnline(): boolean | null {
  const [online, setOnline] = useState<boolean | null>(null);
  useEffect(() => NetInfo.addEventListener(state => {
    setOnline(state.isConnected === false || state.isInternetReachable === false
      ? false : state.isConnected === true ? true : null);
  }), []);
  return online;
}
