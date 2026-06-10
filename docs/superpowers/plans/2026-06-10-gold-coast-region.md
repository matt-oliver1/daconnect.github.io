# Gold Coast Region Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the Gold Coast as a second served region everywhere South Australia appears — a second set of homepage development-application counters, plus marketing copy and SEO metadata.

**Architecture:** Static site, no build step. The homepage stats block becomes two labelled rows (South Australia, Gold Coast). `js/da-stats-counter.js` reads a backward-compatible API response (legacy flat fields = South Australia, plus a new `regions` object) and applies values to region-scoped counter IDs, falling back to HTML `data-target` defaults per region when data is absent. Copy and JSON-LD across `index.html` and `faq.html` are updated to name both regions.

**Tech Stack:** Plain HTML, Bootstrap 5 (CDN), vanilla JS, schema.org JSON-LD. No test framework — verification is via grep and manual browser checks.

---

## File Structure

| File | Responsibility | Change |
|------|----------------|--------|
| `index.html` | Homepage markup, copy, JSON-LD | Stats block → 2 region rows / 6 counters; heading + lead copy; JSON-LD `description` + `areaServed` |
| `js/da-stats-counter.js` | Fetch + apply stats to counters | Parse region-keyed response with legacy fallback; map to 6 region IDs |
| `faq.html` | FAQ page SEO meta | 3 meta descriptions name both regions |

Counter ID convention (used by both `index.html` and `da-stats-counter.js` — keep identical):

| Region | Year | Month | Week |
|--------|------|-------|------|
| South Australia | `sa-lastYear` | `sa-lastMonth` | `sa-lastWeek` |
| Gold Coast | `gc-lastYear` | `gc-lastMonth` | `gc-lastWeek` |

Placeholder `data-target` defaults: SA = 36911 / 1548 / 119 (current real). Gold Coast = 18000 / 750 / 60 (provisional, ≈ half of SA).

---

## Task 1: Rebuild the stats block markup (two region rows)

**Files:**
- Modify: `index.html` (the `<div class="mt-5 pt-4 hero-stats">` block, currently lines ~190-212)

- [ ] **Step 1: Replace the heading and single counter row with a section heading + two labelled rows**

Find the existing block (heading `Development Applications in South Australia` plus the single `<div class="row g-4">` containing `lastYear`/`lastMonth`/`lastWeek`) and replace the entire `<div class="mt-5 pt-4 hero-stats"> ... </div>` with:

```html
        <!-- DA Stats right under content -->
        <div class="mt-5 pt-4 hero-stats">
          <h6 class="fw-bold mb-4" style="color: var(--primary-color); font-size: 1rem; letter-spacing: 1.2px; text-transform: uppercase;">Development Applications We Track</h6>

          <!-- South Australia -->
          <div class="mb-2" style="color: var(--secondary-color); font-weight: 700; font-size: 1.05rem;">South Australia</div>
          <div class="row g-4 mb-4">
            <div class="col-4">
              <div class="p-4 rounded-3 bg-white shadow text-center" style="border: 1px solid rgba(0,0,0,0.08);">
                <div id="sa-lastYear" class="da-stat-number" style="font-size: 3rem; font-weight: 800; color: var(--secondary-color); font-family: 'Plus Jakarta Sans', sans-serif;" data-target="36911">0</div>
                <div style="font-size: 0.95rem; color: #6c757d; letter-spacing: 0.5px; font-weight: 500;">The Past Year</div>
              </div>
            </div>
            <div class="col-4">
              <div class="p-4 rounded-3 bg-white shadow text-center" style="border: 1px solid rgba(0,0,0,0.08);">
                <div id="sa-lastMonth" class="da-stat-number" style="font-size: 3rem; font-weight: 800; color: var(--secondary-color); font-family: 'Plus Jakarta Sans', sans-serif;" data-target="1548">0</div>
                <div style="font-size: 0.95rem; color: #6c757d; letter-spacing: 0.5px; font-weight: 500;">The Past Month</div>
              </div>
            </div>
            <div class="col-4">
              <div class="p-4 rounded-3 bg-white shadow text-center" style="border: 1px solid rgba(0,0,0,0.08);">
                <div id="sa-lastWeek" class="da-stat-number" style="font-size: 3rem; font-weight: 800; color: var(--secondary-color); font-family: 'Plus Jakarta Sans', sans-serif;" data-target="119">0</div>
                <div style="font-size: 0.95rem; color: #6c757d; letter-spacing: 0.5px; font-weight: 500;">The Past Week</div>
              </div>
            </div>
          </div>

          <!-- Gold Coast -->
          <div class="mb-2" style="color: var(--secondary-color); font-weight: 700; font-size: 1.05rem;">Gold Coast</div>
          <div class="row g-4">
            <div class="col-4">
              <div class="p-4 rounded-3 bg-white shadow text-center" style="border: 1px solid rgba(0,0,0,0.08);">
                <div id="gc-lastYear" class="da-stat-number" style="font-size: 3rem; font-weight: 800; color: var(--secondary-color); font-family: 'Plus Jakarta Sans', sans-serif;" data-target="18000">0</div>
                <div style="font-size: 0.95rem; color: #6c757d; letter-spacing: 0.5px; font-weight: 500;">The Past Year</div>
              </div>
            </div>
            <div class="col-4">
              <div class="p-4 rounded-3 bg-white shadow text-center" style="border: 1px solid rgba(0,0,0,0.08);">
                <div id="gc-lastMonth" class="da-stat-number" style="font-size: 3rem; font-weight: 800; color: var(--secondary-color); font-family: 'Plus Jakarta Sans', sans-serif;" data-target="750">0</div>
                <div style="font-size: 0.95rem; color: #6c757d; letter-spacing: 0.5px; font-weight: 500;">The Past Month</div>
              </div>
            </div>
            <div class="col-4">
              <div class="p-4 rounded-3 bg-white shadow text-center" style="border: 1px solid rgba(0,0,0,0.08);">
                <div id="gc-lastWeek" class="da-stat-number" style="font-size: 3rem; font-weight: 800; color: var(--secondary-color); font-family: 'Plus Jakarta Sans', sans-serif;" data-target="60">0</div>
                <div style="font-size: 0.95rem; color: #6c757d; letter-spacing: 0.5px; font-weight: 500;">The Past Week</div>
              </div>
            </div>
          </div>
        </div>
```

