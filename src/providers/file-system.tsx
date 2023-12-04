import { createContext, useContext } from 'react';
import { fileOpen, fileSave } from 'browser-fs-access';

import { useIndexedDB } from '@/hooks/useIndexedDB';

type FileWithHandle = {
  id: string;
  name: string;
  handle?: FileSystemFileHandle;
  origin?: File;
};

interface State {
  files: FileWithHandle[];
  activeKey: string;
}

export interface FileSystemProviderProps {
  children: React.ReactNode;
}

interface FileSystemProviderState {
  files: FileWithHandle[];
  file?: FileWithHandle;
  newFile: () => FileWithHandle;
  openFile: () => Promise<FileWithHandle>;
  recentFile: (id: string) => Promise<FileWithHandle>;
  saveFile: (id: string, content: string) => Promise<FileWithHandle>;
  saveFileAs: (content: string) => Promise<FileWithHandle>;
}

const FileSystemProviderContext = createContext<FileSystemProviderState | null>(null);

async function verifyPermission(fileHandle: FileSystemHandle, withWrite: boolean) {
  const opts: FileSystemHandlePermissionDescriptor = {};

  if (withWrite) {
    opts.writable = true;
    // For Chrome 86 and later...
    opts.mode = 'readwrite';
  }

  // Check if we already have permission, if so, return true.
  if ((await fileHandle.queryPermission(opts)) === 'granted') {
    return true;
  }

  // Request permission to the file, if the user grants permission, return true.
  if ((await fileHandle.requestPermission(opts)) === 'granted') {
    return true;
  }

  // The user did nt grant permission, return false.
  return false;
}

export function FileSystemProvider(props: FileSystemProviderProps) {
  const { children } = props;

  const [state, setState] = useIndexedDB<State>('file-system', {
    files: [],
    activeKey: '',
  });

  const newFile = () => {
    const currentFile = { id: crypto.randomUUID(), name: 'Untitled' };

    setState((prevState) => ({
      files: [...prevState.files.filter((file) => file.handle), currentFile],
      activeKey: currentFile.id,
    }));

    return currentFile;
  };

  const openFile = async () => {
    const origin = await fileOpen();

    const currentFile: FileWithHandle = {
      id: crypto.randomUUID(),
      name: origin.name,
      handle: origin.handle,
      origin,
    };

    setState((prevState) => ({
      files: [...prevState.files, currentFile],
      activeKey: currentFile.id,
    }));

    return currentFile;
  };

  const recentFile = async (id: string) => {
    const currentFile = state.files.find((file) => file.id === id);

    if (!currentFile) {
      throw new DOMException('file does not exist.');
    }

    const existingHandle = currentFile.handle;

    if (existingHandle && !(await verifyPermission(existingHandle, true))) {
      throw new DOMException('file opening failed.');
    }

    const origin = existingHandle ? await existingHandle.getFile() : await fileOpen();
    currentFile.origin = origin;

    setState((prevState) => ({
      files: [...prevState.files],
      activeKey: currentFile.id,
    }));

    return currentFile;
  };

  const saveFile = async (id: string, content: string) => {
    const currentFile = state.files.find((file) => file.id === id);

    if (!currentFile) {
      throw new DOMException('file does not exist.');
    }

    const existingHandle = currentFile.handle;

    if (existingHandle && !(await verifyPermission(existingHandle, true))) {
      throw new DOMException('file save failed.');
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const options = { fileName: currentFile.name, extensions: ['.json'] };
    const handle = await fileSave(blob, options, existingHandle);

    if (handle) {
      const origin = await handle.getFile();
      currentFile.handle = handle;
      currentFile.origin = origin;
      currentFile.name = origin.name;
    }

    setState((prevState) => ({
      ...prevState,
      files: [...prevState.files],
    }));

    return currentFile;
  };

  const saveFileAs = async (content: string) => {
    const currentFile: FileWithHandle = { id: crypto.randomUUID(), name: 'Untitled' };

    const blob = new Blob([content], { type: 'text/plain' });
    const options = { fileName: currentFile.name, extensions: ['.json'] };
    const handle = await fileSave(blob, options);

    if (handle) {
      const origin = await handle.getFile();
      currentFile.handle = handle;
      currentFile.origin = origin;
      currentFile.name = origin.name;
    }

    setState((prevState) => ({
      files: [...prevState.files, currentFile],
      activeKey: currentFile.id,
    }));

    return currentFile;
  };

  const file = state.files.find((file) => file.id === state.activeKey);

  const value = {
    files: state.files,
    file,
    newFile,
    openFile,
    recentFile,
    saveFile,
    saveFileAs,
  };

  return (
    <FileSystemProviderContext.Provider value={value}>
      {children}
    </FileSystemProviderContext.Provider>
  );
}

export function useFileSystem() {
  const context = useContext(FileSystemProviderContext);

  if (!context) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }

  return context;
}
