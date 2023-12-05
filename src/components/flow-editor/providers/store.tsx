import { useCallback } from 'react';
import { applyNodeChanges, applyEdgeChanges, addEdge } from 'reactflow';
import type { Connection, Edge, Node, EdgeChange, NodeChange } from 'reactflow';
import { pick } from 'lodash';

import { useUndo } from '../hooks/use-undo';
import { createContext, useContextSelector } from '../hooks/use-context-selector';

interface StoreState {
  nodes: Node[];
  edges: Edge[];
}

type UseUndoReturnType = ReturnType<typeof useUndo<StoreState>>;

export interface StoreProviderProps {
  children: React.ReactNode;
}

interface StoreProviderState
  extends StoreState,
    Pick<UseUndoReturnType, 'canRedo' | 'canUndo' | 'undo' | 'redo' | 'reset'> {
  onNodesChange: (changes: NodeChange[] | NodeChange, ignore?: boolean) => void;
  onEdgesChange: (changes: EdgeChange[] | EdgeChange, ignore?: boolean) => void;
  onConnect: (connection: Connection, ignore?: boolean) => void;
}

const initialNodes: Node[] = [
  { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
  { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
];

const StoreProviderContext = createContext<StoreProviderState | null>(null);

export function StoreProvider({ children }: StoreProviderProps) {
  const { present, canUndo, canRedo, set, reset, undo, redo } = useUndo<StoreState>({
    nodes: initialNodes,
    edges: initialEdges,
  });

  const onNodesChange = useCallback(
    (changes: NodeChange[] | NodeChange, ignore?: boolean) => {
      set(
        (prevState) => ({
          ...prevState,
          nodes: applyNodeChanges(Array.isArray(changes) ? changes : [changes], prevState.nodes),
        }),
        ignore
      );
    },
    [set]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[] | EdgeChange, ignore?: boolean) => {
      set(
        (prevState) => ({
          ...prevState,
          edges: applyEdgeChanges(Array.isArray(changes) ? changes : [changes], prevState.edges),
        }),
        ignore
      );
    },
    [set]
  );

  const onConnect = useCallback(
    (connection: Connection, ignore?: boolean) => {
      set(
        (prevState) => ({
          ...prevState,
          edges: addEdge(connection, prevState.edges),
        }),
        ignore
      );
    },
    [set]
  );

  const value = {
    ...present,
    canUndo,
    canRedo,
    undo,
    redo,
    reset,
    onNodesChange,
    onEdgesChange,
    onConnect,
  };

  return <StoreProviderContext.Provider value={value}>{children}</StoreProviderContext.Provider>;
}

export function useStore() {
  const context = useContextSelector(StoreProviderContext, (v) => v);

  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }

  return context;
}

export function useStoreApi() {
  const context = useContextSelector(
    StoreProviderContext,
    (v) => v && pick(v, 'canUndo', 'canRedo', 'undo', 'redo', 'reset')
  );

  if (!context) {
    throw new Error('useStoreApi must be used within a StoreProvider');
  }

  return context;
}
