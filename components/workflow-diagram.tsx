'use client';

import { useMemo, useRef, useEffect } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import type { PatternNode, PatternEdge } from '@/types';

// dagre 레이아웃 등록
if (typeof cytoscape !== 'undefined') {
  cytoscape.use(dagre);
}

interface WorkflowDiagramProps {
  nodes: PatternNode[];
  edges: PatternEdge[];
  className?: string;
  isLive?: boolean;
}

export function WorkflowDiagram({
  nodes,
  edges,
  className = '',
}: WorkflowDiagramProps) {
  const cyRef = useRef<cytoscape.Core | null>(null);

  // Cytoscape 형식으로 데이터 변환
  const elements = useMemo(() => {
    const cytoscapeNodes = nodes.map((node) => ({
      data: {
        id: node.id,
        label: node.data.label,
      },
      classes: node.type || 'default',
    }));

    const cytoscapeEdges = edges.map((edge) => ({
      data: {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label || '',
      },
    }));

    return [...cytoscapeNodes, ...cytoscapeEdges];
  }, [nodes, edges]);

  // Cytoscape 스타일 정의
  const stylesheet: cytoscape.Stylesheet[] = useMemo(
    () => [
      // 기본 노드 스타일
      {
        selector: 'node',
        style: {
          'background-color': '#FFFFFF',
          'border-width': 2,
          'border-color': '#ACBAC4',
          label: 'data(label)',
          'text-valign': 'center',
          'text-halign': 'center',
          'font-size': '13px',
          'font-weight': '500',
          color: '#30364F',
          'text-wrap': 'wrap',
          'text-max-width': '160px',
          width: 180,
          height: 60,
          shape: 'roundrectangle',
        },
      },
      // Input 노드 스타일
      {
        selector: 'node.input',
        style: {
          'background-color': '#30364F',
          'border-color': '#30364F',
          color: '#FFFFFF',
          'font-size': '14px',
          'font-weight': '600',
        },
      },
      // Output 노드 스타일
      {
        selector: 'node.output',
        style: {
          'background-color': '#E1D9BC',
          'border-color': '#30364F',
          'border-width': 2,
          color: '#30364F',
          'font-size': '14px',
          'font-weight': '600',
        },
      },
      // Edge 스타일
      {
        selector: 'edge',
        style: {
          width: 2,
          'line-color': '#30364F',
          'target-arrow-color': '#30364F',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          label: 'data(label)',
          'font-size': '11px',
          color: '#30364F',
          'text-background-color': '#FFFFFF',
          'text-background-opacity': 0.8,
          'text-background-padding': '3px',
        },
      },
    ],
    []
  );

  // 레이아웃 설정
  const layout = useMemo(
    () => ({
      name: 'dagre',
      rankDir: 'TB', // Top to Bottom
      nodeSep: 50,
      rankSep: 100,
      padding: 30,
    }),
    []
  );

  // Cytoscape 인스턴스 초기화 및 레이아웃 적용
  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;
      cy.layout(layout).run();

      // 줌 레벨 조정
      cy.fit(undefined, 50);
      cy.center();
    }
  }, [elements, layout]);

  return (
    <div
      className={`workflow-diagram h-[700px] w-full border-2 border-workflow-edge rounded-lg bg-white overflow-hidden ${className}`}
    >
      <CytoscapeComponent
        elements={elements}
        stylesheet={stylesheet}
        layout={layout}
        cy={(cy) => {
          cyRef.current = cy;
        }}
        style={{ width: '100%', height: '100%' }}
        wheelSensitivity={0.2}
        minZoom={0.3}
        maxZoom={1.5}
      />
    </div>
  );
}
