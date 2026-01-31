# Shadow Web

Shadow AI 에이전트의 웹 대시보드 및 API 서버

Next.js + TypeScript + Tailwind CSS v4 + Supabase + TanStack Query + Zustand

## 프로젝트 개요

Shadow Web은 **Shadow 에이전트 시스템의 프론트엔드, 백엔드, 데이터베이스를 담당**하는 풀스택 프로젝트입니다.

### Shadow 전체 아키텍처

```
┌─────────────┐
│   Slack     │  Slack Bot으로 사용자 인터랙션
│   Bot       │
└──────┬──────┘
       │ webhook
       ↓
┌─────────────────────────────────┐
│  shadow-web (이 프로젝트)       │
│  ┌───────────────────────────┐  │
│  │ 프론트엔드 (React)        │  │  대시보드, 분석 결과 시각화
│  │  - Next.js 15            │  │
│  │  - TanStack Query        │  │
│  │  - Tailwind CSS v4       │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ 백엔드 (API Routes)       │  │  Slack 연동, 비즈니스 로직
│  │  - app/api/slack/        │  │  ← Webhook, Commands
│  │  - app/api/analyze/      │  │  ← 분석 요청 처리
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ 데이터베이스 (Supabase)   │  │  데이터 저장 및 관리
│  │  - PostgreSQL            │  │
│  │  - Storage               │  │  ← 녹화 파일, 스크린샷
│  │  - Auth                  │  │
│  │  - RLS                   │  │
│  └───────────────────────────┘  │
└─────────────┬───────────────────┘
              │ HTTP API 호출
              ↓
┌─────────────────────────────────┐
│  shadow-py (별도 프로젝트)      │  AI 분석 엔진
│  - 화면 녹화 + 입력 추적        │
│  - Vision AI 분석 (Claude/Gemini)│
│  - 반복 패턴 감지               │
│  - FastAPI로 API 제공           │
└─────────────────────────────────┘
```

### 역할 분담

| 프로젝트 | 역할 | 기술 스택 |
|---------|------|----------|
| **shadow-web** (이 프로젝트) | 웹 UI + API 서버 + DB | Next.js, Supabase, TypeScript |
| **shadow-py** | AI 분석 엔진 | Python, FastAPI, Claude/Gemini |

## 기술 스택

- **Next.js 15** - React 프레임워크 (App Router)
- **TypeScript** - 타입 안정성
- **Tailwind CSS v4** - 유틸리티 기반 CSS 프레임워크
- **Supabase** - Backend as a Service (Database + Storage + Auth)
- **TanStack Query v5** - 서버 상태 관리
- **Zustand** - 클라이언트 상태 관리
- **pnpm** - 패키지 매니저

## 디렉토리 구조

```
shadow-web/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx           # 대시보드 메인 페이지
│   ├── globals.css
│   └── api/               # API Routes (백엔드)
│       ├── slack/         # Slack Bot 연동
│       │   ├── webhook/   # Slack 이벤트 수신
│       │   └── commands/  # Slash Commands
│       └── analyze/       # shadow-py 연동 API
├── components/            # 재사용 컴포넌트
│   └── dashboard/         # 대시보드 컴포넌트
├── lib/
│   ├── supabase.ts       # Supabase 클라이언트
│   └── services/         # 비즈니스 로직
│       └── shadow-py.ts  # shadow-py API 호출
├── store/                # Zustand stores
├── types/                # TypeScript 타입 정의
│   ├── slack.ts          # Slack 타입
│   └── shadow.ts         # Shadow AI 타입
├── constants/            # 상수 관리
│   └── index.ts
├── supabase/
│   ├── migrations/       # DB 마이그레이션
│   │   └── 001_initial.sql  # 초기 스키마
│   └── config.toml
└── public/               # 정적 파일
```

## 주요 기능

### 1. 프론트엔드 (React/Next.js)
- 분석 결과 대시보드
- 패턴 시각화
- 에이전트 설정 UI
- 세션 히스토리

### 2. 백엔드 (Next.js API Routes)
- **Slack Bot 연동**
  - Webhook 이벤트 수신 (`/api/slack/webhook`)
  - Slash Commands 처리 (`/api/slack/commands`)
- **Shadow AI 통합**
  - shadow-py API 호출 (`/api/analyze`)
  - 분석 결과 저장 및 조회
- **비즈니스 로직**
  - 세션 관리
  - 사용자 권한 제어

### 3. 데이터베이스 (Supabase)
- **PostgreSQL 테이블**
  - `sessions`: 녹화 세션 정보
  - `analysis_results`: AI 분석 결과
  - `patterns`: 감지된 패턴
  - `slack_events`: Slack 이벤트 로그
- **Storage**
  - 녹화 파일 저장
  - 스크린샷 저장
- **RLS (Row Level Security)**
  - 사용자별 데이터 접근 제어

## 시작하기

### 1. 패키지 설치