- [ ] **Step 2: Verify old IDs are gone and new IDs exist**

Run: `grep -nE 'id="(sa|gc)-last(Year|Month|Week)"' index.html`
Expected: 6 matches (sa-lastYear, sa-lastMonth, sa-lastWeek, gc-lastYear, gc-lastMonth, gc-lastWeek).

Run: `grep -nE 'id="last(Year|Month|Week)"' index.html`
Expected: no matches (old region-less IDs removed).

- [ ] **Step 3: Visual check in browser**

Open `index.html` in a browser. Scroll to the hero/stats section. Expected: a "South Australia" labelled row of 3 cards animating to 36,911 / 1,548 / 119, then a "Gold Coast" labelled row of 3 cards animating to 18,000 / 750 / 60. (At this point the live fetch still targets old IDs and silently no-ops; counters use HTML defaults. The JS is fixed in Task 2.)

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Add Gold Coast stats row to homepage with region-scoped counter IDs"
```

---

## Task 2: Update the stats fetch to populate both regions

**Files:**
- Modify: `js/da-stats-counter.js` (the `fetch(...).then(...)` block, currently lines ~6-22)

- [ ] **Step 1: Replace the fetch `.then(data => {...})` body with region-aware application**

Replace the existing fetch chain (from `fetch('https://app.daconnect.com.au/api/public/stats/development-applications')` through the `.finally(...)` call) with:

```js
  // Fetch live stats from the API, fall back to hardcoded defaults on failure.
  // Response is backward-compatible: legacy top-level lastYear/lastMonth/lastWeek
  // are South Australia; an optional `regions` object carries each region.
  fetch('https://app.daconnect.com.au/api/public/stats/development-applications')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      var regions = data.regions || {};

      // South Australia: prefer regions.southAustralia, else legacy top-level fields.
      applyRegion('sa', regions.southAustralia || {
        lastYear: data.lastYear,
        lastMonth: data.lastMonth,
        lastWeek: data.lastWeek
      });

      // Gold Coast: only if present; otherwise the HTML placeholder defaults remain.
      applyRegion('gc', regions.goldCoast || {});
    })
    .catch(function() {
      // Keep the default data-target values from the HTML
    })
    .finally(function() {
      initCounterObserver();
    });

  // Apply a {lastYear,lastMonth,lastWeek} object to one region's counters.
  // Only overrides data-target when the value is non-null/undefined, so a
  // missing field leaves the HTML default in place.
  function applyRegion(prefix, stats) {
    setTarget(prefix + '-lastYear', stats.lastYear);
    setTarget(prefix + '-lastMonth', stats.lastMonth);
    setTarget(prefix + '-lastWeek', stats.lastWeek);
  }

  function setTarget(id, value) {
    if (value == null) return;
    var el = document.getElementById(id);
    if (el) el.dataset.target = value;
  }
```

- [ ] **Step 2: Verify no stale references to old IDs remain**

Run: `grep -nE "getElementById\('(lastYear|lastMonth|lastWeek)'\)|'lastYear'|'lastMonth'|'lastWeek'" js/da-stats-counter.js`
Expected: no matches.

Run: `grep -n "applyRegion\|setTarget" js/da-stats-counter.js`
Expected: definitions + calls present (5+ matches).

- [ ] **Step 3: Verify legacy-shape path in browser console**

Open `index.html`. In DevTools console, simulate the legacy response and re-run the apply logic, or simply reload and watch the network tab. With the **current live endpoint** (legacy flat shape, no `regions`), expected: SA counters reflect live values; Gold Coast counters stay at placeholder 18,000 / 750 / 60.

Manual fault-injection checks (paste in console after load, before scrolling stats into view, then scroll):
- New shape: `applyRegion('gc', {lastYear: 12340, lastMonth: 890, lastWeek: 67}); document.getElementById('gc-lastYear').dataset.target` → `"12340"`.
- Missing field: `applyRegion('sa', {lastYear: 5, lastMonth: null}); document.getElementById('sa-lastMonth').dataset.target` → unchanged (still `"1548"`).

- [ ] **Step 4: Commit**

```bash
git add js/da-stats-counter.js
git commit -m "Populate both region counters from backward-compatible stats response"
```

---

## Task 3: Update homepage marketing copy and JSON-LD

**Files:**
- Modify: `index.html` (JSON-LD `description` ~line 49; `areaServed` ~lines 57-60; how-it-works lead ~line 224)

- [ ] **Step 1: Update the JSON-LD `description`**

Replace:
```html
    "description": "Track development applications in South Australia. Get real-time DA alerts for builders, landscapers, and trades to win more jobs.",
