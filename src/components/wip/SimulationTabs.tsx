"use client";

import { useRef, useState } from "react";
import type { TranscriptStep, WorkInProgress } from "@/content/workInProgress";
import { ConsolePlayback } from "./ConsolePlayback";
import { ValveGaugeSim } from "./ValveGaugeSim";

type TabId = "unity" | "console";

const tabs: { id: TabId; label: string }[] = [
  { id: "unity", label: "Unity · recreated" },
  { id: "console", label: "Console · recorded" },
];

export function SimulationTabs({
  menu,
  steps,
  recreation,
}: {
  menu: string;
  steps: TranscriptStep[];
  recreation: WorkInProgress["recreation"];
}) {
  const [active, setActive] = useState<TabId>("unity");
  const refs = useRef<Record<TabId, HTMLButtonElement | null>>({
    unity: null,
    console: null,
  });

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const next: TabId = active === "unity" ? "console" : "unity";
    setActive(next);
    refs.current[next]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Simulation views"
        onKeyDown={onKeyDown}
        className="mb-3 flex gap-1 rounded-full border border-zinc-200 p-1 text-xs sm:inline-flex dark:border-zinc-800"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[t.id] = el;
            }}
            role="tab"
            id={`sim-tab-${t.id}`}
            aria-selected={active === t.id}
            aria-controls={`sim-panel-${t.id}`}
            tabIndex={active === t.id ? 0 : -1}
            type="button"
            onClick={() => setActive(t.id)}
            className={`flex-1 whitespace-nowrap rounded-full px-3 py-1 font-medium transition-colors ${
              active === t.id
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id="sim-panel-unity"
        aria-labelledby="sim-tab-unity"
        hidden={active !== "unity"}
      >
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-zinc-200">
          <ValveGaugeSim {...recreation} />
        </div>
        <p className="mt-2 text-xs text-zinc-500">
          A web recreation of the Milestone 2 Unity scene, built from the scene&apos;s
          real logic and values (3,000 PSI max, 800 PSI per second, 270° gauge
          sweep). Click the valve and watch the gauge bleed down. Note that
          OnPressureChanged only fires while pressure is moving. The Unity scene
          itself runs in the editor and isn&apos;t hosted here.
        </p>
      </div>

      <div
        role="tabpanel"
        id="sim-panel-console"
        aria-labelledby="sim-tab-console"
        hidden={active !== "console"}
      >
        <ConsolePlayback menu={menu} steps={steps} />
        <p className="mt-2 text-xs text-zinc-500">
          Real output from the Milestone 1 console model, replayed one command at a
          time. Close the valve and both the pressure system and the logger react,
          without the valve knowing about either.
        </p>
      </div>
    </div>
  );
}
