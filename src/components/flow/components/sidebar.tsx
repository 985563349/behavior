import { useState } from 'react';
import { useOnSelectionChange } from 'reactflow';
import type { Node } from 'reactflow';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

const Sidebar: React.FC = () => {
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);

  useOnSelectionChange({
    onChange: ({ nodes }) => {
      setSelectedNodes(nodes);
    },
  });

  const form = useForm({
    defaultValues: {
      name: 'name',
      description: 'description',
    },
  });

  return selectedNodes.length ? (
    <div className="absolute z-50 inset-y-0 right-0 border-l p-6 h-full w-3/4 sm:max-w-xs bg-background">
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold">Attributes</h2>
        </div>

        <Separator />

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Class
          </label>
          <p className="text-sm text-muted-foreground">Custom Node</p>
        </div>

        <Form {...form}>
          <form className="space-y-5">
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormDescription>This is your public display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="description"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>This is your public display description.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  ) : null;
};

export { Sidebar };
