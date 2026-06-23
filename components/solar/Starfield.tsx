'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const STAR_COUNT = 2800
const BOX = 120  // wrap boundary

export default function Starfield({ driftOffset }: { driftOffset: React.MutableRefObject<THREE.Vector3> }) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3)
    const col = new Float32Array(STAR_COUNT * 3)
    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3
      pos[i3]   = (Math.random() - 0.5) * BOX
      pos[i3+1] = (Math.random() - 0.5) * BOX
      pos[i3+2] = (Math.random() - 0.5) * BOX
      // Slight colour variation: mostly white, occasional warm/cool tints
      const tint = Math.random()
      if (tint < 0.15) {
        col[i3] = 0.8; col[i3+1] = 0.85; col[i3+2] = 1.0  // blue-white
      } else if (tint < 0.28) {
        col[i3] = 1.0; col[i3+1] = 0.88; col[i3+2] = 0.65  // warm
      } else {
        col[i3] = 1.0; col[i3+1] = 1.0; col[i3+2] = 1.0
      }
    }
    return { positions: pos, colors: col }
  }, [])

  useFrame(() => {
    if (!pointsRef.current) return
    const geo = pointsRef.current.geometry
    const pos = geo.attributes.position.array as Float32Array
    const off = driftOffset.current
    const half = BOX / 2

    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3
      // Apply drift and wrap
      let x = positions[i3]   - off.x
      let y = positions[i3+1] - off.y
      let z = positions[i3+2] - off.z
      // Wrap each axis
      if (x >  half) x -= BOX; else if (x < -half) x += BOX
      if (y >  half) y -= BOX; else if (y < -half) y += BOX
      if (z >  half) z -= BOX; else if (z < -half) z += BOX
      pos[i3] = x; pos[i3+1] = y; pos[i3+2] = z
    }
    geo.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        vertexColors
        transparent
        opacity={0.88}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
