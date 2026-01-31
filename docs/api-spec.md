# Shadow API 명세서

## 1. 개요

Shadow는 화면 관찰 → 패턴 분석 → HITL 질문 → 명세서 생성 파이프라인을 구현합니다.

### 1.1 시스템 아키텍처

```
[shadow-py (Python)]              [shadow-web (TypeScript/Next.js)]
────────────────────              ──────────────────────────────────
- 화면 캡처                        - Slack Events 수신
- 마우스 이벤트                    - Slack 메시지 송신 (TODO)
- VLM 행동 라벨링                  - DB 저장 (Supabase)
- LLM 패턴 감지                    - 웹 대시보드 (TODO)
- HITL 질문 생성
        │
        └──────→ REST API ──────→ shadow-web
```

### 1.2 기술 스택

| 구분 | 기술 | 용도 |
|------|------|------|
| Backend | Next.js 14 (App Router) | API Routes |
| Database | Supabase (PostgreSQL) | 이벤트 저장 |
| Slack | Slack Events API | 이벤트 수신 |
| Language | TypeScript | 타입 안전성 |

---

## 2. Slack Bot API

### 2.1 엔드포인트 개요

| 엔드포인트 | 메서드 | 설명 | 구현 상태 |
|-----------|--------|------|----------|
| `/api/slack/events` | POST | Slack Events 수신 | ✅ 완료 |

### 2.2 이벤트 수신 (POST /api/slack/events)

Slack Events API로부터 이벤트를 수신하고 처리합니다.

#### 요청 헤더

```http
POST /api/slack/events HTTP/1.1
Content-Type: application/json
X-Slack-Signature: v0=a2114d57b48eac39b9ad189dd8316235a7...
X-Slack-Request-Timestamp: 1531420618
```

| 헤더 | 필수 | 설명 |
|------|------|------|
| `X-Slack-Signature` | ✅ | Slack 서명 (HMAC-SHA256) |
| `X-Slack-Request-Timestamp` | ✅ | 요청 타임스탬프 (Unix epoch) |

#### 요청 타입

```typescript
// URL Verification (앱 초기 설정 시)
interface SlackUrlVerification {
  type: 'url_verification'
  challenge: string
  token: string
}

// Event Callback (일반 이벤트)
interface SlackEventCallback {
  type: 'event_callback'
  event: SlackEvent
  event_id: string
  event_time: number
  team_id: string
}

interface SlackEvent {
  type: string          // 'message', 'app_mention' 등
  user?: string         // 사용자 ID (예: 'U1234567890')
  channel?: string      // 채널 ID (예: 'C1234567890')
  text?: string         // 메시지 텍스트
  ts?: string           // 메시지 타임스탬프 (예: '1234567890.123456')
  subtype?: string      // 'bot_message' 등
  bot_id?: string       // 봇 ID (봇 메시지인 경우)
}
```

#### 응답

```typescript
// URL Verification 응답
interface UrlVerificationResponse {
  challenge: string
}

// 성공 응답
interface SuccessResponse {
  ok: true
}

// 에러 응답
interface ErrorResponse {
  error: string
}
```

#### 상태 코드

| 코드 | 설명 |
|------|------|
| 200 | 성공 |
| 401 | 서명 검증 실패 |
| 500 | 서버 에러 (DB 저장 실패 등) |

#### 처리 흐름

```
1. 서명 검증 (X-Slack-Signature)
   └─ 실패 시 401 반환

2. Payload 파싱
   ├─ type === 'url_verification' → challenge 반환
   └─ type === 'event_callback' → 이벤트 처리

3. 이벤트 처리
   ├─ 봇 메시지 무시 (bot_id 또는 subtype === 'bot_message')
   └─ message 이벤트 → DB 저장 → shadow-py API 호출
```

#### 구현 코드

```typescript
// app/api/slack/events/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifySlackSignature } from '@/lib/slack/verify-signature'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('x-slack-signature')
  const timestamp = request.headers.get('x-slack-request-timestamp')

  // 서명 검증
  const isValid = verifySlackSignature({
    signingSecret: env.slack.signingSecret,
    requestSignature: signature!,
    requestTimestamp: timestamp!,
    body,
  })

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = JSON.parse(body)

  // URL verification
  if (payload.type === 'url_verification') {
    return NextResponse.json({ challenge: payload.challenge })
  }

  // Event callback
  if (payload.type === 'event_callback') {
    const event = payload.event

    // 봇 메시지 무시
    if (event.bot_id || event.subtype === 'bot_message') {
      return NextResponse.json({ ok: true })
    }

    // message 이벤트 처리
    if (event.type === 'message') {
      await supabase.from('slack_events').insert({
        event_type: event.type,
        user_id: event.user,
        channel_id: event.channel,
        payload: event,
      })
    }
  }

  return NextResponse.json({ ok: true })
}
```

