import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Projects.css'

gsap.registerPlugin(ScrollTrigger)

// Keep project copy together here so each item uses the same layout and markup.
const projects = [
  {
    number: '01',
    title: 'KISANSATHI / KISAN MARG',
    status: 'SIH 26032 Prototype · Deploying Soon',
    context: 'Smart India Hackathon 2026',
    description: 'Farmer Procurement Slot Booking & Queue Management System.',
    technologies: [],
    problem: 'Farmer Procurement Slot Booking & Queue Management System.',
    approach: 'Prototype for SIH 26032 under Smart India Hackathon 2026. Not deployed or live.',
    features: [],
    learning: '',
  },
  {
    number: '02',
    title: 'HOSPITAL SMART TOKEN MANAGEMENT SYSTEM',
    status: 'Completed Project',
    context: '',
    description: 'A completed project focused on smart token management for hospitals.',
    technologies: [],
    problem: '',
    approach: '',
    features: [],
    learning: '',
  },
  {
    number: '03',
    title: 'CAMPUS EXCHANGE',
    status: 'B.Tech CSE Minor Project — In Progress',
    context: 'Proposed architecture: React + TypeScript · Node.js + Express · PostgreSQL',
    description: 'An in-progress proposal for a verified campus exchange platform. Planned features include college identity checks, structured listings, search and filters, and buy, sell, rent, borrow, or exchange workflows.',
    technologies: [],
    problem: 'Unused campus items can be hard to discover, while students who need them may buy the same items again. Informal channels also make exchanges difficult to search, verify, and track.',
    approach: 'Proposal for a verified, campus-level student-to-student exchange platform.',
    features: [
      'Planned: college identity verification',
      'Planned: structured listings with search and filters',
      'Planned: buy, sell, rent, borrow, and exchange workflows',
      'Planned: transaction tracking and trust-and-safety tools',
    ],
    learning: '',
  },
  {
    number: '04',
    title: 'PERSONAL PORTFOLIO',
    status: 'Currently Building',
    context: '',
    description: 'A portfolio currently being built as a learning project with React, GSAP, and Three.js / React Three Fiber.',
    technologies: ['React', 'GSAP', 'Three.js', 'React Three Fiber'],
    problem: '',
    approach: 'Currently building this portfolio with React, GSAP, and Three.js / React Three Fiber.',
    features: [],
    learning: 'Learning through building with React, GSAP, and Three.js / React Three Fiber.',
  },
]

function ProjectCaseStudy({ project, expanded, onToggle }) {
  const features = project.features ?? []
  const hasDetails = Boolean(project.problem || project.approach || features.length || project.learning)
  const panelId = `project-case-study-${project.number}`

  return (
    <>
      {hasDetails ? (
        <button
          className="project-row__case-label"
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={onToggle}
        >
          CASE STUDY <span aria-hidden="true">{expanded ? '−' : '+'}</span>
        </button>
      ) : (
        <span className="project-row__case-label">CASE STUDY</span>
      )}

      {hasDetails && (
        <div
          className="project-case-study"
          id={panelId}
          data-expanded={expanded}
          aria-hidden={!expanded}
        >
          <div className="project-case-study__inner">
            {project.problem && (
              <div className="project-case-study__section">
                <h4>Problem</h4>
                <p>{project.problem}</p>
              </div>
            )}
            {project.approach && (
              <div className="project-case-study__section">
                <h4>Approach</h4>
                <p>{project.approach}</p>
              </div>
            )}
            {features.length > 0 && (
              <div className="project-case-study__section project-case-study__section--wide">
                <h4>Features / scope</h4>
                <ul>
                  {features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
              </div>
            )}
            {project.learning && (
              <div className="project-case-study__section project-case-study__section--wide">
                <h4>Learning</h4>
                <p>{project.learning}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

function Projects() {
  const sectionRef = useRef(null)
  const [expandedProject, setExpandedProject] = useState(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!section || prefersReducedMotion) return undefined

    const context = gsap.context(() => {
      gsap.from(section.querySelectorAll('.projects__intro > *, .project-row'), {
        autoAlpha: 0,
        y: 22,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          once: true,
        },
      })
    }, section)

    return () => context.revert()
  }, [])

  return (
    <section ref={sectionRef} className="projects" id="projects" aria-labelledby="projects-title">
      <header className="projects__intro">
        <p className="projects__eyebrow">SELECTED WORK / LEARNING IN PROGRESS</p>
        <h2 id="projects-title">PROJECTS</h2>
        <p className="projects__supporting">
          Projects I’ve built while learning, experimenting, and solving real problems.
        </p>
      </header>

      <div className="projects__list">
        {projects.map((project) => (
          <article className="project-row" key={project.number}>
            <span className="project-row__number">{project.number}</span>

            <div className="project-row__details">
              <p className="project-row__status">{project.status}</p>
              <h3>{project.title}</h3>
              {project.context && <p className="project-row__context">{project.context}</p>}
              <p className="project-row__description">{project.description}</p>
              {project.technologies.length > 0 && (
                <ul className="project-row__technologies" aria-label="Technologies used">
                  {project.technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
              )}
              <ProjectCaseStudy
                project={project}
                expanded={expandedProject === project.number}
                onToggle={() => setExpandedProject(
                  expandedProject === project.number ? null : project.number,
                )}
              />
            </div>

            <div className="project-row__visual" aria-hidden="true">
              <span className="project-row__visual-number">{project.number}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Projects
