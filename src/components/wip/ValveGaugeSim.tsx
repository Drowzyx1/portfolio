"use client";

import { useEffect, useRef, useState } from "react";

// A browser recreation of the Milestone 2 Unity scene. It mirrors the logic of
// Valve.Interact, PressureSystem.Update, and Gauge.UpdateNeedle from the repo,
// using the same constants. It is not a build of the Unity project.

type Props = {
  maxPsi: number;
  psiPerSecond: number;
  sweepDegrees: number;
  closedAngle: number;
};

// Mathf.MoveTowards
const moveTowards = (current: number, target: number, maxDelta: number) =>
  Math.abs(target - current) <= maxDelta
    ? target
    : current + Math.sign(target - current) * maxDelta;

// Point on a circle, with 0 degrees pointing straight up and angles running clockwise.
const polar = (cx: number, cy: number, r: number, deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return [cx + r * Math.sin(rad), cy - r * Math.cos(rad)] as const;
};

export function ValveGaugeSim({
  maxPsi,
  psiPerSecond,
  sweepDegrees,
  closedAngle,
}: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const [psi, setPsi] = useState(maxPsi);
  const [pressureEvents, setPressureEvents] = useState(0);
  const [toggles, setToggles] = useState(0);
  const openRef = useRef(true);
  const psiRef = useRef(maxPsi);

  // PressureSystem.Update: move toward maxPsi (valve open) or 0 (closed), and only
  // raise OnPressureChanged when the value actually changes.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const target = openRef.current ? maxPsi : 0;
      const next = moveTowards(psiRef.current, target, psiPerSecond * dt);
      if (Math.abs(next - psiRef.current) > 1e-6) {
        psiRef.current = next;
        setPsi(next);
        setPressureEvents((n) => n + 1);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [maxPsi, psiPerSecond]);

  // Valve.Interact
  function interact() {
    openRef.current = !openRef.current;
    setIsOpen(openRef.current);
    setToggles((n) => n + 1);
  }

  // Gauge.UpdateNeedle: Clamp01 then Lerp across the sweep, starting at the lower left.
  const t = Math.min(Math.max(psi / maxPsi, 0), 1);
  const start = -sweepDegrees / 2;
  const needleAngle = start + sweepDegrees * t;

  const ticks = Array.from({ length: 7 }, (_, i) => i / 6);
  const [arcX0, arcY0] = polar(100, 100, 74, start);
  const [arcX1, arcY1] = polar(100, 100, 74, start + sweepDegrees);
  const prompt = isOpen ? "Close Valve" : "Open Valve"; // Valve.Prompt

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col items-center rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
          <button
            type="button"
            onClick={interact}
            className="group flex flex-col items-center rounded-md px-2 py-1 outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
          >
            <svg viewBox="0 0 200 140" className="h-36 w-full max-w-60" aria-hidden>
              {/* pipe */}
              <rect x="0" y="78" width="200" height="22" fill="#52525b" />
              <rect x="0" y="78" width="200" height="5" fill="#71717a" />
              {/* valve body and stem */}
              <rect x="82" y="64" width="36" height="50" rx="6" fill="#3f3f46" stroke="#71717a" />
              <rect x="96" y="40" width="8" height="28" fill="#a1a1aa" />
              {/* handle: lined up with the pipe when open, turned across it when closed */}
              <g
                style={{
                  transform: `rotate(${isOpen ? 0 : closedAngle}deg)`,
                  transformOrigin: "100px 40px",
                  transition: "transform 120ms ease-out",
                }}
              >
                <rect x="62" y="35" width="76" height="10" rx="5" fill="#f59e0b" />
              </g>
            </svg>
            <span className="mt-1 text-xs text-zinc-400">
              Valve · {isOpen ? "open" : "closed"}
            </span>
            <span className="mt-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-900 transition-colors group-hover:bg-white">
              {prompt}
            </span>
          </button>
        </div>

        <div className="flex flex-col items-center rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
          <svg
            viewBox="0 0 200 192"
            className="h-44 w-full max-w-60"
            role="img"
            aria-label={`Pressure gauge reading ${Math.round(psi)} PSI`}
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
            {Math.round(psi).toLocaleString()} PSI
          </span>
        </div>
      </div>

      <dl className="mt-3 space-y-1 font-mono text-xs text-zinc-400">
        <div className="flex flex-wrap justify-between gap-x-4">
          <dt className="text-zinc-500">Valve.OnToggled</dt>
          <dd className="text-zinc-200">{toggles}× fired</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-x-4">
          <dt className="text-zinc-500">PressureSystem.OnPressureChanged</dt>
          <dd className="text-zinc-200">{pressureEvents}× fired</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-x-4">
          <dt className="text-zinc-500">PressureSystem.Psi</dt>
          <dd className="text-zinc-200">{psi.toFixed(0)}</dd>
        </div>
      </dl>
    </div>
  );
}
