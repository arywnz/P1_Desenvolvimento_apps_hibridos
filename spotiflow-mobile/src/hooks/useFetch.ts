import { useCallback, useEffect, useRef, useState } from 'react';

interface UseFetchOptions {
  enabled?: boolean;
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
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const execute = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
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
  }, [enabled, fetcher]);

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

  return { data, loading, error, reload: execute };
}
