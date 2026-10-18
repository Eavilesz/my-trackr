# Design — Habit Tracker

Design guide for the app. Use it as context in every Claude Code session to keep visual consistency.

## Concept

Habits are "cultivated" day by day. Progress doesn't read as an abstract percentage — it reads as a **fill** toward a goal, a container gradually completing. Minimalist, warm style, single column, built for daily use on iPhone (no desktop view).

## Colors

| Token        | Hex       | Use                                           |
| ------------ | --------- | --------------------------------------------- |
| `--paper`    | `#EEF0E6` | General background (sage paper)               |
| `--ink`      | `#1E231C` | Primary text                                  |
| `--ink-soft` | `#5B6156` | Secondary text (labels, metadata)             |
| `--moss`     | `#3F6B4A` | Accent for completed binary habits            |
| `--moss-bg`  | `#E1E9DD` | Light moss background (partial states)        |
| `--ochre`    | `#B8863A` | Accent for quantity habits (fill bars, chips) |
| `--ochre-bg` | `#F2E6D3` | Light ochre background (bar track)            |
| `--rust`     | `#A8432F` | Missed habits (`--rust-bg` chips, `--rust-text` text, `--rust-tint` day cells) |
| `--line`     | `#D9DCC9` | Borders and dividers (0.5px hairlines)        |
| `#fff`       | white     | Card background over the paper                |

Rule: moss = completed. Rust = missed (past days only). Ochre = quantity/progress. Don't mix meanings between colors.

## Typography

- **General UI:** Manrope (weights 400 and 500 only)
- **Numeric data** (grams, streaks, percentages): IBM Plex Mono or similar — tabular, for consistent digit alignment
- Sentence case everywhere, no all-caps, no mid-sentence bold

## Components

**Binary habit** (white card, 0.5px `--line` border, 14px radius)

- 38px circle on the left, three states cycled by tapping: unmarked (2px `--line` border) → done (`--moss` fill + check) → failed (`--rust` fill + ✕) → unmarked
- 15px/500 label in `--ink`, 12px subtext "6 day streak" in `--ink-soft`
- Optional per-day note, only while the habit is in the failed state ("Add note" link under the subtext, inline input, max 30 chars); shown in the red calendar chip for that day. Leaving the failed state clears the note
- Optional icon before the name (16px Tabler outline, `--ink-soft`), picked in the habit sheet from a 5×2 grid; tap the selected icon again to remove it. Set lives in `src/lib/icons.ts` (strength, running, cycling, stretching, nutrition, water, sleep, health, reading, focus). A habit stores only the icon id, so ids must stay stable. The calendar legend shows the same icons
- Tapping the habit name opens the edit sheet (no pencil icon, on both binary and quantity cards)

**Quantity habit** (same base card)

- Header: label on the left, current/goal figure on the right in mono, e.g. `104 / 150 g`
- Fill bar: 8px tall track in `--ochre-bg`, `--ochre` fill, 4px radius
- Quick-add chips below: `--ochre-bg` background, dark text (`#633806`), 8px radius — e.g. "+10 g", "+20 g", "other"

**Bottom tab bar:** Today / Month, 18px Tabler outline icon above the label, active in `--ink`, inactive in `--ink-soft`

**Calendar view:** Monday-start month grid, one card-colored cell per day. Each cell shows the date, then one chip per habit in the same order as the habit list (a legend above the grid names them). Chips: done = `--moss-bg` with a check; missed (past days only) = `--rust-bg` with a ✕. A failed binary chip (or an unmarked one on a past day) shows the day's note instead of the ✕ when there is one. Quantity chips show the logged amount in mono (e.g. `158 g`). Today's unfinished habits are `--ochre-bg` (or blank when nothing is logged). A day with every habit done gets a `--moss-tint` cell; a past day with any miss gets `--rust-tint`. Future days show only the date; habits only count from the day they were created. Today's date sits in an `--ink` circle.

**Day sheet:** tapping a past day or today in the calendar opens a bottom sheet (same style as the habit sheet) titled with the date, listing that day's habits using the same cards as the Today view (same tap cycle, quick-adds and notes). Edits apply to that day and update the calendar live. Future days and days before any habit existed aren't tappable; the habit name isn't editable from this sheet.

## Layout

- Single column, mobile-first, no desktop breakpoints
- Cards with 14px padding, 14–16px radius, 10px gap between them
- Borders always 0.5px, never decorative shadows
