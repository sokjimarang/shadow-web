import { WebClient } from '@slack/web-api'
import { env } from '@/lib/env'
import type {
  SendMessageOptions,
  SlackBlock,
  InteractiveQuestionPayload,
  SendAgentSpecOptions,
} from '@/types/slack'
import { buildInteractiveQuestionBlocks, buildCodeSection } from './block-builder'
import { slackFileUploader } from './upload'

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

  async sendAgentSpec(options: SendAgentSpecOptions): Promise<void> {
    if (options.format === 'file') {
      const filename = options.filename || 'agent_spec.md'
      await slackFileUploader.uploadMarkdown(
        options.channel,
        options.spec,
        filename,
        'Agent Specification'
      )
    } else {
      const MAX_BLOCK_LENGTH = 3000
      const chunks = this.chunkText(options.spec, MAX_BLOCK_LENGTH)

      const blocks: SlackBlock[] = chunks.map((chunk) =>
        buildCodeSection(chunk, 'markdown')
      )

      await this.sendMessage({
        channel: options.channel,
        text: 'Agent Specification',
        blocks,
      })
    }
  }

  private chunkText(text: string, maxLength: number): string[] {
    if (text.length <= maxLength) {
      return [text]
    }

    const chunks: string[] = []
    let currentChunk = ''

    const lines = text.split('\n')

    for (const line of lines) {
      if (currentChunk.length + line.length + 1 > maxLength) {
        chunks.push(currentChunk)
        currentChunk = line
      } else {
        currentChunk += (currentChunk ? '\n' : '') + line
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk)
    }

    return chunks
  }

  private handleError(method: string, error: unknown): never {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    console.error(`[SlackClient.${method}] Error:`, errorMessage)
    throw new Error(`Slack API error in ${method}: ${errorMessage}`)
  }
}

export const slackClient = new SlackClient()
