export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  // Spans the full gallery width instead of sitting in a column.
  wide?: boolean;
};

// The kinds of experience a visitor can highlight on the /projects page.
export const projectCategories = [
  "Full-stack",
  "Front-end",
  "Mobile",
  "AI & LLMs",
  "Data & APIs",
  "Client & team work",
] as const;

export type ProjectCategory = (typeof projectCategories)[number];

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  categories: ProjectCategory[];
  role: string;
  links: {
    demo?: string;
    repo?: string;
  };
  // Short skill callouts shown as accent chips on the preview card.
  showcases?: string[];
  highlights: string[];
  images?: ProjectImage[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "look-up-app",
    title: "LOOK UP App",
    tagline: "Senior design capstone — a mobile app that scans nearby planes on a 2D map or in AR by pointing your phone at the sky.",
    description:
      "A full-stack senior design capstone built with a 4-person student team over the fall 2024 semester. A React Native mobile app that detects planes near the user and offers two ways to explore: a 2D map view, or an AR mode where the camera scans the sky and overlays live flight data once it identifies a plane in frame. Owned the front end for the 2D map experience: designing the UI, building the search and filter system in TypeScript, and designing the plane information cards. One of the bigger challenges was flight data reliability — after testing several providers, the team landed on the Flightradar24 API, and getting the payload parsed and displayed correctly took real iteration.",
    tech: ["TypeScript", "React Native", "Expo", "Flightradar24 API"],
    categories: ["Mobile", "Front-end", "Data & APIs", "Client & team work"],
    showcases: ["Mobile + AR", "Live API data", "4-person team"],
    role: "Front End Developer / Front End Designer",
    links: {
      demo: "",
      repo: "https://github.com/c4den/LookUp",
    },
    highlights: [
      "Designed and implemented the UI for the 2D map experience as part of a team, over a 3-month sprint.",
      "Built and iterated on the search and filter system in TypeScript through ~4 rounds of optimization.",
      "Designed the plane information cards showing live flight data (flight number, altitude, airline) pulled from the Flightradar24 API.",
      "Solved inconsistent third-party flight data by iterating on API integration until payload parsing and display were reliable.",
      "Doubled data retrieval speed by tightening the integration between front-end and back-end systems.",
    ],
    featured: true,
  },
  {
    slug: "learn-the-markets",
    title: "Learn the Markets",
    tagline: "Full-stack company website built and maintained for a four-person startup.",
    description:
      "A fully responsive company website for Learn the Markets, built with React, Tailwind CSS, and HTML. Owned the full lifecycle — requirements, UI/UX design, development, deployment — under a one-year contract, including a year of post-launch support.",
    tech: ["React", "Tailwind CSS", "HTML"],
    categories: ["Full-stack", "Front-end", "Client & team work"],
    showcases: ["Real client work", "+70% engagement", "Owned end to end"],
    role: "Full Stack Developer",
    links: {
      demo: "",
      repo: "",
    },
    highlights: [
      "Increased user engagement by 70% with a fully responsive rebuild of the site.",
      "Owned the site for a year post-launch, handling everything from requirement gathering to deployment and maintenance.",
      "Improved functionality and user experience by 15% through feature updates, redesigns, and new animations driven by user feedback.",
    ],
    featured: false,
  },
  {
    slug: "tournament-tracker",
    title: "Tournament Tracker",
    tagline:
      "Full-stack expense/earnings tracker for card game trips and tournaments, with its own multi-user auth and database.",
    description:
      "A full-stack web app for tracking expenses and earnings across card game trips and tournaments — grew out of running events at GEEK'D and wanting something better than a spreadsheet. Started as a single-file HTML prototype and rebuilt into a real multi-user app: each person signs up with their own email/password account and only ever sees their own trips, enforced at the API layer with a normalized schema (User → Trip → Transaction) so no one can see or edit someone else's data.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "NextAuth.js"],
    categories: ["Full-stack", "Data & APIs"],
    showcases: ["Full-stack", "Secure auth", "Database design"],
    role: "Solo Developer",
    links: {
      demo: "https://tournament-tracker-rho.vercel.app/",
      repo: "https://github.com/Drowzyx1/tournament-tracker",
    },
    highlights: [
      "Built a full-stack expense/earnings tracker with Next.js, PostgreSQL, and Prisma ORM, including a normalized multi-user schema (User → Trip → Transaction).",
      "Implemented password-based authentication with NextAuth.js and bcrypt-hashed credentials, scoping every API route to the signed-in user so one person can never see or edit another's data.",
      "Debugged and fixed a production-only redirect loop caused by a cookie/secure-flag mismatch between local and Vercel environments.",
      "Deployed on Vercel with a hosted Neon Postgres database, and made the UI responsive across mobile viewports.",
    ],
    featured: true,
  },
  {
    slug: "poker-session-tracker",
    title: "Poker Session Tracker",
    tagline:
      "Log buy-ins, rebuys, and cash-outs for a home poker game, with leaderboards and bankroll charts that sync live across the table.",
    description:
      "A poker session tracker built for a home game group, where every buy-in and cash-out gets logged and the whole table sees the same numbers. It has four views: Standings (leaderboard, running-profit chart, and playful superlatives like Chip Leader and Ice Cold), a Live game mode for tracking rebuys and cashing players out as they leave, Sessions for logging and editing past nights, and Players for individual profiles with bankroll charts and game logs. It's a single HTML file of vanilla JavaScript — no framework, no build step, and no chart library; the charts are hand-built SVG. Data syncs live across devices, so a rebuy logged on one phone shows up on everyone else's. The live demo runs on made-up players and games, so you can try everything without touching a real group's numbers.",
    tech: ["JavaScript", "HTML/CSS", "SVG", "Real-time sync"],
    categories: ["Front-end", "Data & APIs"],
    showcases: ["Live multi-device sync", "Custom SVG charts", "No framework"],
    role: "Designer & Developer",
    links: {
      demo: "/demos/poker-session-tracker.html",
      repo: "",
    },
    images: [
      {
        src: "/projects/poker-session-tracker/standings.jpg",
        alt: "Standings tab with a ranked leaderboard and a grid of awards such as Chip Leader and The Donor",
        width: 1650,
        height: 1725,
        caption: "Standings: a leaderboard with rank movement, plus awards like Chip Leader and Bad Beat.",
      },
      {
        src: "/projects/poker-session-tracker/chart.jpg",
        alt: "Line chart of each player's running profit after every night",
        width: 1572,
        height: 725,
        caption: "Running profit after each night, shown together or split per player.",
      },
      {
        src: "/projects/poker-session-tracker/live-game.jpg",
        alt: "Live game tab showing the bank total and players at the table with rebuy buttons",
        width: 1650,
        height: 1500,
        caption: "Live game: log rebuys and cash-outs as they happen, with a bank total to count against.",
      },
      {
        src: "/projects/poker-session-tracker/mobile-live-game.jpg",
        alt: "The live game screen on a phone",
        width: 780,
        height: 1688,
        caption: "Built for phones at the table.",
      },
      {
        src: "/projects/poker-session-tracker/sessions.jpg",
        alt: "Sessions tab with the latest night expanded to show each player's buy-in, cash-out, and net",
        width: 1650,
        height: 1650,
        caption: "Sessions: every night's buy-ins and cash-outs, with a check that money in matches money out.",
      },
      {
        src: "/projects/poker-session-tracker/player-profile.jpg",
        alt: "A player profile with profit, win rate, streaks, and money stats",
        width: 1650,
        height: 1950,
        caption: "Player profiles: profit, win rate, streaks, and bankroll history.",
      },
    ],
    highlights: [
      "Built a four-view app (Standings, Live game, Sessions, Players) in a single vanilla JavaScript file with no framework or build step.",
      "Wrote the stats engine behind the leaderboard and awards: profit totals, win rate, winning/losing streaks, best and worst nights, and night-to-night consistency, filterable by week, month, year, or all time.",
      "Hand-built the interactive SVG charts (combined and split running-profit views, plus per-player bankroll charts) instead of pulling in a charting library.",
      "Subscribed to shared data collections for real-time sync across devices, with view-only vs. editor access respected.",
      "Added a money-in vs. money-out check to the session form so mismatched cash counts get flagged before a night is saved.",
      "Designed for phones at the table: responsive layout and automatic light/dark theming.",
    ],
    featured: false,
  },
  {
    slug: "ai-video-maker",
    title: "AI Video Maker",
    tagline:
      "Turns a topic into a finished vertical Short: Claude writes the script, then the app narrates, animates, and captions it.",
    description:
      "A desktop app for making faceless YouTube Shorts. Pick a channel type and a topic, and Claude writes a scene-by-scene script that you can edit, reorder, or rewrite. The app then narrates it with an AI voice and draws every frame itself: animated big text, emoji badges, counting numbers, bar charts, step diagrams, and photos, with word-by-word captions, a progress bar, and sound effects generated in code. The output is a 1080×1920 MP4 ready to upload. It runs locally from a double-click Mac app with a Streamlit interface, and can also be used from a phone on the same Wi-Fi behind a passcode. It's about 2,400 lines of Python, and the Claude API key never leaves the user's machine.",
    tech: ["Python", "Streamlit", "Claude API", "Pillow", "FFmpeg", "edge-tts"],
    categories: ["AI & LLMs", "Data & APIs"],
    showcases: ["AI scriptwriting", "Custom animation engine", "Desktop + phone"],
    role: "Designer & Developer",
    links: {
      demo: "",
      repo: "",
    },
    highlights: [
      "Built the full pipeline in about 2,400 lines of Python: script generation, voice synthesis, frame rendering, audio mixing, and video encoding.",
      "Wrote a custom animation engine: every frame is drawn with Pillow (easing curves, pop-in badges, counting numbers, growing bar charts, sliding diagrams) and streamed to FFmpeg, so a 45-second 1080×1920 Short renders in about 11 seconds, voice generation aside.",
      "Integrated Claude for scriptwriting and topic ideas through the raw API using only the Python standard library, with a model choice that trades quality for cost (about 2¢ vs. under 1¢ per script).",
      "Set up health, money, and law channels to teach rather than advise, since YouTube won't monetize AI narrators giving advice on those topics.",
      "Built a voice system on Microsoft neural voices plus offline Mac voices, with preset characters that combine voice, speed, pitch, and an audio effect.",
      "Added a photo-sourcing fallback chain (local files, optional Pixabay, then Openverse limited to commercially licensed images, then a text card) so a scene never fails and licensing stays safe.",
      "Added optional gameplay-footage backgrounds in split-screen or full-screen layouts, and phone access over local Wi-Fi protected by a passcode.",
    ],
    images: [
      {
        src: "/projects/ai-video-maker/visuals-1.jpg",
        alt: "Four frames from a generated Short: a photo card, a counting number, a bar chart comparison, and a step-by-step diagram, each with captions and a progress bar",
        width: 2232,
        height: 960,
        caption:
          "Frames from a generated Short: photo card, counting number, bar chart, and step diagram, with word-by-word captions and a progress bar.",
        wide: true,
      },
      {
        src: "/projects/ai-video-maker/visuals-2.jpg",
        alt: "Four more frames from a generated Short: emoji badges, big text with a highlighted word, a row of emoji icons, and a versus comparison",
        width: 2232,
        height: 960,
        caption:
          "More scene types: emoji badges, big text with highlighted words, and VS comparisons. Rendered by the app from a script, not edited by hand.",
        wide: true,
      },
    ],
    featured: false,
  },
  {
    slug: "ai-guided-portfolio",
    title: "AI-Guided Portfolio",
    tagline:
      "An AI chatbot layered on top of this portfolio that can talk about my work and navigate visitors to it.",
    description:
      "This portfolio itself, built with Next.js, TypeScript, and Tailwind — but the interesting part is the guide chatbot running on the Claude API. It's given tool-use access to a navigate_to_project function, so it can route visitors to the right project page mid-conversation instead of just answering in text. The bot's knowledge comes straight from the same content files that power the rest of the site (profile.ts, projects.ts), so there's one source of truth instead of a separate FAQ to maintain. The API key never touches the browser — all calls go through a server-side route.",
    tech: ["TypeScript", "Next.js", "Tailwind CSS", "Claude API", "Tool use"],
    categories: ["AI & LLMs", "Full-stack", "Front-end"],
    showcases: ["LLM tool calling", "Secure server-side API"],
    role: "Designer & Developer",
    links: {
      demo: "",
      repo: "https://github.com/Drowzyx1/portfolio",
    },
    highlights: [
      "Built an AI guide chatbot with tool-calling access to navigate_to_project, letting it route visitors to project pages directly instead of just describing them.",
      "Designed the content model so one set of files (profile.ts, projects.ts) drives the human-facing pages and the chatbot's knowledge — no duplicate content to maintain.",
      "Kept the API key server-side only, via a dedicated /api/chat route, so credentials never reach the client.",
    ],
    featured: false,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
