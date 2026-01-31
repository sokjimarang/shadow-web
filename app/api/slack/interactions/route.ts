import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { verifySlackSignature } from '@/lib/slack/verify-signature'
import { getSupabaseClient } from '@/lib/supabase'
import type {
  SlackInteractionPayload,
  InteractiveAnswerPayload,
} from '@/types/slack'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-slack-signature')
    const timestamp = request.headers.get('x-slack-request-timestamp')

    if (!signature || !timestamp) {
      return NextResponse.json(
        { error: 'Missing signature headers' },
        { status: 401 }
      )
    }

    const isValid = verifySlackSignature({
      signingSecret: env.slack.signingSecret,
      requestSignature: signature,
      requestTimestamp: timestamp,
      body,
    })

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const params = new URLSearchParams(body)
    const payloadString = params.get('payload')

    if (!payloadString) {
      return NextResponse.json(
        { error: 'Missing payload' },
        { status: 400 }
      )
    }

    const payload: SlackInteractionPayload = JSON.parse(payloadString)

    if (payload.type === 'block_actions' && payload.actions) {
      const action = payload.actions[0]

      if (action.value) {
        const actionValue = JSON.parse(action.value)

        const answerPayload: InteractiveAnswerPayload = {
          session_id: actionValue.session_id,
          answer: {
            selected_option: actionValue.selected_option,
          },
          answered_at: new Date().toISOString(),
        }

        console.log('[Interactivity] Answer received:', answerPayload)

        const supabase = getSupabaseClient()
        const { error: dbError } = await supabase
          .from('slack_interaction_answers')
          .insert({
            session_id: answerPayload.session_id,
            selected_option: answerPayload.answer.selected_option,
            additional_context: answerPayload.answer.additional_context,
            create_exception_rule: answerPayload.answer.create_exception_rule,
            answered_at: answerPayload.answered_at,
            user_id: payload.user.id,
            raw_payload: payload,
          })

        if (dbError) {
          console.error('[Interactivity] Failed to save answer:', dbError)
        }

        return NextResponse.json({ ok: true })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error processing Slack interaction:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
