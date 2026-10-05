import { lazy, Suspense } from 'react'
import Hero from './components/Hero.jsx'
import Journey from './components/Journey.jsx'
import About from './components/About.jsx'
import Projects from './components/Projects.jsx'
import Lab from './components/Lab.jsx'
import GitHubActivity from './components/GitHubActivity.jsx'
import Contact from './components/Contact.jsx'
import Preloader from './components/Preloader.jsx'

const PhotoParticleExperiment = lazy(() => import('./components/PhotoParticleExperiment.jsx'))

function App() {
  const isParticleExperiment = window.location.pathname.replace(/\/$/, '') === '/photo-particles'

  if (isParticleExperiment) {
    return (
      <Suspense fallback={<main aria-label="Loading experiment" style={{ minHeight: '100svh', background: '#08090b' }} />}>
        <PhotoParticleExperiment />
      </Suspense>
    )
  }

  return (
    <>
      <Hero />
      <Journey />
      <About />
      <Projects />
      <Lab />
      <GitHubActivity />
      <Contact />
      <Preloader />
    </>
  )
}

export default App
