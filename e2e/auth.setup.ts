import { test as setup, expect } from '@playwright/test';
import path from 'path';

const AUTH_FILE = path.join(__dirname, '../playwright/.auth/user.json');

/**
 * Slack 인증 설정
 *
 * 이 파일은 테스트 실행 전에 한 번만 실행되어 인증 상태를 저장합니다.
 * 저장된 인증 상태는 이후 모든 테스트에서 재사용됩니다.
 */
setup('Slack 인증', async ({ page }) => {
  console.log('\n🔐 Slack 인증 시작...');
  console.log('======================================');
  console.log('⚠️  브라우저가 열리면 Slack에 로그인해주세요!');
  console.log('======================================\n');

  // Slack 워크스페이스로 이동
  await page.goto('https://app.slack.com/client/T0AC34UJK0W/C0ABPNQF0FR', {
    waitUntil: 'domcontentloaded'
  });

  await page.waitForTimeout(2000);

  // 워크스페이스 URL 입력 페이지인지 확인
  const workspaceInput = page.locator('input[type="text"]').first();
  const continueButton = page.locator('button:has-text("Continue"), button:has-text("계속")');

  const isWorkspaceInputPage = await workspaceInput.isVisible({ timeout: 3000 }).catch(() => false);

  if (isWorkspaceInputPage) {
    console.log('📝 워크스페이스 URL을 입력하거나, 브라우저에서 직접 로그인해주세요...\n');
  }

  console.log('⏳ 로그인 완료를 기다리는 중... (최대 5분)');
  console.log('   로그인 후 #마케팅 채널이 자동으로 로드될 때까지 기다려주세요.\n');

  // URL이 /client/로 바뀔 때까지 대기 (로그인 완료 신호)
  try {
    await page.waitForURL('**/client/T0AC34UJK0W/**', { timeout: 300000 });
    console.log('✅ 로그인 감지됨, 채널 로딩 중...\n');
  } catch (error) {
    console.log('❌ 타임아웃: 로그인이 완료되지 않았습니다.');
    throw error;
  }

  // 채널 로딩 대기
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000); // Slack UI가 완전히 렌더링되도록 충분한 시간 제공

  // 메시지 입력 영역 확인 (더 관대한 선택자)
  console.log('🔍 메시지 입력 영역을 찾는 중...');

  const messageArea = page.locator('[data-qa="message_input"]')
    .or(page.locator('[role="textbox"]'))
    .or(page.locator('[contenteditable="true"]'))
    .or(page.locator('.ql-editor'))
    .or(page.locator('[aria-label*="메시지"]'))
    .or(page.locator('[aria-label*="Message"]'));

  await expect(messageArea.first()).toBeVisible({ timeout: 30000 });

  console.log('✅ Slack 인증 완료 및 채널 로딩 완료');

  // 인증 상태 저장
  await page.context().storageState({ path: AUTH_FILE });
  console.log(`💾 인증 상태 저장: ${AUTH_FILE}`);
  console.log('✨ 이제 이 인증 상태로 모든 테스트가 실행됩니다!\n');
});
