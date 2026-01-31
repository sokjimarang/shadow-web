import { slackClient } from './client'
import type { InteractiveQuestionPayload } from '@/types/slack'

export async function sendExampleInteractiveQuestion(channel: string) {
  const payload: InteractiveQuestionPayload = {
    trigger_type: 'anomaly_detection',
    confidence: 0.85,
    question: {
      title: '평소와 다른 패턴 감지',
      context: {
        usual_pattern: 'A→B→C',
        current_pattern: 'A→D→C',
      },
      options: ['의도적', '실수', '도구 제약'],
      priority: 'medium',
    },
    session_id: `session_${Date.now()}`,
  }

  await slackClient.sendInteractiveQuestion(channel, payload)
  console.log('[Example] Interactive question sent to', channel)
}

export async function sendExampleAgentSpec(
  channel: string,
  format: 'text' | 'file' = 'text'
) {
  const spec = `
# 에이전트 명세서: 경비 처리 자동화

## 기본 정보
- 생성일: ${new Date().toISOString()}
- 학습 기간: 2025-01-20 ~ 2025-01-30
- 총 관찰 세션: 47회
- HITL 질문/답변: 23건

## 감지된 패턴
1. **경비 영수증 업로드**
   - 빈도: 주 3회
   - 패턴: 사진 촬영 → 구글 드라이브 업로드 → 링크 복사

2. **경비 신청서 작성**
   - 빈도: 주 3회
   - 패턴: 스프레드시트 열기 → 행 추가 → 항목 입력

## 자동화 제안
- 영수증 사진을 자동으로 구글 드라이브에 업로드
- OCR로 금액/날짜 자동 추출
- 스프레드시트에 자동 기입
  `.trim()

  await slackClient.sendAgentSpec({
    channel,
    spec,
    format,
    filename: 'agent_spec_expense.md',
  })

  console.log(`[Example] Agent spec sent to ${channel} (format: ${format})`)
}
