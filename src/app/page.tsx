import { getFeaturedProjects } from "@/content/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { HeroChat } from "@/components/home/HeroChat";

export default function Home() {
  const featured = getFeaturedProjects();

  return (
    <div>
      <HeroChat />

      {featured.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 pb-16">
          <h2 className="animate-fade-in-up text-sm font-medium uppercase tracking-wide text-zinc-500 opacity-0">
            Featured work
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {featured.map((project, i) => (
              <ProjectCard key={project.slug} project={project} delay={80 + i * 60} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
