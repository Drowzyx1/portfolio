// Edit this file to update the Work in progress section. The home page, the
// /projects page, and the chatbot all read from it.
//
// `transcript` is real output from running the console app (see the repo), with
// the menu text trimmed after the first prompt. Re-capture it when the model changes.
//
// `recreation` holds the values the in-browser Unity recreation uses. They're copied
// from the Unity scripts and scene (PressureSystem.maxPsi / psiPerSecond, Gauge.sweepDegrees,
// Valve.closedAngle, Door.openAngle / degreesPerSecond) and the procedure's step assets,
// so update them if those change.

export type MilestoneStatus = "done" | "active" | "planned";

export type Milestone = {
  title: string;
  status: MilestoneStatus;
  note?: string;
};

// One step of the guided procedure, mirroring a TrainingStep asset in the Unity project.
export type RecreatedStep =
  | { kind: "door"; instruction: string; mustBeOpen: boolean }
  | { kind: "valve"; instruction: string; mustBeOpen: boolean }
  | { kind: "pressureBelow"; instruction: string; maxPsi: number };

export const milestoneLabels: Record<number, string> = {
  4: "Milestone 4 · Physics (started)",
  3: "Milestone 3 · Procedure system (nearly done)",
  2: "Milestone 2 · Unity scene",
  1: "Milestone 1 · C# console model",
};

export type TranscriptStep = {
  input: string;
  label: string;
  output: string;
};

export type WorkInProgress = {
  title: string;
  summary: string;
  started: string;
  updated: string;
  repo: string;
  stack: string[];
  milestones: Milestone[];
  builtSoFar: { milestone: 1 | 2 | 3 | 4; concept: string; detail: string }[];
  bugsFixed: string[];
  next: string;
  recreation: {
    maxPsi: number;
    psiPerSecond: number;
    sweepDegrees: number;
    closedAngle: number;
    doorOpenAngle: number;
    doorDegreesPerSecond: number;
    steps: RecreatedStep[];
  };
  menu: string;
  transcript: TranscriptStep[];
};

