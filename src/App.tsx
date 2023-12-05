import { Behavior } from '@/components/behavior';

import { ThemeProvider } from '@/providers/theme';
import { ModalProvider } from '@/providers/modal';
import { FileSystemProvider } from '@/providers/file-system';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ModalProvider>
        <FileSystemProvider>
          <Behavior />
        </FileSystemProvider>
      </ModalProvider>
    </ThemeProvider>
  );
};

export default App;
