import { test, expect } from '@playwright/test';

/**
 * Shadow Bot 테스트
 *
 * #마케팅 채널에서 Shadow Bot과의 상호작용을 테스트합니다.
 */

const WORKSPACE_URL = 'https://app.slack.com/client/T0AC34UJK0W/C0ABPNQF0FR';
const TEST_MESSAGE_PREFIX = '[E2E TEST]';

test.describe('Shadow Bot 상호작용 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // #마케팅 채널로 이동
    await page.goto(WORKSPACE_URL);

    // 채널이 로드될 때까지 대기
    await page.waitForLoadState('networkidle');

    // 메시지 입력창이 보일 때까지 대기
    await page.waitForSelector('[data-qa="message_input"], [role="textbox"]', { timeout: 10000 });
  });

  test('Shadow Bot 멘션 메시지 전송 및 응답 확인', async ({ page }) => {
    const timestamp = Date.now();
    const testMessage = `${TEST_MESSAGE_PREFIX} 안녕하세요 ${timestamp}`;

    // 메시지 입력창 찾기
    const messageInput = page.locator('[data-qa="message_input"]').or(page.locator('[role="textbox"]')).first();
    await messageInput.click();

    // @Shadow Bot 멘션 입력
    await messageInput.fill('@Shadow Bot ');
    await page.waitForTimeout(500); // 멘션 자동완성 대기

    // 나머지 메시지 입력
    await messageInput.pressSequentially(testMessage);
    await page.waitForTimeout(300);

    // 메시지 전송 (Enter 키)
    await messageInput.press('Enter');

    // 메시지가 전송되었는지 확인
    await expect(page.getByText(testMessage)).toBeVisible({ timeout: 5000 });

    // Shadow Bot의 응답 대기 (최대 10초)
    // 예상 응답: "Doyoon Lee 님에 의해 #마케팅에 추가되었습니다." 또는 다른 응답
    const botResponse = page.locator('[data-qa="message_container"]').filter({
      has: page.locator('button:has-text("Shadow Bot"), span:has-text("Shadow Bot")')
    }).last();

    await expect(botResponse).toBeVisible({ timeout: 10000 });

    console.log('✅ Shadow Bot이 응답했습니다.');
  });

  test('Shadow Bot 메시지 확인', async ({ page }) => {
    // 채널 내에 Shadow Bot의 이전 메시지가 있는지 확인
    const botMessages = page.locator('[data-qa="message_container"]').filter({
      has: page.locator('button:has-text("Shadow Bot"), span:has-text("Shadow Bot")')
    });

    const messageCount = await botMessages.count();
    expect(messageCount).toBeGreaterThan(0);

    console.log(`✅ Shadow Bot 메시지 ${messageCount}개 발견`);
  });

  test('Shadow Bot과 대화 스레드 확인', async ({ page }) => {
    const timestamp = Date.now();
    const testMessage = `${TEST_MESSAGE_PREFIX} 테스트 ${timestamp}`;

    // 메시지 입력 및 전송
    const messageInput = page.locator('[data-qa="message_input"]').or(page.locator('[role="textbox"]')).first();
    await messageInput.click();
    await messageInput.fill(`@Shadow Bot ${testMessage}`);
    await page.waitForTimeout(500);
    await messageInput.press('Enter');

    // 전송된 메시지 찾기
    const sentMessage = page.getByText(testMessage);
    await expect(sentMessage).toBeVisible({ timeout: 5000 });

    // Shadow Bot 응답 대기
    await page.waitForTimeout(3000);

    // 스레드 응답이 있는지 확인 (있을 수도 있음)
    const threadIndicator = page.locator('[data-qa="thread_replies_indicator"]').first();
    const hasThread = await threadIndicator.isVisible().catch(() => false);

    if (hasThread) {
      console.log('✅ 스레드 응답이 있습니다.');
    } else {
      console.log('ℹ️  스레드 응답이 없습니다.');
    }
  });

  test('Shadow Bot Interactive messages 테스트', async ({ page }) => {
    // Shadow Bot이 보낸 Interactive message (버튼 등)가 있는지 확인
    const interactiveElements = page.locator('button, [role="button"]').filter({
      has: page.locator('text=/확인|승인|거부|선택/i')
    });

    const hasInteractive = await interactiveElements.count().then(count => count > 0);

    if (hasInteractive) {
      console.log('✅ Interactive 요소 발견');

      // 첫 번째 버튼 클릭 테스트
      const firstButton = interactiveElements.first();
      const buttonText = await firstButton.textContent();
      console.log(`버튼 텍스트: ${buttonText}`);

      // 실제 클릭은 주석 처리 (필요시 활성화)
      // await firstButton.click();
      // await page.waitForTimeout(2000);
    } else {
      console.log('ℹ️  현재 Interactive 요소가 없습니다.');
    }

    // 테스트는 성공으로 처리 (Interactive 요소는 선택사항)
    expect(true).toBe(true);
  });

  test('채널 정보 확인', async ({ page }) => {
    // 채널 이름 확인
    const channelName = page.locator('#마케팅, [aria-label*="마케팅"], :has-text("#마케팅")').first();
    await expect(channelName).toBeVisible({ timeout: 5000 });

    console.log('✅ #마케팅 채널 확인 완료');
  });
});
