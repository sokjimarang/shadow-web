'use client';

import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { PatternNode, PatternEdge } from '@/types';

interface OutputPatternDiagramProps {
  nodes: PatternNode[];
  edges: PatternEdge[];
  className?: string;
}

export function OutputPatternDiagram({
  nodes,
  edges,
  className = '',
}: OutputPatternDiagramProps) {
  const [nodesState, , onNodesChange] = useNodesState(nodes);
  const [edgesState, , onEdgesChange] = useEdgesState(edges);

  return (
    <div
      className={`h-[500px] w-full border border-border rounded-lg bg-background ${className}`}
    >
      <ReactFlow
        nodes={nodesState}
        edges={edgesState}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        defaultEdgeOptions={{
          style: {
            stroke: 'var(--color-primary)',
            strokeWidth: 2,
          },
        }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
      >
        <Controls className="bg-background border-border" />
        <MiniMap
          nodeColor="var(--color-primary)"
          maskColor="var(--color-primary-lighter)"
          className="bg-background border-border"
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
          color="var(--color-border)"
        />
      </ReactFlow>
    </div>
  );
}
