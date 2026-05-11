import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT } from './systemPrompt'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function handleChatRequest(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set')

  const client = new Anthropic({ apiKey })

  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1200,
    system: SYSTEM_PROMPT,
    messages: messages.map(m => ({ role: m.role, content: m.content })),
  })

  const block = response.content[0]
  if (block.type !== 'text') throw new Error('Unexpected response type')
  return block.text
}
