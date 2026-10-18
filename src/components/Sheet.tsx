import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { IconX } from '@tabler/icons-react'
import './TaskSheet.css'

type Props = {
  title: string
  /** Called once the exit animation has finished — unmount the sheet here. */
  onClose: () => void
  /** Receives `close`, which plays the exit animation before calling onClose. */
  children: (close: () => void) => ReactNode
}

/** Bottom sheet that slides up on open and back down before it closes. */
export function Sheet({ title, onClose, children }: Props) {
  const [closing, setClosing] = useState(false)
  const close = () => setClosing(true)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Inputs that handle Escape themselves (the note field) call preventDefault.
      if (e.key === 'Escape' && !e.defaultPrevented) setClosing(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Portaled to <body> so an animated ancestor can't become the containing block
  // for position: fixed and trap the sheet inside the view.
  return createPortal(
    <div className={`sheet-backdrop${closing ? ' is-closing' : ''}`} onClick={close}>
      <div
        className="sheet"
        role="dialog"
        aria-modal
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={(e) => {
          // Ignore animations bubbling up from the cards inside.
          if (closing && e.target === e.currentTarget) onClose()
        }}
      >
        <div className="sheet-header">
          <h2>{title}</h2>
          <button type="button" className="sheet-close" onClick={close} aria-label="Close">
            <IconX size={18} />
          </button>
        </div>
        {children(close)}
      </div>
    </div>,
    document.body,
  )
}
