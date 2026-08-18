export type SkillGroup = {
  label: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    items: [
      "JavaScript",
      "TypeScript",
      "Java",
      "Python",
      "C",
      "Haskell",
      "HTML/CSS",
      "SQL",
    ],
  },
  {
    label: "Frameworks & Tools",
    items: [
      "React",
      "Next.js",
      "Node.js",
      "Tailwind CSS",
      "Firebase",
      "Git",
      "Playwright",
    ],
  },
  {
    label: "Exploring",
    items: ["AWS"],
  },
];

export const profile = {
  name: "Carlos Martinez",
  headline: "Software Engineer",
  summary:
    "Software engineer with front-end depth and experience across insurance and startup environments, open to front-end, back-end, or full-stack roles. Skilled at working in cross-functional, multicultural, and remote teams — managing projects, solving problems under pressure, and communicating clearly. Bilingual (English/Spanish).",
  location: "Orlando, FL",
  locationNote: "Open to relocation or remote work",
  email: "carlose082002@gmail.com",
  links: {
    github: "https://github.com/Drowzyx1",
    linkedin: "https://www.linkedin.com/in/carlosemartinez1/",
    resume: "", // link to a hosted PDF of your resume, if you want one
  },
  education: {
    degree: "Bachelor of Science in Computer Science",
    school:
      "University of Central Florida, College of Engineering and Computer Science",
    start: "Aug 2021",
    end: "Aug 2025",
  },
  workAuthorization: "U.S. citizen — no visa sponsorship required.",
  availability:
    "Available immediately, pending two weeks' notice to his current employer.",
  jobSearchNote:
    "Actively looking for software engineering opportunities to start his career — open to front-end, back-end, full-stack, mobile, or other software development roles, not limited to web development.",
  skills: skillGroups.flatMap((g) => g.items),
};

export type Experience = {
  role: string;
  company: string;
  start: string;
  end: string;
  bullets: string[];
};

export const experience: Experience[] = [
  {
    role: "Shift Leader / Event Organizer",
    company: "GEEK'D",
    start: "2024",
    end: "Present",
    bullets: [
      "Designed and implemented the store's first formal process for running tournaments, replacing ad hoc scheduling with a repeatable system — grew steady turnout to 30 players per event.",
      "Independently ran ~5 recurring events a week plus 3 larger monthly events (40+ participants each), managing logistics, staffing, and real-time problem-solving under time pressure.",
      "Drove a 300% increase in participant turnout and store visibility in 3 months by building and running a Discord-based promotion strategy from scratch.",
    ],
  },
  {
    role: "Software Engineer Intern",
    company: "Spot Pet Insurance",
    start: "May 2024",
    end: "Aug 2024",
    bullets: [
      "Designed and optimized a customer-facing web page — quote form and landing pages — resolving ~60 tickets in 3 months using TypeScript, JavaScript, React, and Next.js.",
      "Implemented automated end-to-end testing with Playwright, cutting manual code review effort by 98%.",
      "Integrated Castle.io and ZeroStep for fraud and bot detection, meeting industry compliance standards and stopping an active scam threat against the company.",
      "Collaborated with a ~25-person cross-functional team (Design, Product, QA) to improve user experience by 10% while maintaining code quality.",
      "Reduced customer-reported issues by 15% through user testing and black-box debugging of production issues.",
    ],
  },
];
