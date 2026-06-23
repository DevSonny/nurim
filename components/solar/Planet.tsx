'use client'
// Planet — orbit node rendered as a procedural GLSL sphere.
// Children: OrbitPath, Ring (if ringed), label, Satellites.

import { useRef, useState, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import { colors, fonts } from '@/lib/tokens'
import '@/lib/solar-shaders'
import type { PlanetMaterial, RingMaterial } from '@/lib/solar-shaders'
import type { PlanetLayout, SatelliteLayout } from '@/lib/use-solar-layout'
import OrbitPath from './OrbitPath'
import Satellite from './Satellite'

const ARCHETYPE_INT: Record<string, number> = {
  gas: 0, rocky: 1, ringed: 2, alien: 3, ice: 4,
}

// ── Progress arc (partial ring showing goal completion) ───────────────────────

function ProgressArc({ size, pct, color }: { size: number; pct: number; color: string }) {
  const radius = size * 1.55
  const SEGMENTS = 64
  const count = Math.max(2, Math.ceil(pct * SEGMENTS))
  const points: [number, number, number][] = []
  for (let i = 0; i <= count; i++) {
    const angle = (i / SEGMENTS) * Math.PI * 2 - Math.PI / 2
    // XZ plane (horizontal, facing up)
    points.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius])
  }
  return (
    <Line
      points={points}
      color={color}
      lineWidth={2.5}
      transparent
      opacity={0.8}
    />
  )
}

// Orbit-position helper (world space, inclined)
function orbitPos(
  radius: number, angle: number, inclination: number
): THREE.Vector3 {
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius
  return new THREE.Vector3(x, z * Math.sin(inclination), z * Math.cos(inclination))
}

interface PlanetProps {
  layout: PlanetLayout
  achievedIds: Set<string>
  dockingId: string | null      // satellite id currently docking
  igniting: boolean             // planet itself is achieving
  onIgniteComplete: () => void
  onDoubleClick: () => void
  onSingleClick: () => void
  onSatDoubleClick: (satId: string) => void
  onSatSingleClick: (satId: string) => void
  onSatDockComplete: () => void
  onSatReturnComplete: () => void
  // lets SolarSystemScene boost sun on any achievement
  onAchievementPulse: () => void
  onHoverChange?: (h: boolean) => void
}

type IgnitePhase = 'idle' | 'burst' | 'settle'

