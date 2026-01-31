import type { Output } from '@/types';

export const MOCK_OUTPUTS: Output[] = [
  {
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
      content: JSON.stringify(
        {
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
        },
        null,
        2
      ),
    },
    metadata: {
      questionId: 'q1',
      status: 'completed',
    },
  },
  {
    id: '2',
    title: 'Q2: 워크플로우 자동화',
    createdAt: '2026-02-01T07:15:00Z',
    pattern: {
      nodes: [
        {
          id: '1',
          type: 'input',
          data: { label: 'Gmail: 새 이메일 수신' },
          position: { x: 0, y: 0 },
        },
        {
          id: '2',
          type: 'default',
          data: { label: 'Filter: 중요 이메일 필터링' },
          position: { x: 200, y: 0 },
        },
        {
          id: '3',
          type: 'default',
          data: { label: 'Slack: 알림 전송' },
          position: { x: 100, y: 100 },
        },
        {
          id: '4',
          type: 'output',
          data: { label: 'JIRA: 티켓 생성' },
          position: { x: 300, y: 100 },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', animated: true },
        { id: 'e2-3', source: '2', target: '3', animated: false },
        { id: 'e2-4', source: '2', target: '4', animated: false },
      ],
    },
    markdown: `# 워크플로우 자동화

## 개요
Gmail → Slack → JIRA 연동을 통한 자동화 워크플로우입니다.

## 처리 단계
1. Gmail에서 새 이메일 수신
2. 중요 키워드 필터링 ("긴급", "버그", "장애")
3. Slack 채널에 알림 전송
4. JIRA 티켓 자동 생성

## 성과
- **자동화된 티켓**: 152개
- **평균 처리 시간 단축**: 85%
- **놓친 이슈**: 0건
`,
    result: {
      type: 'html',
      content: `<div>
  <h2>자동화 통계</h2>
  <table border="1" style="width: 100%; border-collapse: collapse;">
    <thead>
      <tr>
        <th>메트릭</th>
        <th>값</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>총 처리된 이메일</td>
        <td>2,450</td>
      </tr>
      <tr>
        <td>생성된 JIRA 티켓</td>
        <td>152</td>
      </tr>
      <tr>
        <td>Slack 알림 전송</td>
        <td>152</td>
      </tr>
      <tr>
        <td>평균 처리 시간</td>
        <td>2.3초</td>
      </tr>
    </tbody>
  </table>
</div>`,
    },
    metadata: {
      questionId: 'q2',
      status: 'completed',
    },
  },
  {
    id: '3',
    title: 'Q3: 데이터 파이프라인 구축',
    createdAt: '2026-02-01T09:45:00Z',
    pattern: {
      nodes: [
        {
          id: '1',
          type: 'input',
          data: { label: 'Source: PostgreSQL' },
          position: { x: 0, y: 0 },
        },
        {
          id: '2',
          type: 'default',
          data: { label: 'ETL: 데이터 변환' },
          position: { x: 0, y: 100 },
        },
        {
          id: '3',
          type: 'default',
          data: { label: 'Load: BigQuery' },
          position: { x: 0, y: 200 },
        },
        {
          id: '4',
          type: 'output',
          data: { label: 'Visualize: Looker' },
          position: { x: 0, y: 300 },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', animated: true },
        { id: 'e2-3', source: '2', target: '3', animated: true },
        { id: 'e3-4', source: '3', target: '4', animated: true },
      ],
    },
    markdown: `# 데이터 파이프라인 구축

## 개요
PostgreSQL → BigQuery → Looker 데이터 파이프라인을 구축했습니다.

## 파이프라인 구성
- **Extract**: PostgreSQL에서 원본 데이터 추출
- **Transform**: 데이터 정제 및 변환
- **Load**: BigQuery에 적재
- **Visualize**: Looker 대시보드로 시각화

## 성과
- 일일 처리량: **500GB**
- 처리 시간: **평균 15분**
- 데이터 정확도: **99.8%**
`,
    result: {
      type: 'text',
      content: `Pipeline Execution Summary
==========================

Start Time: 2026-02-01 09:45:00 UTC
End Time:   2026-02-01 10:00:00 UTC
Duration:   15 minutes

Stages:
-------
1. Extract from PostgreSQL
   - Records extracted: 5,420,320
   - Duration: 5m 23s
   - Status: ✓ Success

2. Transform data
   - Records processed: 5,420,320
   - Records filtered: 12,450
   - Duration: 6m 12s
   - Status: ✓ Success

3. Load to BigQuery
   - Records loaded: 5,407,870
   - Duration: 3m 25s
   - Status: ✓ Success

4. Update Looker dashboard
   - Dashboards refreshed: 8
   - Duration: 18s
   - Status: ✓ Success

Overall Status: ✓ SUCCESS
Data Accuracy: 99.8%
`,
    },
    metadata: {
      questionId: 'q3',
      status: 'completed',
    },
  },
  {
    id: '4',
    title: 'Q4: AI 모델 학습 파이프라인',
    createdAt: '2026-02-01T11:20:00Z',
    pattern: {
      nodes: [
        {
          id: '1',
          type: 'input',
          data: { label: 'Input: 학습 데이터' },
          position: { x: 0, y: 0 },
        },
        {
          id: '2',
          type: 'default',
          data: { label: 'Preprocess: 데이터 전처리' },
          position: { x: 0, y: 100 },
        },
        {
          id: '3',
          type: 'default',
          data: { label: 'Train: 모델 학습' },
          position: { x: 0, y: 200 },
        },
        {
          id: '4',
          type: 'output',
          data: { label: 'Output: 학습 중...' },
          position: { x: 0, y: 300 },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', animated: true },
        { id: 'e2-3', source: '2', target: '3', animated: true },
        { id: 'e3-4', source: '3', target: '4', animated: true },
      ],
    },
    markdown: `# AI 모델 학습 파이프라인

## 개요
GPT-4 기반 커스텀 모델 학습 작업이 진행 중입니다.

## 진행 상황
- 현재 Epoch: **3/10**
- 학습 진행률: **30%**
- 예상 완료 시간: **약 2시간 남음**

## 현재 메트릭
- Training Loss: 0.425
- Validation Loss: 0.487
- Learning Rate: 0.0001

## 다음 단계
1. 학습 완료 대기
2. 모델 평가
3. 프로덕션 배포
`,
    result: {
      type: 'json',
      content: JSON.stringify(
        {
          status: 'training',
          currentEpoch: 3,
          totalEpochs: 10,
          progress: 30,
          metrics: {
            trainingLoss: 0.425,
            validationLoss: 0.487,
            learningRate: 0.0001,
          },
          estimatedTimeRemaining: '2h 15m',
        },
        null,
        2
      ),
    },
    metadata: {
      questionId: 'q4',
      status: 'processing',
    },
  },
  {
    id: '5',
    title: 'Q5: 서버 장애 분석 (실패)',
    createdAt: '2026-02-01T13:00:00Z',
    pattern: {
      nodes: [
        {
          id: '1',
          type: 'input',
          data: { label: 'Input: 로그 데이터' },
          position: { x: 0, y: 0 },
        },
        {
          id: '2',
          type: 'default',
          data: { label: 'Parse: 로그 파싱' },
          position: { x: 0, y: 100 },
        },
        {
          id: '3',
          type: 'default',
          data: { label: 'Analyze: 에러 패턴 분석' },
          position: { x: 0, y: 200 },
        },
        {
          id: '4',
          type: 'output',
          data: { label: 'Output: 실패' },
          position: { x: 0, y: 300 },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', animated: false },
        { id: 'e2-3', source: '2', target: '3', animated: false },
        { id: 'e3-4', source: '3', target: '4', animated: false },
      ],
    },
    markdown: `# 서버 장애 분석 (실패)

## 문제 상황
로그 파일 파싱 중 오류가 발생하여 분석이 중단되었습니다.

## 에러 메시지
\`\`\`
ParseError: Invalid log format at line 12,450
Expected format: [TIMESTAMP] [LEVEL] [MESSAGE]
Got: 2026-02-01 malformed log entry
\`\`\`

## 조치 사항
1. 로그 포맷 검증 로직 추가 필요
2. 에러 핸들링 개선
3. 파싱 재시도
`,
    result: {
      type: 'text',
      content: `ERROR: Analysis Failed

Timestamp: 2026-02-01 13:00:45 UTC
Error Code: PARSE_ERROR_001
Stage: Log Parsing

Details:
--------
Failed to parse log file at line 12,450
Expected format: [TIMESTAMP] [LEVEL] [MESSAGE]
Received malformed entry: "2026-02-01 malformed log entry"

Stack Trace:
  at LogParser.parseLine (parser.ts:145)
  at LogParser.processFile (parser.ts:89)
  at AnalysisPipeline.run (pipeline.ts:234)

Recommendation:
- Validate log format before analysis
- Add error handling for malformed entries
- Implement retry mechanism
`,
    },
    metadata: {
      questionId: 'q5',
      status: 'failed',
    },
  },
];

export function getOutputById(id: string): Output | undefined {
  return MOCK_OUTPUTS.find((output) => output.id === id);
}
