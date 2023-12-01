import { createContext, useContext, useRef, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ModalConfig {
  open: boolean;
  title: React.ReactNode;
  body: React.ReactNode;
  cancelText?: string;
  actionText?: string;
}

type AlertConfig = Pick<ModalConfig, 'title' | 'body' | 'actionText'>;

type ConfirmConfig = Pick<ModalConfig, 'title' | 'body' | 'actionText' | 'cancelText'>;

interface ModalState extends ModalConfig {
  type: 'alert' | 'confirm';
}

export interface ModalProviderProps {
  children: React.ReactNode;
}

interface ModalProviderState {
  alert: (config: AlertConfig) => Promise<unknown>;
  confirm: (config: ConfirmConfig) => Promise<unknown>;
}

const ModalProviderContext = createContext<ModalProviderState | null>(null);

export function ModalProvider({ children }: ModalProviderProps) {
  const [state, setState] = useState<ModalState>({
    open: false,
    title: '',
    body: '',
    type: 'alert',
    cancelText: 'Cancel',
    actionText: 'Continue',
  });

  const resolveRef = useRef<(value?: unknown) => void>();
  const rejectRef = useRef<() => void>();

  const onAction = () => {
    setState((prevState) => ({ ...prevState, open: false }));
    resolveRef.current?.();
  };

  const onClose = () => {
    setState((prevState) => ({ ...prevState, open: false }));
    rejectRef.current?.();
  };

  const alert = (config: AlertConfig) => {
    setState((prevState) => ({ ...prevState, ...config, open: true, type: 'alert' }));

    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  };

  const confirm = (config: ConfirmConfig) => {
    setState((prevState) => ({ ...prevState, ...config, open: true, type: 'confirm' }));

    return new Promise((resolve, reject) => {
      resolveRef.current = resolve;
      rejectRef.current = reject;
    });
  };

  return (
    <ModalProviderContext.Provider value={{ alert, confirm }}>
      {children}
      <AlertDialog open={state.open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{state.title}</AlertDialogTitle>
            <AlertDialogDescription>{state.body}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {state.type !== 'alert' && (
              <AlertDialogCancel onClick={onClose}>{state.cancelText}</AlertDialogCancel>
            )}
            <AlertDialogAction onClick={onAction}>{state.actionText}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ModalProviderContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalProviderContext);

  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
}
