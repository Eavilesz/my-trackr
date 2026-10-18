import { useEffect, useRef, useState } from 'react'
import { IconBackspace, IconX } from '@tabler/icons-react'
import './AmountPad.css'

type Props = {
  unit: string
  /** Called with the sum of every entered number (always > 0). */
  onSubmit: (amount: number) => void
  onCancel: () => void
}

/** Longest a single number can get, digits and dot included. */
const MAX_TERM = 6

/** Sum of the terms, rounded so 0.1 + 0.2 shows as 0.3. */
function total(terms: string[]): number {
  const sum = terms.reduce((acc, t) => acc + (Number(t) || 0), 0)
  return Math.round(sum * 100) / 100
}

/**
 * Number pad that adds as you go: "20 + 35 + 10" submits 65. The last entry
 * in `terms` is the number being typed; "+" starts a new one.
 */
export function AmountPad({ unit, onSubmit, onCancel }: Props) {
  const [terms, setTerms] = useState<string[]>([''])
  const padRef = useRef<HTMLDivElement>(null)
  const last = terms[terms.length - 1]
  const sum = total(terms)

  // Focused on open so a hardware keyboard works straight away. A div, not an
  // input, so iOS doesn't pop up its own keyboard over ours.
  useEffect(() => padRef.current?.focus({ preventScroll: true }), [])

  function setLast(next: string) {
    setTerms((all) => [...all.slice(0, -1), next])
  }

  function digit(d: string) {
    if (last.length >= MAX_TERM) return
    // At most two decimals.
    if (/\.\d\d$/.test(last)) return
    // No leading zeros: "0" then "5" is "5".
    setLast(last === '0' ? d : last + d)
  }

  function dot() {
    if (last.includes('.') || last.length >= MAX_TERM - 1) return
    setLast(last === '' ? '0.' : last + '.')
  }

  function plus() {
    // Only after a real number, so "+ +" or "0 +" can't stack up.
    if (Number(last) > 0) setTerms((all) => [...all, ''])
  }

  function backspace() {
    // Deleting at the start of an empty term removes the "+" before it.
    if (last === '' && terms.length > 1) setTerms((all) => all.slice(0, -1))
    else setLast(last.slice(0, -1))
  }

  function submit() {
    if (sum > 0) onSubmit(sum)
  }

  // Hardware keyboard support (desktop, iPad keyboards).
  function handleKey(e: React.KeyboardEvent) {
    if (/^\d$/.test(e.key)) digit(e.key)
    else if (e.key === '.' || e.key === ',') dot()
    else if (e.key === '+') plus()
    else if (e.key === 'Backspace') backspace()
    else if (e.key === 'Enter') submit()
    else if (e.key === 'Escape') onCancel()
    else return
    // Handled: keep Escape from also closing a surrounding sheet, Enter from submitting forms.
    e.preventDefault()
  }

  const keys: { label: React.ReactNode; area: string; onPress: () => void; kind?: string; aria?: string }[] = [
    ...'789456123'.split('').map((d) => ({ label: d, area: `k${d}`, onPress: () => digit(d) })),
    { label: '0', area: 'k0', onPress: () => digit('0') },
    { label: '.', area: 'dot', onPress: dot, aria: 'Decimal point' },
    { label: <IconBackspace size={20} stroke={1.75} />, area: 'back', onPress: backspace, kind: 'fn', aria: 'Delete' },
    { label: '+', area: 'plus', onPress: plus, kind: 'plus', aria: 'Plus' },
    { label: 'C', area: 'clear', onPress: () => setTerms(['']), kind: 'fn', aria: 'Clear' },
  ]

  return (
    <div ref={padRef} className="amount-pad" tabIndex={-1} onKeyDown={handleKey}>
      <div className="amount-display" aria-live="polite">
        <div className="amount-expr">
          {terms.map((t, i) => (
            <span key={i} className="amount-term">
              {i > 0 && <span className="amount-op">+</span>}
              {t || (i === terms.length - 1 && terms.length === 1 ? <span className="amount-placeholder">0</span> : null)}
            </span>
          ))}
          <span className="amount-caret" aria-hidden />
        </div>
        <div className={`amount-total${terms.length > 1 ? ' is-visible' : ''}`}>
          = <span key={sum} className="amount-total-num">{sum}</span> {unit}
        </div>
      </div>

      <div className="amount-keys">
        {keys.map((k) => (
          <button
            key={k.area}
            type="button"
            className={`amount-key${k.kind ? ` amount-key--${k.kind}` : ''}`}
            style={{ gridArea: k.area }}
            onClick={k.onPress}
            aria-label={k.aria}
          >
            {k.label}
          </button>
        ))}
      </div>

      <div className="amount-actions">
        <button type="button" className="amount-cancel" onClick={onCancel} aria-label="Cancel">
          <IconX size={16} />
        </button>
        <button type="button" className="amount-submit" onClick={submit} disabled={sum <= 0}>
          Add {sum} {unit}
        </button>
      </div>
    </div>
  )
}
