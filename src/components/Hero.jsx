import { lazy, Suspense, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Hero.css'

gsap.registerPlugin(ScrollTrigger)

const PhotoParticleLayer = lazy(() => import('./PhotoParticleLayer.jsx'))
const links = [
  { label: 'WORK', section: 'projects' },
  { label: 'LAB', section: 'lab' },
  { label: 'ABOUT', section: 'about' },
  { label: 'CONTACT', section: 'contact' },
]

function Hero() {
  const sceneRef = useRef(null)

  useLayoutEffect(() => {
    const scene = sceneRef.current
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!scene || prefersReducedMotion) return undefined

    const hero = scene.querySelector('.hero')
    const photo = scene.querySelector('.hero__photo')
    const particles = scene.querySelector('.hero__particles')
    const content = scene.querySelector('.hero__content')
    const motto = scene.querySelector('.hero__motto')
    const words = scene.querySelectorAll('.hero__transition-word')

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: scene,
          start: 'top top',
          end: '+=240%',
          pin: hero,
          scrub: 1,
          anticipatePin: 1,
        },
      })

      timeline
        .to(photo, { scale: 1.12, yPercent: 4, duration: 0.45, ease: 'none' }, 0)
        // Match the photo's existing movement so its particle details stay aligned.
        .to(particles, { scale: 1.12, yPercent: 4, duration: 0.45, ease: 'none' }, 0)
        .to(content, { yPercent: -8, duration: 0.4, ease: 'none' }, 0)
        .to(motto, { opacity: 0, y: -18, duration: 0.18, ease: 'none' }, 0.43)
        .to(content, { opacity: 0, duration: 0.28, ease: 'none' }, 0.52)
        .to(photo, { opacity: 0, duration: 0.42, ease: 'none' }, 0.48)
        .to(particles, { opacity: 1, duration: 0.42, ease: 'none' }, 0.48)
        // Hold the particle portrait briefly, then crossfade each word in sequence.
        .fromTo(words[0], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power1.out' }, 1.08)
        .to(words[0], { opacity: 0, y: -8, duration: 0.16, ease: 'none' }, 1.42)
        .fromTo(words[1], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power1.out' }, 1.60)
        .to(words[1], { opacity: 0, y: -8, duration: 0.16, ease: 'none' }, 1.94)
        .fromTo(words[2], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power1.out' }, 2.12)
        .to(words[2], { opacity: 0, y: -8, duration: 0.16, ease: 'none' }, 2.46)
        .to(particles, { opacity: 0, duration: 0.24, ease: 'none' }, 2.62)
    }, scene)

    return () => context.revert()
  }, [])

  return (
    <main ref={sceneRef} className="hero-scene" id="top">
      <section className="hero" aria-label="Yash Meena introduction">
        <div className="hero__photo" aria-hidden="true" />
        <div className="hero__texture" aria-hidden="true" />
        <div className="hero__particles" aria-hidden="true">
          <Suspense fallback={null}>
            <PhotoParticleLayer fit="cover" strength={0.82} />
          </Suspense>
        </div>
        <header className="hero__header">
          <a className="hero__brand" href="#top" aria-label="Yash Meena, home">
            YASH MEENA
          </a>

          <nav className="hero__nav" aria-label="Main navigation">
            {links.map((link) => (
              <a key={link.label} href={`#${link.section}`}>
                {link.label}
              </a>
            ))}
          </nav>
        </header>

        <section className="hero__content" aria-labelledby="hero-title">
          <p className="hero__eyebrow">COMPUTER SCIENCE STUDENT &amp; DEVELOPER</p>
          <h1 id="hero-title">YASH MEENA</h1>
          <p className="hero__motto">LEARNING <span>•</span> BUILDING <span>•</span> EXPLORING</p>
        </section>

        <div className="hero__transition-focus" aria-hidden="true">
          <span className="hero__transition-word">LEARNING</span>
          <span className="hero__transition-word">BUILDING</span>
          <span className="hero__transition-word">EXPLORING</span>
        </div>

        <div className="hero__footer">
          <p>B.TECH CSE <span>•</span> 2024—2028</p>
          <p>BASED IN BHOPAL, MADHYA PRADESH, INDIA</p>
        </div>

      </section>

    </main>
  )
}

export default Hero
