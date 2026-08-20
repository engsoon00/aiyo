# Full-Screen Video Hero — Reusable Prompt Template

Your original spec was a *snapshot*: every value hardcoded to one brand, one video, one
palette. This turns it into a *machine*: a fixed structural contract plus a variables block
you swap per project.

**How to use:** fill in §1, paste §1 + §2 into your builder (Claude, Lovable, v0, Bolt).
§3 shows the aiyo values as a worked example. §4 is the tuning guide — read it before you
change numbers, because several of these values are load-bearing and a few of them fight
each other.

---

## 1. Variables

```yaml
# ─── Brand & content ────────────────────────────────────────────────
brand_name:        "{{BRAND}}"                 # e.g. aiyo
logo_path:         "{{LOGO_PATH}}"             # e.g. src/assets/logo.png
logo_height:       "{{LOGO_H}}"                # e.g. 32px

nav_items:                                     # label + whether it has a ChevronDown
  - { label: "{{NAV_1}}", dropdown: {{BOOL}} }
  - { label: "{{NAV_2}}", dropdown: {{BOOL}} }
  - { label: "{{NAV_3}}", dropdown: {{BOOL}} }
  - { label: "{{NAV_4}}", dropdown: {{BOOL}} }
nav_cta_label:     "{{NAV_CTA}}"               # e.g. Sign Up

headline_plain:    "{{HEAD_PLAIN}}"            # rendered in solid foreground
headline_gradient: "{{HEAD_GRADIENT}}"         # rendered in the gradient
subtitle_line_1:   "{{SUB_1}}"
subtitle_line_2:   "{{SUB_2}}"                 # explicit <br />, not wrapping
hero_cta_label:    "{{HERO_CTA}}"

marquee_lede_1:    "{{LEDE_1}}"                # e.g. Relied on by brands
marquee_lede_2:    "{{LEDE_2}}"                # e.g. across the globe
marquee_logos:     ["{{L1}}", "{{L2}}", "{{L3}}", "{{L4}}", "{{L5}}", "{{L6}}"]

# ─── Theme ──────────────────────────────────────────────────────────
color_background:  "{{H S% L%}}"               # raw HSL triplet, no hsl() wrapper
color_foreground:  "{{H S% L%}}"
color_hero_sub:    "{{H S% L%}}"

font_body:         "{{BODY_FONT}}"             # + how to load it (npm pkg or CDN)
font_body_source:  "{{BODY_FONT_SOURCE}}"
font_display:      "{{DISPLAY_FONT}}"
font_display_source: "{{DISPLAY_FONT_SOURCE}}"

# ─── Hero media ─────────────────────────────────────────────────────
video_url:         "{{VIDEO_URL}}"
fade_duration:     "{{FADE_S}}"                # seconds, default 0.5
replay_delay:      "{{REPLAY_MS}}"             # ms, default 100

# ─── Type scale ─────────────────────────────────────────────────────
headline_size:     "{{HEAD_SIZE}}"             # e.g. 220px
headline_leading:  "{{HEAD_LEADING}}"          # e.g. 1.02
headline_tracking: "{{HEAD_TRACKING}}"         # e.g. -0.024em
gradient_stops:    "{{DIRECTION}}, {{C1}}, {{C2}}, {{C3}}"

# ─── Blur mass ──────────────────────────────────────────────────────
blur_w: "{{W}}"   blur_h: "{{H}}"
blur_color: "{{TW_COLOR}}"                     # e.g. bg-gray-950
blur_radius: "{{BLUR}}"                        # e.g. 82px
blur_opacity: "{{OPACITY}}"                    # e.g. 90

# ─── Marquee ────────────────────────────────────────────────────────
marquee_duration:  "{{SECONDS}}"               # e.g. 20s
marquee_gap:       "{{GAP}}"                   # e.g. gap-16
```

---

## 2. The prompt

