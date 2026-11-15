import { useCallback, useEffect, useRef, useState } from 'react';
import { comCache } from '../services/cache';

interface UseFetchOptions {
  enabled?: boolean;
  cacheKey?: string;
  ttlMs?: number;
}

export interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

/**
 * Hook padrão da Aula 9 para requisitar dados assíncronos com estados de loading, erro e recarga.
 */
export function useFetch<T>(
  fetcher: () => Promise<T>,
  options?: UseFetchOptions
): UseFetchResult<T> {
  const enabled = options?.enabled ?? true;
  const cacheKey = options?.cacheKey;
  const ttlMs = options?.ttlMs ?? 300_000;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const execute = useCallback(async (force = false) => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const result = cacheKey
        ? await comCache(cacheKey, fetcher, ttlMs, {
            force,
            onUpdate: fresh => {
              if (requestId === requestIdRef.current) setData(fresh);
            },
          })
        : await fetcher();
      if (requestId === requestIdRef.current) {
        setData(result);
      }
    } catch (err) {
      if (requestId === requestIdRef.current) {
        setError(
          err instanceof Error
            ? err.message
            : 'Não foi possível carregar os dados.'
        );
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [enabled, fetcher, cacheKey, ttlMs]);

  useEffect(() => {
    let active = true;
    const currentRef = requestIdRef;

    void Promise.resolve().then(() => {
      if (active) {
        return execute();
      }
      return undefined;
    });

    return () => {
      active = false;
      currentRef.current += 1;
    };
  }, [execute]);

  const reload = useCallback(() => execute(true), [execute]);
  return { data, loading, error, reload };
}
