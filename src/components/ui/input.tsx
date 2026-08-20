import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-11 w-full rounded-[var(--radius)] border border-border bg-input/60 px-3.5 text-[15px] text-foreground placeholder:text-muted-foreground",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full resize-none rounded-[var(--radius)] border border-border bg-input/60 p-3.5 text-[15px] leading-6 text-foreground placeholder:text-muted-foreground",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
