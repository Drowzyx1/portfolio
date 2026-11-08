import { workInProgress as w, type MilestoneStatus } from "@/content/workInProgress";
import { ConsolePlayback } from "./ConsolePlayback";

const statusStyle: Record<MilestoneStatus, { icon: string; label: string; cls: string }> = {
  done: {
    icon: "✓",
    label: "Done",
    cls: "text-emerald-600 dark:text-emerald-400",
  },
  next: {
    icon: "→",
    label: "Up next",
    cls: "text-amber-600 dark:text-amber-400",
  },
  planned: {
    icon: "○",
    label: "Planned",
    cls: "text-zinc-400 dark:text-zinc-600",
  },
};

export function WorkInProgress() {
  const done = w.milestones.filter((m) => m.status === "done").length;
  const total = w.milestones.length;

  return (
    <section
      aria-labelledby="wip-heading"
      className="animate-fade-in-up opacity-0"
      style={{ animationDelay: "200ms" }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <h2
          id="wip-heading"
          className="text-sm font-medium uppercase tracking-wide text-zinc-500"
        >
          Work in progress
        </h2>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
          </span>
          Building now
        </span>
      </div>

      <div className="mt-4 rounded-lg border border-zinc-200 p-4 sm:p-5 dark:border-zinc-800">
        <h3 className="font-medium text-zinc-950 dark:text-zinc-50">{w.title}</h3>
        <p className="mt-1 text-xs text-zinc-500">
          Started {w.started} · Last updated {w.updated}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {w.stack.map((t) => (
            <span
              key={t}
              className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
            >
              {t}
            </span>
          ))}
        </div>

        <p className="mt-4 text-sm text-zinc-700 dark:text-zinc-300">{w.summary}</p>

        <div className="mt-5">
          <div className="flex items-baseline justify-between text-xs text-zinc-500">
            <span>Progress</span>
            <span>
              {done} of {total} milestones
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Milestones completed"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={done}
            className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
          >
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-700"
              style={{ width: `${(done / total) * 100}%` }}
            />
          </div>
          <ol className="mt-3 space-y-1.5">
            {w.milestones.map((m, i) => {
              const s = statusStyle[m.status];
              return (
                <li key={m.title} className="flex gap-2 text-sm">
                  <span aria-hidden className={`w-4 shrink-0 text-center ${s.cls}`}>
                    {s.icon}
                  </span>
                  <span className="sr-only">{s.label}: </span>
                  <span
                    className={
                      m.status === "planned"
                        ? "text-zinc-500"
                        : "text-zinc-800 dark:text-zinc-200"
                    }
                  >
                    <span className="text-zinc-400">{i} · </span>
                    {m.title}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
            The simulation so far
          </p>
          <ConsolePlayback menu={w.menu} steps={w.transcript} />
          <p className="mt-2 text-xs text-zinc-500">
            Real output from the console model, replayed one command at a time.
            Close the valve and both the pressure system and the logger react,
            without the valve knowing about either.
          </p>
        </div>

        <div className="mt-5 space-y-2">
          <details className="group rounded-md border border-zinc-200 px-3 py-2 dark:border-zinc-800">
            <summary className="cursor-pointer text-sm font-medium text-zinc-800 dark:text-zinc-200">
              What&apos;s built so far
            </summary>
            <ul className="mt-2 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
              {w.builtSoFar.map((b) => (
                <li key={b.concept}>
                  <span className="font-medium text-zinc-950 dark:text-zinc-50">
                    {b.concept}.
                  </span>{" "}
                  {b.detail}
                </li>
              ))}
            </ul>
          </details>
          <details className="group rounded-md border border-zinc-200 px-3 py-2 dark:border-zinc-800">
            <summary className="cursor-pointer text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Bugs found and fixed
            </summary>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
              {w.bugsFixed.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </details>
        </div>

        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          <span className="font-medium text-zinc-800 dark:text-zinc-200">
            Next up:
          </span>{" "}
          {w.next}
        </p>

        <div className="mt-4 text-sm font-medium">
          <a
            href={w.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full border border-zinc-300 px-4 py-2 text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            Follow along on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
