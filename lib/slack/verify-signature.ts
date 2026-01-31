import crypto from 'crypto'

export interface VerifySignatureOptions {
  signingSecret: string
  requestSignature: string
  requestTimestamp: string
  body: string
}

export function verifySlackSignature({
  signingSecret,
  requestSignature,
  requestTimestamp,
  body,
}: VerifySignatureOptions): boolean {
  // Timestamp 검증 (5분 이내 요청만 허용)
  const timestamp = parseInt(requestTimestamp, 10)
  const currentTime = Math.floor(Date.now() / 1000)

  if (Math.abs(currentTime - timestamp) > 60 * 5) {
    return false
  }

  // 서명 생성
  const sigBasestring = `v0:${requestTimestamp}:${body}`
  const mySignature = `v0=${crypto
    .createHmac('sha256', signingSecret)
    .update(sigBasestring, 'utf8')
    .digest('hex')}`

  // 타이밍 공격 방지를 위한 안전한 비교
  try {
    return crypto.timingSafeEqual(
      Buffer.from(mySignature, 'utf8'),
      Buffer.from(requestSignature, 'utf8')
    )
  } catch {
    return false
  }
}
