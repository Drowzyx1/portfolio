"use client";

import { useEffect, useRef, useState } from "react";
import type { WorkInProgress } from "@/content/workInProgress";

// A browser recreation of the Unity scene. It mirrors the logic of Valve.Interact,
// Door.Interact and Door.FixedUpdate, PressureSystem.Update, Gauge.UpdateNeedle,
// ProcedureManager.Update, and the checklist and summary text from ProcedureUI,
// using the same constants and step rules. It is not a build of the Unity project.

type Recreation = WorkInProgress["recreation"];
type Step = Recreation["steps"][number];

type Sim = {
  valveOpen: boolean;
  psi: number;
  doorOpen: boolean;
  doorAngle: number;
  t: number; // seconds since the procedure started (Time.time)
  index: number; // ProcedureManager's current step
  stepStart: number;
  times: number[];
};

const freshSim = (maxPsi: number): Sim => ({
  valveOpen: true,
  psi: maxPsi,
  doorOpen: false,
  doorAngle: 0,
  t: 0,
  index: 0,
  stepStart: 0,
  times: [],
});

// Mathf.MoveTowards (also fine for one-axis Quaternion.RotateTowards)
const moveTowards = (current: number, target: number, maxDelta: number) =>
  Math.abs(target - current) <= maxDelta
    ? target
    : current + Math.sign(target - current) * maxDelta;

// Point on a circle, with 0 degrees pointing straight up and angles running clockwise.
const polar = (cx: number, cy: number, r: number, deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return [cx + r * Math.sin(rad), cy - r * Math.cos(rad)] as const;
};

// TrainingStep.IsComplete
function isComplete(step: Step, sim: Sim) {
  switch (step.kind) {
    case "door":
      return sim.doorOpen === step.mustBeOpen;
    case "valve":
      return sim.valveOpen === step.mustBeOpen;
    case "pressureBelow":
      return sim.psi <= step.maxPsi;
  }
}

