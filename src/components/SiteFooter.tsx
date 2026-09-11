import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

import { GetStartedDialog } from "@/components/GetStartedDialog";
import { Logo } from "@/components/Logo";
import { isAndroidLive, ROUTES, STORE } from "@/lib/config";
import logoMark from "@/assets/logo.png";

/**
 * §28 asks for Product / Support / Legal columns, and also says: do not invent
 * URLs, and mark placeholders clearly.
 *
 * Product links all point at real destinations in this app. Support and Legal
 * pages don't exist yet, so those labels render as plain text with a single
 * honest footnote instead of links that 404 — see the note below the columns.
 */
const PRODUCT_LINKS = [
  { label: "How It Works", to: "/#how-it-works", internal: true },
  { label: "Templates", to: ROUTES.templates, internal: true },
  { label: "Pricing", to: "/#pricing", internal: true },
];

const UNPUBLISHED = {
  Support: ["Help Center", "Contact Us", "Feedback"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

export function SiteFooter() {
  const playUrl = STORE.googlePlayUrl;

  return (
    <footer className="border-t border-border bg-[hsl(260_60%_4%)]">
      <div className="mx-auto w-full max-w-content px-5 py-12 md:px-8 md:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between md:gap-8">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Your AI assistant for everyday errands.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:gap-14">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
                Product
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {PRODUCT_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <GetStartedDialog>
                    <button
                      type="button"
                      className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                    >
                      Get Started
                    </button>
                  </GetStartedDialog>
                </li>
              </ul>
            </div>

            {Object.entries(UNPUBLISHED).map(([heading, items]) => (
              <div key={heading}>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
                  {heading}
                </h2>
                <ul className="mt-4 flex flex-col gap-3">
                  {items.map((label) => (
                    <li
                      key={label}
                      className="text-sm text-muted-foreground/70"
                      aria-disabled="true"
                    >
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-10 text-xs leading-5 text-muted-foreground/70">
          Support and legal pages are not published yet, so those items are shown
          without links rather than pointing somewhere that does not exist.
        </p>

        <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AiYo. All rights reserved.
          </p>
          {/* Only claim availability once a real listing exists (§9/§10). */}
          <p className="text-xs text-muted-foreground">
            {isAndroidLive()
              ? "Android on Google Play · iOS coming soon"
              : "Mobile apps coming soon"}
          </p>
        </div>

        {playUrl && (
          <div className="mt-8 flex flex-col items-center gap-4 border-t border-border pt-8 sm:flex-row sm:justify-between">
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium text-foreground/90">Get the AiYo app</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Scan to download AiYo for Android.
              </p>
            </div>
            <a
              href={playUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-xl bg-white p-2"
              aria-label="Scan to download AiYo for Android"
            >
              <QRCodeSVG
                value={playUrl}
                size={104}
                level="H"
                marginSize={2}
                fgColor="#0a0a0a"
                bgColor="#ffffff"
                title="Scan to download AiYo for Android"
                imageSettings={{
                  src: logoMark,
                  height: 24,
                  width: 24,
                  excavate: true,
                }}
              />
            </a>
          </div>
        )}
      </div>
    </footer>
  );
}
