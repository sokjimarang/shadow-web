export const env = {
  slack: {
    botToken: process.env.SLACK_BOT_TOKEN!,
    signingSecret: process.env.SLACK_SIGNING_SECRET!,
    appToken: process.env.SLACK_APP_TOKEN,
  },
  shadowPy: {
    apiUrl: process.env.SHADOW_PY_API_URL || 'http://127.0.0.1:8000',
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
}

export function validateEnv() {
  const required = {
    SLACK_BOT_TOKEN: env.slack.botToken,
    SLACK_SIGNING_SECRET: env.slack.signingSecret,
    NEXT_PUBLIC_SUPABASE_URL: env.supabase.url,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: env.supabase.anonKey,
  }

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    )
  }
}
