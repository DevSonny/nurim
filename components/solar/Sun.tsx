'use client'
import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
// Import to register extend — must run before first render
import '@/lib/solar-shaders'
import type { SunMaterial } from '@/lib/solar-shaders'

interface SunProps {
  reactCount: number  // incremented on each achievement → triggers flash
  onDoubleClick?: () => void
  onSingleClick?: () => void
}

export default function Sun({ reactCount, onDoubleClick, onSingleClick }: SunProps) {
  const matRef  = useRef<InstanceType<typeof SunMaterial>>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const reactT  = useRef(0)
  const prevCount = useRef(reactCount)
  const hovered = useRef(false)
  const pulseT  = useRef(0)

  useEffect(() => {
    if (reactCount !== prevCount.current) {
      prevCount.current = reactCount
      reactT.current = 1
    }
  }, [reactCount])

  useFrame((state, delta) => {
    if (!matRef.current || !meshRef.current) return
    matRef.current.uTime += delta

    // Fade down react flash
    if (reactT.current > 0) reactT.current = Math.max(0, reactT.current - delta * 2.0)
    matRef.current.uReact = reactT.current

    // Gentle self-pulse + hover
    if (pulseT.current > 0) pulseT.current = Math.max(0, pulseT.current - delta * 1.8)
    const hoverBump = hovered.current ? 0.06 : 0
    const pulseBump = pulseT.current * 0.10
    const reactBump = reactT.current * 0.22
    const target = 1 + hoverBump + pulseBump + reactBump
    meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.14)
  })

  return (
    <group>
      {/* Corona (larger, additive sphere behind main body) */}
      <mesh>
        <sphereGeometry args={[0.72, 32, 32]} />
        <meshBasicMaterial
          color="#ffaa22"
          transparent
          opacity={0.18}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Sun body */}
      <mesh
        ref={meshRef}
        onClick={() => { pulseT.current = 1; onSingleClick?.() }}
        onDoubleClick={onDoubleClick}
        onPointerOver={() => { hovered.current = true; document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { hovered.current = false; document.body.style.cursor = 'auto' }}
      >
        <sphereGeometry args={[0.52, 48, 48]} />
        <sunMaterial ref={matRef} uTime={0} uReact={0} />
      </mesh>

      {/* Point light at sun origin */}
      <pointLight intensity={3.5} color="#fff0cc" distance={80} decay={1.2} />
      <pointLight intensity={1.2} color="#ffaa44" distance={30} decay={2} />

      {/* Label */}
      <Html
        center
        distanceFactor={14}
        position={[0, -0.76, 0]}
        style={{
          color: '#e8e8f5',
          fontSize: '14px',
          fontWeight: 800,
          fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif",
          background: 'rgba(0,0,0,0.62)',
          padding: '2px 9px',
          borderRadius: '10px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          letterSpacing: '0.2px',
          textShadow: '0 0 8px #00eeff',
        }}
      >
        나
      </Html>
    </group>
  )
}
