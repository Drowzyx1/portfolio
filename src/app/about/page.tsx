import { profile, skillGroups, howIWork, experience } from "@/content/profile";

const sectionHeading =
  "text-sm font-medium uppercase tracking-wide text-zinc-500";

export default function AboutPage() {
  return (
    <div className="site-container py-16 lg:py-20">
      <div className="animate-fade-in-up opacity-0">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 lg:text-3xl dark:text-zinc-50">
          About
        </h1>
        <p className="mt-4 max-w-2xl text-zinc-700 lg:text-lg lg:leading-relaxed dark:text-zinc-300">
          {profile.summary}
        </p>
        {profile.location && (
          <p className="mt-2 text-sm text-zinc-500">
            {profile.location}
            {profile.locationNote && ` · ${profile.locationNote}`}
          </p>
        )}
      </div>

      {/* One column on phones; on large screens the shorter sections sit beside the long experience list. */}
      <div className="mt-10 grid gap-x-16 gap-y-10 lg:grid-cols-2">
        <div className="space-y-10">
          {howIWork.length > 0 && (
            <div className="animate-fade-in-up opacity-0" style={{ animationDelay: "80ms" }}>
              <h2 className={sectionHeading}>How I Work</h2>
              <div className="mt-3 space-y-4">
                {howIWork.map((trait) => (
                  <div key={trait.title}>
                    <h3 className="font-medium text-zinc-950 dark:text-zinc-50">
                      {trait.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                      {trait.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile.education && (
            <div className="animate-fade-in-up opacity-0" style={{ animationDelay: "160ms" }}>
              <h2 className={sectionHeading}>Education</h2>
              <div className="mt-3">
                <h3 className="font-medium text-zinc-950 dark:text-zinc-50">
                  {profile.education.degree}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {profile.education.school}
                </p>
                <p className="text-sm text-zinc-500">
                  {profile.education.start} – {profile.education.end}
                </p>
              </div>
            </div>
          )}

          {skillGroups.length > 0 && (
            <div className="animate-fade-in-up opacity-0" style={{ animationDelay: "240ms" }}>
              <h2 className={sectionHeading}>Skills</h2>
              <div className="mt-3 space-y-4">
                {skillGroups.map((group) => (
                  <div key={group.label}>
                    <h3 className="text-xs font-medium text-zinc-500">
                      {group.label}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {group.items.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {experience.length > 0 && (
          <div className="animate-fade-in-up opacity-0" style={{ animationDelay: "320ms" }}>
            <h2 className={sectionHeading}>Experience</h2>
            <div className="mt-4 space-y-6">
              {experience.map((job, i) => (
                <div key={i}>
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <h3 className="font-medium text-zinc-950 dark:text-zinc-50">
                      {job.role} · {job.company}
                    </h3>
                    <span className="text-sm text-zinc-500 sm:shrink-0">
                      {job.start === job.end ? job.start : `${job.start} – ${job.end}`}
                    </span>
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
                    {job.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