> Build a full-screen dark hero section: looping background video, navbar, oversized
> headline, subtitle, CTA, and a logo marquee pinned to the bottom. Vite + React +
> TypeScript + Tailwind, shadcn-style `Button`.
>
> **Theme (`index.css` CSS variables)**
> `--background: {{color_background}}`, `--foreground: {{color_foreground}}`,
> `--hero-sub: {{color_hero_sub}}`. Body font {{font_body}} via {{font_body_source}};
> headline font {{font_display}} via {{font_display_source}}. Expose `--hero-sub` to
> Tailwind as a `hero-sub` color so `text-hero-sub` works.
>
> **Background video** — `{{video_url}}`, absolutely positioned `inset-0 w-full h-full
> object-cover` behind all content, inside a wrapper with `overflow-hidden`. Content sits
> in a `relative z-10` sibling above it. **No gradient overlays on the video.** It starts
> at `opacity: 0` and is driven entirely by a `requestAnimationFrame` loop: fade in over
> the first {{fade_duration}}s, fade out over the last {{fade_duration}}s, computed as
> `min(currentTime / FADE, (duration − currentTime) / FADE)` clamped to 0–1. Native
> `loop` is **off**; on `ended`, set opacity to 0, wait {{replay_delay}}ms, then seek to 0
> and replay. Guard the rAF against unmount, and against `duration` being `NaN` before
> metadata loads.
>
> **Blurred mass** — a `{{blur_w}} × {{blur_h}}`, `opacity-{{blur_opacity}}`,
> `{{blur_color}}`, `blur-[{{blur_radius}}]` div at `top-1/2 left-1/2 -translate-x-1/2
> -translate-y-1/2`, `pointer-events-none`. It darkens the video behind the copy so the
> text stays legible on bright frames. The section must be `overflow-visible` so the blur
> isn't clipped.
>
> **Navbar** — full width, `py-5 px-8`, `flex flex-row justify-between`. Left: logo image
> from `{{logo_path}}` at `{{logo_height}}`. Center: {{nav_items}} — each a button with
> `text-foreground/90` and a hover transition, with a lucide `ChevronDown` on the ones
> marked dropdown. Right: `{{nav_cta_label}}` button, `heroSecondary` variant,
> `rounded-full px-4 py-2`. Below the navbar, a 1px divider: `mt-[3px]`, `bg-gradient-to-r
> from-transparent via-foreground/20 to-transparent`.
>
> **Hero content** — vertically centered in the remaining space via `flex-1 flex
> items-center justify-center`.
> Headline: `text-[{{headline_size}}] font-normal leading-[{{headline_leading}}]
> tracking-[{{headline_tracking}}]` in {{font_display}}. `"{{headline_plain}} "` is plain
> `text-foreground`; `"{{headline_gradient}}"` uses `bg-clip-text text-transparent` with
> `backgroundImage: linear-gradient({{gradient_stops}})`.
> Subtitle: `"{{subtitle_line_1}}"` / `"{{subtitle_line_2}}"` with an explicit `<br />`,
> `text-hero-sub text-lg leading-8 max-w-md mt-[9px] opacity-80`.
> CTA: `{{hero_cta_label}}`, `heroSecondary` variant, `px-[29px] py-[24px] mt-[25px]`.
>
> **Logo marquee** — pinned to the bottom of the hero, `pb-10`, container `max-w-5xl
> mx-auto`, `gap-12` between the two halves. Left: static `"{{marquee_lede_1}}" /
> "{{marquee_lede_2}}"` in `text-foreground/50 text-sm`. Right: an infinite marquee of
> {{marquee_logos}}, each a `liquid-glass` 24×24 `rounded-lg` tile showing the first
> letter plus the name in `text-base font-semibold text-foreground`. Animation
> `translateX(0%) → translateX(-50%)`, `{{marquee_duration}} linear infinite`,
> `{{marquee_gap}}` between logos.
> **Seam requirement:** render the list as *two sibling groups*, each
> `flex {{marquee_gap}} pr-16`, inside one `flex w-max` track — not as one flat doubled
> list. A flat list of 12 items makes each half `6w + 5.5g` wide, so `-50%` lands half a
> gap short and the loop visibly hitches once per cycle.
>
> **`heroSecondary` button variant** — a `class-variance-authority` variant on the shadcn
> `Button`: `liquid-glass rounded-full` translucent pill, `text-foreground/95`, subtle
> hover lift. Because both call sites pass their own padding, this variant must resolve to
> a size with `h-auto` and **no** padding of its own — otherwise the default `h-10 px-4
> py-2` fights the explicit `py-[24px]`. Merge classes with `tailwind-merge` so caller
> classes win.
>
> **Liquid glass utility (`index.css`)**
> ```css
> .liquid-glass {
>   background: rgba(255, 255, 255, 0.01);
>   background-blend-mode: luminosity;
>   backdrop-filter: blur(4px);
>   border: none;
>   box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
>   position: relative;
>   overflow: hidden;
> }
> .liquid-glass::before {
>   content: ""; position: absolute; inset: 0;
>   border-radius: inherit; padding: 1.4px;
>   background: linear-gradient(180deg,
>     rgba(255,255,255,0.45) 0%,  rgba(255,255,255,0.15) 20%,
>     rgba(255,255,255,0)   40%,  rgba(255,255,255,0)    60%,
>     rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%);
>   -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
>   -webkit-mask-composite: xor;
>   mask-composite: exclude;
>   pointer-events: none;
> }
> ```
> Include the unprefixed `mask` alongside `-webkit-mask` or the border ring disappears in
> Firefox.
>
> **Section structure** — `min-h-screen flex flex-col`: navbar at top, content centered via
> `flex-1 flex items-center justify-center`, marquee at bottom.