export const workInProgress: WorkInProgress = {
  title: "Pump Station Maintenance Trainer",
  summary:
    "A virtual maintenance trainer being built to learn C# and Unity. A trainee follows a guided procedure to replace a clogged hydraulic filter on a pump station: open the access panel, close the supply valve, wait for pressure to bleed off, swap the filter, then reopen the valve and confirm pressure is restored. The finished Unity version will warn about unsafe actions (like pulling the filter while the system is pressurized) and end with a summary of time taken and mistakes made. So far there's a console model of the logic and a walkable Unity scene where an on-screen checklist guides the trainee through opening the access panel, closing the supply valve, waiting for the pressure to bleed off, and reopening the valve, then shows a summary of the run.",
  started: "November 2026",
  updated: "Nov 10, 2026",
  repo: "https://github.com/Drowzyx1/PumpStationTrainer",
  stack: ["C#", ".NET 9", "Unity 6.3 LTS"],
  milestones: [
    { title: "Setup (Unity 6.3 LTS, .NET, Git)", status: "done" },
    { title: "Pure C# model (console app)", status: "done" },
    {
      title: "Unity interaction: clickable valve, event-driven gauge, prefabs",
      status: "done",
    },
    {
      title: "Procedure system: steps as ScriptableObjects, UI, mistake detection",
      status: "active",
      note: "Step system, procedure manager, UI, and door step are done; mistake detection is next.",
    },
    {
      title: "Physics and polish: kinematic door, grabbable filters, socket, object pooling",
      status: "active",
      note: "Started: the kinematic access-panel door is done.",
    },
    { title: "Profiling, debugging, and documentation", status: "planned" },
  ],
  builtSoFar: [
    {
      milestone: 4,
      concept: "Kinematic door",
      detail:
        "The access panel is a kinematic Rigidbody that code moves instead of physics. Interact() only flips a target state; FixedUpdate() rotates toward it with MoveRotation and Quaternion.RotateTowards, so it swings smoothly and stays in sync with the physics system. The hinge is an empty parent at the panel's edge, so it pivots like a real door.",
    },
    {
      milestone: 3,
      concept: "Steps as data",
      detail:
        "TrainingStep is an abstract ScriptableObject with an instruction and an abstract IsComplete(ProcedureContext). DoorOpenStep, ValveStateStep, and PressureBelowStep each override it with their own rule, and each step is an asset made from the editor menu, so a new procedure needs no code.",
    },
    {
      milestone: 3,
      concept: "Assets vs scene data",
      detail:
        "Step assets live in the project, so they can't reference scene objects directly. A ProcedureContext in the scene gives them access: it builds a Dictionary of every valve keyed by its id with LINQ ToDictionary, and logs a clear error for an unknown id instead of failing later with a null reference.",
    },
    {
      milestone: 3,
      concept: "ProcedureManager",
      detail:
        "Runs the steps in order and calls IsComplete without knowing a step's concrete type (polymorphism). It times each step and raises OnStepStarted and OnProcedureComplete. Its state is exposed read-only, and the first event fires in Start(), after every listener has subscribed in OnEnable().",
    },
    {
      milestone: 3,
      concept: "Event-driven UI",
      detail:
        "ProcedureUI updates only on events, never per frame. It shows the current instruction, rebuilds the checklist with a StringBuilder, and computes the end summary (total time, slowest step) with LINQ Sum, Max, and IndexOf.",
    },
    {
      milestone: 2,
      concept: "Interface + abstract MonoBehaviour",
      detail:
        "IInteractable defines what anything clickable needs (Prompt, CanInteract, Interact()). InteractableBase is an abstract MonoBehaviour that implements it, with virtual defaults and an abstract Interact() every subclass must write.",
    },
    {
      milestone: 2,
      concept: "Raycast interaction",
      detail:
        "An Interactor raycasts from the camera on click, filtered by a layer mask, and uses GetComponentInParent<IInteractable>() so it works with any interactable, even when the collider sits on a child object.",
    },
    {
      milestone: 2,
      concept: "Events between systems",
      detail:
        "The valve raises OnToggled. PressureSystem moves pressure toward 3000 PSI or 0 with Mathf.MoveTowards and Time.deltaTime, and raises OnPressureChanged only when the value actually changes, so listeners do no work while pressure is steady.",
    },
    {
      milestone: 2,
      concept: "Listener lifecycle",
      detail:
        "The Gauge subscribes in OnEnable and unsubscribes in OnDisable so no listeners leak, and maps PSI to a needle angle with Clamp01 and Lerp.",
    },
    {
      milestone: 2,
      concept: "Prefabs",
      detail:
        "The valve and gauge are prefabs, and a second valve instance overrides its id to \"drain\" to show prefab data versus per-instance overrides.",
    },
    {
      milestone: 2,
      concept: "Encapsulation and input",
      detail:
        "[SerializeField] private fields are editable in the Inspector but hidden from other code. Camera look and WASD movement use Unity's new Input System and stay frame-rate independent.",
    },
    {
      milestone: 1,
      concept: "Inheritance",
      detail:
        "An abstract Component base class holds shared state and declares IsFaulty(); Pump, Valve, and Filter each define their own fault rule.",
    },
    {
      milestone: 1,
      concept: "Interfaces",
      detail:
        "IInspectable and IRepairable describe capabilities. The main loop checks each part with `is` instead of its concrete type.",
    },
    {
      milestone: 1,
      concept: "Events",
      detail:
        "Valve raises OnToggled. The pressure system and a logger react independently, and the valve knows about neither (observer pattern).",
    },
    {
      milestone: 1,
      concept: "LINQ",
      detail:
        "A report lists faulty parts, total hours, and parts sorted by wear using Where, Select, Sum, and OrderByDescending.",
    },
    {
      milestone: 1,
      concept: "Reflection",
      detail:
        "A custom [ShowInDebug] attribute lets one generic method print the tagged properties of any object, discovered at runtime.",
    },
  ],
  bugsFixed: [
    "Listeners subscribed more than once: each valve toggle printed one, then two, then three sets of reactions, because the subscription code sat inside a loop. Moved it outside so it runs once.",
    "The console app's project file was missing from the repo: the Unity .gitignore template ignores every *.csproj. Added an exception for it.",
    "Build output committed by accident: bin/ and obj/ in the console project were tracked because the ignore rules only covered the top level. Untracked them and added rules that match at any depth.",
    "A nested Git repository: Unity Hub created its own .git inside the Unity project, so the main repo would have stored only a pointer instead of the files. Removed the inner repo so everything lives in one place.",
    "Missing Input System package: scripts using UnityEngine.InputSystem wouldn't compile until the package was installed and the new input backend enabled.",
    "Gauge needle jumping on the first valve change: the gauge only updates when OnPressureChanged fires, which happens only on a change, so at startup it showed 0 PSI while the system sat at 3000. Added a one-time sync in Start(), which runs after every Awake().",
  ],
  next: "Milestone 4: grabbable filters (non-kinematic physics, kinematic while held), a filter socket using a trigger collider, the remove and install filter steps, and mistake detection, such as removing the filter while the system is pressurized.",
  recreation: {
    maxPsi: 3000,
    psiPerSecond: 800,
    sweepDegrees: 270,
    closedAngle: 90,
    doorOpenAngle: 100,
    doorDegreesPerSecond: 180,
    steps: [
      // The first step's asset has no instruction text yet; this wording comes from the README.
      { kind: "door", instruction: "Open the access panel", mustBeOpen: true },
      { kind: "valve", instruction: "Close the supply valve", mustBeOpen: false },
      { kind: "pressureBelow", instruction: "Wait for Pressure to bleed off", maxPsi: 1 },
      { kind: "valve", instruction: "Reopen the supply valve", mustBeOpen: true },
    ],
  },
  menu: "Enter Option:\n1) Inspect All\n2) Toggle valve\n3) Report\n4) Debug Valve\n5) Repair Valve\n0) Exit",
  transcript: [
  {
    "input": "1",
    "label": "Inspect all",
    "output": "Component: Main Pump, Hours: 1200 | Faulty: True\n    Inspect: Pump is faulty\nValve: Supply Valve, Hours: 300 | Faulty: False\nFilter: Line Filter, Hours: 250 | Faulty: True\n    Inspect: Filter is faulty"
  },
  {
    "input": "2",
    "label": "Toggle valve",
    "output": "PSI is now 0 \nBar is now 0.0\nLog: Valve is closed"
  },
  {
    "input": "3",
    "label": "Report",
    "output": "Faulty components: Main Pump, Line Filter\nTotal hours: 1750\n   Main Pump: 1200\n   Supply Valve: 300\n   Line Filter: 250"
  },
  {
    "input": "4",
    "label": "Debug valve",
    "output": "Debug Report: Valve\n  IsOpen: False\n  Name: Supply Valve\n  Hours: 300"
  },
  {
    "input": "5",
    "label": "Repair valve",
    "output": "Repair Status: Valve repaired"
  },
  {
    "input": "3",
    "label": "Report",
    "output": "Faulty components: Main Pump, Line Filter\nTotal hours: 1450\n   Main Pump: 1200\n   Line Filter: 250\n   Supply Valve: 0"
  },
  {
    "input": "2",
    "label": "Toggle valve",
    "output": "PSI is now 3000 \nBar is now 206.8\nLog: Valve is open"
  }
],
};