### 2.3 서명 검증

Slack 요청의 진위성을 검증합니다.

```typescript
// lib/slack/verify-signature.ts
interface VerifySignatureOptions {
  signingSecret: string
  requestSignature: string
  requestTimestamp: string
  body: string
}

function verifySlackSignature(options: VerifySignatureOptions): boolean {
  // 1. Timestamp 검증 (5분 이내 요청만 허용)
  const timestamp = parseInt(requestTimestamp, 10)
  const currentTime = Math.floor(Date.now() / 1000)
  if (Math.abs(currentTime - timestamp) > 60 * 5) {
    return false
  }

  // 2. 서명 생성 및 비교
  const sigBasestring = `v0:${requestTimestamp}:${body}`
  const mySignature = `v0=${crypto
    .createHmac('sha256', signingSecret)
    .update(sigBasestring, 'utf8')
    .digest('hex')}`

  // 3. 타이밍 공격 방지를 위한 안전한 비교
  return crypto.timingSafeEqual(
    Buffer.from(mySignature, 'utf8'),
    Buffer.from(requestSignature, 'utf8')
  )
}
```

### 2.4 메시지 전송 (TODO: F-07)

> ⚠️ **미구현**: HITL 질문을 Slack DM으로 전송하는 기능

#### 구현 예정 인터페이스

```typescript
// lib/slack/send-message.ts (예정)
import { WebClient } from '@slack/web-api'

interface SendHitlQuestionOptions {
  userId: string
  questionText: string
  options: Array<{
    id: string
    label: string
  }>
}

async function sendHitlQuestion(options: SendHitlQuestionOptions): Promise<string> {
  const client = new WebClient(env.slack.botToken)

  const result = await client.chat.postMessage({
    channel: options.userId,  // DM은 user ID를 channel로 사용
    text: options.questionText,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: options.questionText,
        },
      },
      {
        type: 'actions',
        elements: options.options.map((opt) => ({
          type: 'button',
          text: {
            type: 'plain_text',
            text: opt.label,
          },
          action_id: `hitl_${opt.id}`,
          value: opt.id,
        })),
      },
    ],
  })

  return result.ts!  // 메시지 타임스탬프 반환
}
```

#### Block Kit 구조 (예정)

```json
{
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "🤔 *확인이 필요합니다*\n\n금액이 100만원을 초과하면 상사에게 확인을 받으시는 것 같은데, 맞나요?"
      }
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": { "type": "plain_text", "text": "✅ 네, 맞아요" },
          "action_id": "hitl_confirm",
          "value": "confirm",
          "style": "primary"
        },
        {
          "type": "button",
          "text": { "type": "plain_text", "text": "❌ 아니에요" },
          "action_id": "hitl_deny",
          "value": "deny",
          "style": "danger"
        }
      ]
    }
  ]
}
```

### 2.5 Block Actions 핸들러 (TODO: F-08)

> ⚠️ **미구현**: Slack 버튼 클릭 이벤트 처리

#### 구현 예정 내용

`/api/slack/events` 엔드포인트에서 `block_actions` 타입 처리 추가 필요:

```typescript
// app/api/slack/events/route.ts (추가 예정)
interface SlackInteractionPayload {
  type: 'block_actions'
  user: {
    id: string
    username: string
  }
  actions: Array<{
    action_id: string
    value: string
    block_id: string
  }>
  response_url: string
  trigger_id: string
}

// block_actions 처리
if (payload.type === 'block_actions') {
  const action = payload.actions[0]

  if (action.action_id.startsWith('hitl_')) {
    // HITL 응답 처리
    await supabase.from('hitl_responses').insert({
      user_id: payload.user.id,
      action_id: action.action_id,
      value: action.value,
    })

    // 응답 확인 메시지 업데이트
    await fetch(payload.response_url, {
      method: 'POST',
      body: JSON.stringify({
        text: '✅ 응답이 기록되었습니다.',
        replace_original: true,
      }),
    })
  }
}
```

---

