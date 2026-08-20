import { useState, type FormEvent } from "react";
import { ArrowRight, Mic } from "lucide-react";

import { Button } from "@/components/ui/button";

interface TaskInputProps {
  value?: string;
  placeholder?: string;
  autoFocus?: boolean;
  submitLabel?: string;
  onSubmit: (text: string) => void;
}

/**
 * The single entry point to the product.
 *
 * The mic is present but disabled — no speech service exists in this project
 * and §4/§16 say to prepare the UI without faking the capability. It carries a
 * title and aria-label saying so rather than silently doing nothing.
 */
export function TaskInput({
  value = "",
  placeholder = "What do you need to do?",
  autoFocus,
  submitLabel = "Continue",
  onSubmit,
}: TaskInputProps) {
  const [text, setText] = useState(value);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (trimmed) onSubmit(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex items-center gap-2 rounded-[var(--radius)] border border-border bg-card p-2 pl-4 focus-within:border-foreground/25">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-label="Describe what you need to do"
          className="h-10 min-w-0 flex-1 bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
        />

        <button
          type="button"
          disabled
          title="Voice input is coming soon"
          aria-label="Voice input (coming soon)"
          className="rounded-lg p-2 text-muted-foreground/60"
        >
          <Mic className="h-4 w-4" />
        </button>

        <Button
          type="submit"
          variant="heroPrimary"
          className="h-10 shrink-0 px-4"
          disabled={!text.trim()}
        >
          <span className="hidden sm:inline">{submitLabel}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
