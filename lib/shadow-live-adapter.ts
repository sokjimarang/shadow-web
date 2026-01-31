/**
 * shadow-py 데이터를 shadow-web Output 타입으로 변환하는 어댑터
 */

import type { Output, PatternNode, PatternEdge } from '@/types';
import type {
  RecordingStatus,
  ShadowPyLabel,
  ShadowPyPattern,
} from '@/types/shadow-live';

/**
 * ShadowPyLabel 배열을 ReactFlow nodes/edges로 변환
 */
export function convertLabelsToPattern(labels: ShadowPyLabel[]): {
  nodes: PatternNode[];
  edges: PatternEdge[];
} {
  if (!labels || labels.length === 0) {
    return { nodes: [], edges: [] };
  }

  const nodes: PatternNode[] = labels.map((label, index) => {
    let nodeType: 'input' | 'output' | 'default' = 'default';
    if (index === 0) {
      nodeType = 'input';
    } else if (index === labels.length - 1) {
      nodeType = 'output';
    }

    return {
      id: `label_${index}`,
      type: nodeType,
      data: {
        label: label.semantic_label || label.action_type,
        app: label.app,
      },
      position: {
        x: 250,
        y: index * 100,
      },
    };
  });

  const edges: PatternEdge[] = [];
  for (let i = 0; i < labels.length - 1; i++) {
    edges.push({
      id: `e${i}-${i + 1}`,
      source: `label_${i}`,
      target: `label_${i + 1}`,
      animated: true,
    });
  }

  return { nodes, edges };
}

/**
 * ShadowPyPattern 배열을 Markdown 문서로 변환
 */
export function convertPatternsToMarkdown(
  patterns: ShadowPyPattern[]
): string {
  if (!patterns || patterns.length === 0) {
    return '# 분석 결과\n\n아직 패턴이 감지되지 않았습니다.';
  }

  let markdown = '# 감지된 패턴\n\n';

  patterns.forEach((pattern, index) => {
    markdown += `## ${index + 1}. ${pattern.name}\n\n`;
    markdown += `**설명:** ${pattern.description}\n\n`;
    markdown += `**신뢰도:** ${(pattern.confidence * 100).toFixed(1)}%\n\n`;
    markdown += `**발생 횟수:** ${pattern.count}회\n\n`;

    if (pattern.actions && pattern.actions.length > 0) {
      markdown += '### 주요 액션\n\n';
      pattern.actions.forEach((action, actionIndex) => {
        markdown += `${actionIndex + 1}. **${action.semantic_label}**\n`;
        markdown += `   - 앱: ${action.app}\n`;
        markdown += `   - 타입: ${action.action_type}\n`;
        markdown += `   - 신뢰도: ${(action.confidence * 100).toFixed(1)}%\n\n`;
      });
    }

    if (pattern.uncertainties && pattern.uncertainties.length > 0) {
      markdown += '### 불확실성\n\n';
      pattern.uncertainties.forEach((uncertainty, uIndex) => {
        markdown += `${uIndex + 1}. **${uncertainty.type}**\n`;
        markdown += `   - 설명: ${uncertainty.description}\n`;
        markdown += `   - 가설: ${uncertainty.hypothesis}\n\n`;
      });
    }

    markdown += '---\n\n';
  });

  return markdown;
}

/**
 * shadow-py 데이터를 Output 타입으로 변환
 */
export function convertToOutput(
  recordingStatus: RecordingStatus,
  labels: ShadowPyLabel[],
  patterns: ShadowPyPattern[]
): Output {
  const { nodes, edges } = convertLabelsToPattern(labels);
  const markdown = convertPatternsToMarkdown(patterns);

  const hasLabels = labels.length > 0;

  const resultContent = hasLabels
    ? JSON.stringify(
        labels.map((l) => ({
          action: l.semantic_label,
          app: l.app,
          confidence: l.confidence,
        })),
        null,
        2
      )
    : '아직 분석된 데이터가 없습니다.';

  return {
    id: 'live',
    title: 'Live Analysis',
    createdAt: new Date().toISOString(),
    pattern: {
      nodes,
      edges,
    },
    markdown,
    result: {
      type: hasLabels ? 'json' : 'text',
      content: resultContent,
    },
    metadata: {
      status: recordingStatus.is_recording
        ? 'processing'
        : recordingStatus.has_session
          ? 'completed'
          : 'pending',
      frameCount: recordingStatus.frame_count,
      eventCount: recordingStatus.event_count,
      duration: recordingStatus.duration,
    },
  };
}
