import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleChatRequest, type ChatMessage } from '../src/lib/chatHandler'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages } = req.body as { messages: ChatMessage[] }
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid messages payload' })
    }

    const content = await handleChatRequest(messages)
    return res.status(200).json({ content })
  } catch (err) {
    console.error('Chat error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
