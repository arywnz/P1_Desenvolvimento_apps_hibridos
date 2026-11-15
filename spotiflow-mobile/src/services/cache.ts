import { storage } from './storage';

interface Entry<T> { data: T; savedAt: number }
interface Options<T> { force?: boolean; onUpdate?: (data: T) => void }
const requests = new Map<string, Promise<unknown>>();

export async function comCache<T>(
  key: string, fetcher: () => Promise<T>, ttlMs: number, options: Options<T> = {},
): Promise<T> {
  if (!Number.isFinite(ttlMs) || ttlMs < 0) throw new Error('TTL invalido');
  const storageKey = 'cache:' + key;
  const entry = await storage.get<Entry<T>>(storageKey);
  const valid = entry && typeof entry.savedAt === 'number' && 'data' in entry;
  const refresh = () => {
    let request = requests.get(key) as Promise<T> | undefined;
    if (!request) {
      request = (async () => {
        const data = await fetcher();
        await storage.set(storageKey, { data, savedAt: Date.now() }).catch(() => {});
        return data;
      })().finally(() => { requests.delete(key); });
      requests.set(key, request);
    }
    return request;
  };
  if (valid) {
    if (options.force || Date.now() - entry.savedAt >= ttlMs) {
      void refresh().then(data => options.onUpdate?.(data)).catch(() => {});
    }
    return entry.data;
  }
  return refresh();
}
