/*
 * Check and cross drawn as plain strokes with pathLength=1, so CSS can "draw"
 * them in by animating stroke-dashoffset from 1 to 0 (see .mark in TaskCard.css).
 */

type Props = { size: number }

export function CheckMark({ size }: Props) {
  return (
    <svg className="mark" width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} />
    </svg>
  )
}

export function CrossMark({ size }: Props) {
  return (
    <svg className="mark" width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d="M6.5 6.5l11 11" pathLength={1} />
      <path d="M17.5 6.5l-11 11" pathLength={1} />
    </svg>
  )
}

/** Expanding square ring plus four sparks flying off the corners. Mount it to play once. */
export function Burst() {
  return (
    <span className="burst" aria-hidden>
      <i />
      <i />
      <i />
      <i />
    </span>
  )
}
