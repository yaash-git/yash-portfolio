import { useEffect, useState } from 'react'
import './Preloader.css'

// Version the key so a stale flag from an earlier preloader build cannot
// suppress the first run after this implementation is deployed.
const SESSION_KEY = 'yash-portfolio-preloader-seen-v2'
const STATUS_LINES = [
  'Initializing portfolio...',
  '✓ A portfolio in progress...',
  '✓ Learning · Building · Exploring...',
  '✓ A little more about the work...',
  '✓ Almost ready...',
  '🚀 Welcome',
]

function shouldShowPreloader() {
  const replayRequested = new URLSearchParams(window.location.search).get('preloader') === 'true'
  if (replayRequested) return true

  try {
    return sessionStorage.getItem(SESSION_KEY) !== 'true'
  } catch {
    return true
  }
}

function Preloader() {
  const [visible, setVisible] = useState(shouldShowPreloader)
  const [visibleLines, setVisibleLines] = useState(0)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    if (!visible) return undefined

    // Remember this visit so a refresh in the same tab skips the introduction.
    try {
      sessionStorage.setItem(SESSION_KEY, 'true')
    } catch {
      // The preloader can still run when browser storage is unavailable.
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      const quickExit = window.setTimeout(() => setVisible(false), 180)
      return () => window.clearTimeout(quickExit)
    }

    const lineInterval = 330
    const timers = STATUS_LINES.map((_, index) =>
      window.setTimeout(() => setVisibleLines(index + 1), 140 + index * lineInterval),
    )

    const fadeTimer = window.setTimeout(() => setIsFading(true), 140 + STATUS_LINES.length * lineInterval)
    const exitTimer = window.setTimeout(
      () => setVisible(false),
      140 + STATUS_LINES.length * lineInterval + 650,
    )

    return () => {
      timers.forEach(window.clearTimeout)
      window.clearTimeout(fadeTimer)
      window.clearTimeout(exitTimer)
    }
  }, [visible])

  if (!visible) return null

  return (
    <div className={`portfolio-preloader${isFading ? ' portfolio-preloader--fading' : ''}`}>
      <div className="portfolio-preloader__window" role="status" aria-live="polite" aria-label="Portfolio introduction">
        <div className="portfolio-preloader__titlebar" aria-hidden="true">
          <span className="portfolio-preloader__dot portfolio-preloader__dot--red" />
          <span className="portfolio-preloader__dot portfolio-preloader__dot--yellow" />
          <span className="portfolio-preloader__dot portfolio-preloader__dot--green" />
          <span className="portfolio-preloader__title">YASH / PORTFOLIO</span>
        </div>
        <div className="portfolio-preloader__terminal">
          {STATUS_LINES.slice(0, visibleLines).map((line, index) => (
            <p className="portfolio-preloader__line" key={line}>
              {index === 0 && <span className="portfolio-preloader__prompt">&gt; </span>}
              {line}
            </p>
          ))}
          {!isFading && <span className="portfolio-preloader__cursor" aria-hidden="true" />}
        </div>
      </div>
    </div>
  )
}

export default Preloader
