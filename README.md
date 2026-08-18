# Carlos Martinez — Portfolio

Personal portfolio site with an AI guide chatbot built on the Claude API —
visitors can browse projects and experience the normal way, or just ask the
chatbot questions and let it navigate them to the right page.

**Contact:** carlose082002@gmail.com · [LinkedIn](https://www.linkedin.com/in/carlosemartinez1/) · [GitHub](https://github.com/Drowzyx1)

## What's interesting here

The standout feature is the AI guide chatbot (`src/components/chat/`): it's
given tool-calling access to a `navigate_to_project` function, so instead of
just describing a project in text, it can surface a clickable preview card
for the right page mid-conversation. The bot's entire knowledge base is
generated from the same content files (`src/content/profile.ts`,
`src/content/projects.ts`) that drive the human-facing pages, so there's one
source of truth instead of a chatbot FAQ that drifts out of sync with the
actual site. The API key stays server-side via a dedicated `/api/chat`
route and never reaches the browser.

The site itself is content-driven: every project on `/projects` and its
detail page, plus the featured grid on the home page, is generated from a
single typed array in `projects.ts`. Adding a project is a data change, not
a code change.

## Tech stack

Next.js (App Router) · TypeScript · Tailwind CSS · Claude API (Anthropic) — tool use / function calling

## Project structure

- `src/content/profile.ts` — bio, skills, education, experience
- `src/content/projects.ts` — project data; powers `/projects`, `/projects/[slug]`, and the chatbot
- `src/app/` — pages: home, `/projects`, `/projects/[slug]`, `/about`
- `src/app/api/chat/route.ts` — server-side Claude API route
- `src/lib/chatContext.ts` — builds the chatbot's system prompt from the content files
- `src/components/chat/` — the chat widget UI and its tool-calling logic

## Running it locally

```bash
git clone https://github.com/Drowzyx1/portfolio.git
cd portfolio
npm install
cp .env.local.example .env.local   # add your own ANTHROPIC_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying

Pushes to `main` auto-deploy on Vercel, with `ANTHROPIC_API_KEY` set as an
environment variable there.

---

Open to software engineering roles, front-end through full-stack.
