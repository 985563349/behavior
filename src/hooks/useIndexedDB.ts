import { useLayoutEffect, useRef, useState } from 'react';
import type { SetStateAction } from 'react';
import * as idb from 'idb-keyval';

export function useIndexedDB<T>(
  key: string,
  initialValue: T
): [T, (action: SetStateAction<T>) => Promise<void>, () => void];

export function useIndexedDB<T>(
  key: string,
  initialValue?: T
): [T | undefined, (action: SetStateAction<T | undefined>) => Promise<void>, () => Promise<void>] {
  if (!key) {
    throw new Error('useIndexedDB key may not be falsy.');
  }

  const [state, setState] = useState<T | undefined>(initialValue);

  const initializer = useRef(async (key: string) => {
    try {
      const indexedDBValue = await idb.get(key);

      if (indexedDBValue) {
        setState(indexedDBValue);
      } else if (initialValue) {
        await idb.set(key, initialValue);
      }
    } catch (error) {
      console.error(error);
    }
  });

  useLayoutEffect(() => {
    initializer.current(key);
  }, [key]);

  const set = (action: SetStateAction<T | undefined>) => {
    let newState: T | undefined;

    setState((prevState) => {
      newState = action instanceof Function ? action(prevState) : action;
      return newState;
    });

    return idb.set(key, newState);
  };

  const del = () => {
    setState(undefined);
    return idb.del(key);
  };

  return [state, set, del];
}
