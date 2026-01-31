import { WebClient } from '@slack/web-api'
import { env } from '@/lib/env'
import type { UploadFileOptions } from '@/types/slack'

export class SlackFileUploader {
  private client: WebClient

  constructor(token?: string) {
    this.client = new WebClient(token || env.slack.botToken)
  }

  async uploadFile(options: UploadFileOptions): Promise<void> {
    try {
      await this.client.files.uploadV2({
        channels: options.channels,
        file: options.file,
        filename: options.filename,
        initial_comment: options.initial_comment,
        title: options.title,
      })
    } catch (error) {
      this.handleError('uploadFile', error)
    }
  }

  async uploadMarkdown(
    channel: string,
    markdown: string,
    filename: string = 'document.md',
    title?: string
  ): Promise<void> {
    const buffer = Buffer.from(markdown, 'utf-8')

    await this.uploadFile({
      channels: channel,
      file: buffer,
      filename,
      filetype: 'markdown',
      title: title || filename,
    })
  }

  async uploadText(
    channel: string,
    text: string,
    filename: string = 'document.txt',
    title?: string
  ): Promise<void> {
    const buffer = Buffer.from(text, 'utf-8')

    await this.uploadFile({
      channels: channel,
      file: buffer,
      filename,
      filetype: 'text',
      title: title || filename,
    })
  }

  private handleError(method: string, error: unknown): never {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    console.error(`[SlackFileUploader.${method}] Error:`, errorMessage)
    throw new Error(`Slack File Upload error in ${method}: ${errorMessage}`)
  }
}

export const slackFileUploader = new SlackFileUploader()
