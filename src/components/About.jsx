import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './About.css'

gsap.registerPlugin(ScrollTrigger)

function About() {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!section || prefersReducedMotion) return undefined

    const context = gsap.context(() => {
      const entranceItems = section.querySelectorAll(
        '.about__label, .about__heading-line, .about__copy, .about__detail',
      )

      gsap.from(entranceItems, {
        autoAlpha: 0,
        y: 18,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 76%',
          once: true,
        },
      })
    }, section)

    return () => context.revert()
  }, [])

  return (
    <section className="about" id="about" aria-labelledby="about-title" ref={sectionRef}>
      <div className="about__inner">
        <div className="about__lead">
          <p className="about__label">ABOUT / 02</p>
          <h2 className="about__heading" id="about-title">
            <span className="about__heading-line">NOT TRYING TO</span>
            <span className="about__heading-line">KNOW EVERYTHING.</span>
          </h2>
        </div>

        <div className="about__body">
          <p className="about__copy about__copy--primary">
            I’m a Computer Science student learning by building. I like understanding how things work,
            turning ideas into projects, and experimenting with technologies I haven’t used before.
          </p>
          <p className="about__copy">
            Right now, I’m exploring frontend development, backend systems, JavaScript, React, Node.js,
            databases, creative web experiences, and the intersection of technology and design.
          </p>

          <dl className="about__details">
            <div className="about__detail">
              <dt>EDUCATION</dt>
              <dd>B.TECH CSE <span>2024 — 2028</span></dd>
            </div>
            <div className="about__detail">
              <dt>BASED IN</dt>
              <dd>BHOPAL, MADHYA PRADESH, INDIA</dd>
            </div>
            <div className="about__detail about__detail--learning">
              <dt>CURRENTLY LEARNING</dt>
              <dd>JavaScript · React · Node.js · Express · MongoDB · Three.js</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}

export default About
