'use client'
// Artificial satellite — NOT a moon.
// Built from box+cylinder primitives (solar panels, body, dish).
// Docking animation: booster → fly to planet → planet gold pulse → return to orbit.

import { useRef, useState, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { colors, fonts } from '@/lib/tokens'
import type { SatelliteLayout } from '@/lib/use-solar-layout'

const tmpV = new THREE.Vector3()

interface SatelliteProps {
  layout: SatelliteLayout
  achieved: boolean
  docking: boolean               // triggered by parent on achieve confirm
  onDockComplete: () => void    // called when satellite reaches planet → trigger planet gold
  onReturnComplete: () => void  // called when returned to orbit
  planetSize: number
  onDoubleClick: () => void
  onSingleClick: () => void
  onHoverChange?: (h: boolean) => void  // propagates up to stop autoRotate
}

type DockPhase = 'orbit' | 'boost' | 'dock' | 'return'

const DOCK_SPEED   = 1.2
const RETURN_SPEED = 0.8
const BOOST_TIME   = 0.4

export default function Satellite({
  layout,
  achieved,
  docking,
  onDockComplete,
  onReturnComplete,
  planetSize,
  onDoubleClick,
  onSingleClick,
  onHoverChange,
}: SatelliteProps) {
  const groupRef   = useRef<THREE.Group>(null)
  const bodyRef    = useRef<THREE.Mesh>(null)
  const panelMatL  = useRef<THREE.MeshStandardMaterial>(null)
  const panelMatR  = useRef<THREE.MeshStandardMaterial>(null)
  const boosterRef = useRef<THREE.Mesh>(null)
  const boosterMat = useRef<THREE.MeshStandardMaterial>(null)

  const [phase, setPhase] = useState<DockPhase>('orbit')
  const dockT = useRef(0)
  const boostT = useRef(0)
  // hoveredRef: used in useFrame to avoid stale closure
  const hoveredRef = useRef(false)
  // hovered state: drives label re-render
  const [hovered, setHovered] = useState(false)
  const orbitAngle = useRef(layout.phase0)

  // Orbit position (planet-local, Z toward sun reference)
  const orbitPos = useCallback((angle: number): THREE.Vector3 => {
    return new THREE.Vector3(
      Math.cos(angle) * layout.orbitRadius,
      0,
      Math.sin(angle) * layout.orbitRadius,
    )
  }, [layout.orbitRadius])

  const dockTarget = useMemo3(() => new THREE.Vector3(0, 0, planetSize + 0.18), [planetSize])

  useEffect(() => {
    if (docking && phase === 'orbit') {
      setPhase('boost')
      boostT.current = 0
      dockT.current = 0
    }
  }, [docking, phase])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    if (phase === 'orbit') {
      // Pause orbit while hovered so user can click
      if (!hoveredRef.current) {
        orbitAngle.current += layout.orbitSpeed * delta
      }
      const pos = orbitPos(orbitAngle.current)
      groupRef.current.position.copy(pos)
      if (bodyRef.current) bodyRef.current.rotation.y += layout.spinSpeed * delta

    } else if (phase === 'boost') {
      boostT.current += delta
      // Booster thruster glow
      if (boosterRef.current && boosterMat.current) {
        boosterRef.current.visible = true
        boosterMat.current.emissiveIntensity = 2.0 + Math.sin(boostT.current * 18) * 0.8
      }
      // Keep orbiting during boost windup
      orbitAngle.current += layout.orbitSpeed * delta * 0.5
      groupRef.current.position.copy(orbitPos(orbitAngle.current))
      if (boostT.current >= BOOST_TIME) {
        setPhase('dock')
        dockT.current = 0
      }

    } else if (phase === 'dock') {
      dockT.current = Math.min(1, dockT.current + delta * DOCK_SPEED)
      const ease = dockT.current < 0.5
        ? 4 * dockT.current ** 3
        : 1 - (-2 * dockT.current + 2) ** 3 / 2
      groupRef.current.position.lerpVectors(
        orbitPos(orbitAngle.current), dockTarget, ease
      )
      if (dockT.current >= 1) {
        onDockComplete()
        setPhase('return')
        dockT.current = 0
      }

    } else if (phase === 'return') {
      dockT.current = Math.min(1, dockT.current + delta * RETURN_SPEED)
      const ease = dockT.current < 0.5
        ? 4 * dockT.current ** 3
        : 1 - (-2 * dockT.current + 2) ** 3 / 2
      const returnTarget = orbitPos(orbitAngle.current)
      groupRef.current.position.lerpVectors(dockTarget, returnTarget, ease)
      if (dockT.current >= 1) {
        if (boosterRef.current) boosterRef.current.visible = false
        setPhase('orbit')
        onReturnComplete()
      }
    }

    // Achieved tint on solar panels
    const goldFactor = achieved ? 1 : 0
    const panelCol = achieved
      ? new THREE.Color(1.0, 0.78, 0.15)
      : new THREE.Color(0.12, 0.55, 0.88)
    if (panelMatL.current) {
      panelMatL.current.color.lerp(panelCol, 0.06)
      panelMatL.current.emissiveIntensity = goldFactor * 0.4
    }
    if (panelMatR.current) {
      panelMatR.current.color.lerp(panelCol, 0.06)
      panelMatR.current.emissiveIntensity = goldFactor * 0.4
    }
  })

  const accentCol = colors.orbits[(layout.node.orbitIdx ?? 0) % colors.orbits.length]

  const handlePointerOver = useCallback(() => {
    hoveredRef.current = true
    setHovered(true)
    onHoverChange?.(true)
    document.body.style.cursor = 'pointer'
  }, [onHoverChange])

  const handlePointerOut = useCallback(() => {
    hoveredRef.current = false
    setHovered(false)
    onHoverChange?.(false)
    document.body.style.cursor = 'auto'
  }, [onHoverChange])

  return (
    <group ref={groupRef}>
      {/* Satellite body — small box */}
      <mesh ref={bodyRef}>
        <boxGeometry args={[layout.size * 0.9, layout.size * 0.7, layout.size * 1.1]} />
        <meshStandardMaterial
          color={achieved ? '#ffcc44' : '#888ca0'}
          emissive={achieved ? '#ffcc44' : accentCol}
          emissiveIntensity={achieved ? 0.6 : 0.15}
          roughness={0.35}
          metalness={0.75}
        />
      </mesh>

      {/* Solar panel — left */}
      <mesh position={[-layout.size * 1.1, 0, 0]}>
        <boxGeometry args={[layout.size * 1.2, layout.size * 0.07, layout.size * 0.55]} />
        <meshStandardMaterial
          ref={panelMatL}
          color="#1255aa"
          emissive="#1255aa"
          emissiveIntensity={0.2}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Solar panel — right */}
      <mesh position={[layout.size * 1.1, 0, 0]}>
        <boxGeometry args={[layout.size * 1.2, layout.size * 0.07, layout.size * 0.55]} />
        <meshStandardMaterial
          ref={panelMatR}
          color="#1255aa"
          emissive="#1255aa"
          emissiveIntensity={0.2}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Antenna dish — small cylinder + tiny sphere */}
      <group position={[0, layout.size * 0.55, 0]}>
        <mesh>
          <cylinderGeometry args={[0.003, layout.size * 0.15, layout.size * 0.3, 8]} />
          <meshStandardMaterial color="#cccccc" roughness={0.4} metalness={0.8} />
        </mesh>
        <mesh position={[0, layout.size * 0.22, 0]} rotation={[Math.PI / 6, 0, 0]}>
          <cylinderGeometry args={[layout.size * 0.18, layout.size * 0.14, layout.size * 0.06, 12]} />
          <meshStandardMaterial color="#ddddee" roughness={0.15} metalness={0.9} />
        </mesh>
      </group>

      {/* Booster thruster — hidden except during dock anim */}
      <mesh
        ref={boosterRef}
        position={[0, -layout.size * 0.55, 0]}
        visible={false}
      >
        <coneGeometry args={[layout.size * 0.18, layout.size * 0.55, 8]} />
        <meshStandardMaterial
          ref={boosterMat}
          color="#ff6600"
          emissive="#ff4400"
          emissiveIntensity={2.5}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Satellite name label — always visible, emphasised on hover */}
      <Html
        center
        distanceFactor={14}
        position={[0, layout.size * 1.6 + 0.2, 0]}
        style={{
          color: hovered ? '#ffffff' : achieved ? '#ffcc44cc' : '#e8e8f5aa',
          fontSize: hovered ? '12px' : '11px',
          fontWeight: 600,
          fontFamily: fonts.body,
          background: hovered ? 'rgba(0,0,0,0.82)' : 'rgba(0,0,0,0.45)',
          padding: '2px 6px',
          borderRadius: '8px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          transition: 'font-size 0.15s, background 0.15s',
          textShadow: achieved ? '0 0 8px #ffcc44' : undefined,
          lineHeight: 1.4,
          textAlign: 'center',
        }}
      >
        <div>{layout.node.label}{achieved && ' ✦'}</div>
        {layout.progressLabel && (
          <div style={{ fontSize: '9px', fontFamily: fonts.display, color: accentCol, opacity: 0.85 }}>
            {layout.progressLabel}
          </div>
        )}
      </Html>

      {/* Invisible hit target — enlarged for easier click */}
      <mesh
        visible={false}
        onClick={() => { onSingleClick() }}
        onDoubleClick={() => { onDoubleClick() }}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[Math.max(layout.size * 4, 0.45), 8, 8]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  )
}

// Minimal useMemo replacement without deps array mismatch warning in this context
function useMemo3<T>(fn: () => T, _deps: unknown[]): T {
  const ref = useRef<T | null>(null)
  if (ref.current === null) ref.current = fn()
  return ref.current
}
