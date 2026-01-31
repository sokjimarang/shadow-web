# 일반적인 규칙

- 항상 TypeScript를 사용합니다.
- API 호출 시, 항상 TanStack Query를 사용합니다.
- 모든 컴포넌트는 함수형 컴포넌트로 작성합니다.
- 가능한한 기존의 컴포넌트를 확장하거나 변경하여 재사용합니다.

# 문서 폴더 구조

```
docs/
├── direction/     # 기획 메인 파일 (PRD, Service Plan 등)
├── plan/          # Claude plan mode로 생성된 계획안
└── report/        # 구현 상태, 문제 상황 등 리포트
```

> **규칙**: 새 문서 생성 시 위 분류에 맞는 폴더에 저장 (훅이 자동으로 목록 업데이트)

### 문서 목록

#### direction (기획)
- `docs/direction/API_Specification.md`
- `docs/direction/data_schema.md`
- `docs/direction/main_service-plan-v1.2.md`
- `docs/direction/prd.md`

#### plan (계획안)
- (없음)

#### report (리포트)
- (없음)

# 상수

- 가능한한 모든 고정값인 숫자, 문자열을 상수로 분리합니다.
- constants/index.ts 파일에 상수를 모아 관리합니다.
- 재활용할 수 있는 상수가 있는지 먼저 확인해보고 중복으로 재작성하지 않도록 합니다.
- 상수의 이름은 대문자와 언더스코어(\_)로 작성합니다.
- 상수의 작성 케이스 예시: CONSTANT_CASE

# NPM Package

- 프로젝트의 기본 NPM package는 pnpm을 사용.
- 새로운 NPM Package를 설치하기 전에 반드시 기존에 설치된 패키지로 대체할 수 없는지 확인.
- 새로운 NPM Package를 설치할 때는 반드시 해당 패키지의 유지보수 상태(최근 업데이트 날짜, 이슈 해결 빈도 등)를 확인.
- 프로젝트에 불필요한 패키지는 설치하지 않도록 주의.

# 개발 서버 관리

- 사용자가 직접 앱을 띄워서 확인 중이므로, 변경사항 완료 후 개발 서버 프로세스를 임의로 종료하지 않음.
- `lsof -ti:3000 | xargs kill -9` 같은 프로세스 종료 명령어 사용 금지.
- `pnpm run dev` 등의 서버 실행 명령어도 굳이 실행하지 않음.
- 사용자가 필요시 직접 서버를 재시작할 것이므로 대신 실행할 필요 없음.

# 문제 해결 및 롤백 원칙

- 문제 해결을 위해 시도한 코드 변경이 효과가 없는 것으로 확인된 경우, **반드시 다음 시도를 하기 전에 해당 변경사항을 이전 상태로 롤백**해야 함.
- 효과가 없는 코드를 남겨두면 불필요한 복잡성이 증가하고 디버깅을 어렵게 만듦.
- 롤백 후 새로운 접근 방식을 시도하여 코드베이스를 깔끔하게 유지.

# 네이밍 규칙

## 인터페이스 네이밍 규칙

- Props 인터페이스는 컴포넌트명 + "Props" 형태로 명명
- 다른 인터페이스는 불필요한 접두사를 붙이지 않음

```typescript
// ✅ 올바른 사용법
interface ButtonProps {
  label: string;
  onClick: () => void;
}

interface User {
  id: string;
  name: string;
}

// ❌ 잘못된 사용법
interface Props {
  // 컴포넌트별 구분이 어려움
  label: string;
}

interface IUser {
  // 불필요한 접두사
  id: string;
  name: string;
}
```

## 컴포넌트 네이밍 규칙

- 모든 컴포넌트는 **PascalCase**로 명명
- 컴포넌트 파일명과 컴포넌트명은 동일하게 맞춤

# 스타일링 규칙

- Tailwind CSS v4 사용
- !important 사용 금지
- 커스텀 스타일이 필요한 경우 app/globals.css의 @layer 디렉티브 사용
- 디자인 토큰은 globals.css의 @theme 블록에 정의

```css
@theme {
  --color-brand: #3b82f6;
  --spacing-tight: 0.125rem;
}
```

# Supabase 개발 워크플로우

## 로컬 개발 환경 우선

1. Docker Desktop 실행
2. `supabase start` 로 로컬 Supabase 시작
3. `.env.local` 파일 설정:
   ```
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<로컬 anon key>
   ```
4. `supabase status`로 로컬 URL 및 키 확인

## Migration 기반 스키마 관리

- **모든 스키마 변경은 Migration 파일로 관리** (Dashboard 직접 수정 금지)
- Migration 생성: `supabase migration new <migration_name>`
- 로컬 테스트: `supabase db reset`
- 원격 배포: `supabase db push`

## 데이터베이스 설계 원칙

- 외래 키 컬럼에는 반드시 인덱스 추가
- RLS(Row Level Security) 정책 필수 설정
- 적절한 데이터 타입 선택 (bigint, text, timestamptz, boolean, numeric)
- NOT NULL 컬럼에는 DEFAULT 값 설정

```sql
-- 예시
CREATE TABLE users (
  id bigint generated always as identity primary key,
  email text not null unique,
  created_at timestamptz not null default now()
);

-- 인덱스 추가
CREATE INDEX users_email_idx ON users (email);

-- RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS 정책
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text);
```
