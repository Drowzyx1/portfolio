// Edit this file to update the Pump Station Maintenance Trainer project. The project page
// (/projects/pump-station-trainer) and the chatbot both read from it.
//
// `transcript` is real output from running the console app (see the repo), with the menu
// text trimmed after the first prompt. Re-capture it if the console model changes.
//
// `recreation` holds the values the in-browser Unity recreation uses. They're copied from the
// Unity scripts and scene (PressureSystem.maxPsi / psiPerSecond, Gauge.sweepDegrees,
// Valve.closedAngle, Door.openAngle / degreesPerSecond, MistakeTracker.safePsi) and the
// procedure's step assets, so update them if those change.

// One step of the guided procedure, mirroring a TrainingStep asset in the Unity project.
export type RecreatedStep =
  | { kind: "door"; instruction: string; mustBeOpen: boolean }
  | { kind: "valve"; instruction: string; mustBeOpen: boolean }
  | { kind: "pressureBelow"; instruction: string; maxPsi: number }
  | { kind: "partInSocket"; instruction: string; requiredPartId: string };

export const milestoneLabels: Record<number, string> = {
  5: "Milestone 5 · Profiling and refactoring",
  4: "Milestone 4 · Physics and polish",
  3: "Milestone 3 · Procedure system",
  2: "Milestone 2 · Unity scene",
  1: "Milestone 1 · C# console model",
};

export type TranscriptStep = {
  input: string;
  label: string;
  output: string;
};

export type PumpTrainer = {
  title: string;
  summary: string;
  started: string;
  completed: string;
  repo: string;
  stack: string[];
  process: { title: string; detail: string }[];
  milestones: string[];
  builtSoFar: { milestone: 1 | 2 | 3 | 4 | 5; concept: string; detail: string }[];
  bugsFixed: { title: string; detail: string; lesson?: string }[];
  nextIdeas: string[];
  recreation: {
    maxPsi: number;
    psiPerSecond: number;
    sweepDegrees: number;
    closedAngle: number;
    doorOpenAngle: number;
    doorDegreesPerSecond: number;
    safePsi: number;
    acceptsPartId: string;
    steps: RecreatedStep[];
  };
  menu: string;
  transcript: TranscriptStep[];
};

