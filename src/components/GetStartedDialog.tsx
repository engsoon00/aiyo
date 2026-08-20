import { type ReactNode, useState } from "react";
import { Apple, Download, Info } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { STORE } from "@/lib/config";

/**
 * The primary conversion action (§8).
 *
 * Honesty rules baked in, per §9/§10:
 *  - `STORE.googlePlayUrl` is null until someone sets a real listing, so the
 *    Android button renders disabled with a plain explanation rather than
 *    linking somewhere that doesn't exist.
 *  - iOS is a status line, never a button, unless a real App Store URL exists.
 *  - No official Google Play badge asset ships with this repo and fabricating
 *    one would misuse Google's mark — the button is plainly styled instead.
 *    Drop the official badge into src/assets and swap the icon when you have it.
 */
export function GetStartedDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const playUrl = STORE.googlePlayUrl;
  const iosUrl = STORE.appStoreUrl;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent aria-describedby="get-started-description">
        <div className="flex flex-col gap-5 p-6 pb-8 sm:pb-6">
          <div className="flex flex-col gap-2">
            <DialogTitle>Start with AiYo</DialogTitle>
            <DialogDescription id="get-started-description">
              Tell AiYo what you need to get done and let AiYo help you plan the
              process. Get the AiYo mobile app and start turning everyday tasks
              into simple processes.
            </DialogDescription>
          </div>

          {/* Android */}
          <div className="flex flex-col gap-2">
            {playUrl ? (
              <Button variant="heroPrimary" size="lg" asChild>
                <a href={playUrl} target="_blank" rel="noreferrer noopener">
                  <Download className="h-4 w-4" />
                  Download from Google Play
                </a>
              </Button>
            ) : (
              <Button variant="heroPrimary" size="lg" disabled>
                <Download className="h-4 w-4" />
                Download from Google Play
              </Button>
            )}

            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              {playUrl ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Android available now
                </>
              ) : import.meta.env.DEV ? (
                /* Developer note — never shipped to real visitors. */
                <>
                  <Info className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    Store link not configured yet — set{" "}
                    <code className="rounded bg-foreground/10 px-1 py-0.5 text-[11px]">
                      STORE.googlePlayUrl
                    </code>{" "}
                    in <code className="text-[11px]">src/lib/config.ts</code>.
                  </span>
                </>
              ) : (
                <>
                  <Info className="h-3.5 w-3.5 shrink-0" />
                  Android app coming soon
                </>
              )}
            </p>
          </div>

          <div className="h-px w-full bg-border" />

          {/* iOS */}
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm text-foreground/80">
              <Apple className="h-4 w-4 text-muted-foreground" />
              iOS
            </span>
            {iosUrl ? (
              <Button variant="outline" size="sm" asChild>
                <a href={iosUrl} target="_blank" rel="noreferrer noopener">
                  Download on the App Store
                </a>
              </Button>
            ) : (
              <Badge variant="soon">Coming soon</Badge>
            )}
          </div>

          <Button variant="ghost" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
