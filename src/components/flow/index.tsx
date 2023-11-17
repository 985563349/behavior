import { useCallback, useRef } from 'react';
import ReactFlow, {
  addEdge,
  useReactFlow,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
} from 'reactflow';
import type { Node, Edge, OnConnect, OnConnectStart, OnConnectEnd } from 'reactflow';
import 'reactflow/dist/style.css';

import { CustomNode } from './components/custom-node';

const initialNodes: Node[] = [
  { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
  { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
];

const nodeTypes = {
  custom: CustomNode,
};

const Flow: React.FC = () => {
  const { deleteElements, getNodes, screenToFlowPosition } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>(initialEdges);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((els) => addEdge(params, els)),
    [setEdges]
  );

  const connectingNodeId = useRef<string | null>(null);

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      const targetIsPane = (event.target as HTMLElement).classList.contains('react-flow__pane');

      if (targetIsPane) {
        const customNode = getNodes().find((node) => node.type === 'custom');

        if (customNode) {
          deleteElements({ nodes: [customNode] });
        }

        const id = crypto.randomUUID();
        const { clientX, clientY } = event instanceof MouseEvent ? event : event.changedTouches[0];

        const node: Node = {
          id,
          type: 'custom',
          position: screenToFlowPosition({
            x: clientX,
            y: clientY,
          }),
          data: { label: `Node` },
        };

        setNodes((nds) => nds.concat(node));
        setEdges((eds) => eds.concat({ id, source: connectingNodeId.current!, target: id }));
      }
    },
    [deleteElements, getNodes, screenToFlowPosition, setNodes, setEdges]
  );

  return (
    <div className="relative w-full h-full">
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        fitView
        fitViewOptions={{ padding: 1 }}
        nodeOrigin={[0.5, 0]}
      >
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

Flow.displayName = 'Flow';

export { Flow };
