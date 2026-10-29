# Design

<!-- impeccable:design-schema 1 -->

## World

**Vinyl record sleeve & liner notes.** The site is built as a vinyl gatefold sleeve: a record jacket (institutional page), an inner sleeve/liner notes (daily consulta), and a printed track listing (ranking acumulado). Established via `/impeccable` new-work direction round (seed key `2ad023e5`, own grounded candidate 5 of 7, assigned by the direction roll). Full direction contract lives in `.impeccable/surfaces/app-public-page-tsx.md`.

## Palette

Restrained-to-committed strategy: warm kraft ground, near-black ink, one committed accent (ember) carrying labels/active state/CTAs, one secondary mark color (gold) for position/rank badges.

| Token | Hex | Use |
|---|---|---|
| `paper` | `#faf7f2` | Page/jacket ground |
| `ink` | `#0b0b0d` | Body text, borders, die-cut label panel |
| `ember` | `#d9480f` | Accent: links on hover, progress bars (consulta), form focus, admin active state |
| `gold` | `#e8b04b` | Secondary mark: rank badges, genre kicker text, ranking progress bars |

Defined in `tailwind.config.ts` under `theme.extend.colors`.

## Type

| Role | Face | Token |
|---|---|---|
| Display (names, headings) | Anton | `--font-display` / `font-display` |
| Body / liner-note copy | PT Serif | `--font-body` / `font-body` |
| Data (dates, points, positions, labels) | JetBrains Mono | `--font-mono` / `font-mono` |

Loaded via `next/font/google` in `app/layout.tsx`. Numeric/tabular content always renders in `font-mono` so columns align like a printed track listing.

## Components

- **`.sleeve-panel`** — bordered "jacket" container (`border-4 border-ink`, 6px corner radius). Used for every grouped block: gatefold panel, consulta/ranking result lists, admin form and list panels.
- **`.track-row`** — one "track listing" line: index/position — name — value, in a 3-column grid, bottom hairline divider. Used across consulta, ranking, and the homepage's A1/A2 navigation links.
- **die-cut disc motif** — circular bordered label (homepage hero) with two concentric rings and a slow idle rotation (`animate-[spin_18s_linear_infinite]`), the raise donated from the shader-portal challenger ("a living, reactive surface").
- **`.btn-admin` / `.btn-admin-ghost`** — admin action buttons with `transition-none` and an instant flat color flip on `:active` (ember/ink), the raise donated from the starship-panel challenger ("tactile, zero-transition feedback").
- **progress bars under values** — a thin accent-colored bar proportional to the row's value, under the points/total in both consulta and ranking rows, the raise donated from the particle-detector challenger ("data-encoding discipline").
- **count-up numbers** — ranking totals animate from 0 on load (`useCountUp` hook in `app/(public)/ranking/page.tsx`), the raise donated from the alphabet-storm challenger.
- **bordered bio panels** — the homepage's "Sobre o cantor" renders as 2-3 separate bordered panels rather than one paragraph block, the raise donated from the azulejo-hall challenger.

## Layout

- Homepage: gatefold two-panel layout (`sm:grid-cols-2`), disc/label side in `bg-ink`, bio/track-listing side in `bg-paper`, single column on mobile.
- Consulta/Ranking: single-column `max-w-3xl`, date picker (consulta) or no filter (ranking) above a `.sleeve-panel` list of `.track-row`s.
- Admin: single-column `max-w-2xl`, date picker → create form (`.sleeve-panel`) → list of existing entries for that date with inline edit/delete.
- Global nav/footer in `app/layout.tsx`, shared across all registered surfaces (`app-public-page-tsx`, `consulta`, `ranking`, `admin/login`, `admin/lancamentos`).

## Known deviations / open items

- No real photography or logo of the artist exists yet (see `PRODUCT.md` → Evidence on Hand); the homepage ships with no image placeholders beyond the typographic disc label — a real photo could later replace/augment it without changing the system.
- This build is **code-led** (no image generation available in this environment): no comp was rendered or diffed; ambition was carried directly in the direction contract's FIRST VIEWPORT block and audited here in code/behavior instead of against a reference image.
- Visual QA could not include live browser screenshots in this environment (no connected browser automation tool); verification was limited to `next build`, `next lint`, and HTTP smoke checks of every route. A screenshot-based finish review (desktop + mobile) is recommended before shipping, ideally via `/impeccable audit` or `critique` once a browser is available.
- The mechanical detector (`impeccable detect`) flagged one `border-r-4` on the homepage gatefold split (app/(public)/page.tsx:8) as resembling the generic "side-tab accent border" antipattern. Reviewed and kept: this border is the gatefold's structural spine (jacket fold), drawn in the same `ink` rule-weight used everywhere else in the system, not a decorative accent on an otherwise plain card.

## Provenance

No rasters/generated images were produced in this build (code-led, text/CSS/SVG only — no plates, no comps).
