import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const memory = new Map<string, string>();
const options = { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY };

export async function salvar(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') { memory.set(key, value); return; }
  await SecureStore.setItemAsync(key, value, options);
}

export async function ler(key: string): Promise<string | null> {
  if (Platform.OS === 'web') return memory.get(key) ?? null;
  return SecureStore.getItemAsync(key, options);
}

export async function apagar(key: string): Promise<void> {
  if (Platform.OS === 'web') { memory.delete(key); return; }
  await SecureStore.deleteItemAsync(key, options);
}
