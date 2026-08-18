import { projects } from "@/content/projects";
import { ProjectCard } from "@/components/ProjectCard";

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="animate-fade-in-up text-2xl font-semibold tracking-tight text-zinc-950 opacity-0 dark:text-zinc-50">
        Projects
      </h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} delay={80 + i * 60} />
        ))}
      </div>
    </div>
  );
}
