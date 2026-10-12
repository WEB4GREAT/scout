import { useState, type FormEvent } from 'react'
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  MoveUpRight,
} from 'lucide-react'

export default function App() {
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email.trim() || submitting) return

    const form = event.currentTarget
    const website = (new FormData(form).get('website') as string) || ''

    setSubmitting(true)
    setSubmitError('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), website }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        setSubmitError(
          typeof result.error === 'string'
            ? result.error
            : 'We couldn’t submit your request. Please try again.',
        )
        return
      }

      setJoined(true)
      setEmail('')
    } catch {
      setSubmitError('Could not reach Scout. Check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="scout-page" id="top">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="glass-nav">
        <a href="#top" className="wordmark" aria-label="SCOUT home">
          <svg className="scout-mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
  <path className="scout-mark-line" d="M10 10 L29 12 L26 30 L10 10 M10 10 L10 29 L26 30 M29 12 L10 29" />
  <circle className="scout-mark-node node-a" cx="10" cy="10" r="4" />
  <circle className="scout-mark-node node-b" cx="29" cy="12" r="4" />
  <circle className="scout-mark-node node-c" cx="26" cy="30" r="4" />
  <circle className="scout-mark-node node-d" cx="10" cy="29" r="4" />
  <circle className="scout-mark-core" cx="20" cy="20" r="3" />
</svg>
          SCOUT
        </a>

        <div className="nav-middle">
          <span className="nav-status" />
          INDEPENDENT DISCOVERY
        </div>

        <a href="#waitlist" className="nav-action">
          <span>Get early access</span>
          <span className="nav-arrow"><ArrowUpRight size={15} /></span>
        </a>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="pretitle">
            <span>WEB3, BEFORE THE CROWD</span>
            <span className="pretitle-line" />
            <span>001</span>
          </div>

          <h1>
            There’s more<br />
            <span className="headline-muted">out there.</span>
          </h1>

          <p className="hero-description">
            The projects worth knowing about aren't always
            the ones making the most noise.
            SCOUT is being built to help you find them.
          </p>

          <a href="#why" className="text-link">
            Get to know SCOUT
            <ArrowDown size={15} />
          </a>

          <div className="waitlist-area" id="waitlist">
            <span className="form-eyebrow">THE FIRST CIRCLE</span>

            {joined ? (
              <div className="join-success">
                <span className="success-icon"><Check size={16} /></span>
                <div>
                  <strong>You're on the list.</strong>
                  <p>Thanks for your interest. We’ll share updates as Scout develops.</p>
                </div>
              </div>
            ) : (
              <form className="join-form" onSubmit={handleSubmit}>
                <label className="sr-only" htmlFor="waitlist-email">
                  Email address
                </label>
                <input
                  className="sr-only"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />
                <input
                  id="waitlist-email"
                  type="email"
                  placeholder="Your email address"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <button
                  type="submit"
                  aria-label={submitting ? 'Joining waitlist' : 'Join the waitlist'}
                  disabled={submitting}
                >
                  {submitting ? '…' : <MoveUpRight size={19} />}
                </button>
              </form>
            )}

            {submitError && !joined && (
              <p className="form-error" role="alert">{submitError}</p>
            )}

            <p className="form-footnote">
              Early access, when it's ready. That's it.
            </p>
          </div>
        </div>

        <div className="hero-art" aria-label="Abstract layered glass sculpture">
          <div className="art-coordinate coordinate-top">SC / 001</div>
          <div className="art-coordinate coordinate-bottom">LOOK CLOSER ↗</div>

          <div className="glass-orbit orbit-back" />
          <div className="glass-orbit orbit-front" />

          <div className="glass-object">
            <div className="glass-slab slab-back" />
            <div className="glass-slab slab-middle" />
            <div className="glass-slab slab-front">
              <div className="slab-reflection" />
              <div className="slab-core">
                <span className="core-cross">+</span>
                <span className="core-label">SIGNAL<br />FOUND</span>
              </div>
            </div>
          </div>

          <div className="glass-pin pin-one"><span /></div>
          <div className="glass-pin pin-two"><span /></div>
          <div className="glass-pin pin-three"><span /></div>

          <div className="art-note note-left">
            <span className="note-dash" />
            <span>LOOK<br />BEYOND</span>
          </div>

          <div className="art-note note-right">
            <span>NOT EVERYTHING<br />IS ON THE SURFACE.</span>
          </div>

          <div className="art-bottom">
            <span>DISCOVERY IS A PRACTICE.</span>
            <span>01 — 03</span>
          </div>
        </div>
      </section>

      <div className="marquee-strip" aria-label="SCOUT focus">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div className="marquee-group" key={copy} aria-hidden={copy === 1}>
              <span>EARLY PROJECTS</span>
              <i />
              <span>REAL BUILDERS</span>
              <i />
              <span>NEW OPPORTUNITIES</span>
              <i />
              <span>LESS NOISE</span>
              <i />
            </div>
          ))}
        </div>
      </div>

      <section className="manifesto" id="why">
        <div className="manifesto-aside">
          <span className="section-index">A NOTE ON SCOUT</span>
          <span className="aside-mark">↘</span>
        </div>

        <div className="manifesto-main">
          <p className="manifesto-kicker">THE INTERNET MOVES FAST.</p>
          <h2>
            Your attention<br />
            <span>shouldn't have</span><br />
            to move faster.
          </h2>

          <div className="manifesto-bottom">
            <span className="manifesto-rule" />
            <p>
              SCOUT is a work in progress, built around a simple idea:
              discovering a project should be more than stumbling across
              a post at the right time.
            </p>
          </div>
        </div>
      </section>

      <section className="faq-section" id="faq">
        <div className="faq-heading">
          <span className="section-index">GOOD QUESTIONS / 001</span>
          <h2>Before you<br /><em>look closer.</em></h2>
          <p>A few things worth knowing about Scout.</p>
        </div>

        <div className="faq-list">
          <details className="faq-item">
            <summary>What exactly is Scout?</summary>
            <p>Scout is an independent discovery platform in development, built to help people find interesting Web3 projects before everyone is talking about them.</p>
          </details>

          <details className="faq-item">
            <summary>Who is Scout for?</summary>
            <p>Builders, researchers, curious users and anyone who wants to explore emerging projects across the Web3 ecosystem.</p>
          </details>

          <details className="faq-item">
            <summary>What kind of projects will I find?</summary>
            <p>We’re building toward discovery across different categories and blockchain ecosystems. The goal is to surface useful signals, not just the loudest launches.</p>
          </details>

          <details className="faq-item">
            <summary>How does early access work?</summary>
            <p>Join the waitlist to express your interest. We’ll share updates as Scout develops. Joining does not guarantee immediate access.</p>
          </details>

          <details className="faq-item">
            <summary>Is Scout live yet?</summary>
            <p>Scout is still being built. We’re working on the product and its underlying discovery infrastructure before opening it up more widely.</p>
          </details>
        </div>
      </section>

      <section className="closing">
        <div className="closing-orb" />
        <div className="closing-content">
          <span className="section-index">SCOUT / EARLY ACCESS</span>
          <h2>Be there<br />before <em>it's obvious.</em></h2>
          <a href="#waitlist" className="closing-link">
            Join the first circle
            <span><ArrowUpRight size={18} /></span>
          </a>
        </div>
        <span className="closing-side-note">THE NEXT THING IS OUT THERE.</span>
      </section>

      <footer className="site-footer">
        <a href="#top" className="footer-wordmark">SCOUT<span>.</span></a>
        <span>© 2026 SCOUT™. All rights reserved.</span>
        <a href="#top" className="back-top">BACK TO TOP ↑</a>
      </footer>
    </main>
  )
}
