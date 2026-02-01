'use client';

import {
  GitBranch,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Clock,
  Layers,
} from 'lucide-react';

// 통계 데이터
const analyticsData = {
  collection: {
    period: '2026.01.15 - 2026.01.31',
    sessions: 47,
    events: 1284,
    avgTime: '4분 12초',
    confidence: 94.2,
  },
  appUsage: [
    { name: 'Slack', percentage: 24.8, time: '18분 32초' },
    { name: 'JIRA', percentage: 19.2, time: '14분 17초' },
    { name: 'Google Drive', percentage: 15.7, time: '11분 04초' },
    { name: 'Chrome', percentage: 12.4, time: '9분 08초' },
    { name: 'Notion', percentage: 8.3, time: '6분 12초' },
    { name: '기타', percentage: 19.6, time: '14분 28초' },
  ],
  questionTypes: [
    { type: '스펙 확인', count: 127, percentage: 58.5 },
    { type: '일정 문의', count: 56, percentage: 25.8 },
    { type: '담당자 확인', count: 21, percentage: 9.7 },
    { type: '기타', count: 13, percentage: 6.0 },
  ],
  branches: {
    sufficiency: [
      { label: '충분 → 답변', value: 77.4 },
      { label: '불충분 → 추가검색', value: 22.6 },
    ],
    quality: [
      { label: '통과 → 전송', value: 87.1 },
      { label: '미흡 → 수정', value: 12.9 },
    ],
  },
  exceptions: [
    { type: '다중 매칭 (3건+)', count: 23, percentage: 10.6, action: 'PM 선택 요청' },
    { type: '검색 결과 0건', count: 12, percentage: 5.5, action: 'PM 확인 요청' },
    { type: '오래된 문서', count: 8, percentage: 3.7, action: '최신 여부 확인' },
    { type: '긴급/장애', count: 4, percentage: 1.8, action: '즉시 에스컬레이션' },
    { type: '기밀 문서', count: 2, percentage: 0.9, action: 'PM 승인 대기' },
  ],
  rules: [
    { name: 'JIRA 링크 필수 포함', observations: 217, consistency: 100, status: 'confirmed' as const },
    { name: '핵심 내용 요약 포함', observations: 217, consistency: 100, status: 'confirmed' as const },
    { name: '스펙→JIRA+Drive 병렬 검색', observations: 127, consistency: 98.4, status: 'confirmed' as const },
    { name: '스펙 질문에 Drive 링크', observations: 124, consistency: 97.6, status: 'confirmed' as const },
    { name: '기능명+동작 키워드 추출', observations: 203, consistency: 96.1, status: 'confirmed' as const },
    { name: '긴급/장애 에스컬레이션', observations: 4, consistency: 100, status: 'inferred' as const },
    { name: '6개월+ 문서 최신 확인', observations: 8, consistency: 87.5, status: 'inferred' as const },
  ],
  confidence: {
    overall: 94.2,
    details: [
      { label: '패턴 일관성', value: 96.8 },
      { label: '규칙 커버리지', value: 92.1 },
      { label: '예외 처리', value: 89.4 },
      { label: '사용자 확인', value: 85.7 },
    ],
  },
};