---

## 3. Worked example — the aiyo fill

```yaml
brand_name: aiyo
logo_path: src/assets/logo.png
logo_height: 32px
nav_items:
  - { label: Features,  dropdown: true  }
  - { label: Solutions, dropdown: false }
  - { label: Plans,     dropdown: false }
  - { label: Learning,  dropdown: true  }
nav_cta_label: Sign Up
headline_plain: "Power"
headline_gradient: "AI"
subtitle_line_1: The most powerful AI ever deployed
subtitle_line_2: in talent acquisition
hero_cta_label: Schedule a Consult
marquee_lede_1: Relied on by brands
marquee_lede_2: across the globe
marquee_logos: [Vortex, Nimbus, Prysma, Cirrus, Kynder, Halcyn]

color_background: 260 87% 3%
color_foreground: 40 6% 95%
color_hero_sub:   40 6% 82%
font_body: Geist Sans
font_body_source: "@fontsource/geist-sans"
font_display: General Sans
font_display_source: "https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"

video_url: https://d8j0ntlcm91z4.cloudfront.net/.../hf_20260328_065045_....mp4
fade_duration: 0.5
replay_delay: 100

headline_size: 220px
headline_leading: 1.02
headline_tracking: -0.024em
gradient_stops: "to left, #6366f1, #a855f7, #fcd34d"

blur_w: w-[984px]   blur_h: h-[527px]
blur_color: bg-gray-950
blur_radius: 82px
blur_opacity: 90

marquee_duration: 20s
marquee_gap: gap-16
```

---

## 4. Which knobs actually matter

**Load-bearing — change these and the design changes identity**

| Variable | Why |
|---|---|
| `color_background` | The 87% saturation at 3% lightness is what makes it read blue-purple rather than flat black. Drop saturation and the whole thing goes generic. |
| `headline_size` + `tracking` | The `-0.024em` is compensating for the 220px size. Tight tracking on small text looks broken; loose tracking at 220px looks amateur. Scale them together. |
| `gradient_stops` direction | `to left` puts amber on the left, indigo on the right. Flip to `to right` and the warm end collides with the CTA below it. |
| `blur_radius` vs `blur_w/h` | The blur radius has to be large relative to nothing in particular — but the *mass* has to be wider than your headline or you get a visible rectangle edge behind the text. Keep width ≥ headline width. |

**Safe to retune**

`fade_duration`, `replay_delay`, `marquee_duration`, `marquee_gap`, all the copy,
the logo set, the nav items. None of these interact with anything else.

**Traps**

- **`heroSecondary` sizing.** The variant carries no padding by design. If you add default
  padding to it "for convenience," every call site's explicit padding silently fights it.
- **Marquee seam.** See §2. This is the single most common way this component ships broken.
- **`overflow-visible` on the section vs `overflow-hidden` on the wrapper.** These look
  contradictory and get "cleaned up" by well-meaning refactors. The wrapper clips the
  video and the oversized headline; the section must *not* clip the blur. Both are needed.
- **Fixed `text-[220px]`.** There is no responsive behavior in this spec. Below ~1000px
  the headline overflows and the wrapper's `overflow-hidden` clips it. If you need mobile,
  add `text-[clamp(64px,18vw,220px)]` — but note that changes the blur-width relationship
  above.
- **Autoplay.** `muted` + `playsInline` are mandatory or the video never starts on iOS and
  the rAF loop holds opacity at 0 forever — which looks exactly like a broken build.

**Underspecified in the original — decide explicitly**

- **Headline alignment.** `max-w-md` on the subtitle plus a manual `<br />` reads as
  left-aligned; a 220px headline reads as centered. Pick one and say so.
- **Marquee edge treatment.** No fade mask was specified, so logos pop in and out at the
  container edge. Add `mask-image: linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)`
  if you want them to dissolve instead.
- **Nav behavior on mobile.** The nav items have no breakpoint rule. They need a hamburger
  or a hide, or they collide with the logo.
