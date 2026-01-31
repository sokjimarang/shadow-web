// Slack Block Kit 타입 정의

export type Priority = 'low' | 'medium' | 'high'

// 연동 포인트 A: Shadow → Slack (질문 전송)
export interface InteractiveQuestionPayload {
  trigger_type: string
  confidence: number
  question: {
    title: string
    context: Record<string, any>
    options: string[]
    priority: Priority
  }
  session_id: string
}

// 연동 포인트 B: Slack → Shadow (답변 수신)
export interface InteractiveAnswerPayload {
  session_id: string
  answer: {
    selected_option: string
    additional_context?: string
    create_exception_rule?: boolean
  }
  answered_at: string
}

// Slack Block Kit 요소 타입
export interface SlackBlock {
  type: string
  [key: string]: any
}

export interface SlackHeaderBlock extends SlackBlock {
  type: 'header'
  text: {
    type: 'plain_text'
    text: string
  }
}

export interface SlackSectionBlock extends SlackBlock {
  type: 'section'
  text?: {
    type: 'mrkdwn' | 'plain_text'
    text: string
  }
  fields?: Array<{
    type: 'mrkdwn' | 'plain_text'
    text: string
  }>
}

export interface SlackActionsBlock extends SlackBlock {
  type: 'actions'
  elements: SlackActionElement[]
}

export interface SlackContextBlock extends SlackBlock {
  type: 'context'
  elements: Array<{
    type: 'mrkdwn' | 'plain_text'
    text: string
  }>
}

export interface SlackDividerBlock extends SlackBlock {
  type: 'divider'
}

// Action 요소
export interface SlackActionElement {
  type: 'button' | 'static_select' | 'overflow'
  [key: string]: any
}

export interface SlackButtonElement extends SlackActionElement {
  type: 'button'
  text: {
    type: 'plain_text'
    text: string
  }
  value: string
  action_id: string
  style?: 'primary' | 'danger'
}

// Slack Interactivity Webhook Payload
export interface SlackInteractionPayload {
  type: 'block_actions' | 'view_submission'
  user: {
    id: string
    username: string
    name: string
  }
  response_url: string
  actions?: SlackBlockAction[]
  view?: any
  message?: {
    ts: string
    text: string
  }
}

export interface SlackBlockAction {
  action_id: string
  block_id: string
  type: string
  value?: string
  selected_option?: {
    text: {
      type: string
      text: string
    }
    value: string
  }
}

// 메시지 전송 옵션
export interface SendMessageOptions {
  channel: string
  text: string
  blocks?: SlackBlock[]
  thread_ts?: string
}

// 파일 업로드 옵션
export interface UploadFileOptions {
  channels: string
  content?: string
  file?: Buffer
  filename?: string
  filetype?: string
  initial_comment?: string
  title?: string
}

// 에이전트 명세서 전송 옵션
export interface SendAgentSpecOptions {
  channel: string
  spec: string
  format: 'text' | 'file'
  filename?: string
}
