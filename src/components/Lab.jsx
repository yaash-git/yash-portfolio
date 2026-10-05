import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Lab.css'

gsap.registerPlugin(ScrollTrigger)

const experiments = [
  {
    number: '01',
    title: 'GSAP / SCROLL',
    description: 'A scroll-driven animation experiment exploring pinned sections, timelines, transitions, and scroll-based storytelling.',
    technologies: ['GSAP', 'ScrollTrigger'],
    visual: 'scroll',
  },
  {
    number: '02',
    title: 'THREE.JS / PARTICLES',
    description: 'A particle-based visual experiment built with React Three Fiber and Three.js, using a real portrait image as the visual source.',
    technologies: ['Three.js', 'React Three Fiber', 'WebGL'],
    visual: 'particles',
  },
  {
    number: '03',
    title: 'PORTFOLIO / INTERACTION',
    description: 'The portfolio itself is also an ongoing experiment in combining React, GSAP, WebGL, visual storytelling, and interactive UI.',
    technologies: ['React', 'GSAP', 'Three.js', 'JavaScript'],
    visual: 'interface',
  },
]

function Lab() {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!section || prefersReducedMotion) return undefined

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 76%',
          once: true,
        },
      })

      timeline
        .from('.lab__label', { autoAlpha: 0, y: 14, duration: 0.5, ease: 'power2.out' })
        .from('.lab__heading', { autoAlpha: 0, y: 22, duration: 0.65, ease: 'power2.out' }, '-=0.2')
        .from('.lab__intro', { autoAlpha: 0, y: 16, duration: 0.55, ease: 'power2.out' }, '-=0.25')
        .from('.lab__experiment', {
          autoAlpha: 0,
          y: 18,
          duration: 0.55,
          stagger: 0.11,
          ease: 'power2.out',
        }, '-=0.15')
    }, section)

    return () => context.revert()
  }, [])

  return (
    <section className="lab" id="lab" aria-labelledby="lab-title" ref={sectionRef}>
      <div className="lab__inner">
        <header className="lab__intro-layout">
          <div className="lab__heading-group">
            <p className="lab__label">LAB / 03</p>
            <h2 className="lab__heading" id="lab-title">
              EXPERIMENTS<br />IN PROGRESS.
            </h2>
          </div>
          <p className="lab__intro">
            Not everything I build starts as a finished product. Some things begin as experiments — a
            way to understand, break, rebuild, and learn.
          </p>
        </header>

        <ol className="lab__list">
          {experiments.map((experiment) => (
            <li className="lab__experiment" key={experiment.number}>
              <span className="lab__number" aria-hidden="true">{experiment.number}</span>
              <div className="lab__details">
                <h3>{experiment.title}</h3>
                <p>{experiment.description}</p>
                <ul className="lab__technologies" aria-label={`${experiment.title} technologies`}>
                  {experiment.technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
              </div>
              <div className={`lab__visual lab__visual--${experiment.visual}`} aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default Lab
