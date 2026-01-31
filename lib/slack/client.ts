import { WebClient } from '@slack/web-api'
import { env } from '@/lib/env'
import type {
  SendMessageOptions,
  SlackBlock,
  InteractiveQuestionPayload,
} from '@/types/slack'
import { buildInteractiveQuestionBlocks } from './block-builder'

export class SlackClient {
  private client: WebClient

  constructor(token?: string) {
    this.client = new WebClient(token || env.slack.botToken)
  }

  async sendMessage(options: SendMessageOptions): Promise<void> {
    try {
      await this.client.chat.postMessage({
        channel: options.channel,
        text: options.text,
        blocks: options.blocks,
        thread_ts: options.thread_ts,
      })
    } catch (error) {
      this.handleError('sendMessage', error)
    }
  }

  async sendBlocks(
    channel: string,
    text: string,
    blocks: SlackBlock[]
  ): Promise<void> {
    await this.sendMessage({
      channel,
      text,
      blocks,
    })
  }

  async sendInteractiveQuestion(
    channel: string,
    payload: InteractiveQuestionPayload
  ): Promise<void> {
    const blocks = buildInteractiveQuestionBlocks(payload)
    const fallbackText = `${payload.question.title}\n옵션: ${payload.question.options.join(', ')}`

    await this.sendMessage({
      channel,
      text: fallbackText,
      blocks,
    })
  }

  private handleError(method: string, error: unknown): never {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    console.error(`[SlackClient.${method}] Error:`, errorMessage)
    throw new Error(`Slack API error in ${method}: ${errorMessage}`)
  }
}

export const slackClient = new SlackClient()