// 원형 프로그레스 (도넛 차트)
function CircularProgress({
  value,
  size = 100,
  strokeWidth = 6,
  color = '#22D3EE',
  bgColor = '#E5E7EB',
  label,
  fontSize = 'text-xl',
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  label?: string;
  fontSize?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={bgColor}
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${fontSize} font-bold text-primary`}>{value}<span className="text-sm">%</span></span>
        </div>
      </div>
      {label && (
        <span className="mt-2 text-xs text-muted-foreground">{label}</span>
      )}
    </div>
  );
}

// 섹션 타이틀
function SectionTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 text-base font-semibold text-primary mb-6">
      <Icon className="w-5 h-5 text-primary" />
      {children}
    </h3>
  );
}

// 통계 카드
function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subValue?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-border">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary-lighter">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-bold text-primary">{value}</p>
          {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
        </div>
      </div>
    </div>
  );
}

// 앱 사용 비율
function AppUsageChart() {
  const { appUsage } = analyticsData;

  return (
    <div className="bg-muted/50 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-primary mb-5">앱 사용 비율</h3>
      <div className="space-y-3">
        {appUsage.map((app, index) => (
          <div key={app.name} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-primary">{app.name}</span>
                <span className="text-sm font-medium text-primary">{app.percentage}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 bg-primary"
                  style={{
                    width: `${app.percentage}%`,
                    opacity: 1 - index * 0.12,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 질문 유형 분포
function QuestionTypeChart() {
  const { questionTypes } = analyticsData;
  const maxPercentage = Math.max(...questionTypes.map(q => q.percentage));

  return (
    <div className="bg-muted/50 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-primary mb-5">질문 유형 분포</h3>
      <div className="flex items-end justify-around h-40">
        {questionTypes.map((item, index) => (
          <div key={item.type} className="flex flex-col items-center">
            <span className="text-xs font-medium text-primary mb-2">{item.percentage}%</span>
            <div
              className="w-12 rounded-t-lg transition-all duration-1000 bg-primary"
              style={{
                height: `${(item.percentage / maxPercentage) * 100}px`,
                opacity: 1 - index * 0.2,
              }}
            />
            <span className="mt-3 text-xs text-muted-foreground text-center">{item.type}</span>
            <span className="text-[10px] text-muted-foreground">{item.count}건</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 분기 통계 테이블
function BranchStatsTable() {
  const { branches } = analyticsData;

  return (
    <div className="space-y-6">
      {/* 정보 충분성 판단 */}
      <div className="border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 bg-muted/50 border-b border-border">
          <span className="text-sm text-muted-foreground">정보 충분성 판단</span>
        </div>
        <div className="divide-y divide-border">
          {branches.sufficiency.map((item) => (
            <div key={item.label} className="flex items-center justify-between px-6 py-4 bg-white">
              <span className="text-sm text-primary">{item.label}</span>
              <span className="text-sm font-medium text-primary">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* 답변 품질 검증 */}
      <div className="border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 bg-muted/50 border-b border-border">
          <span className="text-sm text-muted-foreground">답변 품질 검증</span>
        </div>
        <div className="divide-y divide-border">
          {branches.quality.map((item) => (
            <div key={item.label} className="flex items-center justify-between px-6 py-4 bg-white">
              <span className="text-sm text-primary">{item.label}</span>
              <span className="text-sm font-medium text-primary">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 예외 상황 테이블
function ExceptionsTable() {
  const { exceptions } = analyticsData;

  return (
    <div className="space-y-3">
      {exceptions.map((exc) => (
        <div
          key={exc.type}
          className="flex items-center justify-between px-5 py-4 bg-white border border-border rounded-xl"
        >
          <span className="text-sm text-primary">{exc.type}</span>
          <div className="flex items-center gap-6">
            <span className="text-sm text-muted-foreground">{exc.count}회 ({exc.percentage}%)</span>
            <span className="text-sm text-muted-foreground min-w-[120px] text-right">{exc.action}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// 규칙 확정 현황 테이블
function RulesTable() {
  const { rules } = analyticsData;

  return (
    <div className="space-y-3">
      {rules.map((rule) => (
        <div
          key={rule.name}
          className="flex items-center justify-between px-5 py-4 bg-white border border-border rounded-xl"
        >
          <div className="flex items-center gap-3">
            {rule.status === 'confirmed' ? (
              <CheckCircle2 className="w-5 h-5 text-primary" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
            )}
            <span className="text-sm text-primary">{rule.name}</span>
          </div>
          <div className="flex items-center gap-8">
            <span className="text-sm text-muted-foreground min-w-[60px] text-right">{rule.observations}회</span>
            <span className="text-sm font-medium text-primary min-w-[60px] text-right">{rule.consistency}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// 메인 대시보드 컴포넌트
export function PatternAnalyticsDashboard() {
  return (
    <div className="space-y-12 py-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">행동 패턴 분석</h2>
          <p className="text-sm text-muted-foreground mt-1">{analyticsData.collection.period}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">신뢰도</span>
          <span className="px-4 py-2 bg-primary-lighter text-primary rounded-full text-sm font-semibold">
            {analyticsData.collection.confidence}%
          </span>
        </div>
      </div>

      {/* 상단 영역: 통계 카드 */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Activity} label="총 세션" value={`${analyticsData.collection.sessions}회`} />
        <StatCard icon={Layers} label="총 이벤트" value={analyticsData.collection.events.toLocaleString()} />
        <StatCard icon={Clock} label="평균 처리 시간" value={analyticsData.collection.avgTime} />
        <div className="bg-primary rounded-2xl p-5 text-white">
          <p className="text-xs text-primary-light">종합 신뢰도</p>
          <p className="text-3xl font-bold mt-1">{analyticsData.collection.confidence}%</p>
        </div>
      </div>

      {/* 앱 사용 비율 + 질문 유형 분포 */}
      <div className="grid grid-cols-2 gap-6">
        <AppUsageChart />
        <QuestionTypeChart />
      </div>

      {/* 분기 발생 통계 */}
      <div>
        <SectionTitle icon={GitBranch}>분기 발생 통계</SectionTitle>
        <BranchStatsTable />
      </div>

      {/* 예외 상황 */}
      <div>
        <SectionTitle icon={AlertTriangle}>예외 상황</SectionTitle>
        <ExceptionsTable />
      </div>

      {/* 규칙 확정 현황 */}
      <div>
        <SectionTitle icon={CheckCircle2}>규칙 확정 현황</SectionTitle>
        <RulesTable />
      </div>

      {/* 종합 신뢰도 */}
      <div className="p-8 bg-muted/50 rounded-2xl">
        <h3 className="text-base font-semibold text-primary mb-8">종합 신뢰도</h3>
        <div className="flex items-center gap-12">
          <CircularProgress
            value={analyticsData.confidence.overall}
            size={140}
            strokeWidth={10}
            color="hsl(222, 25%, 25%)"
            bgColor="hsl(222, 15%, 85%)"
          />
          <div className="flex-1 space-y-5">
            {analyticsData.confidence.details.map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-28">{item.label}</span>
                <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-1000"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-primary w-14 text-right">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
