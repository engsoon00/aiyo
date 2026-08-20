import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { defaultReminder } from "@/lib/datetime";
import { templateById } from "@/lib/templates";
import type { CategoryId, Process, Template } from "@/lib/types";

const STORAGE_KEY = "aiyo.processes.v1";

/** Crypto-free id — this store never leaves the device. */
let counter = 0;
const uid = (prefix: string) =>
  `${prefix}_${Date.now().toString(36)}_${(counter++).toString(36)}`;

// ---------------------------------------------------------------------------
// Seed data — a couple of processes so the app doesn't open empty on a first
// visit. Cleared the moment the user creates anything of their own.
// ---------------------------------------------------------------------------

function seed(): Process[] {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  twoDaysAgo.setHours(14, 30, 0, 0);

  const bank = fromTemplate(templateById("bank-visit") as Template, {
    title: "Update Phone Number at Bank",
    scheduledAt: tomorrow.toISOString(),
    sourceText: "I need to go to the bank tomorrow morning to update my phone number.",
  });

  const parcel = fromTemplate(templateById("send-parcel") as Template, {
    scheduledAt: twoDaysAgo.toISOString(),
    sourceText: "Send a parcel to Penang",
  });
  parcel.steps = parcel.steps.map((s) => ({ ...s, done: true }));
  parcel.preparation = parcel.preparation.map((p) => ({ ...p, done: true }));
  parcel.completedAt = twoDaysAgo.toISOString();

  return [bank, parcel];
}

export function fromTemplate(
  template: Template,
  overrides: Partial<Process> = {}
): Process {
  const scheduledAt = overrides.scheduledAt ?? null;
  return {
    id: uid("p"),
    title: overrides.title ?? template.title,
    category: template.category,
    scheduledAt,
    remindAt: overrides.remindAt ?? defaultReminder(scheduledAt),
    preparation: template.preparation.map((item) => ({
      id: uid("prep"),
      label: item.label,
      hint: item.hint,
      done: false,
    })),
    steps: template.steps.map((label) => ({ id: uid("step"), label, done: false })),
    templateId: template.id,
    createdAt: new Date().toISOString(),
    completedAt: null,
    ...overrides,
  };
}

export function blankProcess(
  title: string,
  category: CategoryId,
  scheduledAt: string | null,
  sourceText?: string
): Process {
  return {
    id: uid("p"),
    title,
    category,
    scheduledAt,
    remindAt: defaultReminder(scheduledAt),
    preparation: [],
    steps: [],
    sourceText,
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

interface ProcessStore {
  processes: Process[];
  upcoming: Process[];
  active: Process[];
  completed: Process[];
  byId: (id: string) => Process | undefined;
  add: (process: Process) => void;
  update: (id: string, patch: Partial<Process>) => void;
  remove: (id: string) => void;
  toggleStep: (processId: string, stepId: string) => void;
  togglePrep: (processId: string, prepId: string) => void;
  complete: (id: string) => void;
  reopen: (id: string) => void;
  /** "Use Again" — clones a completed process back into the active list. */
  useAgain: (id: string) => Process | null;
}

const Ctx = createContext<ProcessStore | null>(null);

function load(): Process[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Process[]) : seed();
  } catch {
    // Private mode, quota, corrupt JSON — all non-fatal, just start fresh.
    return seed();
  }
}

export function ProcessProvider({ children }: { children: ReactNode }) {
  const [processes, setProcesses] = useState<Process[]>(load);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(processes));
    } catch {
      /* Persistence is a convenience, never a requirement. */
    }
  }, [processes]);

  const add = useCallback((process: Process) => {
    setProcesses((prev) => [process, ...prev]);
  }, []);

  const update = useCallback((id: string, patch: Partial<Process>) => {
    setProcesses((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );
  }, []);

  const remove = useCallback((id: string) => {
    setProcesses((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const toggleStep = useCallback((processId: string, stepId: string) => {
    setProcesses((prev) =>
      prev.map((p) =>
        p.id === processId
          ? {
              ...p,
              steps: p.steps.map((s) =>
                s.id === stepId ? { ...s, done: !s.done } : s
              ),
            }
          : p
      )
    );
  }, []);

  const togglePrep = useCallback((processId: string, prepId: string) => {
    setProcesses((prev) =>
      prev.map((p) =>
        p.id === processId
          ? {
              ...p,
              preparation: p.preparation.map((item) =>
                item.id === prepId ? { ...item, done: !item.done } : item
              ),
            }
          : p
      )
    );
  }, []);

  const complete = useCallback((id: string) => {
    setProcesses((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              completedAt: new Date().toISOString(),
              steps: p.steps.map((s) => ({ ...s, done: true })),
            }
          : p
      )
    );
  }, []);

  const reopen = useCallback((id: string) => {
    setProcesses((prev) =>
      prev.map((p) => (p.id === id ? { ...p, completedAt: null } : p))
    );
  }, []);

  const useAgain = useCallback(
    (id: string): Process | null => {
      const source = processes.find((p) => p.id === id);
      if (!source) return null;

      const clone: Process = {
        ...source,
        id: uid("p"),
        scheduledAt: null,
        remindAt: null,
        completedAt: null,
        createdAt: new Date().toISOString(),
        preparation: source.preparation.map((item) => ({
          ...item,
          id: uid("prep"),
          done: false,
        })),
        steps: source.steps.map((step) => ({
          ...step,
          id: uid("step"),
          done: false,
        })),
      };

      setProcesses((prev) => [clone, ...prev]);
      return clone;
    },
    [processes]
  );

  const value = useMemo<ProcessStore>(() => {
    const open = processes.filter((p) => !p.completedAt);
    return {
      processes,
      // "Active" = someone has started ticking things off.
      active: open.filter(
        (p) => p.steps.some((s) => s.done) || p.preparation.some((i) => i.done)
      ),
      upcoming: open
        .filter(
          (p) => !p.steps.some((s) => s.done) && !p.preparation.some((i) => i.done)
        )
        .sort((a, b) => {
          if (!a.scheduledAt) return 1;
          if (!b.scheduledAt) return -1;
          return a.scheduledAt.localeCompare(b.scheduledAt);
        }),
      completed: processes
        .filter((p) => p.completedAt)
        .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? "")),
      byId: (id) => processes.find((p) => p.id === id),
      add,
      update,
      remove,
      toggleStep,
      togglePrep,
      complete,
      reopen,
      useAgain,
    };
  }, [processes, add, update, remove, toggleStep, togglePrep, complete, reopen, useAgain]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProcesses(): ProcessStore {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useProcesses must be used inside <ProcessProvider>");
  return ctx;
}

/** Progress across preparation + steps, 0–1. */
export function progressOf(process: Process): number {
  const items = [...process.preparation, ...process.steps];
  if (!items.length) return 0;
  return items.filter((i) => i.done).length / items.length;
}

/** The step the user should be doing right now. */
export function currentStepIndex(process: Process): number {
  const idx = process.steps.findIndex((s) => !s.done);
  return idx === -1 ? process.steps.length : idx;
}
