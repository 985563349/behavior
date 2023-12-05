import { Menu } from '@/components/menu';
import { FlowEditor, FlowEditorProvider } from '@/components/flow-editor';
import { Welcome } from '@/components/welcome';
import { useFileSystem } from '@/providers/file-system';

const Behavior: React.FC = () => {
  const { file } = useFileSystem();

  return (
    <FlowEditorProvider>
      <div className="grid grid-rows-[auto_1fr] w-screen h-screen">
        <Menu />
        <div className="border-t">{file ? <FlowEditor /> : <Welcome />}</div>
      </div>
    </FlowEditorProvider>
  );
};

Behavior.displayName = 'Behavior';

export { Behavior };
