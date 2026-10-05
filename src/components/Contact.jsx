import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { API_BASE_URL } from '../config/api.js'
import './Contact.css'

gsap.registerPlugin(ScrollTrigger)

const contactEmail = 'yashmeena5584@gmail.com'
const emailPattern = /^[^\s@]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/
const contactLinks = [
  { label: 'EMAIL', text: contactEmail, href: `mailto:${contactEmail}`, type: 'email' },
  { label: 'GITHUB', text: 'github.com/yaash-git', href: 'https://github.com/yaash-git' },
  { label: 'LINKEDIN', text: 'linkedin.com/in/yaashmeena', href: 'https://www.linkedin.com/in/yaashmeena' },
  { label: 'INSTAGRAM', text: 'instagram.com/yesyaash', href: 'https://www.instagram.com/yesyaash/' },
]
function createEmailFallback(form) {
  const name = form.elements.name.value.trim()
  const email = form.elements.email.value.trim()
  const message = form.elements.message.value.trim()
  const subject = encodeURIComponent(`Portfolio message from ${name}`)
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)

  return `mailto:${contactEmail}?subject=${subject}&body=${body}`
}

function Contact() {
  const sectionRef = useRef(null)
  const submissionInFlightRef = useRef(false)
  const [formState, setFormState] = useState('idle')
  const [formMessage, setFormMessage] = useState('')
  const [emailFallback, setEmailFallback] = useState('')

  useLayoutEffect(() => {
    const section = sectionRef.current
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!section || prefersReducedMotion) return undefined

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          once: true,
        },
      })

      timeline
        .from('.contact__label', { autoAlpha: 0, y: 14, duration: 0.5, ease: 'power2.out' })
        .from('.contact__heading-line', { autoAlpha: 0, y: 22, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '-=0.18')
        .from('.contact__supporting', { autoAlpha: 0, y: 16, duration: 0.55, ease: 'power2.out' }, '-=0.18')
        .from('.contact__link-row', { autoAlpha: 0, y: 14, duration: 0.45, stagger: 0.08, ease: 'power2.out' }, '-=0.12')
        .from('.contact__form', { autoAlpha: 0, y: 16, duration: 0.55, ease: 'power2.out' }, '-=0.05')
    }, section)

    return () => context.revert()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    if (submissionInFlightRef.current) return

    const form = event.currentTarget
    const emailField = form.elements.email
    emailField.setCustomValidity('')

    if (!emailPattern.test(emailField.value.trim())) {
      emailField.setCustomValidity('Enter a valid email address.')
      form.reportValidity()
      emailField.setCustomValidity('')
      setFormState('error')
      setFormMessage('Enter a valid email address.')
      setEmailFallback('')
      return
    }

    if (!form.reportValidity()) return

    submissionInFlightRef.current = true
    setFormState('submitting')
    setFormMessage('')
    setEmailFallback('')

    try {
      if (!API_BASE_URL) {
        setFormState('error')
        setFormMessage('The contact server is not configured. You can send your note by email instead.')
        setEmailFallback(createEmailFallback(form))
        return
      }

      let response

      try {
        response = await fetch(`${API_BASE_URL}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.elements.name.value,
            email: form.elements.email.value,
            message: form.elements.message.value,
          }),
        })
      } catch {
        setFormState('error')
        setFormMessage('The contact server is unavailable. You can send your note by email instead.')
        setEmailFallback(createEmailFallback(form))
        return
      }

      let result
      try {
        result = await response.json()
      } catch {
        setFormState('error')
        setFormMessage('The form could not be submitted. You can send your note by email instead.')
        setEmailFallback(createEmailFallback(form))
        return
      }

      if (!response.ok || !result.success) {
        setFormState('error')
        setFormMessage('The form could not be submitted. You can send your note by email instead.')
        setEmailFallback(createEmailFallback(form))
        return
      }

      form.reset()
      setFormState('success')
      setFormMessage('Message received. Thanks for reaching out.')
    } catch {
      setFormState('error')
      setFormMessage('The form could not be submitted. You can send your note by email instead.')
      setEmailFallback(createEmailFallback(form))
    } finally {
      submissionInFlightRef.current = false
      setFormState((currentState) => currentState === 'submitting' ? 'idle' : currentState)
    }
  }

  return (
    <>
      <section className="contact" id="contact" aria-labelledby="contact-title" ref={sectionRef}>
        <div className="contact__inner">
          <div className="contact__intro">
            <p className="contact__label">CONTACT / 04</p>
            <h2 className="contact__heading" id="contact-title">
              <span className="contact__heading-line">LET'S BUILD</span>
              <span className="contact__heading-line">SOMETHING.</span>
            </h2>
            <p className="contact__supporting">
              Have an idea, want to collaborate, or just want to talk tech? Feel free to reach out.
            </p>
          </div>

          <div className="contact__content">
            <address className="contact__links" aria-label="Contact links">
              {contactLinks.map((link) => (
                <div className={`contact__link-row${link.type === 'email' ? ' contact__link-row--email' : ''}`} key={link.label}>
                  <span className="contact__link-label">{link.label}</span>
                  <a
                    href={link.href}
                    {...(link.type === 'email' ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    {link.text}<span aria-hidden="true">↗</span>
                  </a>
                </div>
              ))}
            </address>

            <form className="contact__form" noValidate onSubmit={handleSubmit}>
              <p className="contact__form-title">OR LEAVE A NOTE</p>

              <div className="contact__field">
                <label htmlFor="contact-name">Name</label>
                <input id="contact-name" name="name" type="text" autoComplete="name" maxLength={100} required />
              </div>

              <div className="contact__field">
                <label htmlFor="contact-email">Email</label>
                <input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} required />
              </div>

              <div className="contact__field">
                <label htmlFor="contact-message">Message</label>
                <textarea id="contact-message" name="message" rows="4" maxLength={2000} required />
              </div>

              <button className="contact__submit" type="submit" disabled={formState === 'submitting'}>
                {formState === 'submitting' ? 'Sending...' : 'SEND MESSAGE'}
                {formState !== 'submitting' && <span aria-hidden="true">↗</span>}
              </button>
              <p className="contact__form-status" data-state={formState} role="status" aria-live="polite" aria-atomic="true">
                {formMessage}{emailFallback && <> <a href={emailFallback}>Open your email app</a></>}
              </p>
            </form>
          </div>
        </div>
      </section>

      <footer className="contact-footer">
        <div className="contact-footer__details">
          <span>YASH MEENA</span>
          <span>B.TECH CSE · 2024—2028</span>
          <span>BHOPAL, MADHYA PRADESH, INDIA</span>
        </div>
        <p>© 2026 YASH MEENA — BUILT WHILE LEARNING.</p>
      </footer>
    </>
  )
}

export default Contact
