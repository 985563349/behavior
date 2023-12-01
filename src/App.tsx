import { Behavior } from '@/components/behavior';

import { ThemeProvider } from '@/providers/theme';
import { ModalProvider } from '@/providers/modal';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ModalProvider>
        <Behavior />
      </ModalProvider>
    </ThemeProvider>
  );
};

export default App;
