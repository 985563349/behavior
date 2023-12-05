import {
  createContext as createContextOrig,
  useContext as useContextOrig,
  useSyncExternalStore,
  useRef,
  useLayoutEffect,
} from 'react';
import type { Context as ContextOrig } from 'react';
import shallowequal from 'shallowequal';

type Listener = () => void;

type ContextValue<V> = {
  value: V;
  subscribe: (listen: Listener) => () => void;
  notify: () => void;
};

export interface Context<V> {
  Provider: React.ComponentType<{ value: V; children: React.ReactNode }>;
  displayName?: string;
}

export function createContext<V>(defaultValue: V) {
  const context = createContextOrig<ContextValue<V>>({
    value: defaultValue,
    subscribe: () => () => null,
    notify: () => null,
  });
  const ProviderOrig = context.Provider;

  const Provider = ({ value, children }: { value: V; children: React.ReactNode }) => {
    const store = useRef<ContextValue<V>>();

    if (!store.current) {
      const listeners = new Set<Listener>();

      store.current = {
        value,
        subscribe: (l) => {
          listeners.add(l);
          return () => listeners.delete(l);
        },
        notify: () => listeners.forEach((l) => l()),
      };
    }

    useLayoutEffect(() => {
      if (store.current) {
        store.current.value = value;
        store.current.notify();
      }
    }, [value]);

    return <ProviderOrig value={store.current}>{children}</ProviderOrig>;
  };

  (context as unknown as Context<V>).Provider = Provider;
  delete (context as unknown as Record<string, unknown>).Consumer;

  return context as Context<V>;
}

export function useContextSelector<V, S>(context: Context<V>, selector: (value: V) => S) {
  const store = useContextOrig(context as unknown as ContextOrig<ContextValue<V>>);

  const lastSnapshot = useRef(selector(store.value));

  const getSnapshot = () => {
    const nextSnapshot = selector(store.value);

    if (shallowequal(nextSnapshot, lastSnapshot.current)) {
      return lastSnapshot.current;
    }

    lastSnapshot.current = nextSnapshot;
    return nextSnapshot;
  };

  return useSyncExternalStore(store.subscribe, getSnapshot);
}
