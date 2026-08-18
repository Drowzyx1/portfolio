export type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  role: string;
  links: {
    demo?: string;
    repo?: string;
  };
  highlights: string[];
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
    featured: true,
  },
  {
    slug: "ai-guided-portfolio",
    title: "AI-Guided Portfolio",
    tagline:
      "An AI chatbot layered on top of this portfolio that can talk about my work and navigate visitors to it.",
    description:
      "This portfolio itself, built with Next.js, TypeScript, and Tailwind — but the interesting part is the guide chatbot running on the Claude API. It's given tool-use access to a navigate_to_project function, so it can route visitors to the right project page mid-conversation instead of just answering in text. The bot's knowledge comes straight from the same content files that power the rest of the site (profile.ts, projects.ts), so there's one source of truth instead of a separate FAQ to maintain. The API key never touches the browser — all calls go through a server-side route.",
    tech: ["TypeScript", "Next.js", "Tailwind CSS", "Claude API", "Tool use"],
    role: "Designer & Developer",
    links: {
      demo: "",
      repo: "",
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
