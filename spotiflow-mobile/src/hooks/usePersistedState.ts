import { useCallback, useEffect, useRef, useState, type SetStateAction } from 'react';
import { storage } from '../services/storage';

export function usePersistedState<T>(key: string, initial: T) {
  const [value, setValue] = useState(initial);
  const [ready, setReady] = useState(false);
  const current = useRef(initial);
  const revision = useRef(0);
  const writes = useRef(Promise.resolve());

  useEffect(() => {
    let active = true;
    const version = revision.current;
    void storage.get<T>(key).then(saved => {
      if (!active) return;
      if (saved !== null && revision.current === version) {
        current.current = saved;
        setValue(saved);
      }
      setReady(true);
    });
    return () => { active = false; };
  }, [key]);

  const update = useCallback((action: SetStateAction<T>) => {
    const next = typeof action === 'function'
      ? (action as (previous: T) => T)(current.current) : action;
    revision.current += 1;
    current.current = next;
    setValue(next);
    writes.current = writes.current
      .then(() => storage.set(key, next))
      .catch(() => { console.warn('Nao foi possivel persistir a preferencia.'); });
  }, [key]);

  return [value, update, ready] as const;
}