export function SceneRecreation({
  maxPsi,
  psiPerSecond,
  sweepDegrees,
  closedAngle,
  doorOpenAngle,
  doorDegreesPerSecond,
  steps,
}: Recreation) {
  const sim = useRef<Sim>(freshSim(maxPsi));
  const [view, setView] = useState<Sim>(() => freshSim(maxPsi));
  const [toggles, setToggles] = useState(0);
  const [pressureEvents, setPressureEvents] = useState(0);
  const [stepEvents, setStepEvents] = useState(1); // Start() fires OnStepStarted for step 1

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const s = sim.current;
      s.t += dt;
      let changed = false;

      // PressureSystem.Update: move toward maxPsi (valve open) or 0 (closed), and only
      // raise OnPressureChanged when the value actually changes.
      const nextPsi = moveTowards(s.psi, s.valveOpen ? maxPsi : 0, psiPerSecond * dt);
      if (Math.abs(nextPsi - s.psi) > 1e-6) {
        s.psi = nextPsi;
        setPressureEvents((n) => n + 1);
        changed = true;
      }

      // Door.FixedUpdate: rotate toward the open or closed target.
      const nextAngle = moveTowards(
        s.doorAngle,
        s.doorOpen ? doorOpenAngle : 0,
        doorDegreesPerSecond * dt,
      );
      if (nextAngle !== s.doorAngle) {
        s.doorAngle = nextAngle;
        changed = true;
      }

      // ProcedureManager.Update: complete at most one step per frame, in order.
      const step = steps[s.index];
      if (step && isComplete(step, s)) {
        s.times.push(s.t - s.stepStart);
        s.stepStart = s.t;
        s.index += 1;
        if (s.index < steps.length) setStepEvents((n) => n + 1);
        changed = true;
      }

      if (changed) setView({ ...s, times: [...s.times] });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [maxPsi, psiPerSecond, doorOpenAngle, doorDegreesPerSecond, steps]);

  // Valve.Interact
  function toggleValve() {
    sim.current.valveOpen = !sim.current.valveOpen;
    setToggles((n) => n + 1);
    setView({ ...sim.current, times: [...sim.current.times] });
  }

  // Door.Interact: only flips the target state; FixedUpdate does the swinging.
  function toggleDoor() {
    sim.current.doorOpen = !sim.current.doorOpen;
    setView({ ...sim.current, times: [...sim.current.times] });
  }

  function restart() {
    sim.current = freshSim(maxPsi);
    setToggles(0);
    setPressureEvents(0);
    setStepEvents(1);
    setView({ ...sim.current });
  }

  const done = view.index >= steps.length;
  const current = steps[view.index];

  // Gauge.UpdateNeedle: Clamp01 then Lerp across the sweep, starting at the lower left.
  const t = Math.min(Math.max(view.psi / maxPsi, 0), 1);
  const start = -sweepDegrees / 2;
  const needleAngle = start + sweepDegrees * t;
  const ticks = Array.from({ length: 7 }, (_, i) => i / 6);
  const [arcX0, arcY0] = polar(100, 100, 74, start);
  const [arcX1, arcY1] = polar(100, 100, 74, start + sweepDegrees);

  // ProcedureUI.ShowSummary
  const total = view.times.reduce((a, b) => a + b, 0);
  const slowest = view.times.length ? Math.max(...view.times) : 0;
  const slowestStep = steps[view.times.indexOf(slowest)];

  const tileCls =
    "flex flex-col items-center rounded-lg border border-zinc-800 bg-zinc-900/60 p-3";
  const pillCls =
    "mt-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-900 transition-colors group-hover:bg-white";
  const btnCls =
    "group flex flex-col items-center rounded-md px-2 py-1 outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400";

  return (
    <div>
      {/* ProcedureUI: instruction and, when finished, the summary */}
      <div className="rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2">
        <p className="text-[11px] uppercase tracking-wide text-zinc-500">
          {done ? "Finished" : `Step ${view.index + 1} of ${steps.length}`}
        </p>
        <p className="text-sm text-zinc-100" aria-live="polite">
          {done ? "Procedure complete!" : current.instruction}
        </p>
        {done && (
          <p className="mt-1 font-mono text-xs text-zinc-300">
            Total time: {total.toFixed(1)}s
            <br />
            Slowest step: {slowestStep?.instruction} ({slowest.toFixed(1)}s)
          </p>
        )}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {/* Access panel (Door) */}
        <div className={tileCls}>
          <button type="button" onClick={toggleDoor} className={btnCls}>
            <svg viewBox="0 0 200 150" className="h-32 w-full max-w-48" aria-hidden>
              {/* wall, seen from above, with a gap for the panel */}
              <rect x="0" y="44" width="60" height="14" fill="#52525b" />
              <rect x="140" y="44" width="60" height="14" fill="#52525b" />
              <rect x="60" y="44" width="80" height="14" fill="#18181b" />
              {/* the panel swings about its hinge at the edge of the opening */}
              <g transform={`rotate(${view.doorAngle} 60 51)`}>
                <rect x="60" y="45" width="80" height="12" rx="2" fill="#a1a1aa" />
              </g>
              <circle cx="60" cy="51" r="4" fill="#f59e0b" />
            </svg>
            <span className="mt-1 text-xs text-zinc-400">
              Access panel · {view.doorOpen ? "open" : "closed"}
            </span>
            <span className={pillCls}>
              {view.doorOpen ? "Close Panel" : "Open Panel"}
            </span>
          </button>
        </div>

        {/* Supply valve */}
        <div className={tileCls}>
          <button type="button" onClick={toggleValve} className={btnCls}>
            <svg viewBox="0 0 200 140" className="h-32 w-full max-w-48" aria-hidden>
              <rect x="0" y="78" width="200" height="22" fill="#52525b" />
              <rect x="0" y="78" width="200" height="5" fill="#71717a" />
              <rect x="82" y="64" width="36" height="50" rx="6" fill="#3f3f46" stroke="#71717a" />
              <rect x="96" y="40" width="8" height="28" fill="#a1a1aa" />
              <g
                style={{
                  transform: `rotate(${view.valveOpen ? 0 : closedAngle}deg)`,
                  transformOrigin: "100px 40px",
                  transition: "transform 120ms ease-out",
                }}
              >
                <rect x="62" y="35" width="76" height="10" rx="5" fill="#f59e0b" />
              </g>
            </svg>
            <span className="mt-1 text-xs text-zinc-400">
              Supply valve · {view.valveOpen ? "open" : "closed"}
            </span>
            <span className={pillCls}>
              {view.valveOpen ? "Close Valve" : "Open Valve"}
            </span>
          </button>
        </div>

        {/* Pressure gauge */}
        <div className={tileCls}>
          <svg
            viewBox="0 0 200 192"
            className="h-40 w-full max-w-48"
            role="img"
            aria-label={`Pressure gauge reading ${Math.round(view.psi)} PSI`}
          >
            <circle cx="100" cy="100" r="88" fill="#3f3f46" />
            <circle cx="100" cy="100" r="80" fill="#27272a" />
            <path
              d={`M ${arcX0} ${arcY0} A 74 74 0 1 1 ${arcX1} ${arcY1}`}
              fill="none"
              stroke="#52525b"
              strokeWidth="3"
            />
            {ticks.map((f, i) => {
              const a = start + sweepDegrees * f;
              const [x1, y1] = polar(100, 100, 74, a);
              const [x2, y2] = polar(100, 100, 64, a);
              const [lx, ly] = polar(100, 100, 52, a);
              return (
                <g key={i}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#a1a1aa" strokeWidth="2" />
                  {i % 2 === 0 && (
                    <text
                      x={lx}
                      y={ly}
                      fontSize="9"
                      fill="#a1a1aa"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {Math.round(maxPsi * f)}
                    </text>
                  )}
                </g>
              );
            })}
            <text x="100" y="128" fontSize="9" fill="#71717a" textAnchor="middle">
              PSI
            </text>
            <g transform={`rotate(${needleAngle} 100 100)`}>
              <line x1="100" y1="106" x2="100" y2="36" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
            </g>
            <circle cx="100" cy="100" r="6" fill="#ef4444" />
          </svg>
          <span className="font-mono text-sm text-zinc-100">
            {Math.round(view.psi).toLocaleString()} PSI
          </span>
        </div>
      </div>

      {/* ProcedureUI checklist */}
      <pre className="mt-3 whitespace-pre-wrap break-words rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2 font-mono text-xs leading-relaxed text-zinc-300">
        {steps
          .map((s, i) => `${i < view.index ? "[x]" : "[ ]"} ${s.instruction}`)
          .join("\n")}
      </pre>

      <div className="mt-3 flex flex-wrap items-start gap-x-4 gap-y-2">
        <dl className="min-w-0 flex-1 space-y-1 font-mono text-xs text-zinc-400">
          <div className="flex flex-wrap justify-between gap-x-4">
            <dt className="text-zinc-500">Valve.OnToggled</dt>
            <dd className="text-zinc-200">{toggles}× fired</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-x-4">
            <dt className="text-zinc-500">PressureSystem.OnPressureChanged</dt>
            <dd className="text-zinc-200">{pressureEvents}× fired</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-x-4">
            <dt className="text-zinc-500">ProcedureManager.OnStepStarted</dt>
            <dd className="text-zinc-200">{stepEvents}× fired</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={restart}
          className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300 transition-colors hover:bg-zinc-900"
        >
          Restart procedure
        </button>
      </div>
    </div>
  );
}