```
with:
```html
    "description": "Track development applications in South Australia and the Gold Coast. Get real-time DA alerts for builders, landscapers, and trades to win more jobs.",
```

- [ ] **Step 2: Update the JSON-LD `areaServed` to an array of two regions**

Replace:
```html
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "South Australia"
    }
```
with:
```html
    "areaServed": [
      {
        "@type": "AdministrativeArea",
        "name": "South Australia"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Gold Coast"
      }
    ]
```

- [ ] **Step 3: Update the how-it-works lead sentence**

Replace:
```html
        <p class="lead text-muted mx-auto mb-4 scroll-animate animate-up delay-1" style="max-width: 750px; font-size: 1.15rem; line-height: 1.7;">All development data from every council in South Australia is received by DAconnect</p>
```
with:
```html
        <p class="lead text-muted mx-auto mb-4 scroll-animate animate-up delay-1" style="max-width: 750px; font-size: 1.15rem; line-height: 1.7;">All development data from every council in South Australia and the Gold Coast is received by DAconnect</p>
```

- [ ] **Step 4: Verify copy and validate JSON-LD**

Run: `grep -n "South Australia and the Gold Coast" index.html`
Expected: 2 matches (description + lead sentence).

Run: `grep -n '"name": "Gold Coast"' index.html`
Expected: 1 match (areaServed array).

Validate the Organization JSON-LD block parses (copy the `<script type="application/ld+json">` Organization block into https://validator.schema.org/ or Google Rich Results Test). Expected: valid, two `areaServed` administrative areas.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Name Gold Coast in homepage copy and structured data"
```

---

## Task 4: Update FAQ meta descriptions

**Files:**
- Modify: `faq.html` (meta `description` line 7, `og:description` line 20, `twitter:description` line 27)

- [ ] **Step 1: Update all three meta descriptions**

In each of the three tags, replace the substring `in South Australia.` with `in South Australia and the Gold Coast.` The three lines are:
- Line 7: `<meta name="description" content="...builders, trades, and suppliers in South Australia.">`
- Line 20: `<meta property="og:description" content="...builders, trades, and suppliers in South Australia.">`
- Line 27: `<meta name="twitter:description" content="...builders, trades, and suppliers in South Australia.">`

Each becomes `...builders, trades, and suppliers in South Australia and the Gold Coast.`

- [ ] **Step 2: Verify**

Run: `grep -c "in South Australia and the Gold Coast" faq.html`
Expected: `3`.

Run: `grep -n "South Australia" faq.html`
Expected: 3 matches, and every one is immediately followed by "and the Gold Coast" (no standalone "South Australia." left).

- [ ] **Step 3: Commit**

```bash
git add faq.html
git commit -m "Name Gold Coast in FAQ meta descriptions"
```

---

## Final verification

- [ ] **Step 1: Confirm no orphaned old counter IDs anywhere**

Run: `grep -rnE 'id="last(Year|Month|Week)"|getElementById\(.last(Year|Month|Week).\)' index.html js/da-stats-counter.js`
Expected: no matches.

- [ ] **Step 2: Confirm both regions present in markup and script**

Run: `grep -rn "gc-lastYear\|sa-lastYear" index.html js/da-stats-counter.js`
Expected: present in both files.

- [ ] **Step 3: Full browser smoke test**

Open `index.html`. Expected: hero stats shows two labelled rows; all six counters animate on scroll; live SA data loads (if endpoint reachable) and Gold Coast shows placeholders. No console errors.

- [ ] **Step 4: Confirm clean tree**

Run: `git status`
Expected: clean working tree, 4 feature commits on the branch.

---

## Notes for the implementer

- **No test framework exists** in this repo — do not add one. Verification is grep + manual browser checks as written.
- **Bump cache-busting query if needed:** `index.html` loads the script as `js/da-stats-counter.js?v=2`. If the live site caches aggressively, bump to `?v=3` when committing Task 2 (optional; mention to the user).
- **Do not touch** `signin.html` or `compliance.html` — they contain no "South Australia" text (verified during design).
- **Gold Coast figures are placeholders** (18,000 / 750 / 60); they are replaced automatically once the backend returns `regions.goldCoast`.
