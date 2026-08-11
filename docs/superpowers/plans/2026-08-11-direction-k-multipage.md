# Direction K — Multi-page G Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Direction K — a 6-page version of Direction G where each section is its own page, with fluid full-width responsive layout and navbar links that navigate between pages.

**Architecture:** Six standalone HTML files in `demo/` share one CSS file and one JS file (`demo/assets/direction-k.css`, `demo/assets/direction-k.js`). Each page carries identical header/footer/chat markup but all styling/behaviour is centralised in the shared assets. Layout uses full-bleed section bands with a centred `.k-wrap` (max-width 1600px) and fluid grids — no fixed-width wrapper, no zoom scaler.

**Tech Stack:** Static HTML5, CSS (custom properties, flexbox/grid, `clamp()`, media queries), vanilla JS (IIFE, feature-guarded). Served by GitHub Pages. Local preview: `python -m http.server 8777 --bind 127.0.0.1` (already running as a background task).

## Global Constraints

- All new files live under `demo/`. Never modify the live site or Directions A–J.
- Copy is VERBATIM from `demo/direction-g.html`. No wording changes.
- Green brand only: green `#2C7A5B`, hover `#256A4F`, bright `#4CAF7D`, gold `#B08A47`, navy `#101B2A`, ink `#1E2A38`, sand `#F7F4EF`, border `#EEE9DE`. NO blue anywhere.
- Font: DM Sans (same Google Fonts link as G).
- Images referenced with the same relative paths as G (`../images/…`, `../images/demo/…`). Header/footer use the light-on-dark logo where the background is dark (footer) and the standard logo on the white header, exactly as G does.
- Every interactive element keeps G's exact `id` so ported scripts work unchanged.
- No horizontal scrollbar at any viewport width from 360px to 2560px.
- Header/footer/chat markup must be IDENTICAL across all six pages (copy-paste), differing only in which nav link is marked active.
- Preview server base URL: `http://127.0.0.1:8777/demo/`.

---

## File Structure

- Create `demo/assets/direction-k.css` — reset, tokens, `.k-wrap` layout, header/nav, footer, trust bar, chat widget, buttons, shared section/card styles, all responsive breakpoints.
- Create `demo/assets/direction-k.js` — feature-guarded IIFEs: mobile-nav, chat, region/geo/stats/feed, pricing toggle, form buttons.
- Create `demo/direction-k.html` — Home (hero + trial form + DA tracker).
- Create `demo/direction-k-how.html` — How It Works.
- Create `demo/direction-k-who.html` — Who It's For (+ testimonials).
- Create `demo/direction-k-pricing.html` — Pricing.
- Create `demo/direction-k-sample.html` — Free Sample.
- Create `demo/direction-k-contact.html` — Contact.
- Modify `demo/index.html` — add "G · Multi-page (K)" card.

Source of truth for copy/markup/scripts to port: `demo/direction-g.html`.

---

## Shared contracts (used by every page task)

**HTML skeleton every page uses:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>DAconnect — G · Multi-page · <PAGE NAME> (Preview)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,800;9..40,900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/direction-k.css">
</head>
<body>
  <a class="k-back" href="index.html">&larr; All previews</a>
  <header class="k-header"> … shared … </header>
  <main> … page-specific sections … </main>
  <footer class="k-footer"> … shared … </footer>
  <div class="v2-chat-box" id="v2-chat-box" hidden> … shared … </div>
  <button class="k-chat-fab" type="button" aria-label="Open chat"> … </button>
  <script src="assets/direction-k.js"></script>
</body>
</html>
```

**Shared nav markup** (the active page adds `aria-current="page"` and class `is-active` to its own link):

```html
<nav class="k-nav">
  <a href="direction-k-how.html">HOW IT WORKS</a>
  <a href="direction-k-who.html">WHO IT'S FOR</a>
  <a href="direction-k-pricing.html">PRICING</a>
  <a href="direction-k-sample.html">FREE SAMPLE</a>
  <a href="../faq.html">Q&amp;A</a>
  <a href="direction-k-contact.html">CONTACT</a>
