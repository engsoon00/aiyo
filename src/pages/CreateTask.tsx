import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Check, Plus, Sparkles, Trash2, X } from "lucide-react";

import { AppLayout, StickyActions } from "@/components/app/AppLayout";
import { TaskInput } from "@/components/app/TaskInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/categories";
import { ROUTES } from "@/lib/config";
import { defaultReminder, formatWhen } from "@/lib/datetime";
import { parseIntent } from "@/lib/parseIntent";
import { templateById } from "@/lib/templates";
import type { ParsedIntent, Process } from "@/lib/types";
import { blankProcess, fromTemplate, useProcesses } from "@/store/ProcessStore";

const EXAMPLES = [
  "Go to the bank tomorrow",
  "Send a parcel",
  "Pay my electricity bill",
  "Clinic appointment on Friday at 3pm",
];

/** §27 — narrate the work, don't spin a generic chatbot dot. */
const THINKING_STEPS = [
  "Understanding your request",
  "Finding the right template",
  "Preparing your steps",
];

type Phase = "input" | "thinking" | "review";

/** Local <input type="datetime-local"> wants "YYYY-MM-DDTHH:mm" in local time. */
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function CreateTask() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { add } = useProcesses();

  const initial = params.get("q") ?? "";
  const [phase, setPhase] = useState<Phase>("input");
  const [sourceText, setSourceText] = useState(initial);
  const [intent, setIntent] = useState<ParsedIntent | null>(null);
  const [draft, setDraft] = useState<Process | null>(null);
  const [visibleThinking, setVisibleThinking] = useState(0);

  const understand = (text: string) => {
    setSourceText(text);
    setIntent(parseIntent(text));
    setVisibleThinking(0);
    setPhase("thinking");
  };

  // Arriving with ?q= (from a use-case card or the dashboard) skips straight in.
  useEffect(() => {
    if (initial) understand(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  // The parse itself is synchronous; this staged reveal is presentational only,
  // so the user can read what happened rather than watch it snap.
  useEffect(() => {
    if (phase !== "thinking") return;
    const timers = THINKING_STEPS.map((_, i) =>
      window.setTimeout(() => setVisibleThinking(i + 1), 260 * (i + 1))
    );
    const done = window.setTimeout(() => setPhase("review"), 260 * THINKING_STEPS.length + 320);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(done);
    };
  }, [phase]);

  const suggestedTemplate = useMemo(
    () => templateById(intent?.templateId),
    [intent]
  );

  // Build the draft the moment we land on review, from template or from scratch.
  useEffect(() => {
    if (phase !== "review" || !intent || draft) return;
    setDraft(
      suggestedTemplate
        ? fromTemplate(suggestedTemplate, {
            title: intent.title,
            scheduledAt: intent.scheduledAt,
            remindAt: defaultReminder(intent.scheduledAt),
            sourceText,
          })
        : blankProcess(intent.title, intent.category, intent.scheduledAt, sourceText)
    );
  }, [phase, intent, draft, suggestedTemplate, sourceText]);

  const reset = () => {
    setPhase("input");
    setIntent(null);
    setDraft(null);
  };

  const save = () => {
    if (!draft) return;
    add(draft);
    navigate(ROUTES.process(draft.id));
  };

  // -------------------------------------------------------------------------

  if (phase === "input") {
    return (
      <AppLayout>
        <BackLink />
        <h1 className="mt-4 font-general-sans text-2xl font-medium tracking-[-0.02em] md:text-3xl">
          Create Task
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          What do you need to do?
        </p>

        <div className="mt-5">
          <TaskInput autoFocus onSubmit={understand} placeholder="Type something..." />
        </div>

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground/45">
            Examples
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => understand(example)}
                className="rounded-full border border-border px-3.5 py-2 text-sm text-foreground/80 transition-colors hover:border-foreground/25 hover:bg-foreground/5"
              >
                &ldquo;{example}&rdquo;
              </button>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  if (phase === "thinking") {
    return (
      <AppLayout>
        <BackLink />
        <div className="mt-10 flex flex-col items-center text-center">
          <Sparkles className="h-6 w-6 text-foreground/70" />
          <h1 className="mt-4 font-general-sans text-xl font-medium">
            Creating your plan...
          </h1>
          <ul className="mt-6 flex flex-col gap-2.5">
            {THINKING_STEPS.map((step, i) => (
              <li
                key={step}
                className={`flex items-center gap-2.5 text-sm transition-opacity duration-200 ${
                  i < visibleThinking
                    ? "text-foreground/85 opacity-100"
                    : "text-muted-foreground opacity-40"
                }`}
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground/10">
                  {i < visibleThinking && (
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  )}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      </AppLayout>
    );
  }

  if (!draft || !intent) return null;
  const meta = CATEGORIES[draft.category];

  return (
    <AppLayout>
      <BackLink />

      {/* What AiYo understood — stated as a suggestion, never as certainty. */}
      <div className="mt-4 rounded-[var(--radius)] border border-border bg-card p-5">
        <p className="flex items-center gap-2 text-sm text-foreground/85">
          <Sparkles className="h-4 w-4 shrink-0 text-foreground/60" />
          {draft.steps.length > 0 ? (
            <span>
              I created a {draft.steps.length}-step plan for you.
            </span>
          ) : (
            <span>I couldn&rsquo;t match a template — here&rsquo;s a blank plan.</span>
          )}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge>
            <meta.icon className={`h-3 w-3 ${meta.tint}`} />
            {meta.label}
          </Badge>
          {intent.dateLabel && <Badge variant="outline">{intent.dateLabel}</Badge>}
          {intent.timeLabel && <Badge variant="outline">{intent.timeLabel}</Badge>}
          {intent.confidence < 0.5 && (
            <Badge variant="soon">Low confidence — check this</Badge>
          )}
        </div>

        {suggestedTemplate && (
          <p className="mt-4 text-sm text-muted-foreground">
            Suggested template:{" "}
            <span className="text-foreground/85">{suggestedTemplate.title}</span>
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={reset}>
            <X className="h-3.5 w-3.5" />
            Start over
          </Button>
          {suggestedTemplate && draft.steps.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setDraft(
                  blankProcess(
                    draft.title,
                    draft.category,
                    draft.scheduledAt,
                    sourceText
                  )
                )
              }
            >
              Create Custom instead
            </Button>
          )}
        </div>
      </div>

      {/* Editable plan */}
      <div className="mt-4 flex flex-col gap-4">
        <Field label="Title">
          <Input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
        </Field>

        <Field label="Date & time">
          <input
            type="datetime-local"
            value={toLocalInput(draft.scheduledAt)}
            onChange={(e) => {
              const iso = e.target.value
                ? new Date(e.target.value).toISOString()
                : null;
              setDraft({ ...draft, scheduledAt: iso, remindAt: defaultReminder(iso) });
            }}
            className="h-11 w-full rounded-[var(--radius)] border border-border bg-input/60 px-3.5 text-[15px] text-foreground [color-scheme:dark]"
          />
          {draft.remindAt && (
            <p className="mt-2 text-xs text-muted-foreground">
              Reminder set for {formatWhen(draft.remindAt)} — an hour before.
            </p>
          )}
        </Field>

        <EditableList
          label="Preparation"
          placeholder="Add something to bring"
          items={draft.preparation.map((p) => ({ id: p.id, label: p.label }))}
          onChange={(items) =>
            setDraft({
              ...draft,
              preparation: items.map((item) => {
                const existing = draft.preparation.find((p) => p.id === item.id);
                return existing
                  ? { ...existing, label: item.label }
                  : { id: item.id, label: item.label, done: false };
              }),
            })
          }
        />

        <EditableList
          label="Steps"
          placeholder="Add a step"
          ordered
          items={draft.steps.map((s) => ({ id: s.id, label: s.label }))}
          onChange={(items) =>
            setDraft({
              ...draft,
              steps: items.map((item) => {
                const existing = draft.steps.find((s) => s.id === item.id);
                return existing
                  ? { ...existing, label: item.label }
                  : { id: item.id, label: item.label, done: false };
              }),
            })
          }
        />
      </div>

      <StickyActions>
        <Button
          variant="heroPrimary"
          size="lg"
          className="w-full"
          onClick={save}
          disabled={!draft.title.trim()}
        >
          Save Process
        </Button>
      </StickyActions>
    </AppLayout>
  );
}

// ---------------------------------------------------------------------------

function BackLink() {
  return (
    <Link
      to={ROUTES.app}
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      Back
    </Link>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius)] border border-border bg-card p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-foreground/45">
        {label}
      </p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

interface ListItem {
  id: string;
  label: string;
}

function EditableList({
  label,
  items,
  onChange,
  placeholder,
  ordered,
}: {
  label: string;
  items: ListItem[];
  onChange: (items: ListItem[]) => void;
  placeholder: string;
  ordered?: boolean;
}) {
  const [draft, setDraft] = useState("");

  const addItem = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...items, { id: `new_${Date.now()}_${items.length}`, label: trimmed }]);
    setDraft("");
  };

  return (
    <div className="rounded-[var(--radius)] border border-border bg-card p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-foreground/45">
        {label}
      </p>

      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item, i) => (
          <li key={item.id} className="flex items-center gap-2">
            {ordered && (
              <span className="w-4 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                {i + 1}
              </span>
            )}
            <Input
              value={item.label}
              aria-label={`${label} item ${i + 1}`}
              onChange={(e) =>
                onChange(
                  items.map((it) =>
                    it.id === item.id ? { ...it, label: e.target.value } : it
                  )
                )
              }
              className="h-10"
            />
            <button
              type="button"
              aria-label={`Remove ${item.label || `item ${i + 1}`}`}
              onClick={() => onChange(items.filter((it) => it.id !== item.id))}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center gap-2">
        <Input
          value={draft}
          placeholder={placeholder}
          aria-label={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
          className="h-10"
        />
        <Button
          type="button"
          variant="outline"
          className="h-10 shrink-0"
          onClick={addItem}
          disabled={!draft.trim()}
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>
    </div>
  );
}
