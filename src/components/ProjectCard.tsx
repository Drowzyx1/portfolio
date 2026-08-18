import Link from "next/link";
import type { CSSProperties } from "react";
import type { Project } from "@/content/projects";

export function ProjectCard({
  project,
  delay = 0,
}: {
  project: Project;
  delay?: number;
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      style={{ animationDelay: `${delay}ms` } as CSSProperties}
      className="animate-fade-in-up block rounded-lg border border-zinc-200 p-4 opacity-0 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-zinc-400 hover:shadow-lg hover:shadow-zinc-900/5 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:shadow-black/30"
    >
      <h3 className="font-medium text-zinc-950 dark:text-zinc-50">
        {project.title}
      </h3>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        {project.tagline}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <span
            key={t}
            className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
          >
            {t}
          </span>
        ))}
      </div>
    </Link>
  );
}
