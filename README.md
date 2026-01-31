# Fast Builderton

Next.js + TypeScript + Tailwind CSS v4 + Supabase + TanStack Query + Zustand

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
fast-builderton/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/               # API routes
├── components/            # 재사용 컴포넌트
├── lib/
│   ├── supabase.ts       # Supabase 클라이언트
│   └── services/         # 비즈니스 로직
├── store/                # Zustand stores
├── types/                # TypeScript 타입 정의
├── constants/            # 상수 관리
│   └── index.ts
├── supabase/
│   ├── migrations/       # DB 마이그레이션
│   └── config.toml
└── public/               # 정적 파일
```

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
# 로컬 개발 환경
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase status에서 확인한 anon key>
```

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

## 코딩 컨벤션

프로젝트 코딩 규칙은 `CLAUDE.md` 참고

## 참고 자료

- [Next.js 문서](https://nextjs.org/docs)
- [Tailwind CSS v4 문서](https://tailwindcss.com/docs)
- [Supabase 문서](https://supabase.com/docs)
- [TanStack Query 문서](https://tanstack.com/query/latest)
- [Zustand 문서](https://zustand.docs.pmnd.rs/)
