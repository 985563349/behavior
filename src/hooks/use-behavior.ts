import { useRef } from 'react';
import { useFlowEditor, useOnFlowEditorEvent } from '@/components/flow-editor';

import { useFileSystem } from '@/providers/file-system';
import { useModal } from '@/providers/modal';

export function useBehavior() {
  const { file, newFile, openFile, saveFile, saveAsFile } = useFileSystem();
  const { confirm } = useModal();
  const { reactFlow, reset } = useFlowEditor();

  const changed = useRef(false);

  useOnFlowEditorEvent('change', () => {
    changed.current = true;
  });

  const fileNew = async () => {
    try {
      if (changed.current) {
        await confirm({ title: 'Warning', body: 'Discard changes? all changes will be lost.' });
      }

      newFile();
      reset();
      reactFlow.setViewport({ x: 0, y: 0, zoom: 1 });
    } catch (error) {
      console.log(error);
    }
  };

  const fileOpen = async () => {
    try {
      if (changed.current) {
        await confirm({ title: 'Warning', body: 'Discard changes? all changes will be lost.' });
      }

      const file = await openFile();
      const text = await file.origin?.text();

      // TODO: check file content

      const { nodes, edges, viewport } = JSON.parse(text ?? '');
      reset({ nodes, edges });
      reactFlow.setViewport(viewport);
    } catch (error) {
      console.log(error);
    }
  };

  const fileSave = async () => {
    try {
      if (reactFlow.viewportInitialized) {
        const flow = reactFlow.toObject();
        await saveFile(file!.id, JSON.stringify(flow));
        changed.current = false;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fileSaveAs = () => {
    try {
      if (reactFlow.viewportInitialized) {
        const flow = reactFlow.toObject();
        saveAsFile(JSON.stringify(flow));
        changed.current = false;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { fileNew, fileOpen, fileSave, fileSaveAs };
}
