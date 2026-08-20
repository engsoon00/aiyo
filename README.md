# AiYo

An AI-powered assistant for everyday errands. Describe what you need to do and
AiYo turns it into preparation items, practical steps, a date and time, and a
reminder — then keeps the finished process so you can run it again.

Not a todo list: a todo tells you *what* to do, AiYo helps you work out *how* to
get it done.

## Running locally

```bash
npm install
npm run dev      # http://localhost:8080
npm run build    # type-check + production build
npm run preview  # serve the production build
```

## Routes

| Route                | What it is                                   |
| -------------------- | -------------------------------------------- |
| `/`                  | Marketing site                                |
| `/app`               | Dashboard                                     |
| `/app/create`        | Create a process (accepts `?q=<sentence>`)    |
| `/app/process/:id`   | Process detail — preparation, steps, reminder |
| `/app/templates`     | Template library                              |
| `/app/history`       | Completed processes                           |
| `/hero-v1`, `/hero-v2` | Earlier hero explorations, kept for comparison |

## How the "AI" works

`src/lib/parseIntent.ts` is a local, deterministic rule engine — no model call,
no network, no API key. It extracts dates and times ("tomorrow morning",
"Friday at 3 PM", "next Monday"), classifies the errand by keyword, and matches
a template from `src/lib/templates.ts`.

It exists so the product's UX is real and testable today. Swapping in a hosted
model is a one-file change: anything satisfying `(text: string) => ParsedIntent`
drops straight in.

**Voice input and document/OCR understanding are not implemented.** They are
marked "Coming soon" in the UI and the mic button is visibly disabled.

## Store links

`src/lib/config.ts` holds the store configuration. Both URLs are `null` — no
listing exists yet, and the UI degrades honestly rather than linking somewhere
fake:

```ts
export const STORE: StoreConfig = {
  googlePlayUrl: null,   // set this and the download button goes live
  androidPackageName: null,
  appStoreUrl: null,
};
```

Set `googlePlayUrl` and the Get Started dialog's download button becomes a real
link and the footer starts claiming Android availability. Until then it shows
"coming soon". No official Google Play badge ships with this repo — add the
official asset to `src/assets` and swap the icon in `GetStartedDialog.tsx`.

## Data

Processes live in `localStorage` under `aiyo.processes.v1`. There is no account,
no sync, and reminders are displayed but not delivered as notifications.

## Deploying to GitHub Pages

`.github/workflows/deploy.yml` builds and publishes on every push to `main`.

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub
Actions**.

The workflow derives the base path from the repository name — `/<repo>/` for a
project site, `/` for a `<name>.github.io` user site — and passes it as
`VITE_BASE`. The router reads the same value via `import.meta.env.BASE_URL`, and
`vite.config.ts` writes a `404.html` copy of `index.html` so deep links like
`/app/templates` survive a hard refresh on Pages' static hosting.

## Stack

Vite · React 18 · TypeScript · Tailwind · react-router · Radix Dialog ·
lucide-react
