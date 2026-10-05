import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { BufferGeometry, Float32BufferAttribute, TextureLoader } from 'three'

const IMAGE_PATH = '/assets/yash-hero.jpg'
const SAMPLE_WIDTH = 160

function PortraitParticles({ fit, imagePositionX, strength }) {
  const pointsRef = useRef(null)
  const pointer = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })
  const texture = useLoader(TextureLoader, IMAGE_PATH)
  const viewport = useThree((state) => state.viewport)

  const geometry = useMemo(() => {
    const image = texture.image
    const sampleHeight = Math.max(1, Math.round(SAMPLE_WIDTH * image.height / image.width))
    const sampleCanvas = document.createElement('canvas')
    const context = sampleCanvas.getContext('2d', { willReadFrequently: true })

    sampleCanvas.width = SAMPLE_WIDTH
    sampleCanvas.height = sampleHeight
    context.drawImage(image, 0, 0, SAMPLE_WIDTH, sampleHeight)

    const pixels = context.getImageData(0, 0, SAMPLE_WIDTH, sampleHeight).data
    const positions = []
    const shades = []
    const imageAspect = image.width / image.height
    const fitWidth = viewport.width * (fit === 'cover' ? 1 : 0.92)
    const fitHeight = viewport.height * (fit === 'cover' ? 1 : 0.78)
    const imageWidth = fit === 'cover'
      ? Math.max(fitWidth, fitHeight * imageAspect)
      : Math.min(fitWidth, fitHeight * imageAspect)
    const imageHeight = imageWidth / imageAspect
    const positionX = imagePositionX ?? (fit === 'cover' && window.innerWidth <= 640 ? 0.58 : 0.5)
    const horizontalOffset = (viewport.width - imageWidth) * (positionX - 0.5)

    // Sample every second pixel so the image details form a light point texture.
    for (let y = 0; y < sampleHeight; y += 2) {
      for (let x = 0; x < SAMPLE_WIDTH; x += 2) {
        const pixel = (y * SAMPLE_WIDTH + x) * 4
        const brightness = (pixels[pixel] + pixels[pixel + 1] + pixels[pixel + 2]) / (3 * 255)
        const normalizedX = x / (SAMPLE_WIDTH - 1)
        const normalizedY = y / (sampleHeight - 1)

        positions.push(
          (normalizedX - 0.5) * imageWidth + horizontalOffset,
          (0.5 - normalizedY) * imageHeight,
          (brightness - 0.5) * 0.12,
        )

        // Keep dark sampled areas visible as fine points instead of empty patches.
        const shade = 0.14 + Math.pow(brightness, 1.6) * 0.8
        shades.push(shade, shade, shade, 1)
      }
    }

    const result = new BufferGeometry()
    result.setAttribute('position', new Float32BufferAttribute(positions, 3))
    result.setAttribute('color', new Float32BufferAttribute(shades, 4))
    return result
  }, [texture, viewport.width, viewport.height, fit, imagePositionX])

  useFrame((state, delta) => {
    if (!pointsRef.current) return

    // Pointer input nudges only the overlay, with small targets and smooth damping.
    target.current.x = state.pointer.x * 0.025
    target.current.y = state.pointer.y * 0.018
    const easing = 1 - Math.exp(-delta * 3)

    pointer.current.x += (target.current.x - pointer.current.x) * easing
    pointer.current.y += (target.current.y - pointer.current.y) * easing
    pointsRef.current.position.x = pointer.current.x
    pointsRef.current.position.y = pointer.current.y
    pointsRef.current.rotation.y = pointer.current.x * 0.025
    pointsRef.current.rotation.x = -pointer.current.y * 0.015
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        vertexColors
        size={0.018}
        sizeAttenuation
        transparent
        opacity={strength}
        depthWrite={false}
      />
    </points>
  )
}

// A transparent canvas can be layered over either the hero photo or the standalone photo.
export default function PhotoParticleLayer({ fit = 'contain', imagePositionX, strength = 0.24 }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <PortraitParticles fit={fit} imagePositionX={imagePositionX} strength={strength} />
    </Canvas>
  )
}
