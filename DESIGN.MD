# Design — Habit Tracker

Design guide for the app. Use it as context in every Claude Code session to keep visual consistency.

## Concept

Dark, cool and precise. Habits are marked off with crisp, satisfying feedback: every completion should *feel* good — fast (under ~0.5s), smooth, never in the way. Single column, built for daily use on iPhone (no desktop view).

## Colors (`src/styles/tokens.css`)

| Token                                   | Hex                   | Use                                                   |
| --------------------------------------- | --------------------- | ----------------------------------------------------- |
| `--bg`                                  | `#07090D`             | Page background                                       |
| `--surface` / `-2` / `-3`               | `#0E131B` → `#1D2635` | Cards / inputs & buttons / tracks & empty segments    |
| `--line` / `--line-strong`              | `#222C3B` / `#344259` | Card borders / control borders                        |
| `--text` / `--text-soft` / `--text-faint` | `#EAF0F8` / `#8D9AB0` / `#5A6679` | Primary / secondary / tertiary text      |
| `--blue`                                | `#2F6BF0`             | Primary: fills, buttons, **done** (white text ≥ 4.5:1) |
| `--blue-text`                           | `#7AA7FF`             | Blue used as text/icon/stroke on dark                 |
| `--blue-bg` / `--blue-tint`             | `#12244A` / `#0B1426` | Done chips / done cards & calendar cells              |
| `--amber` (`-text`, `-bg`)              | `#F0A020`             | Quantity **in progress** (fill bar, pending chips)    |
| `--red` (`-text`, `-bg`, `-tint`)       | `#E5484D`             | **Missed / failed** (past days, failed binary)        |

Rule: blue = done. Red = missed. Amber = quantity still in progress, turning blue once the goal is met (never green-looking, so it can't read as success). Don't mix meanings.

## Shape

- **Sharp edges everywhere: no border-radius.** Check buttons, chips, the today marker and sheets are all square.
- Borders are 1px. Shadows only as blue glow on "done" things and primary buttons, plus a soft lift on sheets.

## Typography

- **UI:** Manrope 400/500/600/700. Titles 700 with slight negative tracking; habit names 600.
- **Eyebrow labels** (date above "Today", "Month", form field labels): 11px, 600, uppercase, `0.06–0.08em` tracking. Use sparingly, only for these.
- **Numbers** (amounts, streak count, progress count, calendar dates): IBM Plex Mono.

## Motion

Tokens: `--ease-out` (default), `--ease-spring` (small overshoot for number ticks and icons), `--ease-in-out` (exits); `--dur-fast` 140ms, `--dur` 240ms, `--dur-slow` 420ms. `prefers-reduced-motion` collapses everything to 1ms (kept non-zero so `animationend` still fires).

- **Completion animations only play after a tap**, never on first render. Binary cards track this with an `fx` state (`done` / `failed` / `cleared`); quantity cards with a `celebration` counter used as a React `key` to replay.
- **Done:** button pop (scale 0.84 → 1.12 → 1), checkmark stroke draws in (`Marks.tsx`, `pathLength=1`), square ring + 4 corner sparks (`<Burst />`), a light sweep across the card, the left state bar grows in, streak number ticks up.
- **Failed:** button shake, ✕ draws in stroke by stroke, red state bar.
- **Quantity:** fill width eases over 520ms; each add floats "+N" up from the figure and bumps the value; crossing the goal plays the done celebration plus a shine through the bar.
- **Press feedback:** buttons scale to ~0.9–0.98 on `:active`.
- **Sheets** (`Sheet.tsx`): slide up + backdrop fade on open; slide down before unmounting (children get a `close()` that plays the exit). Portaled to `<body>`. Escape closes unless an input `preventDefault`s it.
- **Navigation:** views rise in on tab switch; the tab bar's indicator slides; months slide in from the direction you navigated; cards and calendar cells stagger in via a `--i` index.
- Entrance animations use `backwards` fill, not `both`: a lingering transform makes the element the containing block for `position: fixed`.

## Components

**Binary habit:** surface card. 40px square check button on the left, cycling unmarked (outlined) → done (blue fill + ✓, glow) → failed (red fill + ✕) → unmarked. A 3px left state bar and tinted background reflect the state. Name 15px/600 (with an optional 16px Tabler outline icon, tinted by state), subtext "N day streak" with N in mono. Failed habits show "Add note" (max 30 chars); the note shows in the calendar's red chip; leaving the failed state clears it. Tapping the name opens the edit sheet.

**Quantity habit:** 24px square check, name, then `value / goal unit` in mono (value in amber, blue once met). 6px square-ended track; quick-add chips are square, mono, outlined, flashing amber on press. "Other" swaps the chips for a custom summing keypad (`AmountPad.tsx`): numpad with a tall amber "+", backspace, C and decimal point (max 2 decimals). The display shows the expression (`20 + 35 + 10`) and, once there's a "+", the running total; the full-width "Add N unit" button submits the sum. Works with a hardware keyboard too (digits, +, Backspace, Enter, Escape). It's a div, not an input, so the iOS keyboard never opens over it. Never use `window.prompt`/`confirm`: iOS home-screen apps don't show them.

**Icons:** set in `src/lib/icons.ts`. A habit stores only the icon id, so ids must stay stable. Picker is a 5×2 grid of square tiles; tap the selected one again to clear.

**Today header:** blue uppercase date eyebrow, 32px "Today", a square blue add button. Below it a segmented progress meter (one segment per habit, filling left to right) with a mono `done/total` count; label switches to "All done for today" with a glow when complete.

**Tab bar:** sticky, translucent with blur, sliding 2px blue indicator on top. Active tab: text in `--text`, icon in `--blue-text`.

**Calendar:** Monday-start grid of square cells. A legend panel above names the habits top to bottom. One chip per habit per day: done = `--blue-bg`, missed = `--red-bg`, today's partial quantity = `--amber-bg`. Binary: ✓, ✕, or the day's note (8px) instead of the ✕. Quantity: amount in mono with no space before the unit (`158g`); a missed past day gets ✕ before it. All-done days get `--blue-tint`, past days with a miss `--red-tint`. Today has a blue outline and the date on a blue square. Future days are transparent and show only the date. Habits only count from the day they were created.

**Day sheet:** tapping a past day or today opens a sheet titled with the date, listing that day's habits with the same cards (names not editable there). Future days and days before any habit existed aren't tappable.

**Habit sheet:** uppercase field labels, square inputs with a blue focus ring, segmented "Yes / no | Amount per day" control with a sliding blue highlight, full-width blue submit, red text "Delete habit".

## Layout

- Single column, max 480px, 16px side padding, mobile-first, no desktop breakpoints.
- Cards: 16px padding, 8px gap.
- Respect safe areas: top padding includes `env(safe-area-inset-top)` (status bar is `black-translucent`); tab bar and sheets include the bottom inset.
