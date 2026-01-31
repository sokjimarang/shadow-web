# Shadow Web - Database Migration Guide

이 가이드는 Supabase 데이터베이스 스키마를 관리하고 마이그레이션하는 방법을 설명합니다.

## 목차

1. [현재 DB 스키마](#현재-db-스키마)
2. [마이그레이션 명령어](#마이그레이션-명령어)
3. [새로운 마이그레이션 만들기](#새로운-마이그레이션-만들기)
4. [프로덕션 배포 워크플로우](#프로덕션-배포-워크플로우)
5. [트러블슈팅](#트러블슈팅)

---

## 현재 DB 스키마

Shadow Web은 다음 4개의 주요 테이블을 사용합니다:

### 1. `sessions` - 녹화 세션 정보

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  duration NUMERIC NOT NULL DEFAULT 0,
  frame_count INTEGER NOT NULL DEFAULT 0,
  event_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**용도**: shadow-py에서 녹화한 세션의 메타데이터 저장

### 2. `analysis_results` - AI 분석 결과

```sql
CREATE TABLE analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  target TEXT NOT NULL,
  context TEXT,
  description TEXT,
  confidence NUMERIC,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**용도**: Claude/Gemini가 분석한 사용자 행동 저장

### 3. `patterns` - 감지된 패턴

```sql
CREATE TABLE patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  pattern_type TEXT NOT NULL DEFAULT 'sequence',
  count INTEGER NOT NULL DEFAULT 0,
  actions JSONB NOT NULL DEFAULT '[]'::jsonb,
  similarity_score NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**용도**: 반복 패턴 감지 결과 저장

### 4. `slack_events` - Slack 이벤트 로그

```sql
CREATE TABLE slack_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id TEXT,
  channel_id TEXT,
  payload JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**용도**: Slack Bot 이벤트 및 명령 로그

---

## 마이그레이션 명령어

프로젝트의 `package.json`에 다음 명령어가 정의되어 있습니다:

### 기본 명령어

```bash
# 로컬 Supabase 시작 (Docker 필요)
pnpm run db:start

# 로컬 Supabase 중지
pnpm run db:stop

# Supabase 상태 확인 (URL, API Keys 등)
pnpm run db:status
```

### 마이그레이션 관리

```bash
# 새로운 마이그레이션 파일 생성
pnpm run db:migration:new <migration_name>

# 마이그레이션 목록 확인 (로컬 vs 리모트)
pnpm run db:migration:list

# 로컬 DB 초기화 (모든 마이그레이션 재실행)
pnpm run db:reset
```

### 배포 명령어

```bash
# 프로덕션 DB에 마이그레이션 배포
pnpm run db:push

# 프로덕션 DB 스키마 가져오기 (역방향)
pnpm run db:pull

# 로컬-프로덕션 차이 확인
pnpm run db:diff
```

---

## 새로운 마이그레이션 만들기

### 1. 마이그레이션 파일 생성

```bash
pnpm run db:migration:new add_user_preferences
```

생성된 파일: `supabase/migrations/YYYYMMDDHHMMSS_add_user_preferences.sql`

### 2. SQL 작성

```sql
-- Add user_preferences table
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index
CREATE INDEX user_preferences_user_id_idx ON user_preferences(user_id);

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Users can manage their own preferences"
  ON user_preferences
  FOR ALL
  USING (auth.uid()::text = user_id);
```

### 3. 로컬에서 테스트 (선택사항)

```bash
# 로컬 Supabase 시작
pnpm run db:start

# .env.local을 로컬로 변경
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<로컬 anon key>

# 마이그레이션 적용
pnpm run db:reset

# 앱 실행 및 테스트
pnpm run dev
```

### 4. 프로덕션 배포

```bash
# .env.local을 프로덕션으로 변경
NEXT_PUBLIC_SUPABASE_URL=https://ddntzfdetgcobzohimvm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<프로덕션 anon key>

# 프로덕션에 배포
pnpm run db:push
```

---

## 프로덕션 배포 워크플로우

### 권장 워크플로우 (안전)

```bash
# 1. 새 기능 브랜치 생성
git checkout -b feat/add-user-preferences

# 2. 마이그레이션 파일 생성 및 작성
pnpm run db:migration:new add_user_preferences
# supabase/migrations/xxx_add_user_preferences.sql 편집

# 3. 로컬 테스트 (선택)
pnpm run db:start
pnpm run db:reset
pnpm run dev

# 4. 프로덕션 배포
pnpm run db:push

# 5. Git 커밋
git add supabase/migrations/
git commit -m "feat: add user preferences table"
git push origin feat/add-user-preferences
```

### 빠른 배포 (현재 설정)

프로덕션 Supabase를 직접 사용하는 경우:

```bash
# 1. 마이그레이션 생성
pnpm run db:migration:new add_feature

# 2. SQL 작성
vim supabase/migrations/xxx_add_feature.sql

# 3. 바로 프로덕션 배포
pnpm run db:push

# 4. Git 커밋
git add . && git commit -m "feat: add feature"
```

---

## 트러블슈팅

### 마이그레이션 실패 시

```bash
# 오류 확인
pnpm run db:push

# 로컬-프로덕션 차이 확인
pnpm run db:diff

# 프로덕션 스키마 가져오기
pnpm run db:pull
```

### 마이그레이션 히스토리 불일치

```bash
# 수동으로 마이그레이션 상태 수정
supabase migration repair --status applied <migration_id>
```

### UUID 함수 오류

**잘못된 예시** (구버전):
```sql
DEFAULT uuid_generate_v4()  -- ❌ 오류 발생
```

**올바른 예시** (PostgreSQL 13+):
```sql
DEFAULT gen_random_uuid()  -- ✅ 정상 작동
```

### 연결 실패

```bash
# Supabase 프로젝트 재연결
supabase link --project-ref ddntzfdetgcobzohimvm

# 상태 확인
pnpm run db:status
```

---

## 참고 자료

- [Supabase Migration 공식 문서](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [PostgreSQL 데이터 타입](https://www.postgresql.org/docs/current/datatype.html)
- [RLS (Row Level Security) 가이드](https://supabase.com/docs/guides/auth/row-level-security)

---

## 현재 환경 정보

- **프로젝트 ID**: `ddntzfdetgcobzohimvm`
- **프로덕션 URL**: `https://ddntzfdetgcobzohimvm.supabase.co`
- **연결 상태**: ✅ 연결됨 (`supabase link` 완료)
- **마이그레이션 상태**: ✅ 초기 스키마 배포 완료

```bash
# 현재 마이그레이션 확인
pnpm run db:migration:list
```

출력 예시:
```
  Local          | Remote         | Time (UTC)
  ----------------|----------------|---------------------
   20260131073844 | 20260131073844 | 2026-01-31 07:38:44
```
