import { memo } from 'react';
import { Handle, NodeProps, Position, useReactFlow } from 'reactflow';

import { Button } from '@/components/ui/button';

const CustomNode: React.FC<NodeProps> = memo(({ id }) => {
  const { setNodes } = useReactFlow();

  return (
    <div className="border rounded-sm p-3 text-xs bg-white">
      <div>
        <div className="space-y-1">
          <Button
            onClick={() => {
              setNodes((nodes) =>
                nodes.map((node) => (node.id === id ? { ...node, type: 'default' } : node))
              );
            }}
          >
            Node
          </Button>
        </div>
      </div>
      <Handle type="target" position={Position.Top} />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

export { CustomNode };
