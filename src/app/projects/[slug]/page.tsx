import Image from "next/image";
import { notFound } from "next/navigation";
import { getProjectBySlug, projects } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="animate-fade-in-up opacity-0">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          {project.title}
        </h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          {project.tagline}
        </p>
      </div>

      <div
        className="animate-fade-in-up mt-4 flex flex-wrap gap-2 opacity-0"
        style={{ animationDelay: "80ms" }}
      >
        {project.tech.map((t) => (
          <span
            key={t}
            className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
          >
            {t}
          </span>
        ))}
      </div>

      <p
        className="animate-fade-in-up mt-6 text-zinc-700 opacity-0 dark:text-zinc-300"
        style={{ animationDelay: "140ms" }}
      >
        {project.description}
      </p>

      <div className="animate-fade-in-up opacity-0" style={{ animationDelay: "200ms" }}>
        <p className="mt-6 text-sm font-medium text-zinc-500">
          Role: <span className="text-zinc-800 dark:text-zinc-200">{project.role}</span>
        </p>

        {project.highlights.length > 0 && (
          <ul className="mt-4 list-disc space-y-1 pl-5 text-zinc-700 dark:text-zinc-300">
            {project.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        )}
      </div>

      <div
        className="animate-fade-in-up mt-8 flex gap-4 text-sm font-medium opacity-0"
        style={{ animationDelay: "260ms" }}
      >
        {project.links.demo && (
          <a
            href={project.links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-zinc-950 px-4 py-2 text-white dark:bg-white dark:text-black"
          >
            Live demo
          </a>
        )}
        {project.links.repo && (
          <a
            href={project.links.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-800 dark:border-zinc-700 dark:text-zinc-200"
          >
            Source code
          </a>
        )}
      </div>

      {project.images && project.images.length > 0 && (
        <div
          className="animate-fade-in-up mt-12 opacity-0"
          style={{ animationDelay: "320ms" }}
        >
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Screenshots
          </h2>
          <div className="mt-4 gap-4 sm:columns-2">
            {project.images.map((img) => (
              <figure
                key={img.src}
                className={`mb-4 break-inside-avoid ${
                  img.wide
                    ? "[column-span:all]"
                    : img.height > img.width * 1.5
                      ? "mx-auto w-3/5"
                      : ""
                }`}
              >
                <a
                  href={img.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block rounded-lg border border-zinc-200 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600 ${
                    img.wide ? "overflow-x-auto sm:overflow-hidden" : "overflow-hidden"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    sizes={img.wide ? "720px" : "(min-width: 768px) 360px, 100vw"}
                    className={`h-auto w-full ${img.wide ? "min-w-[640px] sm:min-w-0" : ""}`}
                  />
                </a>
                {img.caption && (
                  <figcaption className="mt-2 text-xs text-zinc-500">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
