import { Metadata } from 'next';
import { OutputDashboardLayout } from '@/components/output-dashboard-layout';
import type { Output } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

// 임시 목업 데이터 (Phase 7에서 별도 파일로 분리 예정)
const MOCK_OUTPUT: Output = {
  id: '1',
  title: 'Q1: 사용자 행동 분석',
  createdAt: '2026-02-01T05:30:00Z',
  pattern: {
    nodes: [
      {
        id: '1',
        type: 'input',
        data: { label: 'Input: 사용자 데이터' },
        position: { x: 0, y: 0 },
      },
      {
        id: '2',
        type: 'default',
        data: { label: 'Transform: 데이터 정제' },
        position: { x: 0, y: 100 },
      },
      {
        id: '3',
        type: 'default',
        data: { label: 'Analyze: 패턴 분석' },
        position: { x: 0, y: 200 },
      },
      {
        id: '4',
        type: 'output',
        data: { label: 'Output: 분석 결과' },
        position: { x: 0, y: 300 },
      },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true },
      { id: 'e2-3', source: '2', target: '3', animated: true },
      { id: 'e3-4', source: '3', target: '4', animated: true },
    ],
  },
  markdown: `# 사용자 행동 분석

## 개요
사용자의 행동 패턴을 분석하여 주요 인사이트를 도출합니다.

## 주요 발견사항
- 사용자의 평균 세션 시간: **12분 30초**
- 가장 많이 사용하는 기능: **대시보드 조회** (42%)
- 이탈률이 높은 페이지: **설정 페이지** (65%)

## 권장사항
1. 설정 페이지의 UI/UX 개선
2. 대시보드 성능 최적화
3. 사용자 온보딩 프로세스 강화
`,
  result: {
    type: 'json',
    content: JSON.stringify({
      totalUsers: 1250,
      avgSessionTime: '12m 30s',
      topFeatures: [
        { name: 'Dashboard', usage: 42 },
        { name: 'Reports', usage: 28 },
        { name: 'Settings', usage: 15 },
      ],
      bounceRate: {
        dashboard: 12,
        reports: 18,
        settings: 65,
      },
    }),
  },
  metadata: {
    questionId: 'q1',
    status: 'completed',
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  // Phase 7에서 실제 데이터 조회로 교체 예정
  return {
    title: `Output ${id} - Shadow Dashboard`,
    description: 'Shadow-py 출력 결과 대시보드',
  };
}

export default async function OutputPage({ params }: PageProps) {
  const { id } = await params;

  // Phase 7에서 실제 데이터 조회 로직으로 교체 예정
  const output = MOCK_OUTPUT;

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">{output.title}</h1>
        <p className="text-sm text-muted-foreground">
          Created at: {new Date(output.createdAt).toLocaleString('ko-KR')}
        </p>
      </div>

      {/* Dashboard Layout */}
      <OutputDashboardLayout output={output} />
    </div>
  );
}