```bash
pnpm install
```

### 2. Supabase 로컬 환경 설정

Docker Desktop을 실행한 후:

```bash
# Supabase CLI 설치 (Mac)
brew install supabase/tap/supabase

# Supabase 초기화
supabase init

# 로컬 Supabase 시작
supabase start
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 입력:

```bash
# Supabase Configuration
# 로컬 개발
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase status에서 확인한 anon key>

# 프로덕션 (Vercel 배포 시)
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-publishable-key

# Slack Bot Configuration
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
SLACK_APP_TOKEN=xapp-your-app-token  # Socket Mode 사용 시

# Shadow-py API Configuration
SHADOW_PY_API_URL=http://localhost:8000  # shadow-py FastAPI 서버 주소
```

**환경 변수 확인 방법**:
- `NEXT_PUBLIC_SUPABASE_*`: `supabase status` 명령어로 확인
- `SLACK_*`: Slack App 설정 페이지에서 확인
  - Bot Token: Settings > Install App > Bot User OAuth Token
  - Signing Secret: Settings > Basic Information > Signing Secret
  - App Token: Settings > Basic Information > App-Level Tokens

### 4. 개발 서버 실행

```bash
pnpm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

## Supabase 개발 워크플로우

### Migration 생성

```bash
supabase migration new <migration_name>
```

### 로컬 DB 테스트

```bash
supabase db reset
```

### 원격 DB 배포

```bash
supabase db push
```

### 로컬 Supabase Studio

```bash
# http://127.0.0.1:54323 에서 확인
supabase status
```

## 주요 명령어

```bash
# 개발 서버 실행
pnpm run dev

# 프로덕션 빌드
pnpm run build

# 프로덕션 서버 실행
pnpm run start

# Lint 검사
pnpm run lint

# Supabase 로컬 시작
supabase start

# Supabase 로컬 중지
supabase stop

# Supabase 상태 확인
supabase status
```

## shadow-py와 연동하기

shadow-web은 AI 분석 기능을 위해 shadow-py API를 호출합니다.

### 1. shadow-py 서버 실행

별도 터미널에서 shadow-py 실행:

```bash
cd /Users/doyoonlee/Desktop/dev_else/_my-projects/shadow-py

# FastAPI 서버 시작
uvicorn main:app --reload --port 8000
```

### 2. API 연동 확인

```bash
# shadow-py API 상태 확인
curl http://localhost:8000/

# 분석 요청 테스트
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"session_id": "test-session"}'
```

### 3. 로컬 개발 플로우

1. **Supabase 시작**: `supabase start`
2. **shadow-py 시작**: `uvicorn main:app --reload` (포트 8000)
3. **shadow-web 시작**: `pnpm run dev` (포트 3000)

## Slack Bot 연동하기

### 1. Slack App 생성

