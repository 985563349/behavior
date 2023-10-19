import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface AboutDialogProps extends Omit<React.ComponentProps<typeof Dialog>, 'children'> {}

const AboutDialog: React.FC<AboutDialogProps> = (props) => {
  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>About</DialogTitle>
        </DialogHeader>

        <p>Welcome to Behavior!</p>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

AboutDialog.displayName = 'AboutDialog';

export { AboutDialog };
