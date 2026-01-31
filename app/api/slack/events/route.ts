import { NextRequest, NextResponse } from 'next/server'
import { env, validateEnv } from '@/lib/env'
import { verifySlackSignature } from '@/lib/slack/verify-signature'
import { shadowClient } from '@/lib/shadow/client'
import { createClient } from '@supabase/supabase-js'

validateEnv()

const supabase = createClient(env.supabase.url, env.supabase.anonKey)

interface SlackEventPayload {
  type: string
  challenge?: string
  event?: {
    type: string
    user?: string
    channel?: string
    text?: string
    ts?: string
    subtype?: string
    bot_id?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-slack-signature')
    const timestamp = request.headers.get('x-slack-request-timestamp')

    if (!signature || !timestamp) {
      return NextResponse.json({ error: 'Missing signature headers' }, { status: 401 })
    }

    // 서명 검증
    const isValid = verifySlackSignature({
      signingSecret: env.slack.signingSecret,
      requestSignature: signature,
      requestTimestamp: timestamp,
      body,
    })

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload: SlackEventPayload = JSON.parse(body)

    // URL verification (Slack 앱 초기 설정)
    if (payload.type === 'url_verification' && payload.challenge) {
      return NextResponse.json({ challenge: payload.challenge })
    }

    // Event callback 처리
    if (payload.type === 'event_callback' && payload.event) {
      const event = payload.event

      // 봇 메시지 무시
      if (event.bot_id || event.subtype === 'bot_message') {
        return NextResponse.json({ ok: true })
      }

      // message 이벤트 처리
      if (event.type === 'message' && event.user && event.text) {
        // Supabase에 메시지 저장
        const { data, error } = await supabase.from('slack_events').insert({
          event_type: event.type,
          user_id: event.user,
          channel_id: event.channel || 'unknown',
          payload: event,
        })

        if (error) {
          console.error('Failed to save event to Supabase:', error)
          return NextResponse.json({ error: 'Database error' }, { status: 500 })
        }

        // Mock shadow-py API 호출 (백그라운드에서 실행)
        shadowClient
          .analyzePattern([
            {
              user_id: event.user,
              channel_id: event.channel || 'unknown',
              text: event.text,
              timestamp: event.ts || new Date().toISOString(),
            },
          ])
          .then((result) => {
            console.log('Pattern analysis result:', result)
          })
          .catch((err) => {
            console.error('Pattern analysis failed:', err)
          })

        return NextResponse.json({ ok: true })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error processing Slack event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
