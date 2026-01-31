# 프로젝트별 설정

> **참고:** 이 문서는 shadow-web 프로젝트의 특화 설정만 포함합니다.
> 일반적인 개발 규칙, 코드 작성 원칙, 에이전트 활용 등은 전역 CLAUDE.md(`~/.claude/CLAUDE.md`)를 참고하세요.

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

## 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: TanStack Query
- **Database**: Supabase (리모트만 사용)
- **Package Manager**: pnpm

## 개발 서버 관리

- 사용자가 직접 앱을 띄워서 확인 중이므로, 변경사항 완료 후 개발 서버 프로세스를 임의로 종료하지 않음
- `lsof -ti:3000 | xargs kill -9` 같은 프로세스 종료 명령어 사용 금지
- `pnpm run dev` 등의 서버 실행 명령어도 굳이 실행하지 않음
- 사용자가 필요시 직접 서버를 재시작할 것이므로 대신 실행할 필요 없음

## Supabase 개발 워크플로우

### 리모트 전용 (로컬 환경 사용 안 함)

- 이 프로젝트는 **리모트 Supabase만 사용**합니다
- 로컬 Supabase (`supabase start`) 사용하지 않음
- `.env.local` 파일에는 리모트 Supabase 접속 정보 설정:
  ```
  NEXT_PUBLIC_SUPABASE_URL=<리모트 Supabase URL>
  NEXT_PUBLIC_SUPABASE_ANON_KEY=<리모트 anon key>
  ```

### Migration 기반 스키마 관리

- **모든 스키마 변경은 Migration 파일로 관리** (Dashboard 직접 수정 금지)
- Migration 생성: `supabase migration new <migration_name>`
- 원격 배포: `supabase db push`
- 마이그레이션 확인: Supabase Dashboard에서 확인

### 데이터베이스 설계 원칙

- 외래 키 컬럼에는 반드시 인덱스 추가
- RLS(Row Level Security) 정책 필수 설정
- 적절한 데이터 타입 선택 (UUID, text, timestamptz, boolean, numeric)
- NOT NULL 컬럼에는 DEFAULT 값 설정

```sql
-- 예시
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT NOW()
);

-- 인덱스 추가
CREATE INDEX users_email_idx ON users(email);

-- RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS 정책
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);
```
