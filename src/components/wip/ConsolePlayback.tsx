"use client";

import { useEffect, useRef, useState } from "react";
import type { TranscriptStep } from "@/content/workInProgress";

// Replays a recorded run of the console app, one command at a time. The output
// is real (captured from the program), not a re-implementation of it.
export function ConsolePlayback({
  menu,
  steps,
}: {
  menu: string;
  steps: TranscriptStep[];
}) {
  const [shown, setShown] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (el && shown > 0) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [shown]);

  const next = steps[shown];
  const finished = shown >= steps.length;

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-200 shadow-sm">
      <div className="flex items-center gap-3 border-b border-zinc-800 px-3 py-2">
        <div className="flex shrink-0 items-center gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
        </div>
        <span className="min-w-0 truncate font-mono text-xs text-zinc-500">
          dotnet run · PumpSimConsole
        </span>
      </div>

      <div
        ref={bodyRef}
        role="log"
        aria-live="polite"
        aria-label="Console output"
        className="max-h-80 overflow-auto px-4 py-3 font-mono text-xs leading-relaxed"
      >
        <pre className="whitespace-pre text-zinc-500">{menu}</pre>
        {steps.slice(0, shown).map((s, i) => (
          <div key={i} className="mt-3">
            <div className="text-emerald-400">
              &gt; {s.input}{" "}
              <span className="text-zinc-500">({s.label})</span>
            </div>
            <pre className="whitespace-pre text-zinc-200">{s.output}</pre>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-zinc-800 px-3 py-2.5">
        <button
          type="button"
          onClick={() => setShown((n) => Math.min(n + 1, steps.length))}
          disabled={finished}
          className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-900 transition-opacity hover:bg-white disabled:opacity-40"
        >
          {finished
            ? "Session complete"
            : `Run option ${next.input}: ${next.label}`}
        </button>
        {!finished && shown < steps.length - 1 && (
          <button
            type="button"
            onClick={() => setShown(steps.length)}
            className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300 transition-colors hover:bg-zinc-900"
          >
            Run all
          </button>
        )}
        {shown > 0 && (
          <button
            type="button"
            onClick={() => setShown(0)}
            className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300 transition-colors hover:bg-zinc-900"
          >
            Reset
          </button>
        )}
        <span className="ml-auto text-xs text-zinc-500">
          {shown} / {steps.length} commands
        </span>
      </div>
    </div>
  );
}
