import mitt from 'mitt';
import type { Emitter } from 'mitt';
import type { Node, Edge } from 'reactflow';

interface ChangeEventData {
  nodes: Node[];
  edges: Edge[];
}

export type EmitterEvents = {
  change: ChangeEventData;
};

export const emitter: Emitter<EmitterEvents> = mitt<EmitterEvents>();
