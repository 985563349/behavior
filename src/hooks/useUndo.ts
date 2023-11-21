import { useReducer, useRef } from 'react';

type State<T> = {
  past: T[];
  present: T;
  future: T[];
};

type Action<T> =
  | { type: 'SET'; payload: T; ignore?: boolean }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR'; payload: T };

function reducer<T>(state: State<T>, action: Action<T>) {
  const { past, present, future } = state;

  switch (action.type) {
    case 'SET': {
      if (action.payload === present) {
        return state;
      }

      return {
        past: action.ignore ? past : [...past, present],
        present: action.payload,
        future: [],
      };
    }

    case 'UNDO': {
      return {
        past: past.slice(0, past.length - 1),
        present: past[past.length - 1],
        future: [present, ...future],
      };
    }

    case 'REDO': {
      return {
        past: [...past, present],
        present: future[0],
        future: future.slice(1),
      };
    }

    default: {
      throw new Error('Unsupported action type');
    }
  }
}

export function useUndo<T>(initialState: T) {
  const initialStateRef = useRef(initialState);

  const [state, dispatch] = useReducer<typeof reducer<T>>(reducer, {
    past: [],
    present: initialStateRef.current,
    future: [],
  });

  const canUndo = state.past.length !== 0;
  const canRedo = state.future.length !== 0;

  const set = (state: T, ignore?: boolean) => {
    dispatch({ type: 'SET', payload: state, ignore });
  };

  const undo = () => {
    if (canUndo) {
      dispatch({ type: 'UNDO' });
    }
  };

  const redo = () => {
    if (canUndo) {
      dispatch({ type: 'REDO' });
    }
  };

  const clear = () => {
    dispatch({ type: 'CLEAR', payload: initialStateRef.current });
  };

  return { state: state.present, set, undo, redo, clear, canUndo, canRedo };
}