</nav>
```

**CSS class contract (produced by Task 1, consumed by all page tasks):**
- `.k-wrap` — `max-width:1600px; margin:0 auto; padding:0 clamp(20px,5vw,64px)`.
- `.k-band` — full-bleed section; modifiers `.k-band--sand` (`#F7F4EF`), `.k-band--navy` (`#101B2A`, light text), `.k-band--white` (`#fff`). Vertical padding `clamp(48px,7vw,90px)`.
- `.k-h2` — section heading, `font-size:clamp(28px,4vw,40px); font-weight:800; letter-spacing:-0.5px`.
- `.k-grid` — `display:grid; gap:clamp(16px,2vw,28px); grid-template-columns:repeat(auto-fit,minmax(240px,1fr))`.
- `.k-btn-green` — green pill/rounded CTA (bg `#2C7A5B`, hover `#256A4F`, white text).
- `.k-cta-outline` — white bg, green text, `1.5px solid #2C7A5B`.
- `.k-header`, `.k-nav`, `.k-nav a.is-active`, `.k-burger`, `.k-footer`, `.k-trust`, `.k-back`, `.k-chat-fab`, `.v2-chat-box` — chrome styles.
- Responsive: at `max-width:900px` nav collapses (burger shown, `.k-nav` becomes a dropdown toggled by `header.nav-open`); hero and multi-column sections stack to one column.

**JS contract (produced by Task 2, consumed by all page tasks):** a single `direction-k.js` whose IIFEs each run only if their target element exists:
- `#v2-chat-box` + `.k-chat-fab` → chat open/close.
- `.k-header` + `.k-burger` → toggle `nav-open`.
- `#v2-region` + `#v2-feed` → region data (`regions.sa`/`regions.qld`), IP geo via `https://get.geojs.io/v1/ip/geo.json`, `applyRegion()`, `#v2-stat-0/1/2`, `#v2-near-tag`, `renderFeed()`.
- `#v2-subscribe` + `#v2-bill-monthly` → pricing toggle + `renderPricing()` into `#v2-pricing-features`, `#v2-price-main`, `#v2-price-unit`, `#v2-savings`, `#v2-pricing-sub`.
- `#v2-trial-btn` / `#v2-sample-btn2` / `#v2-contact-btn` → demo form button behaviour (as G).

Port the region/pricing/feed/chat logic from the `<script>` blocks in `demo/direction-g.html` unchanged except for wiring the chat FAB selector and mobile-nav selector to the class names above.

---

### Task 1: Shared stylesheet

**Files:**
- Create: `demo/assets/direction-k.css`
- Reference: `demo/direction-g.html` (`<style>` block + inline section styles) for visual values.

**Interfaces:**
- Produces: every class in the CSS class contract above.

- [ ] **Step 1: Create the file** with `:root` brand tokens (all Global-Constraints colours as custom properties), a minimal reset (`*{box-sizing:border-box}`, `body{margin:0;font-family:'DM Sans',system-ui,sans-serif;color:#1E2A38}`), and `.k-wrap`, `.k-band(+modifiers)`, `.k-h2`, `.k-grid`, `.k-btn-green`, `.k-cta-outline` per contract.
- [ ] **Step 2: Add chrome styles** `.k-header` (white, flex, sticky optional, `border-bottom:1px solid #EEE9DE`), `.k-nav` + `.k-nav a` (uppercase, weight 700) + `.k-nav a.is-active` (green, underline), `.k-burger` (hidden on desktop), `.k-back` (fixed pill top-left), `.k-footer` + `.k-trust` (navy), `.k-chat-fab` + `.v2-chat-box` (port from G).
- [ ] **Step 3: Add responsive rules** — `@media (max-width:900px)`: show `.k-burger`, hide `.k-nav` by default, `header.nav-open .k-nav` becomes a stacked dropdown; stack `.k-grid`/hero to one column; reduce band padding. Verify no fixed pixel widths force overflow (`img{max-width:100%;height:auto}`, wrap long rows).
- [ ] **Step 4: Verify** the file is valid CSS (no unclosed braces) and contains every contract class:

