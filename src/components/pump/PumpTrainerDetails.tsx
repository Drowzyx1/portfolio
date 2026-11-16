import { milestoneLabels, pumpTrainer as t } from "@/content/pumpTrainer";
import { SimulationTabs } from "./SimulationTabs";

const sectionHeading =
  "text-sm font-medium uppercase tracking-wide text-zinc-500";

// Extra sections for the Pump Station Maintenance Trainer's project page: the interactive
// simulation, how it was built, the bug log, and what's next. Reads from src/content/pumpTrainer.ts.
export function PumpTrainerDetails() {
  const groups = [5, 4, 3, 2, 1] as const;

  return (
    <div className="mt-12 space-y-12">
      <section aria-labelledby="pt-sim">
        <h2 id="pt-sim" className={sectionHeading}>
          Try the simulation
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Work through the six-step procedure, or break it on purpose by pulling the
          old filter while the gauge is still high.
        </p>
        <div className="mt-4">
          <SimulationTabs
            menu={t.menu}
            steps={t.transcript}
            recreation={t.recreation}
          />
        </div>
      </section>

      <section aria-labelledby="pt-built">
        <h2 id="pt-built" className={sectionHeading}>
          How it was built
        </h2>
        <ol className="mt-3 space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
          {t.process.map((p, i) => (
            <li key={p.title}>
              <span className="font-medium text-zinc-950 dark:text-zinc-50">
                {i + 1}. {p.title}.
              </span>{" "}
              {p.detail}
            </li>
          ))}
        </ol>

        <ol className="mt-5 space-y-1.5">
          {t.milestones.map((m, i) => (
            <li key={m} className="flex gap-2 text-sm text-zinc-800 dark:text-zinc-200">
              <span aria-hidden className="w-4 shrink-0 text-center text-emerald-600 dark:text-emerald-400">
                ✓
              </span>
              <span className="sr-only">Done: </span>
              <span>
                <span className="text-zinc-400">{i} · </span>
                {m}
              </span>
            </li>
          ))}
        </ol>

        <details className="mt-4 rounded-md border border-zinc-200 px-3 py-2 dark:border-zinc-800">
          <summary className="cursor-pointer text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Architecture, piece by piece
          </summary>
          {groups.map((ms) => (
            <div key={ms} className="mt-3 first:mt-2">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                {milestoneLabels[ms]}
              </p>
              <ul className="mt-1.5 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                {t.builtSoFar
                  .filter((b) => b.milestone === ms)
                  .map((b) => (
                    <li key={b.concept}>
                      <span className="font-medium text-zinc-950 dark:text-zinc-50">
                        {b.concept}.
                      </span>{" "}
                      {b.detail}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </details>
      </section>

      <section aria-labelledby="pt-bugs">
        <h2 id="pt-bugs" className={sectionHeading}>
          Bugs found and fixed
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Real bugs from the build, written up in the repo&apos;s bug log with the
          symptom, how each was tracked down, the cause, the fix, and the lesson.
        </p>
        <div className="mt-3 space-y-2">
          {t.bugsFixed.map((b) => (
            <details
              key={b.title}
              className="rounded-md border border-zinc-200 px-3 py-2 dark:border-zinc-800"
            >
              <summary className="cursor-pointer text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {b.title}
              </summary>
              <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{b.detail}</p>
              {b.lesson && (
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    Lesson:
                  </span>{" "}
                  {b.lesson}
                </p>
              )}
            </details>
          ))}
        </div>
      </section>

      <section aria-labelledby="pt-next">
        <h2 id="pt-next" className={sectionHeading}>
          What&apos;s next
        </h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
          {t.nextIdeas.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
