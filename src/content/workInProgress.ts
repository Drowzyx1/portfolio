// Edit this file to update the Work in progress section. The home page, the
// /projects page, and the chatbot all read from it.
//
// `transcript` is real output from running the console app (see the repo), with
// the menu text trimmed after the first prompt. Re-capture it when the model changes.

export type MilestoneStatus = "done" | "next" | "planned";

export type Milestone = {
  title: string;
  status: MilestoneStatus;
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
  builtSoFar: { concept: string; detail: string }[];
  bugsFixed: string[];
  next: string;
  menu: string;
  transcript: TranscriptStep[];
};

export const workInProgress: WorkInProgress = {
  title: "Pump Station Maintenance Trainer",
  summary:
    "A virtual maintenance trainer being built to learn C# and Unity. A trainee follows a guided procedure to replace a clogged hydraulic filter on a pump station: open the access panel, close the supply valve, wait for pressure to bleed off, swap the filter, then reopen the valve and confirm pressure is restored. The finished Unity version will warn about unsafe actions (like pulling the filter while the system is pressurized) and end with a summary of time taken and mistakes made.",
  started: "November 2026",
  updated: "Nov 8, 2026",
  repo: "https://github.com/Drowzyx1/PumpStationTrainer",
  stack: ["C#", ".NET 9", "Unity (planned)"],
  milestones: [
    { title: "Setup (Unity 6.3 LTS, .NET, Git)", status: "done" },
    { title: "Pure C# model (console app)", status: "done" },
    {
      title: "Unity interaction: clickable valve, event-driven gauge, prefabs",
      status: "next",
    },
    {
      title: "Procedure system: steps as ScriptableObjects, UI, mistake detection",
      status: "planned",
    },
    {
      title: "Physics and polish: kinematic door, grabbable filters, socket, object pooling",
      status: "planned",
    },
    { title: "Profiling, debugging, and documentation", status: "planned" },
  ],
  builtSoFar: [
    {
      concept: "Inheritance",
      detail:
        "An abstract Component base class holds shared state and declares IsFaulty(); Pump, Valve, and Filter each define their own fault rule.",
    },
    {
      concept: "Interfaces",
      detail:
        "IInspectable and IRepairable describe capabilities. The main loop checks each part with `is` instead of its concrete type.",
    },
    {
      concept: "Events",
      detail:
        "Valve raises OnToggled. The pressure system and a logger react independently, and the valve knows about neither (observer pattern).",
    },
    {
      concept: "LINQ",
      detail:
        "A report lists faulty parts, total hours, and parts sorted by wear using Where, Select, Sum, and OrderByDescending.",
    },
    {
      concept: "Reflection",
      detail:
        "A custom [ShowInDebug] attribute lets one generic method print the tagged properties of any object, discovered at runtime.",
    },
  ],
  bugsFixed: [
    "Listeners subscribed more than once: each valve toggle printed one, then two, then three sets of reactions, because the subscription code sat inside a loop. Moved it outside so it runs once.",
    "The console app's project file was missing from the repo: the Unity .gitignore template ignores every *.csproj. Added an exception for it.",
  ],
  next: "Milestone 2: the Unity scene, with a clickable valve built on an IInteractable interface, a pressure system and gauge connected by events, and prefabs.",
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
