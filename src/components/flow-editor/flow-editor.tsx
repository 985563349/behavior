import { forwardRef } from 'react';
import { HotkeysProvider } from 'react-hotkeys-hook';

import { Flow } from './components/flow';
import type { FlowRefType, FlowProps } from './components/flow';
import { FlowEditorProvider } from './providers/flow-editor';

export interface FlowEditorProps extends FlowProps {}

const FlowEditor = forwardRef<FlowRefType, FlowEditorProps>((props, ref) => {
  return (
    <HotkeysProvider initiallyActiveScopes={['flow-editor']}>
      <FlowEditorProvider>
        <Flow ref={ref} {...props} />
      </FlowEditorProvider>
    </HotkeysProvider>
  );
});

FlowEditor.displayName = 'FlowEditor';

export { FlowEditor };
