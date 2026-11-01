"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import {
  projectCategories,
  type Project,
  type ProjectCategory,
} from "@/content/projects";

export function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<ProjectCategory | null>(null);

  const countFor = (c: ProjectCategory) =>
    projects.filter((p) => p.categories.includes(c)).length;
  const matches = active
    ? projects.filter((p) => p.categories.includes(active)).length
    : projects.length;

  return (
    <>
      <div
        className="animate-fade-in-up mt-6 opacity-0"
        style={{ animationDelay: "40ms" }}
      >
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Highlight by experience
        </p>
        <div
          role="group"
          aria-label="Highlight projects by experience"
          className="mt-2 flex flex-wrap gap-2"
        >
          <FilterChip selected={active === null} onClick={() => setActive(null)}>
            All
          </FilterChip>
          {projectCategories.map((c) => (
            <FilterChip
              key={c}
              selected={active === c}
              onClick={() => setActive(active === c ? null : c)}
              count={countFor(c)}
            >
              {c}
            </FilterChip>
          ))}
        </div>
        <p
          aria-live="polite"
          className="mt-3 min-h-5 text-sm text-zinc-500"
        >
          {active
            ? `${matches} ${matches === 1 ? "project highlights" : "projects highlight"} ${active} experience.`
            : "Pick an area to see which projects show it."}
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {projects.map((project, i) => {
          const isMatch = !!active && project.categories.includes(active);
          const isDimmed = !!active && !isMatch;
          return (
            <div
              key={project.slug}
              className={`relative rounded-lg transition-all duration-300 [&>a]:h-full ${
                isMatch
                  ? "ring-2 ring-indigo-500/70 dark:ring-indigo-400/60"
                  : ""
              } ${isDimmed ? "opacity-40 saturate-50 hover:opacity-100 hover:saturate-100" : ""}`}
            >
              {isMatch && (
                <span className="absolute -top-2.5 right-3 z-10 rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-medium text-white shadow dark:bg-indigo-500">
                  ✓ {active}
                </span>
              )}
              <ProjectCard project={project} delay={80 + i * 60} />
            </div>
          );
        })}
      </div>
    </>
  );
}

function FilterChip({
  selected,
  onClick,
  count,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors ${
        selected
          ? "border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500"
          : "border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
      }`}
    >
      {children}
      {count !== undefined && (
        <span
          className={`text-xs ${selected ? "text-indigo-100" : "text-zinc-400"}`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
