import { useHotkeys } from 'react-hotkeys-hook';

import { useStore } from '../providers/store';

export function useHotkeyManager() {
  const { undo, redo } = useStore();

  useHotkeys('meta+z', (e) => {
    e.preventDefault();
    undo();
  });

  useHotkeys('meta+shift+z', (e) => {
    e.preventDefault();
    redo();
  });
}
