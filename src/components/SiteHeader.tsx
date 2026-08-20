import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { GetStartedDialog } from "@/components/GetStartedDialog";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/config";
import logo from "@/assets/logo.png";

const SECTIONS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Pricing", href: "#pricing" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-30">
      <nav className="mx-auto flex w-full max-w-content items-center justify-between px-5 py-5 md:px-8">
        <Link to={ROUTES.landing} className="flex items-center" aria-label="AiYo home">
          <img src={logo} alt="AiYo" className="h-8 w-auto" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {SECTIONS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-foreground/90 transition-colors duration-200 hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
          <Link
            to={ROUTES.app}
            className="text-sm text-foreground/90 transition-colors duration-200 hover:text-foreground"
          >
            Open Web App
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <GetStartedDialog>
            <Button variant="heroSecondary" className="rounded-full px-4 py-2">
              Get Started
            </Button>
          </GetStartedDialog>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-foreground/80 transition-colors hover:bg-foreground/10 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu — the nav links stack rather than colliding with the logo. */}
      {open && (
        <div className="mx-5 mb-2 flex flex-col gap-1 rounded-[var(--radius)] border border-border bg-card p-2 md:hidden">
          {SECTIONS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-foreground/90 hover:bg-foreground/5"
            >
              {item.label}
            </a>
          ))}
          <Link
            to={ROUTES.app}
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm text-foreground/90 hover:bg-foreground/5"
          >
            Open Web App
          </Link>
        </div>
      )}

      <div className="mt-[3px] h-px w-full hairline" />
    </header>
  );
}
