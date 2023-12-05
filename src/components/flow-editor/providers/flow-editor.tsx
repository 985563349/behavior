import { useMemo } from 'react';
import { ReactFlowProvider, useReactFlow } from 'reactflow';

import { StoreProvider, useStoreApi } from './store';

export interface FlowEditorProviderProps {
  children: React.ReactNode;
}

export function FlowEditorProvider({ children }: FlowEditorProviderProps) {
  try {
    useFlowEditor();
  } catch {
    return (
      <ReactFlowProvider>
        <StoreProvider>{children}</StoreProvider>
      </ReactFlowProvider>
    );
  }

  return <>{children}</>;
}

export function useFlowEditor() {
  try {
    const reactFlow = useReactFlow();
    const storeApi = useStoreApi();

    return useMemo(
      () => ({
        ...storeApi,
        reactFlow,
      }),
      [reactFlow, storeApi]
    );
  } catch {
    throw new Error('useFlowEditor must be used within a FlowEditorProvider');
  }
}
