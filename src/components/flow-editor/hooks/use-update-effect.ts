import { type EffectCallback, type DependencyList, useEffect } from 'react';

import { useFirstMountState } from './use-first-mount-state';

export function useUpdateEffect(effect: EffectCallback, deps?: DependencyList) {
  const isFirstMount = useFirstMountState();

  useEffect(() => {
    if (!isFirstMount) {
      return effect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
