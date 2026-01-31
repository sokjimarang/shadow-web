import type { Node, Edge } from '@xyflow/react';

export interface PatternNode extends Node {
  id: string;
  type?: 'input' | 'output' | 'default';
  data: {
    label: string;
  };
  position: {
    x: number;
    y: number;
  };
}

export interface PatternEdge extends Edge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

export interface Output {
  id: string;
  title: string;
  createdAt: string;
  pattern: {
    nodes: PatternNode[];
    edges: PatternEdge[];
  };
  markdown: string;
  result: {
    type: 'text' | 'html' | 'json';
    content: string;
  };
  metadata?: {
    questionId?: string;
    status?: 'pending' | 'processing' | 'completed' | 'failed';
    [key: string]: unknown;
  };
}
