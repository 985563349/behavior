import { ReactFlowProvider } from 'reactflow';

import { Menu } from '@/components/menu';
import { Flow } from '@/components/flow';

const Behavior: React.FC = () => {
  return (
    <ReactFlowProvider>
      <div className="grid grid-rows-[auto_1fr] w-screen h-screen">
        <Menu />
        <div className="border-t">
          <Flow />
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export { Behavior };