Run: `grep -oE "\.k-(wrap|band|h2|grid|btn-green|cta-outline|header|nav|burger|footer|trust|back|chat-fab)" demo/assets/direction-k.css | sort -u`
Expected: all listed classes present.

- [ ] **Step 5: Commit**

```bash
git add demo/assets/direction-k.css
git commit -m "Add Direction K shared stylesheet (fluid full-width layout system)"
```

---

### Task 2: Shared script

**Files:**
- Create: `demo/assets/direction-k.js`
- Reference: `<script>` blocks in `demo/direction-g.html`.

**Interfaces:**
- Consumes: element ids/classes from Task 1 chrome + G's ids.
- Produces: the guarded IIFEs in the JS contract.

- [ ] **Step 1: Port the shared logic** into one file: mobile-nav toggle (`.k-burger` → `header.classList.toggle('nav-open')`), chat open/close (`.k-chat-fab` ↔ `#v2-chat-box`), region/geo/stats/feed block (guard `if(document.getElementById('v2-region'))`), pricing block (guard `if(document.getElementById('v2-subscribe'))`), form-button blocks (guard each by id). Copy the `regions` data object, `applyRegion`, `renderFeed`, `renderPricing`, `baseFeatures` verbatim from G.
- [ ] **Step 2: Verify** all guards and functions present:

Run: `grep -oE "getElementById\('v2-(region|subscribe|trial-btn|sample-btn2|contact-btn|chat-box)'\)|renderFeed|renderPricing|applyRegion|get\.geojs\.io" demo/assets/direction-k.js | sort -u`
Expected: region, subscribe, chat-box guards + renderFeed + renderPricing + applyRegion + geojs present.

- [ ] **Step 3: Commit**

```bash
git add demo/assets/direction-k.js
git commit -m "Add Direction K shared script (guarded region/pricing/chat/nav)"
```

---

### Task 3: Home page

**Files:**
- Create: `demo/direction-k.html`
- Port from `demo/direction-g.html`: header (245–274), hero section (276–451, incl. trial form + `#v2-trial-btn`), "Development Applications We Track" section (452–518, incl. `#v2-region`, `#v2-stat-0/1/2`, `#v2-near-tag`, `#v2-feed`), footer (917–979), chat box (981+).

**Interfaces:**
- Consumes: `assets/direction-k.css`, `assets/direction-k.js`, shared skeleton + nav markup.

