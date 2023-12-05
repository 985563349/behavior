import { useCallback, useEffect, useRef, useState } from 'react';
import type { SetStateAction } from 'react';
import * as idb from 'idb-keyval';
import { isFunction } from 'lodash';

export type UseIndexedDBReturn<T> = {
  data: T;
  isReady: boolean;
  error: Error | null;
  update: (action: SetStateAction<T>) => Promise<void>;
  remove: () => Promise<void>;
};

export function useIndexedDB<T>(key: string): UseIndexedDBReturn<T | undefined>;
export function useIndexedDB<T>(key: string, initialData: T): UseIndexedDBReturn<T>;
export function useIndexedDB<T>(key: string, initialData?: T): UseIndexedDBReturn<T | undefined> {
  if (!key) {
    throw new Error('useIndexedDB key may not be falsy.');
  }

  const [data, setData] = useState<T | undefined>(initialData);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const initializer = useRef(async (key: string) => {
    try {
      const indexedDBValue = await idb.get(key);

      if (indexedDBValue) {
        setData(indexedDBValue);
      } else if (initialData) {
        await idb.set(key, initialData);
      }

      setIsReady(true);
    } catch (error) {
      setError(error as Error);
    }
  });

  useEffect(() => {
    initializer.current(key);
  }, [key]);

  const update = useCallback(
    (action: SetStateAction<T | undefined>) => {
      let nextData: T | undefined;

      setData((prevData) => {
        nextData = isFunction(action) ? action(prevData) : action;
        return nextData;
      });

      return idb.set(key, nextData);
    },
    [key]
  );

  const remove = useCallback(() => {
    setData(undefined);
    return idb.del(key);
  }, [key]);

  return { data, isReady, error, update, remove };
}
