# Portfolio

Personal portfolio built with Next.js + TypeScript + Tailwind, with an AI
guide chatbot (Claude API) layered on top of normal manual navigation.

## Structure

- `src/content/profile.ts` — your bio, skills, and work experience. **Edit this first.**
- `src/content/projects.ts` — your projects. **Edit this too.** Same data
  powers the `/projects` pages and the chatbot's knowledge.
- `src/app/` — pages: home, `/projects`, `/projects/[slug]`, `/about`.
- `src/app/api/chat/route.ts` — server-side API route that calls the Claude
  API. Your API key never reaches the browser.
- `src/lib/chatContext.ts` — builds the chatbot's system prompt from the
  content files above.
- `src/components/chat/ChatWidget.tsx` — the floating chat UI. The bot can
  call a `navigate_to_project` tool, which the widget uses to route the
  visitor to the right project page.

The chatbot is additive — every page also works with it closed, via the
normal nav bar.

## Getting started

1. Fill in `src/content/profile.ts` and `src/content/projects.ts` with your
   real information.
2. Copy the env example and add your key:

   ```bash
   cp .env.local.example .env.local
   ```

   Get an API key from [console.anthropic.com](https://console.anthropic.com/settings/keys),
   and paste it into `.env.local` as `ANTHROPIC_API_KEY`.

3. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. In the Vercel project's Environment Variables settings, add
   `ANTHROPIC_API_KEY` with your key. It's never committed to git.
4. Deploy. Every push to `main` will redeploy automatically.

## Notes

- The chatbot uses `claude-sonnet-5`. Chat calls cost a small amount per
  message via the Anthropic API — fine at low traffic, but keep an eye on
  usage if the site gets a lot of visitors.
- To add a project, add an entry to `src/content/projects.ts` — no other
  code changes needed; the grid, detail page, and chatbot all pick it up
  automatically.
