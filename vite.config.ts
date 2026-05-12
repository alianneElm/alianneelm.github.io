import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import Anthropic from '@anthropic-ai/sdk'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import { SYSTEM_PROMPT } from './src/lib/systemPrompt'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Read .env.local directly — bypasses Vite's env loading order
function getApiKey(): string {
  try {
    const raw = readFileSync(resolve(__dirname, '.env.local'), 'utf-8')
    const match = raw.match(/^ANTHROPIC_API_KEY=(.+)$/m)
    return match ? match[1].trim() : ''
  } catch {
    return process.env.ANTHROPIC_API_KEY ?? ''
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'api-middleware',
      configureServer(server) {

        // ── /api/generate-cv ──────────────────────────────────────────────────
        server.middlewares.use(
          '/api/generate-cv',
          (req: IncomingMessage, res: ServerResponse) => {
            if (req.method !== 'POST') {
              res.statusCode = 405
              res.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }
            const apiKey = getApiKey()
            if (!apiKey) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'ANTHROPIC_API_KEY not set' }))
              return
            }
            let body = ''
            req.on('data', (chunk: Buffer) => { body += chunk.toString() })
            req.on('end', async () => {
              try {
                const { roleDescription } = JSON.parse(body)
                const client = new Anthropic({ apiKey })
                const CV_SYSTEM_PROMPT = `
You are an expert CV writer for Consid, a Swedish IT consulting firm.
Your task is to generate a tailored CV summary for Alianne Elm based on a given job description.

Alianne's background:
- 8 years fullstack developer, specialising in FinTech and AI
- Tech Lead at Octane (US fintech) for 3 years — loan decisioning, bank integrations, hexagonal architecture, AWS
- AI implementation at Devoteam — LangChain, LLMs, Generative AI, RAG, Azure, Snowflake
- Stack: Java, Python, Django, Spring Boot, React, TypeScript, Vue.js, PostgreSQL, AWS, Azure, Docker, Kubernetes
- Certifications: Anthropic Academy (4 certs), GenAI Level 2, SnowPro Core, AWS (in progress)
- Soft skills: structured, solution-oriented, builds strong relationships, drives change, intellectual curiosity, entrepreneurial mindset
- Languages: Spanish (native), Swedish (fluent), English (fluent)

Available experience IDs: devoteam, octane, tedsys, gualda, encaprichate

Rules:
- Write in Swedish
- Always write in THIRD PERSON — use "hon", "Alianne", "hennes" — never "jag", "mig" or "min"
  Example: "Alianne har 8 års erfarenhet av..." / "Hon kombinerar..." / "Hennes bakgrund inom..."
- Never exaggerate — only claim Tech Lead for the Octane Partner Platform role
- Use "hade ansvar för", "arbetade med", "bidrog till" — not "ledde" unless explicitly the Octane Tech Lead role
- Be concise and sales-oriented

Respond ONLY with valid JSON:
{
  "roleTitle": "string",
  "summary": {
    "professional": "string (2-4 sentences tailored to the role)",
    "personal": "string (2-3 sentences about personality and soft skills)",
    "bonus": "string (1-2 sentences about passion for learning or non-profit)"
  },
  "highlightedExperiences": ["array of experience IDs, max 3, most relevant first"],
  "experienceHighlights": {
    "experience_id": "1-2 sentences in Swedish, third person, explaining specifically why THIS experience is relevant for THIS assignment. Be concrete — mention the specific technologies or responsibilities from the job description that match."
  }
}
Note: experienceHighlights should contain entries ONLY for the experiences in highlightedExperiences (max 3).`
                const response = await client.messages.create({
                  model: 'claude-haiku-4-5',
                  max_tokens: 1000,
                  system: CV_SYSTEM_PROMPT,
                  messages: [{ role: 'user', content: `Generera ett anpassat CV för följande uppdrag:\n\n${roleDescription}` }],
                })
                const text = response.content[0].type === 'text' ? response.content[0].text : ''
                const jsonMatch = text.match(/\{[\s\S]*\}/)
                if (!jsonMatch) throw new Error('No JSON in response')
                const parsed = JSON.parse(jsonMatch[0])
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(parsed))
              } catch (err) {
                console.error('[api/generate-cv dev]', err)
                res.statusCode = 500
                res.end(JSON.stringify({ error: 'Internal server error' }))
              }
            })
          }
        )

        // ── /api/chat ─────────────────────────────────────────────────────────
        server.middlewares.use(
          '/api/chat',
          (req: IncomingMessage, res: ServerResponse) => {
            if (req.method !== 'POST') {
              res.statusCode = 405
              res.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }

            const apiKey = getApiKey()
            if (!apiKey) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'ANTHROPIC_API_KEY not set in .env.local' }))
              return
            }

            let body = ''
            req.on('data', (chunk: Buffer) => { body += chunk.toString() })
            req.on('end', async () => {
              try {
                const { messages } = JSON.parse(body)
                const client = new Anthropic({ apiKey })
                const response = await client.messages.create({
                  model: 'claude-haiku-4-5',
                  max_tokens: 1200,
                  system: SYSTEM_PROMPT,
                  messages,
                })
                const text = response.content[0].type === 'text' ? response.content[0].text : ''
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ content: text }))
              } catch (err) {
                console.error('[api/chat dev]', err)
                res.statusCode = 500
                res.end(JSON.stringify({ error: 'Internal server error' }))
              }
            })
          }
        )
      },
    },
  ],
})
