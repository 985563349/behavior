import { LuFile, LuFolder, LuHelpCircle } from 'react-icons/lu';

import { Button } from '@/components/ui/button';
import { useBehavior } from '@/hooks/use-behavior';

const Welcome: React.FC = () => {
  const { fileNew, fileOpen } = useBehavior();

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="space-y-6">
        <h1 className="text-center text-5xl font-bold">Behavior</h1>
        <p className="text-center text-lg">All your data is saved locally in your browser.</p>
        <div className="flex flex-col items-center space-y-1">
          <Button className="w-56 justify-between" variant="ghost" onClick={fileNew}>
            <span className="inline-flex items-center">
              <LuFile className="mr-2 h-4 w-4" />
              New File
            </span>
            <span className="text-muted-foreground">⇧⌘N</span>
          </Button>

          <Button className="w-56 justify-between" variant="ghost" onClick={fileOpen}>
            <span className="inline-flex items-center">
              <LuFolder className="mr-2 h-4 w-4" />
              Open File
            </span>
            <span className="text-muted-foreground">⇧⌘O</span>
          </Button>

          <Button className="w-56 justify-between" variant="ghost">
            <span className="inline-flex items-center">
              <LuHelpCircle className="mr-2 h-4 w-4" />
              Help
            </span>
            <span className="text-muted-foreground">?</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

Welcome.displayName = 'Welcome';

export { Welcome };
