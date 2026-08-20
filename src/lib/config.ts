/**
 * External configuration.
 *
 * Nothing in this file may be invented. A repo-wide search for a Play Store
 * listing, an App Store listing, or any download configuration turned up
 * nothing, so both URLs start as `null`. The UI reads these values and
 * degrades honestly — it never links to a fabricated store page.
 *
 * To go live: set `googlePlayUrl` to the real listing and the download button
 * becomes a working link automatically. Same for iOS.
 */
export interface StoreConfig {
  /** e.g. "https://play.google.com/store/apps/details?id=..." */
  googlePlayUrl: string | null;
  /** e.g. "com.aiyo.app" — shown nowhere, kept for build tooling. */
  androidPackageName: string | null;
  /** e.g. "https://apps.apple.com/app/id..." */
  appStoreUrl: string | null;
}

export const STORE: StoreConfig = {
  googlePlayUrl: null,
  androidPackageName: null,
  appStoreUrl: null,
};

export const isAndroidLive = () => Boolean(STORE.googlePlayUrl);
export const isIosLive = () => Boolean(STORE.appStoreUrl);

/**
 * Routes that exist in this app. The footer only renders links to these —
 * see the comment in SiteFooter about not inventing destinations.
 */
export const ROUTES = {
  landing: "/",
  app: "/app",
  create: "/app/create",
  templates: "/app/templates",
  history: "/app/history",
  process: (id: string) => `/app/process/${id}`,
} as const;
