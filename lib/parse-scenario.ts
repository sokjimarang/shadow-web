/**
 * 시나리오 마크다운 파싱 유틸리티
 */

interface WorkflowStep {
  order: number;
  id: string;
  action: string;
  app?: string;
  description: string;
  input?: string | string[];
  output?: string;
  condition?: string;
}

interface Workflow {
  description: string;
  steps: WorkflowStep[];
}

interface ParsedScenario {
  title: string;
  workflow: Workflow | null;
  agentSpec: Record<string, unknown> | null;
  fullMarkdown: string;
}

/**
 * 마크다운에서 제목 추출
 */
function extractTitle(markdown: string): string {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : 'Untitled Scenario';
}

/**
 * 마크다운에서 JSON 코드 블록 추출
 */
function extractJsonBlock(markdown: string, sectionTitle: string): Record<string, unknown> | null {
  // 섹션 제목 찾기 (예: "## 4. 생성되는 에이전트 명세서")
  const sectionRegex = new RegExp(`^##\\s+.*${sectionTitle}[^\\n]*$`, 'mi');
  const sectionMatch = markdown.match(sectionRegex);

  if (!sectionMatch) {
    return null;
  }

  // 해당 섹션 이후의 첫 번째 JSON 코드 블록 찾기
  const startIndex = sectionMatch.index! + sectionMatch[0].length;
  const remainingText = markdown.slice(startIndex);

  const jsonBlockRegex = /```json\s*\n([\s\S]*?)\n```/;
  const jsonMatch = remainingText.match(jsonBlockRegex);

  if (!jsonMatch) {
    return null;
  }

  try {
    return JSON.parse(jsonMatch[1]);
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return null;
  }
}

/**
 * 에이전트 명세서 JSON 추출
 */
function extractAgentSpec(markdown: string): Record<string, unknown> | null {
  return extractJsonBlock(markdown, '생성되는 에이전트 명세서');
}

/**
 * 에이전트 명세서에서 workflow 추출
 */
function extractWorkflowFromSpec(agentSpec: Record<string, unknown> | null): Workflow | null {
  if (!agentSpec || typeof agentSpec !== 'object') {
    return null;
  }

  const workflow = agentSpec.workflow;
  if (!workflow || typeof workflow !== 'object') {
    return null;
  }

  return workflow as Workflow;
}

/**
 * 시나리오 마크다운 파싱
 */
export function parseScenario(markdown: string): ParsedScenario {
  const agentSpec = extractAgentSpec(markdown);
  const workflow = extractWorkflowFromSpec(agentSpec);

  return {
    title: extractTitle(markdown),
    workflow,
    agentSpec,
    fullMarkdown: markdown,
  };
}

/**
 * workflow steps를 ReactFlow nodes/edges로 변환
 */
export function workflowToPattern(workflow: Workflow | null): {
  nodes: Array<{
    id: string;
    type: string;
    data: { label: string };
    position: { x: number; y: number };
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    animated: boolean;
  }>;
} {
  if (!workflow || !workflow.steps || workflow.steps.length === 0) {
    return { nodes: [], edges: [] };
  }

  const steps = workflow.steps;

  // Nodes 생성
  const nodes = steps.map((step, index) => {
    let nodeType = 'default';
    if (index === 0) {
      nodeType = 'input';
    } else if (index === steps.length - 1) {
      nodeType = 'output';
    }

    const label = step.app
      ? `${step.app}: ${step.description}`
      : step.description;

    return {
      id: step.id,
      type: nodeType,
      data: { label },
      position: { x: 0, y: index * 100 },
    };
  });

  // Edges 생성
  const edges = steps.slice(0, -1).map((step, index) => ({
    id: `e${index}-${index + 1}`,
    source: step.id,
    target: steps[index + 1].id,
    animated: true,
  }));

  return { nodes, edges };
}
