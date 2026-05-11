# Alianne Elm — Professional Profile Page

A personal profile site for Alianne Elm, consultant at [Consid](https://consid.se). Built for sales teams and potential clients to quickly assess fit for roles and generate tailored CVs.

**Live:** [alianneelm-page.vercel.app](https://alianneelm-page.vercel.app)

---

## Features

- **AI chatbot** — powered by Claude (Anthropic), answers questions about Alianne's experience, skills and role fit in Swedish or English
- **CV generator** — paste a job description, get a tailored PDF CV in Consid's template with AI-generated summaries
- **Bilingual** — Swedish / English via i18next
- **Dark cyberpunk design** — Apple-inspired glassmorphism aesthetic

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Routing | React Router v7 |
| Animation | Framer Motion |
| AI | Anthropic Claude (`claude-haiku-4-5`) via `@anthropic-ai/sdk` |
| PDF | react-to-print |
| Markdown | react-markdown + remark-gfm |
| Icons | lucide-react |
| Hosting | Vercel (frontend + serverless functions) |

---

## Project Structure

```
├── api/                        # Vercel serverless functions (self-contained)
│   ├── chat.ts                 # POST /api/chat — AI chatbot
│   └── generate-cv.ts          # POST /api/generate-cv — CV generation
├── src/
│   ├── components/
│   │   ├── HeroChat.tsx        # Chat UI with icon markers
│   │   ├── CVDocument/         # Printable CV (A4, Consid template)
│   │   └── CVRequestModal/     # Modal for entering job description
│   ├── lib/
│   │   ├── systemPrompt.ts     # AI instructions + Alianne's full profile
│   │   ├── cvData.ts           # CV content (experiences, certs, education)
│   │   └── chatHandler.ts      # Shared chat logic (used in dev via vite.config)
│   ├── pages/
│   │   ├── HomePage.tsx        # Main profile page
│   │   └── CVGeneratorPage.tsx # CV preview + print page
│   └── i18n/                   # Swedish / English translations
├── public/
│   ├── profile.jpg             # Profile photo
│   └── consid-logo.svg         # Consid logo
├── vite.config.ts              # Dev server with /api middleware
└── vercel.json                 # Vercel deployment config
```

---

## Local Development

**1. Clone and install**
```bash
git clone https://github.com/alianneelm/alianne_page.git
cd alianne_page
npm install
```

**2. Add your API key**
```bash
# Create .env.local (gitignored)
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local
```

**3. Run dev server**
```bash
npm run dev
```

The dev server proxies `/api/chat` and `/api/generate-cv` through Vite middleware — no separate backend needed locally.

---

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Add environment variable: `ANTHROPIC_API_KEY` = your Anthropic key
4. Deploy — Vercel auto-detects the Vite frontend and TypeScript serverless functions in `/api/`

> **Important:** Each file in `api/` must be self-contained (no imports from `src/`). Vercel's ESM bundler does not resolve cross-directory local imports at runtime.

---

## Updating the AI Profile

Edit `src/lib/systemPrompt.ts` to update what the chatbot knows about Alianne. The same file is mirrored inline in `api/chat.ts` for production — keep both in sync when making changes.

Restart the dev server after editing: `npm run dev`

---

## Updating the CV Content

Edit `src/lib/cvData.ts` to update experiences, certifications, education and languages shown in the generated PDF.
