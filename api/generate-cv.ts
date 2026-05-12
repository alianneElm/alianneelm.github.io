import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'

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
- Founder of non-profit Llego la Luz (humanitarian aid to Cuba)
- Studies quantum physics and quantum computing in spare time

Available experience IDs: devoteam, octane, tedsys, gualda, encaprichate

Rules:
- Write in Swedish
- Always write in THIRD PERSON — use "hon", "Alianne", "hennes" — never "jag", "mig" or "min"
  Example: "Alianne har 8 års erfarenhet av..." / "Hon kombinerar..." / "Hennes bakgrund inom..."
- Never exaggerate leadership. The ONLY Tech Lead role was the Partner Platform at Octane (product she designed and built from scratch, led partner integrations and onboarding). For the Dealer Platform and Decisioning Engine at Octane she was a contributor/developer — not the lead. Never write that she "ledde" the decisioning system, hexagonal architecture or AWS work at Octane.
- Use accurate language: "bidrog till", "arbetade med", "var del av teamet som" for contributor roles — only use "ledde" or "hade ansvar för" for the Partner Platform Tech Lead role
- Be concise and sales-oriented
- Do NOT claim Linux experience. If the job requires Linux, do not mention it as a match — instead highlight her Docker/Kubernetes/AWS work as related context

Respond ONLY with valid JSON in this exact format:
{
  "roleTitle": "string (the role title for this CV, e.g. 'Java-utvecklare' or 'AI-specialist')",
  "summary": {
    "professional": "string (2-4 sentences tailored to the role, highlighting most relevant experience)",
    "personal": "string (2-3 sentences about personality, work style, soft skills relevant to the role)",
    "bonus": "string (1-2 sentences about her passion for learning, quantum computing, or non-profit work — whichever is most relevant)"
  },
  "highlightedExperiences": ["array of experience IDs to show first, max 3, most relevant to the role"],
  "experienceHighlights": {
    "experience_id": "1-2 sentences in Swedish, third person, explaining specifically why THIS experience is relevant for THIS assignment."
  },
  "competencies": {
    "Plattformar": ["list of 2-5 platform/cloud technologies from Alianne's profile that match the assignment, e.g. AWS, Azure, PostgreSQL"],
    "Tekniker": ["list of 2-5 languages/frameworks that match, e.g. Java, Spring Boot, React.js, Python"],
    "Verktyg": ["list of 2-4 tools that match, e.g. Docker, Jenkins, JIRA, Kubernetes"],
    "Verksamhet och funktion": ["list of 1-3 business domains or functions that match, e.g. FinTech, Säkerhet, Systemmigrering"]
  }
}
Note: competencies should only list skills Alianne actually has that are relevant to this specific assignment. Keep each list focused and concise.
`

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' })
  }

  const { roleDescription } = req.body as { roleDescription: string }
  if (!roleDescription) {
    return res.status(400).json({ error: 'roleDescription is required' })
  }

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1000,
      system: CV_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Generera ett anpassat CV för följande uppdrag:\n\n${roleDescription}`,
        },
      ],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    // Extract JSON from response (handle potential markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in response')

    const parsed = JSON.parse(jsonMatch[0])
    return res.status(200).json(parsed)
  } catch (err) {
    console.error('[api/generate-cv]', err)
    return res.status(500).json({ error: 'Failed to generate CV' })
  }
}
