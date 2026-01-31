'use client';

import { useMemo, useRef, useEffect, useCallback } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { ZoomIn, ZoomOut, Maximize2, RefreshCw } from 'lucide-react';
import type { PatternNode, PatternEdge } from '@/types';

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
  const isInitializedRef = useRef(false);

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

  const stylesheet = useMemo(
    () => [
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
    ] as any,
    []
  );

  const layout = useMemo(
    () => ({
      name: 'dagre',
      rankDir: 'TB',
      nodeSep: 50,
      rankSep: 100,
      padding: 30,
      fit: false,
      animate: false,
    }),
    []
  );

  const runLayout = useCallback(() => {
    if (cyRef.current) {
      const cy = cyRef.current;
      const layoutInstance = cy.layout(layout);

      layoutInstance.run();

      layoutInstance.on('layoutstop', () => {
        if (!isInitializedRef.current) {
          cy.fit(undefined, 50);
          cy.center();
          isInitializedRef.current = true;
        }
      });
    }
  }, [layout]);

  useEffect(() => {
    if (cyRef.current && elements.length > 0) {
      runLayout();
    }
  }, [elements, runLayout]);

  const handleZoomIn = () => {
    if (cyRef.current) {
      const cy = cyRef.current;
      const currentZoom = cy.zoom();
      const newZoom = Math.min(currentZoom * 1.2, 1.5);
      cy.zoom({
        level: newZoom,
        renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 },
      });
    }
  };

  const handleZoomOut = () => {
    if (cyRef.current) {
      const cy = cyRef.current;
      const currentZoom = cy.zoom();
      const newZoom = Math.max(currentZoom / 1.2, 0.3);
      cy.zoom({
        level: newZoom,
        renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 },
      });
    }
  };

  const handleFitView = () => {
    if (cyRef.current) {
      const cy = cyRef.current;
      cy.fit(undefined, 50);
      cy.center();
    }
  };

  const handleReset = () => {
    if (cyRef.current) {
      const cy = cyRef.current;
      runLayout();
      setTimeout(() => {
        cy.fit(undefined, 50);
        cy.center();
      }, 100);
    }
  };

  return (
    <div
      className={`workflow-diagram h-[700px] w-full border-2 border-workflow-edge rounded-lg bg-white overflow-hidden relative ${className}`}
    >
      <CytoscapeComponent
        elements={elements}
        stylesheet={stylesheet}
        cy={(cy) => {
          cyRef.current = cy;
        }}
        style={{ width: '100%', height: '100%' }}
        wheelSensitivity={0.2}
        minZoom={0.3}
        maxZoom={1.5}
      />

      <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-white border-2 border-workflow-edge rounded-lg p-1 shadow-sm">
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-muted rounded transition-colors"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-4 h-4 text-primary" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-muted rounded transition-colors"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-4 h-4 text-primary" />
        </button>
        <button
          onClick={handleFitView}
          className="p-2 hover:bg-muted rounded transition-colors"
          title="Fit to View"
          aria-label="Fit to View"
        >
          <Maximize2 className="w-4 h-4 text-primary" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 hover:bg-muted rounded transition-colors"
          title="Reset View"
          aria-label="Reset View"
        >
          <RefreshCw className="w-4 h-4 text-primary" />
        </button>
      </div>
    </div>
  );
}
