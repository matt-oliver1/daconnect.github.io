# Direction K — Multi-page G (design spec)

**Date:** 2026-08-11
**Status:** Approved (design), pending implementation
**Author:** Matt Oliver + Claude

## Goal

Produce a new homepage preview, **Direction K**, that takes the exact content and
brand of Direction G but presents each major section as its **own standalone page**
(a genuine multi-page site) instead of one long scrolling page. Navbar links
navigate to separate pages rather than scrolling to anchors.

Additionally, abandon Direction G's fixed-width desktop approach (a `min-width:1460px`
wrapper scaled by a JS "zoom" scaler) in favour of a **genuinely fluid, responsive
layout**: content fills the full width of the page on desktop (capped for readability)
and reflows correctly on mobile.

Requested by a director who prefers single-purpose pages per section.

## Scope

- Lives entirely in `demo/`. The live site is untouched.
- Reuses existing images under `images/` and `images/demo/`.
- Copy is **verbatim from Direction G** (`demo/direction-g.html`). No wording changes.
- Green brand palette identical to G: green `#2C7A5B`, green-hover `#256A4F`,
  bright green `#4CAF7D`, gold `#B08A47`, navy `#101B2A`, ink `#1E2A38`, sand `#F7F4EF`.
- Font: DM Sans (as G).
- Q&A is out of scope for a new page — the nav's Q&A link keeps pointing at the
  existing `../faq.html`.

## Pages (6) — all in `demo/`

| File | Page | Content (from G) |
|------|------|------------------|
| `direction-k.html` | **Home** | Hero (+ 14-day-trial form) and the "Development Applications We Track" live DA tracker + stats |
| `direction-k-how.html` | **How It Works** | "From sign-up to your first…" 4-step section + trial CTA |
| `direction-k-who.html` | **Who It's For** | "Who Benefits from DAconnect" industry tiles + "Quote early to win the work." + trial CTA + testimonials ("The calls come…") |
| `direction-k-pricing.html` | **Pricing** | "Simple, transparent" plan card + monthly/yearly toggle |
| `direction-k-sample.html` | **Free Sample** | "Receive a Sample of the Digital Business Card" capture form |
| `direction-k-contact.html` | **Contact** | "Contact Our Team" form + details |

Testimonials ride along on the **Who It's For** page (they reinforce "who benefits").
The hero trial form appears on Home; a "Start your 14-day trial now" CTA button
appears on How It Works and Who It's For (as in G).

## Shared assets (DRY across 6 pages)

- `demo/assets/direction-k.css` — reset, brand tokens, layout system, header/nav,
  footer, trust bar, chat widget, buttons, and shared section/card styles.
- `demo/assets/direction-k.js` — shared scripts, each guarded by
  presence of its target element so one file is safe to load on every page:
  - mobile-nav (hamburger) toggle
  - chat widget open/close
  - region toggle + IP geolocation + stats + live feed (Home only — runs only if
    `#v2-region`/`#v2-feed` exist)
  - pricing monthly/yearly toggle + plan feature rendering (Pricing only)
  - trial-form / sample-form / contact-form button behaviour (guarded)

Each page is a small standalone HTML file that links the shared CSS/JS and contains
only its own `<main>` content plus the shared header/footer markup.

> Note: header and footer markup is repeated in each HTML file (no server-side
> includes on GitHub Pages), but all *styling* and *behaviour* is centralised in the
> shared css/js. Keeping the markup identical across files is a maintenance
> requirement.

## Layout system (fluid full-width)

- **No** `min-width:1460px` wrapper and **no** zoom-scaler script.
- Every section is a **full-bleed band** (background colour spans the viewport).
- Inside each band, a wrapper centres and caps the content:
  `.k-wrap { max-width:1600px; margin:0 auto; padding:0 clamp(20px,5vw,64px); }`
- Grids are fluid: `repeat(auto-fit, minmax(<min>, 1fr))` plus explicit media-query
  breakpoints where needed (e.g. hero two-column → single column).
- Type scales with `clamp()` so headings shrink gracefully.
- Target breakpoints: comfortable desktop (>1100px), tablet (~700–1100px),
  mobile (<700px). No horizontal scrollbar at any width.

## Shared chrome

- **Header:** green-brand logo + "LEAD GENERATION SERVICES" kicker; nav links →
  page files; the link for the current page gets an `aria-current="page"` + active
  style (green underline/weight). SIGN IN outline button. Hamburger on mobile opens
  a dropdown of the nav links.
- **Footer:** identical to G (columns, links, disclaimer) + navy trust bar.
- **Chat widget:** identical to G on every page.

## Interactivity mapping

| Behaviour | Pages |
|-----------|-------|
| Mobile nav + chat | all |
| Region toggle, geolocation, stats, live feed | Home |
| Pricing toggle + plan rendering | Pricing |
| Trial form | Home, (CTA buttons on How/Who link to signup URL) |
| Sample form | Free Sample |
| Contact form | Contact |

All interactive elements keep the same `id`s used in G so the ported scripts work
unchanged (`v2-region`, `v2-stat-0/1/2`, `v2-near-tag`, `v2-feed`, `v2-price-main`,
`v2-price-unit`, `v2-pricing-sub`, `v2-pricing-features`, `v2-bill-monthly`,
`v2-bill-yearly`, `v2-savings`, `v2-subscribe`, `v2-trial-btn`, `v2-sample-btn2`,
`v2-contact-btn`, `v2-chat-box`).

## Preview hub

Add a card **"G · Multi-page (K)"** to `demo/index.html` linking to
`direction-k.html`, noting it is a multi-page variant (nav navigates between pages).

## Success criteria

1. Six pages serve 200 and navigate to each other via the nav (no broken links).
2. No page has a horizontal scrollbar between 360px and 2560px wide; content fills
   the width on desktop and is single-column on mobile.
3. Home's DA tracker, geolocation, stats and live feed work; Pricing's toggle works;
   forms behave as in G; chat opens on every page.
4. Copy matches G verbatim; green brand only (no blue); images load.
5. The current page is highlighted in the nav on each page.

## Out of scope

- Any change to the live site or to Directions A–J.
- New copy, new imagery, or new sections not present in G.
- A real backend for the forms (they behave exactly as G's demo forms do).