1. [Slack API](https://api.slack.com/apps)에서 앱 생성
2. **OAuth & Permissions**에서 Bot Token Scopes 추가:
   - `chat:write`
   - `commands`
   - `im:history`
3. **Event Subscriptions** 활성화
   - Request URL: `https://your-domain.com/api/slack/webhook`
4. **Slash Commands** 생성
   - Command: `/shadow`
   - Request URL: `https://your-domain.com/api/slack/commands`

### 2. 로컬 테스트 (ngrok 사용)

#### ngrok 설치

```bash
# macOS
brew install ngrok

# 또는 https://ngrok.com/download
```

#### 테스트 단계

1. **Next.js 개발 서버 실행**
   ```bash
   pnpm run dev
   ```

2. **ngrok으로 로컬 서버 노출**
   ```bash
   ngrok http 3000
   ```

   출력 예시:
   ```
   Forwarding  https://abc123.ngrok.io -> http://localhost:3000
   ```

3. **Slack App Events API 설정**
   - [Slack API Apps](https://api.slack.com/apps) > 앱 선택 > **Event Subscriptions**
   - **Enable Events** ON
   - **Request URL** 입력:
     ```
     https://abc123.ngrok.io/api/slack/events
     ```
   - URL verification 성공 확인 (✅ Verified)

4. **Subscribe to bot events 추가**
   - `message.channels` - 공개 채널 메시지
   - `message.groups` - 비공개 채널 메시지
   - `message.im` - DM 메시지
   - `message.mpim` - 그룹 DM 메시지
   - **Save Changes** 클릭

5. **앱을 워크스페이스에 재설치**
   - Settings > Install App > **Reinstall to Workspace**

6. **테스트 메시지 전송**
   - Slack에서 봇이 추가된 채널에 메시지 전송
   - 터미널에서 로그 확인:
     ```
     [Mock] Analyzing pattern for messages: 1
     Pattern analysis result: { simple_patterns: [...], sequence_patterns: [] }
     ```

7. **Supabase에서 데이터 확인**
   ```bash
   # Supabase Studio 열기
   supabase status
   # Studio URL: http://127.0.0.1:54323

   # slack_messages 테이블 확인
   ```

#### 주의사항

- ngrok 무료 버전은 세션이 종료되면 URL이 변경됨
- URL 변경 시 Slack App 설정도 업데이트 필요
- ngrok 터널 유지를 위해 터미널 창 유지

### 3. Interactive Messages 사용

Shadow는 사용자와 상호작용이 필요할 때 Interactive Messages를 전송합니다.

#### Interactivity 설정

1. [Slack API Apps](https://api.slack.com/apps) > 앱 선택 > **Interactivity & Shortcuts**
2. **Interactivity** ON
3. **Request URL** 입력:
   ```
   https://your-domain.com/api/slack/interactions
   ```
   (로컬 개발 시: `https://abc123.ngrok.io/api/slack/interactions`)

#### 사용 예시

**연동 포인트 A: Shadow → Slack (질문 전송)**

```typescript
import { slackClient } from '@/lib/slack'

await slackClient.sendInteractiveQuestion('C01234ABCD', {
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
  session_id: 'session_20250131_001',
})
```

**연동 포인트 B: Slack → Shadow (답변 수신)**

사용자가 버튼을 클릭하면 `/api/slack/interactions` 엔드포인트로 답변이 전송되고, `slack_interaction_answers` 테이블에 저장됩니다.

#### 에이전트 명세서 전송

```typescript
import { slackClient } from '@/lib/slack'

// 텍스트로 전송 (코드 블록)
await slackClient.sendAgentSpec({
  channel: 'C01234ABCD',
  spec: agentSpecMarkdown,
  format: 'text',
})

// 파일로 전송
await slackClient.sendAgentSpec({
  channel: 'C01234ABCD',
  spec: agentSpecMarkdown,
  format: 'file',
  filename: 'agent_spec.md',
})
```

## Tailwind CSS v4 사용법

### 디자인 토큰 정의

`app/globals.css`에서 `@theme` 블록 사용:

```css
@theme {
  --color-brand: #3b82f6;
  --spacing-tight: 0.125rem;
}
```

### 커스텀 스타일

`@layer` 디렉티브 사용:

```css
@layer components {
  .btn-primary {
    @apply rounded-lg bg-blue-500 px-4 py-2 text-white;
  }
}
```

## 배포

### Vercel 배포 (권장)

1. **Vercel 프로젝트 생성**
   ```bash
   # Vercel CLI 설치
   pnpm add -g vercel

   # 프로젝트 배포
   vercel
   ```

2. **환경 변수 설정**
   - Vercel Dashboard에서 프로덕션 환경 변수 설정
   - `NEXT_PUBLIC_SUPABASE_URL`, `SLACK_BOT_TOKEN` 등

3. **Supabase 프로덕션 연결**
   ```bash
   # Supabase 프로젝트와 연결
   supabase link --project-ref your-project-ref

   # 마이그레이션 배포
   supabase db push
   ```

4. **Slack Webhook URL 업데이트**
   - Slack App 설정에서 Request URL을 Vercel 도메인으로 변경
   - 예: `https://your-app.vercel.app/api/slack/webhook`

### shadow-py 배포

shadow-py는 별도로 배포해야 합니다. 권장 옵션:
- **Railway**: Python FastAPI 배포에 최적화
- **Render**: 무료 티어 제공
- **AWS Lambda**: 서버리스 배포

배포 후 `.env.local`의 `SHADOW_PY_API_URL`을 프로덕션 URL로 변경

## 코딩 컨벤션

프로젝트 코딩 규칙은 `CLAUDE.md` 참고

## 트러블슈팅

### Supabase 연결 오류
```bash
# Supabase 재시작
supabase stop
supabase start

# 상태 확인
supabase status
```

### shadow-py API 연결 실패
```bash
# shadow-py 서버 상태 확인
curl http://localhost:8000/

# 포트 충돌 확인
lsof -ti:8000
```

### Slack Webhook 검증 실패
- Signing Secret이 올바른지 확인
- ngrok URL이 만료되지 않았는지 확인 (로컬 개발 시)

## 참고 자료

### 기술 문서
- [Next.js 문서](https://nextjs.org/docs)
- [Tailwind CSS v4 문서](https://tailwindcss.com/docs)
- [Supabase 문서](https://supabase.com/docs)
- [TanStack Query 문서](https://tanstack.com/query/latest)
- [Zustand 문서](https://zustand.docs.pmnd.rs/)

### 통합 서비스
- [Slack API 문서](https://api.slack.com/docs)
- [Slack Bolt 프레임워크](https://slack.dev/bolt-js/concepts)
- [ngrok 문서](https://ngrok.com/docs)

### 관련 프로젝트
- **shadow-py**: AI 분석 엔진 (Python FastAPI)
  - 위치: `/Users/doyoonlee/Desktop/dev_else/_my-projects/shadow-py`
  - 문서: shadow-py 프로젝트의 README 참고
