'use client';

import { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type OnConnect,
  type Node,
  type Edge,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: '시작' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    data: { label: '데이터 수집' },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    data: { label: '데이터 처리' },
    position: { x: 400, y: 100 },
  },
  {
    id: '4',
    data: { label: '결과 분석' },
    position: { x: 250, y: 200 },
  },
  {
    id: '5',
    type: 'output',
    data: { label: '완료' },
    position: { x: 250, y: 300 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e4-5', source: '4', target: '5' },
];

export function WorkflowDiagram() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="h-[400px] w-full border border-border rounded-lg bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        defaultEdgeOptions={{
          style: { stroke: 'hsl(222 25% 25%)', strokeWidth: 2 },
        }}
      >
        <Controls className="bg-card border-border" />
        <MiniMap
          nodeColor="hsl(222 25% 25%)"
          maskColor="hsl(60 38% 90% / 0.8)"
          className="bg-card border-border"
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
          color="hsl(207 15% 73%)"
        />
      </ReactFlow>
    </div>
  );
}