export const pumpTrainer: PumpTrainer = {
  title: "Pump Station Maintenance Trainer",
  summary:
    "A Unity virtual maintenance trainer built in November 2026 to learn C# and Unity. A trainee follows a guided, step-by-step procedure to replace a clogged hydraulic filter on a pump station: open the access panel, close the supply valve, wait for the pressure to bleed off, remove the clogged filter, install the new one, and reopen the valve. The current instruction and a live checklist are shown on screen, removing the filter while the system is still pressurized triggers a warning and a spark effect, and the run ends with a summary of total time, mistakes, and the slowest step.",
  started: "November 2026",
  completed: "Nov 14, 2026",
  repo: "https://github.com/Drowzyx1/PumpStationTrainer",
  stack: ["C#", ".NET 9", "Unity 6.3 LTS"],
  process: [
    {
      title: "Requirements first",
      detail:
        "Broke the trainer into what it needed to do: interactable parts, a pressure simulation, an ordered procedure whose steps check the state of the world, mistake detection, and feedback for the trainee.",
    },
    {
      title: "Model the logic in plain C#",
      detail:
        "A console app let the object model come together without the engine in the way: an abstract Component hierarchy, interfaces for capabilities, and events between systems.",
    },
    {
      title: "Design the Unity architecture",
      detail:
        "Before writing scripts: an IInteractable interface so one click handler works on anything clickable, procedure steps as ScriptableObject data so a new procedure needs no code, and a ProcedureContext so those assets can reach scene objects.",
    },
    {
      title: "Implement milestone by milestone",
      detail:
        "Interaction, then the procedure system, then physics and polish, then profiling and refactoring, committing working progress at each step.",
    },
  ],
  milestones: [
    "Setup (Unity 6.3 LTS, .NET, Git)",
    "Pure C# model (console app)",
    "Unity interaction: clickable valve, event-driven gauge, prefabs",
    "Procedure system: ScriptableObject steps, UI, mistake detection",
    "Physics and polish: kinematic door, grabbable filters, socket, object pooling",
    "Profiling, debugging, event-driven refactor",
  ],
  builtSoFar: [
    {
      milestone: 5,
      concept: "Profiler pass",
      detail:
        "Every script allocates 0 B per frame (CPU module, Hierarchy view sorted by GC Alloc). To practice finding garbage, a string concatenation was added to PressureSystem.Update() on purpose: the Profiler showed 58 B every frame, which was traced down the Hierarchy to the method, removed, and verified.",
    },
    {
      milestone: 5,
      concept: "Memory-leak investigation",
      detail:
        "A listener was deliberately subscribed to a static event without unsubscribing, then the scene was reloaded repeatedly. Memory Profiler snapshots showed dead subscribers piling up that could never be freed, and the event kept firing at destroyed objects (MissingReferenceException). Fixed by unsubscribing in OnDisable().",
    },
    {
      milestone: 5,
      concept: "Polling to events",
      detail:
        "ProcedureManager originally checked the current step every frame in Update(), which was simple and got the procedure working first. Once everything worked, it was refactored to subscribe to the four state-change events instead, so it does no work while nothing changes and isn't tied to frame timing. Behavior stayed identical, and it disappears from the Profiler's per-frame list.",
    },
    {
      milestone: 4,
      concept: "Pooled spark effects",
      detail:
        "A burst of sparks plays at the socket on every mistake. Effects come from Unity's ObjectPool<T> instead of Instantiate and Destroy each time, which avoids garbage and GC spikes, and a coroutine returns each one to the pool when it finishes playing.",
    },
    {
      milestone: 4,
      concept: "Grabbable filters",
      detail:
        "Filters are non-kinematic while loose, so physics drops them, and kinematic while held (parented to a hold point on the camera) or installed. Each method sets the state it creates (PickUp, Drop, LockInto) with a shared Attach helper, and picking one up raises OnPickedUp.",
    },
    {
      milestone: 4,
      concept: "Filter socket",
      detail:
        "A trigger collider installs a dropped part through guard clauses: the socket is empty, the object is a Grabbable, it isn't held, and it's the right part id. The socket holds the part by reference (composition, not inheritance), subscribes to its OnPickedUp on insert and unsubscribes on removal, and exposes a computed CurrentPartId.",
    },
    {
      milestone: 4,
      concept: "Kinematic door",
      detail:
        "The access panel is a kinematic Rigidbody that code moves instead of physics. Interact() only flips a target state; FixedUpdate() rotates toward it with MoveRotation and Quaternion.RotateTowards, so it swings smoothly and stays in sync with the physics system. The hinge is an empty parent at the panel's edge, so it pivots like a real door.",
    },
    {
      milestone: 3,
      concept: "Mistake detection",
      detail:
        "MistakeTracker is a second, independent listener on the old filter's OnPickedUp. If pressure is above a safe level it records the mistake and raises OnMistake, which the UI shows as a warning and the spark effect reacts to.",
    },
    {
      milestone: 3,
      concept: "Steps as data",
      detail:
        "TrainingStep is an abstract ScriptableObject with an instruction and an abstract IsComplete(ProcedureContext). DoorOpenStep, ValveStateStep, PressureBelowStep, and PartInSocketStep each override it with their own rule, and each step is an asset made from the editor menu, so a new procedure needs no code. One class can serve several steps with different data: PartInSocketStep with an empty id means \"socket must be empty\" (remove the filter), and with new-filter means \"new filter installed.\"",
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
        "Runs the steps in order and calls IsComplete without knowing a step's concrete type (polymorphism). It times each step and raises OnStepStarted and OnProcedureComplete. It's fully event-driven: it re-checks the current step only when a valve, the pressure, the door, or the socket changes, with no per-frame polling. Its state is exposed read-only.",
    },
    {
      milestone: 3,
      concept: "Event-driven UI",
      detail:
        "ProcedureUI updates only on events, never per frame. It shows the current instruction, rebuilds the checklist with a StringBuilder, shows mistake warnings, and computes the end summary (total time, mistakes, slowest step) with LINQ Sum, Max, and IndexOf.",
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
    {
      title: "Memory leak from a static event",
      detail:
        "After reloading the scene a few times, changing the pressure filled the Console with MissingReferenceException errors, and the count grew with every reload. Memory Profiler snapshots before and after 10 reloads showed leaked listener objects, each holding a 1 MB array, piling up. A listener had subscribed to a static event in OnEnable and never unsubscribed, so every reload added a subscriber while the destroyed ones stayed referenced. Fixed by unsubscribing in OnDisable().",
      lesson:
        "Every += needs a matching -=, especially for static events or any event source that outlives its listeners.",
    },
    {
      title: "Listeners subscribing more than once",
      detail:
        "Each valve toggle printed one, then two, then three sets of reactions. The setup code that subscribes in constructors sat inside a foreach loop, so every pass added another pair of listeners. Moved it outside the loop so it runs once.",
      lesson:
        "Each subscription runs its handler once per event, so subscribing twice means reacting twice.",
    },
    {
      title: "Gauge needle jumping on the first valve change",
      detail:
        "The needle snapped from 0 to near 3000 on the first change. Pressure starts at 3000 in Awake, but the gauge only updates on OnPressureChanged, which fires only on a change, so it showed its editor default until then. Added a one-time sync in Start(), which runs after every Awake().",
      lesson: "Event-driven displays need an initial sync.",
    },
    {
      title: "Scene changes missing from the repo",
      detail:
        "The door and the first step worked locally but weren't in the pushed scene, and a step asset's instruction was blank, because both had unsaved changes in the editor. Saved the scene and the project, checked git status, and recommitted.",
      lesson: "Before every commit, save the scene and project, then check git status.",
    },
    {
      title: "New filter vanishing when picked up",
      detail:
        "The old filter could be picked up, but the new one disappeared. Comparing the two filters' Inspector fields showed an empty Hold Point: prefabs can't keep references to scene objects, so picking it up attached it to the world origin. Set the reference on the scene instance.",
      lesson:
        "Scene-object references belong on scene instances, or should be found at runtime, not stored in prefabs.",
    },
    {
      title: "Sparks never returning to the pool",
      detail:
        "Sparks kept spawning forever after a mistake. The particle system was looping with continuous emission, so it never reported itself finished and the coroutine waiting on it never completed. Switched it to a single non-looping burst.",
      lesson:
        "Pooling depends on knowing when an object is done; an effect that never ends never gets returned.",
    },
    {
      title: "Repo setup",
      detail:
        "The Unity .gitignore template ignored the console project's .csproj, build output (bin/ and obj/) had been committed, and Unity Hub had created a nested Git repository. Fixed all three.",
    },
  ],
  nextIdeas: [
    "Load procedures from external data (such as JSON), so trainers can be authored without opening Unity",
    "More mistake types (wrong order, wrong part) and per-step hints",
    "Make the drain valve affect how fast pressure bleeds off",
    "Save and replay a trainee's session for instructor review",
    "Unit tests for step logic and the procedure manager",
  ],
  recreation: {
    maxPsi: 3000,
    psiPerSecond: 800,
    sweepDegrees: 270,
    closedAngle: 90,
    doorOpenAngle: 100,
    doorDegreesPerSecond: 180,
    safePsi: 1,
    acceptsPartId: "new-filter",
    steps: [
      { kind: "door", instruction: "Open the access panel", mustBeOpen: true },
      { kind: "valve", instruction: "Close the supply valve", mustBeOpen: false },
      { kind: "pressureBelow", instruction: "Wait for Pressure to bleed off", maxPsi: 1 },
      // An empty part id means "the socket must be empty".
      { kind: "partInSocket", instruction: "Remove the clogged filter", requiredPartId: "" },
      { kind: "partInSocket", instruction: "Install the new filter", requiredPartId: "new-filter" },
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
