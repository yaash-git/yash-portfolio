import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Journey.css'

gsap.registerPlugin(ScrollTrigger)

const focusAreas = [
  { title: 'PROGRAMMING', topics: 'Java · Python · Problem Solving' },
  { title: 'WEB', topics: 'HTML · CSS · JavaScript · React' },
  { title: 'BACKEND', topics: 'Node.js · Express · MongoDB' },
  { title: 'EXPLORING', topics: 'Three.js · AI-assisted development · New technologies' },
]

function Journey() {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!section || prefersReducedMotion) return undefined

    const context = gsap.context(() => {
      gsap.from(section.querySelectorAll('.journey__intro > *, .journey__card'), {
        autoAlpha: 0,
        y: 24,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          once: true,
        },
      })
    }, section)

    return () => context.revert()
  }, [])

  return (
    <section ref={sectionRef} className="journey" aria-labelledby="journey-title">
      <div className="journey__intro">
        <p className="journey__eyebrow">JOURNEY / LEARNING BY BUILDING</p>
        <h2 id="journey-title">WHAT I'M BUILDING</h2>
        <p className="journey__copy">
          I'm a Computer Science student learning by building — exploring programming, web
          development, backend systems, and new technologies through real projects.
        </p>
      </div>

      <div className="journey__grid">
        {focusAreas.map((area, index) => (
          <article className="journey__card" key={area.title}>
            <span className="journey__number">0{index + 1}</span>
            <h3>{area.title}</h3>
            <p>{area.topics}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Journey
