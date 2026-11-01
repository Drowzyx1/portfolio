import { ProjectCard } from "@/components/ProjectCard";
import { getProjectBySlug, type Project } from "@/content/projects";
import type { Message } from "./useGuideChat";

export function ChatThread({
  messages,
  loading,
  error,
}: {
  messages: Message[];
  loading: boolean;
  error: string | null;
}) {
  return (
    <>
      {messages.map((m, i) => {
        const recommended = (m.projectSlugs ?? [])
          .map((slug) => getProjectBySlug(slug))
          .filter((p): p is Project => !!p);

        return (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <span
              className={`inline-block max-w-[94%] rounded-lg px-3 py-2 text-left text-sm sm:max-w-[85%] ${
                m.role === "user"
                  ? "bg-zinc-950 text-white dark:bg-white dark:text-black"
                  : "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
              }`}
            >
              {m.content}
            </span>
            {recommended.map((project, idx) => (
              <div key={project.slug} className="mt-2 max-w-[94%] sm:max-w-[85%]">
                <ProjectCard project={project} delay={idx * 120} />
              </div>
            ))}
          </div>
        );
      })}
      {loading && (
        <div className="text-left text-sm text-zinc-400">Thinking…</div>
      )}
      {error && <div className="text-left text-sm text-red-500">{error}</div>}
    </>
  );
}
