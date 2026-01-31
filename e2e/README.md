# Shadow Bot E2E 테스트

Playwright를 사용한 Shadow Bot의 E2E 테스트 스위트입니다.

## 테스트 구조

```
e2e/
├── auth.setup.ts        # Slack 인증 설정 (최초 1회 실행)
├── shadow-bot.spec.ts   # Shadow Bot 테스트 케이스
└── README.md
```

## 테스트 시나리오

### 1. Shadow Bot 멘션 메시지 전송 및 응답 확인
- #마케팅 채널에서 @Shadow Bot 멘션
- Shadow Bot의 응답 확인

### 2. Shadow Bot 메시지 확인
- 채널 내 Shadow Bot의 이전 메시지 존재 여부 확인

### 3. Shadow Bot과 대화 스레드 확인
- 메시지 전송 후 스레드 응답 확인

### 4. Interactive Messages 테스트
- Shadow Bot이 보낸 버튼 등의 Interactive 요소 확인

### 5. 채널 정보 확인
- #마케팅 채널 로딩 및 접근 가능 여부 확인

## 테스트 실행 방법

### 최초 실행 (인증 설정 필요)

```bash
# 브라우저가 열리면 Slack에 로그인
pnpm test:e2e:headed
```

첫 실행 시:
1. Chromium 브라우저가 열림
2. Slack 로그인 페이지로 이동
3. 수동으로 로그인 (이메일/비밀번호 입력)
4. 로그인 완료되면 인증 상태가 `playwright/.auth/user.json`에 저장됨
5. 이후 테스트는 저장된 인증 상태를 재사용

### 이후 실행

```bash
# 일반 테스트 실행 (브라우저 표시)
pnpm test:e2e:headed

# UI 모드로 테스트 (대화형 디버깅)
pnpm test:e2e:ui

# 디버그 모드
pnpm test:e2e:debug

# 특정 테스트만 실행
pnpm test:e2e shadow-bot
```

## 인증 상태 관리

### 인증 상태 재설정

로그아웃되었거나 새로운 워크스페이스로 변경한 경우:

```bash
# 인증 파일 삭제
rm -rf playwright/.auth

# 다시 테스트 실행 (로그인 프롬프트가 나타남)
pnpm test:e2e:headed
```

### 인증 파일 위치

```
playwright/.auth/user.json  # 저장된 Slack 세션 정보
```

이 파일은 `.gitignore`에 포함되어 있어 git에 커밋되지 않습니다.

## 테스트 설정

### Playwright 설정 (`playwright.config.ts`)

주요 설정:
- **timeout**: 60초 (Slack 로딩 시간 고려)
- **headless**: false (브라우저 UI 표시)
- **workers**: 1 (순차 실행)
- **viewport**: 1400x900
- **인증 재사용**: setup 프로젝트에서 인증 후 chromium 프로젝트에서 재사용

## 테스트 작성 가이드

### 선택자 우선순위

1. **Role-based 선택자** (권장)
   ```typescript
   page.getByRole('button', { name: '전송' })
   ```

2. **Data attributes**
   ```typescript
   page.locator('[data-qa="message_input"]')
   ```

3. **Text content** (최후의 수단)
   ```typescript
   page.getByText('Shadow Bot')
   ```

### 대기 처리

```typescript
// ✅ 올바른 방법: auto-waiting 활용
await page.getByRole('button').click();

// ❌ 피해야 할 방법: 임의의 timeout
await page.waitForTimeout(3000); // 필요한 경우에만 최소한으로 사용
```

### 메시지 전송 패턴

```typescript
const messageInput = page.locator('[data-qa="message_input"]').first();
await messageInput.click();
await messageInput.fill('@Shadow Bot 메시지 내용');
await messageInput.press('Enter');
```

## 트러블슈팅

### 테스트가 실패하는 경우

1. **인증 만료**
   ```bash
   rm -rf playwright/.auth
   pnpm test:e2e:headed
   ```

2. **Slack UI 변경**
   - 선택자를 업데이트해야 할 수 있음
   - `pnpm test:e2e:debug`로 디버그 모드 실행하여 확인

3. **타임아웃 에러**
   - `playwright.config.ts`에서 timeout 값 증가
   - 또는 네트워크 상태 확인

### 리포트 확인

테스트 실행 후 HTML 리포트 생성:

```bash
# 리포트 열기
npx playwright show-report
```

## 주의사항

⚠️ **테스트 메시지**
- 테스트 메시지는 `[E2E TEST]` 접두사를 포함하여 실제 메시지와 구분
- 필요시 테스트 후 메시지 삭제 로직 추가 고려

⚠️ **Rate Limiting**
- Slack API rate limit 고려하여 테스트 실행 빈도 조절
- 필요시 테스트 간 대기 시간 추가

⚠️ **병렬 실행 주의**
- 현재 설정은 순차 실행 (workers: 1)
- 병렬 실행 시 메시지 충돌 가능성 있음
