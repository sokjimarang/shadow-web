/**
 * 시나리오 마크다운 파일을 읽어서 Output 타입 데이터로 변환하는 스크립트
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseScenario, workflowToPattern } from '../lib/parse-scenario';

interface Output {
  id: string;
  title: string;
  createdAt: string;
  pattern: {
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
  };
  markdown: string;
  result: {
    type: string;
    content: string;
  };
  metadata: {
    questionId: string;
    status: string;
  };
}

const SCENARIO_DIR = path.join(__dirname, '../../shadow-py/docs/scenario');
const OUTPUT_FILE = path.join(__dirname, '../constants/mock-outputs.ts');

function generateOutputs(): void {
  // 시나리오 파일 목록
  const scenarioFiles = [
    'scenario-01-pm-slack-response.md',
    'scenario-02-cs-support.md',
  ];

  const outputs: Output[] = scenarioFiles.map((filename, index) => {
    const filePath = path.join(SCENARIO_DIR, filename);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Scenario file not found: ${filePath}`);
    }

    const markdown = fs.readFileSync(filePath, 'utf-8');
    const parsed = parseScenario(markdown);

    // Pattern 생성
    const pattern = workflowToPattern(parsed.workflow);

    // ID 생성 (scenario-01 → 1)
    const id = String(index + 1);
    const questionId = filename.replace('.md', '');

    // Result content 생성
    const resultContent = parsed.agentSpec
      ? JSON.stringify(parsed.agentSpec, null, 2)
      : JSON.stringify({ error: 'No agent spec found' }, null, 2);

    return {
      id,
      title: parsed.title,
      createdAt: new Date().toISOString(),
      pattern,
      markdown: parsed.fullMarkdown,
      result: {
        type: 'json',
        content: resultContent,
      },
      metadata: {
        questionId,
        status: 'completed',
      },
    };
  });

  // TypeScript 파일 생성
  const outputContent = `import type { Output } from '@/types';

export const MOCK_OUTPUTS: Output[] = ${JSON.stringify(outputs, null, 2)};

export function getOutputById(id: string): Output | undefined {
  return MOCK_OUTPUTS.find((output) => output.id === id);
}
`;

  fs.writeFileSync(OUTPUT_FILE, outputContent, 'utf-8');
  console.log(`✅ Generated ${outputs.length} outputs to ${OUTPUT_FILE}`);
}

// 스크립트 실행
try {
  generateOutputs();
} catch (error) {
  console.error('❌ Failed to generate outputs:', error);
  process.exit(1);
}
