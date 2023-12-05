import { useState, useRef, useCallback } from 'react';
import { type SetStateAction } from 'react';

type State<T> = {
  past: T[];
  present: T;
  future: T[];
};

const ensure = <T>(array: T[], limit: number) => {
  if (array.length <= limit) {
    return array;
  }
  const start = limit - array.length - 1;
  return array.slice(start);
};

export function useUndo<T>(initialState: T, limit: number = 100, delay: number = 500) {
  const initialStateRef = useRef(initialState);

  const [state, setState] = useState<State<T>>({
    past: [],
    present: initialStateRef.current,
    future: [],
  });

  const lastModifyTime = useRef(Date.now());

  const set = useCallback(
    (action: SetStateAction<T>, ignore?: boolean) => {
      const now = Date.now();

      ignore = ignore || now - lastModifyTime.current < delay;

      if (ignore === false) {
        lastModifyTime.current = now;
      }

      setState((prevState) => {
        const { past, present, future } = prevState;
        const newPresent = action instanceof Function ? action(present) : action;

        if (newPresent === present) {
          return prevState;
        }

        return {
          past: ignore ? past : ensure([...past, present], limit),
          present: newPresent,
          future: ignore ? future : [],
        };
      });
    },
    [limit, delay]
  );

  const undo = useCallback(() => {
    setState((prevState) => {
      const { past, present, future } = prevState;

      if (!past.length) {
        return prevState;
      }

      return {
        past: past.slice(0, past.length - 1),
        present: past[past.length - 1],
        future: [present, ...future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((prevState) => {
      const { past, present, future } = prevState;

      if (!future.length) {
        return prevState;
      }

      return {
        past: [...past, present],
        present: future[0],
        future: future.slice(1),
      };
    });
  }, []);

  const reset = useCallback((state?: T) => {
    setState({
      past: [],
      present: state ?? initialStateRef.current,
      future: [],
    });
  }, []);

  const canUndo = state.past.length !== 0;
  const canRedo = state.future.length !== 0;

  return { ...state, canUndo, canRedo, set, undo, redo, reset };
}
