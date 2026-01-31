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
      className={`h-[500px] w-full border border-border rounded-lg bg-white ${className}`}
    >
      <ReactFlow
        nodes={nodesState}
        edges={edgesState}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        defaultEdgeOptions={{
          style: { stroke: 'hsl(222 25% 25%)', strokeWidth: 2 },
        }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
      >
        <Controls className="bg-white border-border" />
        <MiniMap
          nodeColor="hsl(222 25% 25%)"
          maskColor="hsl(222 25% 95% / 0.8)"
          className="bg-white border-border"
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
          color="hsl(222 15% 85%)"
        />
      </ReactFlow>
    </div>
  );
}
