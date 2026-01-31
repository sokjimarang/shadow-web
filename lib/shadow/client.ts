import { env } from '@/lib/env'

export interface ActionLabel {
  action_type: string
  target: string
  app: string
  description: string
}

export interface Pattern {
  count: number
  actions: ActionLabel[]
}

export interface PatternAnalysisResult {
  simple_patterns: Pattern[]
  sequence_patterns: Pattern[]
}

export interface SlackMessage {
  user_id: string
  channel_id: string
  text: string
  timestamp: string
}

export class ShadowClient {
  private baseUrl: string

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || env.shadowPy.apiUrl
  }

  async analyzePattern(messages: SlackMessage[]): Promise<PatternAnalysisResult> {
    // Mock 응답 - 실제 shadow-py API 호출 대신 더미 데이터 반환
    console.log('[Mock] Analyzing pattern for messages:', messages.length)

    // 더미 패턴 생성
    const mockPattern: Pattern = {
      count: 2,
      actions: [
        {
          action_type: 'message',
          target: 'Slack Channel',
          app: 'Slack',
          description: '반복적인 메시지 패턴 감지',
        },
      ],
    }

    return {
      simple_patterns: [mockPattern],
      sequence_patterns: [],
    }
  }

  async generateAgentSpec(patterns: Pattern[]): Promise<string> {
    // Mock 응답 - 실제 shadow-py API 호출 대신 더미 명세서 반환
    console.log('[Mock] Generating agent spec for patterns:', patterns.length)

    return `
# 에이전트 명세서 (Mock)

## 감지된 패턴
- 패턴 개수: ${patterns.length}

## 권장 자동화
- Slack 메시지 자동 응답
- 반복 작업 자동화

## 생성일
${new Date().toISOString()}
    `.trim()
  }

  // 실제 API 호출 (주석 처리된 예시)
  /*
  async analyzePattern(messages: SlackMessage[]): Promise<PatternAnalysisResult> {
    const response = await fetch(`${this.baseUrl}/api/analyze-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    })

    if (!response.ok) {
      throw new Error(`Shadow API error: ${response.statusText}`)
    }

    return response.json()
  }

  async generateAgentSpec(patterns: Pattern[]): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/generate-spec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ patterns }),
    })

    if (!response.ok) {
      throw new Error(`Shadow API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.spec
  }
  */
}

export const shadowClient = new ShadowClient()
