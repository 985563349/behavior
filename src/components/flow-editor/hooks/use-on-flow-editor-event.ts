import { useEffect } from 'react';

import { emitter } from '../helpers/emitter';
import type { EmitterEvents } from '../helpers/emitter';

export function useOnFlowEditorEvent<K extends keyof EmitterEvents>(
  type: K,
  listener: (ev: EmitterEvents[K]) => void
) {
  useEffect(() => {
    emitter.on(type, listener);

    return () => {
      emitter.off(type, listener);
    };
  }, [type, listener]);
}
