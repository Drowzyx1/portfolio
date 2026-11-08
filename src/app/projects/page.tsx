import { projects } from "@/content/projects";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { WorkInProgress } from "@/components/wip/WorkInProgress";

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="animate-fade-in-up text-2xl font-semibold tracking-tight text-zinc-950 opacity-0 dark:text-zinc-50">
        Projects
      </h1>
      <ProjectsExplorer projects={projects} />
      <div className="mt-14">
        <WorkInProgress />
      </div>
    </div>
  );
}
