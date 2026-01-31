import type {
  InteractiveQuestionPayload,
  Priority,
  SlackBlock,
  SlackHeaderBlock,
  SlackSectionBlock,
  SlackActionsBlock,
  SlackContextBlock,
  SlackDividerBlock,
  SlackButtonElement,
} from '@/types/slack'

const PRIORITY_CONFIG: Record<
  Priority,
  { emoji: string; color: 'primary' | 'danger' | undefined }
> = {
  low: { emoji: '💡', color: undefined },
  medium: { emoji: '⚠️', color: 'primary' },
  high: { emoji: '🚨', color: 'danger' },
}

export function buildInteractiveQuestionBlocks(
  payload: InteractiveQuestionPayload
): SlackBlock[] {
  const { question, session_id, confidence, trigger_type } = payload
  const priorityConfig = PRIORITY_CONFIG[question.priority]

  const blocks: SlackBlock[] = []

  blocks.push(buildHeaderBlock(question.title, priorityConfig.emoji))

  blocks.push(buildDividerBlock())

  if (Object.keys(question.context).length > 0) {
    blocks.push(buildContextSection(question.context))
    blocks.push(buildDividerBlock())
  }

  blocks.push(buildActionsBlock(question.options, session_id, priorityConfig.color))

  blocks.push(
    buildMetadataContext(session_id, confidence, trigger_type, question.priority)
  )

  return blocks
}

function buildHeaderBlock(title: string, emoji: string): SlackHeaderBlock {
  return {
    type: 'header',
    text: {
      type: 'plain_text',
      text: `${emoji} ${title}`,
    },
  }
}

function buildContextSection(context: Record<string, any>): SlackSectionBlock {
  const fields = Object.entries(context).map(([key, value]) => ({
    type: 'mrkdwn' as const,
    text: `*${key}:*\n${formatContextValue(value)}`,
  }))

  return {
    type: 'section',
    fields,
  }
}

function formatContextValue(value: any): string {
  if (typeof value === 'string') {
    return `\`${value}\``
  }
  if (typeof value === 'object' && value !== null) {
    return `\`\`\`${JSON.stringify(value, null, 2)}\`\`\``
  }
  return String(value)
}

function buildActionsBlock(
  options: string[],
  sessionId: string,
  color: 'primary' | 'danger' | undefined
): SlackActionsBlock {
  const elements: SlackButtonElement[] = options.map((option, index) => ({
    type: 'button',
    text: {
      type: 'plain_text',
      text: option,
    },
    value: JSON.stringify({
      session_id: sessionId,
      selected_option: option,
    }),
    action_id: `answer_${sessionId}_${index}`,
    ...(index === 0 && color ? { style: color } : {}),
  }))

  return {
    type: 'actions',
    elements,
  }
}

function buildMetadataContext(
  sessionId: string,
  confidence: number,
  triggerType: string,
  priority: Priority
): SlackContextBlock {
  return {
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: `Session: \`${sessionId}\` | Confidence: \`${(confidence * 100).toFixed(1)}%\` | Trigger: \`${triggerType}\` | Priority: \`${priority}\``,
      },
    ],
  }
}

function buildDividerBlock(): SlackDividerBlock {
  return {
    type: 'divider',
  }
}

export function buildTextSection(text: string): SlackSectionBlock {
  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text,
    },
  }
}

export function buildCodeSection(code: string, language = ''): SlackSectionBlock {
  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `\`\`\`${language}\n${code}\n\`\`\``,
    },
  }
}