export default function Planet({
  layout,
  achievedIds,
  dockingId,
  igniting,
  onIgniteComplete,
  onDoubleClick,
  onSingleClick,
  onSatDoubleClick,
  onSatSingleClick,
  onSatDockComplete,
  onSatReturnComplete,
  onAchievementPulse,
  onHoverChange,
}: PlanetProps) {
  const revGroupRef = useRef<THREE.Group>(null)  // orbital revolution group
  const meshRef     = useRef<THREE.Mesh>(null)
  const matRef      = useRef<InstanceType<typeof PlanetMaterial>>(null)
  const ringMatRef  = useRef<InstanceType<typeof RingMaterial>>(null)
  const flashRingRef = useRef<THREE.Mesh>(null)
  const flashMat    = useRef<THREE.MeshBasicMaterial>(null)
  const hovered     = useRef(false)
  const orbitAngle  = useRef(layout.phase0)
  const pulseT      = useRef(0)

  const [ignitePhase, setIgnitePhase] = useState<IgnitePhase>(
    achievedIds.has(layout.node.id) ? 'settle' : 'idle'
  )
  const igniteT = useRef(achievedIds.has(layout.node.id) ? 1 : 0)

  useEffect(() => {
    if (igniting && ignitePhase === 'idle') {
      setIgnitePhase('burst')
      igniteT.current = 0
    }
  }, [igniting, ignitePhase])

  const { archetype } = layout
  const accentColor = colors.orbits[layout.node.orbitIdx % colors.orbits.length]
  const planetAchieved = achievedIds.has(layout.node.id)

  useFrame((state, delta) => {
    // Advance orbit
    orbitAngle.current += layout.orbitSpeed * delta
    const pos = orbitPos(layout.orbitRadius, orbitAngle.current, layout.inclination)
    revGroupRef.current?.position.copy(pos)

    if (!matRef.current || !meshRef.current) return

    // Drive uTime
    matRef.current.uTime += delta

    // Pulse bump (single-click)
    if (pulseT.current > 0) pulseT.current = Math.max(0, pulseT.current - delta * 2)

    // ── Ignite animation ───────────────────────────────────
    if (ignitePhase === 'burst') {
      igniteT.current = Math.min(1, igniteT.current + delta * 2.2)
      // Elastic overshoot: 1→2.5→1.1 (burst), then settle at 1.05
      const bt = igniteT.current
      const elastic = bt < 0.5
        ? 1 + bt / 0.5 * 1.5                // 1 → 2.5
        : 2.5 - (bt - 0.5) / 0.5 * 1.4     // 2.5 → 1.1
      meshRef.current.scale.setScalar(elastic)
      matRef.current.uAchieveGold = Math.min(1, bt * 2)
      if (ringMatRef.current) ringMatRef.current.uAchieveGold = Math.min(1, bt * 2)

      // Flash ring expands and fades
      if (flashRingRef.current && flashMat.current) {
        flashRingRef.current.scale.setScalar(1 + bt * 5)
        flashMat.current.opacity = (1 - bt) * 0.8
        flashRingRef.current.visible = true
      }

      if (igniteT.current >= 1) {
        setIgnitePhase('settle')
        onIgniteComplete()
        onAchievementPulse()
      }

    } else if (ignitePhase === 'settle') {
      // Ease to 1.05 (slightly bigger to show it's done)
      matRef.current.uAchieveGold = 1
      if (ringMatRef.current) ringMatRef.current.uAchieveGold = 1
      if (flashRingRef.current) flashRingRef.current.visible = false
      meshRef.current.scale.lerp(new THREE.Vector3(1.05, 1.05, 1.05), 0.08)

    } else {
      // Normal idle/hover scale
      const hoverBump = hovered.current ? 0.08 : 0
      const pulseBump = pulseT.current * 0.22
      const target = 1 + hoverBump + pulseBump
      meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.14)
    }

    // Axial spin
    meshRef.current.rotation.y += layout.spinSpeed * delta * 0.25
  })

  const { colA, colB, colC, glow } = archetype

  const handleDockComplete = useCallback(() => {
    onSatDockComplete()
  }, [onSatDockComplete])

  return (
    <group ref={revGroupRef}>
      {/* Orbit path (in SUN space, but drawn as child — translated with planet, doesn't matter for orbit path which is in sun space) */}
      {/* We draw orbit paths separately in SolarSystem for sun-space rendering */}

      {/* Flash ring — visible during burst only */}
      <mesh ref={flashRingRef} visible={false} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[layout.size * 0.9, layout.size * 1.15, 48]} />
        <meshBasicMaterial
          ref={flashMat}
          color={accentColor}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Progress arc — shows pct of goal as partial ring in XZ plane */}
      {layout.progressPct > 0.01 && (
        <ProgressArc
          size={layout.size}
          pct={layout.progressPct}
          color={accentColor}
        />
      )}

      {/* Planet body */}
      <mesh
        ref={meshRef}
        onClick={() => { pulseT.current = 1; onSingleClick() }}
        onDoubleClick={onDoubleClick}
        onPointerOver={() => { hovered.current = true; onHoverChange?.(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { hovered.current = false; onHoverChange?.(false); document.body.style.cursor = 'auto' }}
      >
        <sphereGeometry args={[layout.size, 48, 48]} />
        <planetMaterial
          ref={matRef}
          uTime={0}
          uArchetype={ARCHETYPE_INT[archetype.archetype] ?? 0}
          uSeed={archetype.seed}
          uColA={new THREE.Color(...colA)}
          uColB={new THREE.Color(...colB)}
          uColC={new THREE.Color(...colC)}
          uGlow={new THREE.Color(...glow)}
          uBandFreq={archetype.bandFreq}
          uSpinDir={archetype.spinDir}
          uAchieveGold={planetAchieved ? 1 : 0}
          uLightDir={new THREE.Vector3(0, 0, 0).normalize()}
          uQuality={5}
        />
      </mesh>

      {/* Saturn ring */}
      {archetype.hasRing && (
        <mesh rotation={[Math.PI * 0.1, 0, Math.PI * 0.05]}>
          <ringGeometry args={[layout.size * 1.35, layout.size * 2.1, 64]} />
          <ringMaterial
            ref={ringMatRef}
            uRingCol={new THREE.Color(...colC)}
            uAchieveGold={planetAchieved ? 1 : 0}
            transparent
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Satellite orbit paths (planet-local space) */}
      {layout.satellites.map(sat => (
        <mesh
          key={`op-${sat.node.id}`}
          rotation={[0, 0, 0]}
        >
          {/* Draw orbit path as Line in planet local */}
          <OrbitPath
            radius={sat.orbitRadius}
            inclination={0}
            color={accentColor}
            opacity={0.1}
            segments={48}
          />
        </mesh>
      ))}

      {/* Satellites */}
      {layout.satellites.map(sat => (
        <Satellite
          key={sat.node.id}
          layout={sat}
          achieved={achievedIds.has(sat.node.id)}
          docking={dockingId === sat.node.id}
          onDockComplete={handleDockComplete}
          onReturnComplete={onSatReturnComplete}
          planetSize={layout.size}
          onDoubleClick={() => onSatDoubleClick(sat.node.id)}
          onSingleClick={() => onSatSingleClick(sat.node.id)}
          onHoverChange={onHoverChange}
        />
      ))}

      {/* Planet label */}
      <Html
        center
        distanceFactor={14}
        position={[0, -(layout.size + 0.32), 0]}
        style={{
          color: planetAchieved ? '#ffcc44' : '#e8e8f5',
          fontSize: '13px',
          fontWeight: 700,
          fontFamily: fonts.body,
          background: 'rgba(0,0,0,0.72)',
          padding: '3px 9px',
          borderRadius: '10px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          letterSpacing: '0.2px',
          textShadow: planetAchieved ? '0 0 10px #ffcc44' : undefined,
          lineHeight: 1.4,
          textAlign: 'center',
        }}
      >
        <div>{layout.node.label}{planetAchieved && ' ✦'}</div>
        {layout.progressLabel && (
          <div style={{ fontSize: '10px', fontFamily: fonts.display, color: accentColor, opacity: 0.9 }}>
            {layout.progressLabel}
          </div>
        )}
      </Html>
    </group>
  )
}