## 3. 데이터베이스 스키마

### 3.1 slack_events 테이블

Slack 이벤트 로그를 저장합니다.

```sql
CREATE TABLE slack_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,           -- 'message', 'app_mention' 등
  user_id TEXT,                       -- Slack 사용자 ID
  channel_id TEXT,                    -- Slack 채널 ID
  payload JSONB NOT NULL,             -- 원본 이벤트 JSON
  processed BOOLEAN NOT NULL DEFAULT FALSE,  -- 처리 완료 여부
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX slack_events_event_type_idx ON slack_events(event_type);
CREATE INDEX slack_events_user_id_idx ON slack_events(user_id);
CREATE INDEX slack_events_processed_idx ON slack_events(processed);
CREATE INDEX slack_events_created_at_idx ON slack_events(created_at DESC);
```

### 3.2 RLS 정책

```sql
-- Row Level Security 활성화
ALTER TABLE slack_events ENABLE ROW LEVEL SECURITY;

-- 읽기 허용
CREATE POLICY "Anyone can view slack events"
  ON slack_events FOR SELECT
  USING (true);

-- 삽입 허용
CREATE POLICY "Service can insert slack events"
  ON slack_events FOR INSERT
  WITH CHECK (true);
```

---

## 4. 환경변수

### 4.1 필수 환경변수

```bash
# Slack
SLACK_BOT_TOKEN=xoxb-...          # Bot User OAuth Token
SLACK_SIGNING_SECRET=...          # Signing Secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 4.2 선택 환경변수

```bash
# Slack (Socket Mode 사용 시)
SLACK_APP_TOKEN=xapp-...          # App-Level Token

# Shadow-py API
SHADOW_PY_API_URL=http://127.0.0.1:8000
```

### 4.3 환경변수 검증

```typescript
// lib/env.ts
export function validateEnv() {
  const required = {
    SLACK_BOT_TOKEN: env.slack.botToken,
    SLACK_SIGNING_SECRET: env.slack.signingSecret,
    NEXT_PUBLIC_SUPABASE_URL: env.supabase.url,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: env.supabase.anonKey,
  }

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}
```

---

## 5. PRD 기능 매핑

### 5.1 구현 상태

| 기능 ID | 기능 | 담당 | 구현 상태 |
|---------|------|------|----------|
| F-01 | 화면 캡처 | shadow-py | - |
| F-02 | 마우스 이벤트 캡처 | shadow-py | - |
| F-03 | 활성 윈도우 정보 | shadow-py | - |
| F-04 | 행동 라벨링 (VLM) | shadow-py | - |
| F-05 | 패턴 감지 (LLM) | shadow-py | - |
| F-06 | HITL 질문 생성 | shadow-py | - |
| **F-07** | **Slack 메시지 송신** | **shadow-web** | **❌ TODO** |
| **F-08** | **Slack 응답 수신** | **shadow-web** | **❌ TODO** |
| F-09 | 명세서 생성 | shadow-py | - |
| F-10 | CLI 시작/중지 | shadow-py | - |

### 5.2 shadow-web 추가 구현 사항

| 기능 | 설명 | 파일 |
|------|------|------|
| Slack 이벤트 수신 | Events API 핸들러 | `app/api/slack/events/route.ts` ✅ |
| 서명 검증 | HMAC-SHA256 검증 | `lib/slack/verify-signature.ts` ✅ |
| DB 저장 | Supabase 연동 | `route.ts` ✅ |
| Slack 메시지 송신 | chat.postMessage | `lib/slack/send-message.ts` ❌ TODO |
| Block Actions 처리 | 버튼 클릭 핸들러 | `route.ts` 수정 필요 ❌ TODO |

---

## 6. Slack 앱 설정 가이드

### 6.1 필요한 OAuth Scopes

**Bot Token Scopes:**
- `chat:write` - 메시지 전송
- `im:write` - DM 전송
- `im:history` - DM 읽기

### 6.2 Event Subscriptions

**Request URL:**
```
https://<your-domain>/api/slack/events
```

**Subscribe to bot events:**
- `message.im` - DM 메시지 수신

### 6.3 Interactivity & Shortcuts

**Request URL:**
```
https://<your-domain>/api/slack/events
```

> 동일한 엔드포인트에서 Events와 Interactivity 모두 처리

---

## Changelog

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0 | 2026-01-31 | 초안 작성 - TypeScript/Next.js 기반 |
