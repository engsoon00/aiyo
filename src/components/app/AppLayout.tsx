import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Clock3,
  LayoutTemplate,
  Home as HomeIcon,
  Plus,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/config";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const NAV: { to: string; label: string; icon: LucideIcon; end?: boolean }[] = [
  { to: ROUTES.app, label: "Dashboard", icon: HomeIcon, end: true },
  { to: ROUTES.templates, label: "Templates", icon: LayoutTemplate },
  { to: ROUTES.history, label: "History", icon: Clock3 },
];

/**
 * Adaptive rather than stretched (§30): a persistent sidebar from `lg` up, a
 * bottom tab bar below it. Same routes, different ergonomics.
 */
export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-border bg-[hsl(260_60%_4%)] px-4 py-6 lg:flex">
        <Link to={ROUTES.landing} className="px-2" aria-label="AiYo home">
          <img src={logo} alt="AiYo" className="h-8 w-auto" />
        </Link>

        <Button variant="heroPrimary" className="mt-7 w-full" asChild>
          <Link to={ROUTES.create}>
            <Plus className="h-4 w-4" />
            New Process
          </Link>
        </Button>

        <nav className="mt-6 flex flex-col gap-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-foreground/10 text-foreground"
                    : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to={ROUTES.landing}
          className="mt-auto px-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to website
        </Link>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-5 py-3.5 backdrop-blur lg:hidden">
        <Link to={ROUTES.landing} aria-label="AiYo home">
          <img src={logo} alt="AiYo" className="h-7 w-auto" />
        </Link>
        <Button variant="heroSecondary" className="rounded-full px-3.5 py-1.5" asChild>
          <Link to={ROUTES.create}>
            <Plus className="h-3.5 w-3.5" />
            New
          </Link>
        </Button>
      </header>

      <main className="px-5 pb-28 pt-6 lg:ml-60 lg:px-10 lg:pb-16 lg:pt-10">
        <div className="mx-auto w-full max-w-4xl">{children}</div>
      </main>

      {/* Mobile bottom tabs */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-background/95 backdrop-blur lg:hidden">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-[11px] transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

/**
 * Bottom action bar. It needs its own opaque backdrop — a bare `sticky` element
 * lets the page scroll visibly underneath it, which reads as a rendering bug.
 * Sits above the mobile tab bar, flush to the viewport bottom on desktop.
 */
export function StickyActions({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-16 z-20 -mx-5 mt-8 border-t border-border bg-background/95 px-5 py-4 backdrop-blur lg:bottom-0 lg:-mx-10 lg:px-10">
      <div className="flex flex-col gap-2 lg:flex-row">{children}</div>
    </div>
  );
}

export function PageHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-general-sans text-2xl font-medium tracking-[-0.02em] md:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
