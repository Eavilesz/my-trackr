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
| `--line`     | `#D9DCC9` | Borders and dividers (0.5px hairlines)        |
| `#fff`       | white     | Card background over the paper                |

Rule: moss = binary/completed. Ochre = quantity/progress. Don't mix meanings between colors.

## Typography

- **General UI:** Manrope (weights 400 and 500 only)
- **Numeric data** (grams, streaks, percentages): IBM Plex Mono or similar — tabular, for consistent digit alignment
- Sentence case everywhere, no all-caps, no mid-sentence bold

## Components

**Binary habit** (white card, 0.5px `--line` border, 14px radius)

- 38px circle on the left: `--moss` fill + check icon when done, 2px `--line` border when not
- 15px/500 label in `--ink`, 12px subtext "6 day streak" in `--ink-soft`

**Quantity habit** (same base card)

- Header: label on the left, current/goal figure on the right in mono, e.g. `104 / 150 g`
- Fill bar: 8px tall track in `--ochre-bg`, `--ochre` fill, 4px radius
- Quick-add chips below: `--ochre-bg` background, dark text (`#633806`), 8px radius — e.g. "+10 g", "+20 g", "other"

**Bottom tab bar:** Today / Week / Month, 18px Tabler outline icon above the label, active in `--ink`, inactive in `--ink-soft`

**Weekly view:** grid with a label column (habits) + 7 columns (M–S). Binary = filled/empty dot. Quantity = rounded square, filled or muted depending on whether the goal was hit that day.

**Monthly view:** heatmap of rounded squares (one per day), color based on the aggregate completion percentage across all habits that day — solid moss = 100%, light moss (`--moss-bg`) = partial completion. General view, not per individual habit.

## Layout

- Single column, mobile-first, no desktop breakpoints
- Cards with 14px padding, 14–16px radius, 10px gap between them
- Borders always 0.5px, never decorative shadows
