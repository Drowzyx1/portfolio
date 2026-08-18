import { ProjectCard } from "@/components/ProjectCard";
import { getProjectBySlug } from "@/content/projects";
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
        const project = m.projectSlug
          ? getProjectBySlug(m.projectSlug)
          : undefined;

        return (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <span
              className={`inline-block max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                m.role === "user"
                  ? "bg-zinc-950 text-white dark:bg-white dark:text-black"
                  : "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
              }`}
            >
              {m.content}
            </span>
            {project && (
              <div className="mt-2 max-w-[85%]">
                <ProjectCard project={project} />
              </div>
            )}
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
