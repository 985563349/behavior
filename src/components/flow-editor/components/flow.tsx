import { forwardRef, useCallback } from 'react';
import ReactFlow, { Controls, Background } from 'reactflow';
import type { OnNodesChange, ReactFlowProps, ReactFlowRefType } from 'reactflow';

import 'reactflow/dist/style.css';

import { emitter } from '../helpers/emitter';
import { useStore } from '../providers/store';
import { useUpdateEffect } from '../hooks/use-update-effect';
import { useHotkeyManager } from '../hooks/use-hotkey-manager';

export type FlowRefType = ReactFlowRefType;

export interface FlowProps
  extends Omit<
    ReactFlowProps,
    | 'nodes'
    | 'edges'
    | 'defaultNodes'
    | 'defaultEdges'
    | 'onNodesChange'
    | 'onEdgesChange'
    | 'onConnect'
    | 'onInit'
  > {}

const Flow = forwardRef<FlowRefType, FlowProps>(({ children, ...props }, ref) => {
  const { nodes, edges, onNodesChange: storeOnNodesChange, onEdgesChange, onConnect } = useStore();

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      const ignore = changes.every((change) => change.type === 'dimensions');
      storeOnNodesChange(changes, ignore);
    },
    [storeOnNodesChange]
  );

  useUpdateEffect(() => {
    emitter.emit('change', { nodes, edges });
  }, [nodes, edges]);

  useHotkeyManager();

  return (
    <div className="relative w-full h-full">
      <ReactFlow
        ref={ref}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        fitViewOptions={{ padding: 1 }}
        nodeOrigin={[0.5, 0]}
        proOptions={{ hideAttribution: true }}
        {...props}
      >
        {children}
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
});

Flow.displayName = 'Flow';

export { Flow };
