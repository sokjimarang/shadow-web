import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright 설정 파일
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',

  // 테스트 실행 시간 제한 (60초)
  timeout: 60 * 1000,

  // 각 테스트 expect 대기 시간
  expect: {
    timeout: 10000,
  },

  // 테스트 실패 시 재시도 설정
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Slack 테스트는 순차 실행

  // 리포터 설정
  reporter: 'html',

  // 모든 테스트에서 공유되는 설정
  use: {
    // 스크린샷 및 트레이스 수집 설정
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // 브라우저 컨텍스트 옵션
    viewport: { width: 1400, height: 900 },

    // Slack 로딩 대기 시간
    navigationTimeout: 30000,
    actionTimeout: 10000,
  },

  // 프로젝트별 브라우저 설정
  projects: [
    // 인증 설정 프로젝트
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      timeout: 360000, // 6분 타임아웃 (로그인 대기 시간)
      use: {
        ...devices['Desktop Chrome'],
        headless: false, // 로그인 시 브라우저 표시
      },
    },
    // 실제 테스트 프로젝트
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json', // 저장된 인증 상태 사용
        headless: false, // Slack UI 확인을 위해 브라우저 표시
      },
      dependencies: ['setup'], // setup 프로젝트 먼저 실행
    },
  ],

  // 개발 서버 설정 (필요시 활성화)
  // webServer: {
  //   command: 'pnpm run dev',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
