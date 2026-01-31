'use client';

import { memo, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { PatternNode, PatternEdge } from '@/types';

interface OutputPatternDiagramLiveProps {
  nodes: PatternNode[];
  edges: PatternEdge[];
  className?: string;
}

const iconBaseStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '22px',
  height: '22px',
  borderRadius: '6px',
  border: '1px solid var(--color-workflow-edge)',
  background: 'var(--color-workflow-node-light)',
  flexShrink: 0,
} as const;

const iconStroke = 'var(--color-workflow-node)';

function WorkflowIcon({ name }: { name: string }) {
  if (name === 'chat') {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={iconStroke} strokeWidth="2">
        <path d="M7 9h10M7 13h6" />
        <path d="M4 5h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4V7a2 2 0 0 1 2-2z" />
      </svg>
    );
  }

  if (name === 'doc') {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={iconStroke} strokeWidth="2">
        <path d="M7 4h7l4 4v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
        <path d="M14 4v4h4" />
        <path d="M8 13h8M8 17h6" />
      </svg>
    );
  }

  if (name === 'db') {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={iconStroke} strokeWidth="2">
        <ellipse cx="12" cy="5" rx="7" ry="3" />
        <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
        <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
      </svg>
    );
  }

  if (name === 'decision') {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={iconStroke} strokeWidth="2">
        <path d="M12 3l7 9-7 9-7-9 7-9z" />
        <path d="M12 8v8" />
      </svg>
    );
  }

  if (name === 'check') {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={iconStroke} strokeWidth="2">
        <path d="M5 12l4 4 10-10" />
      </svg>
    );
  }

  if (name === 'bolt') {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={iconStroke} strokeWidth="2">
        <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={iconStroke} strokeWidth="2">
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <rect x="13" y="13" width="7" height="7" rx="1" />
      <path d="M11 8h2M8 11v2" />
    </svg>
  );
}

function resolveIconKey(label: string, app?: string, type?: string) {
  const token = `${app ?? ''} ${label}`.toLowerCase();

  if (type === 'input') return 'bolt';
  if (type === 'output') return 'check';
  if (token.includes('slack') || token.includes('dm') || token.includes('message')) return 'chat';
  if (token.includes('jira') || token.includes('issue')) return 'decision';
  if (token.includes('notion') || token.includes('confluence') || token.includes('doc')) return 'doc';
  if (token.includes('drive') || token.includes('storage') || token.includes('db')) return 'db';
  if (token.includes('검토') || token.includes('분기') || token.includes('조건')) return 'decision';

  return 'process';
}

const CustomNode = memo(({ data, type }: NodeProps<PatternNode>) => {
  const iconKey = resolveIconKey(data.label ?? '', data.app, type);

  return (
    <div
      style={{
        padding: '12px 18px',
        borderRadius: '8px',
        border: '2px solid var(--color-workflow-edge)',
        background: 'white',
        minWidth: '180px',
        fontSize: '13px',
        fontWeight: '500',
        color: 'var(--color-workflow-node)',
        whiteSpace: 'pre-line',
        lineHeight: '1.4',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <span style={iconBaseStyle}>
        <WorkflowIcon name={iconKey} />
      </span>
      <span style={{ textAlign: 'left', flex: 1 }}>{data.label}</span>
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

const InputNode = memo(({ data, type }: NodeProps<PatternNode>) => {
  const iconKey = resolveIconKey(data.label ?? '', data.app, type);

  return (
    <div
      style={{
        padding: '14px 20px',
        borderRadius: '8px',
        border: '2px solid var(--color-workflow-node)',
        background: 'var(--color-workflow-node)',
        color: 'white',
        minWidth: '180px',
        fontSize: '14px',
        fontWeight: '600',
        whiteSpace: 'pre-line',
        lineHeight: '1.4',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <span
        style={{
          ...iconBaseStyle,
          border: '1px solid rgba(255, 255, 255, 0.4)',
          background: 'rgba(255, 255, 255, 0.16)',
        }}
      >
        <WorkflowIcon name={iconKey} />
      </span>
      <span style={{ textAlign: 'left', flex: 1 }}>{data.label}</span>
    </div>
  );
});

InputNode.displayName = 'InputNode';

const OutputNode = memo(({ data, type }: NodeProps<PatternNode>) => {
  const iconKey = resolveIconKey(data.label ?? '', data.app, type);

  return (
    <div
      style={{
        padding: '14px 20px',
        borderRadius: '8px',
        border: '2px solid var(--color-workflow-edge-active)',
        background: 'var(--color-workflow-node-light)',
        color: 'var(--color-workflow-node)',
        minWidth: '180px',
        fontSize: '14px',
        fontWeight: '600',
        whiteSpace: 'pre-line',
        lineHeight: '1.4',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <span style={iconBaseStyle}>
        <WorkflowIcon name={iconKey} />
      </span>
      <span style={{ textAlign: 'left', flex: 1 }}>{data.label}</span>
    </div>
  );
});

OutputNode.displayName = 'OutputNode';

const nodeTypes = {
  input: InputNode,
  output: OutputNode,
  default: CustomNode,
};

export function OutputPatternDiagramLive({
  nodes,
  edges,
  className = '',
}: OutputPatternDiagramLiveProps) {
  const normalizedEdges = useMemo(
    () =>
      edges.map((edge) => ({
        ...edge,
        animated: false,
        style: {
          stroke: 'var(--color-workflow-edge-active)',
          strokeWidth: 2,
          ...edge.style,
        },
      })),
    [edges]
  );

  const [nodesState, setNodes, onNodesChange] = useNodesState(nodes);
  const [edgesState, setEdges, onEdgesChange] = useEdgesState(normalizedEdges);

  // 실시간 업데이트: props 변경 감지하여 상태 업데이트
  useEffect(() => {
    setNodes(nodes);
  }, [nodes, setNodes]);

  useEffect(() => {
    setEdges(normalizedEdges);
  }, [normalizedEdges, setEdges]);

  return (
    <div
      className={`workflow-pattern-diagram h-[700px] w-full border-2 border-workflow-edge rounded-lg bg-white ${className}`}
    >
      <ReactFlow
        nodes={nodesState}
        edges={edgesState}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
        }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
          style: {
            stroke: 'var(--color-workflow-edge-active)',
            strokeWidth: 2,
          },
        }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        minZoom={0.5}
        maxZoom={1.5}
      >
        <Controls
          style={{
            background: 'white',
            border: '1px solid var(--color-workflow-edge)',
            borderRadius: '6px',
          }}
        />
        <MiniMap
          nodeColor="var(--color-workflow-node)"
          maskColor="rgba(225, 217, 188, 0.6)"
          style={{
            background: 'white',
            border: '1px solid var(--color-workflow-edge)',
            borderRadius: '6px',
          }}
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1.5}
          color="var(--color-workflow-edge)"
          style={{
            opacity: 0.4,
          }}
        />
      </ReactFlow>
    </div>
  );
}
