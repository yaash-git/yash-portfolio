import { Suspense } from 'react'
import PhotoParticleLayer from './PhotoParticleLayer.jsx'
import './PhotoParticleExperiment.css'

const IMAGE_PATH = '/assets/yash-hero.webp'

function PhotoParticleExperiment() {
  return (
    <main className="particle-experiment">
      {/* The still photo is the clear base; the transparent canvas adds texture above it. */}
      <img className="particle-experiment__portrait" src={IMAGE_PATH} alt="Portrait of Yash Meena" />
      <div className="particle-experiment__canvas" aria-hidden="true">
        <Suspense fallback={null}>
          <PhotoParticleLayer />
        </Suspense>
      </div>

      <header className="particle-experiment__header">
        <a className="particle-experiment__back" href="/" aria-label="Return to the main hero">
          <span aria-hidden="true">←</span> BACK TO PORTFOLIO
        </a>
        <p className="particle-experiment__index">EXPERIMENT 01 / IMAGE STUDY</p>
      </header>

      <footer className="particle-experiment__footer" aria-hidden="true">
        <span>YASH MEENA</span>
        <span>MOVE YOUR POINTER</span>
      </footer>
    </main>
  )
}

export default PhotoParticleExperiment
