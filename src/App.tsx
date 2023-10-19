import { Behavior } from '@/components/behavior';
import { ThemeProvider } from '@/providers/theme';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Behavior />
    </ThemeProvider>
  );
};

export default App;
