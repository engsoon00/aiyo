import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-foreground/80 hover:bg-foreground/5 hover:text-foreground",
        link: "text-foreground underline-offset-4 hover:underline",
        outline:
          "border border-border bg-transparent hover:bg-foreground/5 hover:border-foreground/25",
        /** Primary conversion action. The brand gradient, used sparingly. */
        heroPrimary:
          "rounded-full bg-gradient-to-l from-indigo-500 via-purple-500 to-amber-300 text-[hsl(260_87%_6%)] font-semibold shadow-[0_1px_0_rgba(255,255,255,0.25)_inset] hover:brightness-110 active:brightness-95",
        /**
         * Hero glass pill — translucent, blurred, with a soft inset highlight
         * and the vertical liquid-glass edge gradient.
         */
        heroSecondary:
          "liquid-glass rounded-full text-foreground/95 font-medium tracking-[-0.01em] hover:bg-white/[0.06] hover:text-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-6 text-[15px]",
        icon: "h-10 w-10",
        /** Intrinsic height — padding is supplied by the caller. */
        hero: "h-auto",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render the child element instead of a <button> — for links. */
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, children, ...props }, ref) => {
    // The hero variants are sized by their own padding, not a fixed height.
    const resolvedSize =
      size ?? (variant === "heroSecondary" ? "hero" : "default");
    const classes = cn(
      buttonVariants({ variant, size: resolvedSize }),
      className
    );

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string }>;
      return React.cloneElement(child, {
        className: cn(classes, child.props.className),
      });
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
