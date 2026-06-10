# Add Gold Coast Alongside South Australia — Design

**Date:** 2026-06-10
**Status:** Approved for planning

## Goal

The site currently presents DAconnect as a South Australia–only service: the homepage
stats block shows three counters (Past Year / Month / Week) for South Australia, and
several pieces of marketing copy and SEO metadata name South Australia explicitly. We
want to add the Gold Coast as a second served region everywhere South Australia appears,
including a second set of live development-application counters.

The Gold Coast stats endpoint is **not live yet**, so the design must degrade gracefully:
Gold Coast shows placeholder figures today and lights up with real data automatically once
the backend starts returning it — with no further code change.

## Decisions (from brainstorming)

- **Stats layout:** Two stacked, labelled rows (South Australia, then Gold Coast), both
  always visible. Not a toggle, not combined totals.
- **API contract:** One endpoint, **backward-compatible** shape. Keeps legacy top-level
  `lastYear/lastMonth/lastWeek` (= South Australia) and adds a `regions` object.
- **Text scope:** Update everywhere — stats heading, homepage marketing copy, SEO /
  structured data, and FAQ meta. (`signin.html` and `compliance.html` contain no
  "South Australia" text, so nothing to change there.)
- **Gold Coast placeholder:** Use figures roughly half of South Australia's until the
  endpoint is live.

## Affected files

| File | Change |
|------|--------|
| `index.html` | Stats block markup (2 rows, 6 counters); heading copy; "every council…" copy; JSON-LD `description` and `areaServed`. |
| `js/da-stats-counter.js` | Parse new region-keyed response with legacy fallback; map to 6 region-scoped counter IDs. |
| `faq.html` | Three meta descriptions (`description`, `og:description`, `twitter:description`). |

## 1. Stats block (`index.html`, `#dastats`)

Replace the single heading + one `.row` of three counter cards with a section heading and
**two labelled rows**:

```
Development Applications We Track          (section heading, existing h6 style)

South Australia                           (region label)
[ Past Year ] [ Past Month ] [ Past Week ]

Gold Coast                                (region label)
[ Past Year ] [ Past Month ] [ Past Week ]
```

Counter element IDs change from `lastYear/lastMonth/lastWeek` to region-scoped IDs:

| Region | Year | Month | Week |
|--------|------|-------|------|
| South Australia | `sa-lastYear` | `sa-lastMonth` | `sa-lastWeek` |
| Gold Coast | `gc-lastYear` | `gc-lastMonth` | `gc-lastWeek` |

Each counter keeps a `data-target` default so the counters animate even when the API fails.

- **South Australia** defaults retain current real numbers: 36,911 / 1,548 / 119.
- **Gold Coast** placeholder defaults (≈ half of SA, clearly provisional): **18,000 / 750 / 60.**

Reuse the existing card styling (`.da-stat-number`, the white rounded card, the
`col-4` grid) for all six counters and the existing `h6` style for the two region labels.

The existing animation + `IntersectionObserver` logic targets all `.da-stat-number`
elements generically, so it drives six counters with no change to that logic.

## 2. Data layer (`js/da-stats-counter.js`)

Single fetch to the existing endpoint
(`https://app.daconnect.com.au/api/public/stats/development-applications`), parsing the
backward-compatible response:

```jsonc
{
  "lastYear": 36911,   // legacy = South Australia
  "lastMonth": 1548,
  "lastWeek": 119,
  "regions": {
    "southAustralia": { "lastYear": 36911, "lastMonth": 1548, "lastWeek": 119 },
    "goldCoast":      { "lastYear": 12340, "lastMonth": 890,  "lastWeek": 67  }
  }
}
```

Parsing rules (each independent; a missing piece leaves that counter's HTML `data-target`
untouched, so the placeholder/default shows):

1. **South Australia** ← `data.regions.southAustralia` if present, else the legacy
   top-level `data.lastYear/lastMonth/lastWeek`.
2. **Gold Coast** ← `data.regions.goldCoast` if present; otherwise leave the placeholder
   defaults in the HTML.
3. On total fetch/parse failure, keep all HTML defaults (current behaviour).

A small helper applies a `{lastYear,lastMonth,lastWeek}` object to a region's three IDs,
only overriding `data.dataset.target` when the value is non-null. `initCounterObserver()`
still runs in `finally`.

Result: today (legacy-only response) SA updates live and Gold Coast shows placeholders;
when the backend adds `regions.goldCoast`, Gold Coast updates live automatically.

## 3. Copy + SEO changes

| Location | From | To |
|----------|------|----|
| `index.html` stats heading (~line 191) | "Development Applications in South Australia" | "Development Applications We Track" (region names move to row labels) |
| `index.html` how-it-works lead (~line 224) | "every council in South Australia" | "every council in South Australia and the Gold Coast" |
| `index.html` JSON-LD `description` (~line 49) | "…in South Australia. …" | "…in South Australia and the Gold Coast. …" |
| `index.html` JSON-LD `areaServed` (~lines 57–60) | single `AdministrativeArea` "South Australia" | **array** of two `AdministrativeArea` entries: "South Australia" and "Gold Coast" |
| `faq.html` meta `description`, `og:description`, `twitter:description` (lines 7, 20, 27) | "…in South Australia." | "…in South Australia and the Gold Coast." |

`areaServed` array form:

```json
"areaServed": [
  { "@type": "AdministrativeArea", "name": "South Australia" },
  { "@type": "AdministrativeArea", "name": "Gold Coast" }
]
```

## 4. Testing / verification

Static site, no build step. Manual verification:

1. Open `index.html` in a browser; confirm both region rows render and all six counters
   animate on scroll into the stats section.
2. Simulate the **new** response shape (regions object) and confirm both regions update.
3. Simulate the **legacy** flat shape and confirm SA updates while Gold Coast shows its
   placeholder defaults.
4. Simulate a fetch failure and confirm all six counters fall back to HTML defaults.
5. Validate the JSON-LD (e.g. Google Rich Results / schema validator) parses with the
   `areaServed` array.

## Out of scope

- Live Gold Coast endpoint / backend work (owned separately; the frontend is ready for it).
- Any region toggle, filtering, or per-region pages.
- Changes to `signin.html` / `compliance.html` (no South Australia text present).
