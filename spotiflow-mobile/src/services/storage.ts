import AsyncStorage from '@react-native-async-storage/async-storage';

export async function get<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw === null ? null : JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function set<T>(key: string, value: T): Promise<void> {
  try {
    const raw = JSON.stringify(value);
    if (raw === undefined) throw new Error('Valor nao serializavel');
    await AsyncStorage.setItem(key, raw);
  } catch {
    throw new Error('Nao foi possivel salvar os dados locais.');
  }
}

export async function remove(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    throw new Error('Nao foi possivel remover os dados locais.');
  }
}

export const storage = { get, set, remove };