- [ ] **Step 1: Build the page** from the HTML skeleton. Title "…· Home (Preview)". No nav link active (Home isn't in the nav). Rewrap hero as a fluid two-column band (`.k-band--white` + `.k-wrap`; image column + copy/form column via grid, stacking on mobile). Rewrap the DA-tracker section as `.k-band--white` + `.k-wrap`, stats in `.k-grid`, feed below. Keep every id.
- [ ] **Step 2: Verify serve + ids + no fixed wrapper:**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8777/demo/direction-k.html   # 200
grep -c "min-width:1460px" demo/direction-k.html                                        # 0
grep -oE "id=\"v2-(trial-btn|region|feed|stat-0|near-tag)\"" demo/direction-k.html | sort -u  # all 5
```
Expected: 200, zero `min-width:1460px`, all 5 ids.

- [ ] **Step 3: Commit**

```bash
git add demo/direction-k.html
git commit -m "Add Direction K home page (hero + trial + DA tracker)"
```

---

### Task 4: How It Works page

**Files:**
- Create: `demo/direction-k-how.html`
- Port from G: "From sign-up to your first…" section (519–593) + the "Start your 14-day trial now" CTA.

- [ ] **Step 1: Build** from skeleton. Title "…· How It Works". Mark `direction-k-how.html` nav link `is-active`. Section as `.k-band--sand` + `.k-wrap`; the 4 steps in a fluid `.k-grid` (or numbered rows), images `max-width:100%`. Include the trial CTA button (`.k-btn-green`) linking to the G signup URL.
- [ ] **Step 2: Verify:**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8777/demo/direction-k-how.html   # 200
grep -c 'aria-current="page"' demo/direction-k-how.html                                     # >=1
grep -c "Start your 14-day trial now" demo/direction-k-how.html                             # >=1
```

- [ ] **Step 3: Commit** `git add demo/direction-k-how.html && git commit -m "Add Direction K How It Works page"`

---

### Task 5: Who It's For page

**Files:**
- Create: `demo/direction-k-who.html`
- Port from G: "Who Benefits from DAconnect" section (594–669, incl. industry tiles, "Quote early to win the work.", curtains-and-blinds copy, trial CTA) + testimonials section (670–724).

- [ ] **Step 1: Build** from skeleton. Title "…· Who It's For". Nav link active. Industry section as `.k-band--navy` (light text, matches G) + `.k-wrap`, tiles in fluid `.k-grid`; keep the tile `<img>` background colours. Testimonials as `.k-band--white` + `.k-wrap` fluid grid. Keep the trial CTA.
- [ ] **Step 2: Verify:**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8777/demo/direction-k-who.html   # 200
grep -c "Quote early to win the work" demo/direction-k-who.html                             # 1
grep -c "curtains and blinds" demo/direction-k-who.html                                     # 1 (case as in G)
```

- [ ] **Step 3: Commit** `git add demo/direction-k-who.html && git commit -m "Add Direction K Who It's For page (+ testimonials)"`

---

### Task 6: Pricing page

**Files:**
- Create: `demo/direction-k-pricing.html`
- Port from G: "Simple, transparent" pricing section (725–774, incl. `#v2-bill-monthly/yearly`, `#v2-price-main/unit`, `#v2-savings`, `#v2-pricing-sub`, `#v2-pricing-features`, `#v2-subscribe`).

- [ ] **Step 1: Build** from skeleton. Title "…· Pricing". Nav link active. Section `.k-band--sand` + `.k-wrap`; the plan card centred with a comfortable max-width; keep every pricing id so the shared JS renders it.
- [ ] **Step 2: Verify:**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8777/demo/direction-k-pricing.html   # 200
grep -oE "id=\"v2-(subscribe|bill-monthly|price-main|pricing-features|savings)\"" demo/direction-k-pricing.html | sort -u  # all 5
```

- [ ] **Step 3: Commit** `git add demo/direction-k-pricing.html && git commit -m "Add Direction K Pricing page"`

---

### Task 7: Free Sample page

**Files:**
- Create: `demo/direction-k-sample.html`
- Port from G: "Receive a Sample of the Digital Business Card" section (775–804, incl. `#v2-sample-btn2` + `digital_businesscard.png`).

- [ ] **Step 1: Build** from skeleton. Title "…· Free Sample". Nav link active. Section `.k-band--white` + `.k-wrap`, capture form + card image side by side, stacking on mobile. Keep `#v2-sample-btn2`.
- [ ] **Step 2: Verify:**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8777/demo/direction-k-sample.html   # 200
grep -c 'id="v2-sample-btn2"' demo/direction-k-sample.html                                     # 1
```

- [ ] **Step 3: Commit** `git add demo/direction-k-sample.html && git commit -m "Add Direction K Free Sample page"`

---

### Task 8: Contact page

**Files:**
- Create: `demo/direction-k-contact.html`
- Port from G: "Contact Our Team" section (805–916, incl. `#v2-contact-btn` + contact details).

- [ ] **Step 1: Build** from skeleton. Title "…· Contact". Nav link active. Section `.k-band--sand` + `.k-wrap`, form + details in a fluid two-column grid stacking on mobile. Keep `#v2-contact-btn`.
- [ ] **Step 2: Verify:**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8777/demo/direction-k-contact.html   # 200
grep -c 'id="v2-contact-btn"' demo/direction-k-contact.html                                     # 1
```

- [ ] **Step 3: Commit** `git add demo/direction-k-contact.html && git commit -m "Add Direction K Contact page"`

---

### Task 9: Preview hub card

**Files:**
- Modify: `demo/index.html` (featured cards area near the other G-family cards).

- [ ] **Step 1: Add a card** "G · Multi-page (K)" with green/sand swatches, adj "Multi-page · fluid · navigates", a description noting each section is its own page and the navbar moves between pages, and an "Open G · Multi-page →" button linking to `direction-k.html`. Match the existing `.featured` card markup pattern already in the file.
- [ ] **Step 2: Verify:**

```bash
grep -c "direction-k.html" demo/index.html          # >=1
grep -c "G · Multi-page" demo/index.html            # >=1
```

- [ ] **Step 3: Commit** `git add demo/index.html && git commit -m "Add Direction K card to preview hub"`

---

### Task 10: Cross-page verification

**Files:** none (verification only).

- [ ] **Step 1: All pages serve 200:**

```bash
for p in "" -how -who -pricing -sample -contact; do curl -s -o /dev/null -w "k$p=%{http_code} " http://127.0.0.1:8777/demo/direction-k$p.html; done; echo
```
Expected: all `=200`.

- [ ] **Step 2: Nav links resolve to real files** — confirm each of `direction-k-how/who/pricing/sample/contact.html` and `../faq.html` exists; no `href="#"` left in any K nav:

```bash
grep -c 'href="#"' demo/direction-k*.html   # 0 in nav (hero/other anchors ok if intentional — check output)
ls demo/direction-k*.html                    # 6 files
```

- [ ] **Step 3: No fixed-width wrapper / zoom scaler anywhere in K:**

```bash
grep -c "min-width:1460px" demo/direction-k*.html   # 0 each
grep -c "zoom" demo/assets/direction-k.js           # 0
```

- [ ] **Step 4: Brand check — no blue:**

```bash
grep -oiE "#(2563EB|1D4ED8|3B82F6|0F172A|1E293B|64748B|2C5AA0)" demo/direction-k*.html demo/assets/direction-k.css   # empty
```

- [ ] **Step 5: Manual visual review by user** — open `http://127.0.0.1:8777/demo/direction-k.html`, click through every nav link, resize from wide desktop to mobile, confirm no horizontal scroll and content fills width. (This step is a checkpoint, not automatable — cannot self-screenshot; requires the user.)

- [ ] **Step 6: Update memory** `redesign-in-progress.md` to note Direction K exists (6-page fluid variant) and commit any final touch-ups.

---

## Self-Review

- **Spec coverage:** 6 pages (Tasks 3–8) ✓, shared css/js DRY (Tasks 1–2) ✓, fluid full-width layout (Task 1 + verified Task 10.3) ✓, nav navigates between pages with active state (shared nav + Tasks 4–8) ✓, per-page interactivity via guarded JS (Task 2 contract) ✓, hub card (Task 9) ✓, verbatim copy + green-only + images (Global Constraints + Task 10.4) ✓, Q&A → faq.html (shared nav) ✓.
- **Placeholder scan:** page tasks reference exact G line ranges + concrete class/id contracts rather than "similar to"; verification uses runnable commands. No TBD/TODO.
- **Type/name consistency:** class names in the CSS contract (Task 1) match those consumed in page tasks; ids match G's ids used by the JS contract (Task 2).
- **Note on testing:** static site — no unit-test framework; "tests" are serve/grep/structural checks + a required human visual checkpoint (Task 10.5) because screenshots aren't available this session.
