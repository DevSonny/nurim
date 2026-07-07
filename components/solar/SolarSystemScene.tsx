'use client'
// Root Canvas component. Owns interaction state machine.
// ssr:false guaranteed by index.tsx dynamic import.

import { useRef, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { useGraph } from '@/lib/use-data'
import { api } from '@/lib/api-client'
import { useIsDesktop } from '@/lib/use-media'
import AchievementToast from './AchievementToast'
import SolarSystem from './SolarSystem'

// ── Galaxy drift (lives inside Canvas so it has useFrame) ──────────────────

function GalaxyDrift({ driftRef }: { driftRef: React.MutableRefObject<THREE.Vector3> }) {
  const time = useRef(0)
  useFrame((_, delta) => {
    time.current += delta
    const t = time.current
    // Smooth sine steering — feels like a long, gentle curve through space
    driftRef.current.x += Math.sin(t * 0.07) * 1.8 * delta
    driftRef.current.y += Math.sin(t * 0.05 + 1.2) * 0.6 * delta
    driftRef.current.z += Math.cos(t * 0.04) * 2.2 * delta
  })
  return null
}

// ── Camera reset when desktop breakpoint changes ───────────────────────────

function CameraInit({
  isDesktop,
  orbitRef,
}: {
  isDesktop: boolean
  orbitRef: React.MutableRefObject<OrbitControlsImpl | null>
}) {
  useEffect(() => {
    const ctrl = orbitRef.current
    if (!ctrl) return
    ctrl.object.position.set(0, isDesktop ? 5 : 6, isDesktop ? 13 : 18)
    ctrl.update()
  }, [isDesktop, orbitRef])
  return null
}

// ── Main scene ─────────────────────────────────────────────────────────────

export default function SolarSystemScene() {
  const { nodes, mutate } = useGraph()
  const achievedIds = new Set(nodes.filter(n => n.achievedAt).map(n => n.id))

  const [pendingId, setPendingId] = useState<string | null>(null)
  const [ignitingPlanetId, setIgnitingPlanetId] = useState<string | null>(null)
  const [dockingSatId, setDockingSatId] = useState<string | null>(null)
  const [sunReactCount, setSunReactCount] = useState(0)
  const [quality, setQuality] = useState<'high' | 'med' | 'low'>('high')
  const [hovering, setHovering] = useState(false)

  const driftOffset = useRef(new THREE.Vector3(0, 0, 0))
  const orbitRef = useRef<OrbitControlsImpl | null>(null)
  const isDesktop = useIsDesktop()

  useEffect(() => {
    return () => { document.body.style.cursor = 'auto' }
  }, [])

  // Look up pending node for the toast
  const pendingNode = pendingId ? nodes.find(n => n.id === pendingId) : null

  const handleConfirm = useCallback(() => {
    if (!pendingId) return
    const id = pendingId
    const node = nodes.find(n => n.id === id)
    setPendingId(null)

    api.nodes.achieve(id, true).then(() => mutate())

    if (node?.type === 'orbit') {
      setIgnitingPlanetId(id)
    } else if (node?.type === 'sub') {
      setDockingSatId(id)
    }
  }, [pendingId, nodes, mutate])

  const handleCancel = useCallback(() => setPendingId(null), [])

  const handlePlanetDoubleClick = useCallback((id: string) => {
    if (pendingId || achievedIds.has(id)) return
    setPendingId(id)
  }, [pendingId, achievedIds])

  const handleSatDoubleClick = useCallback((id: string) => {
    if (pendingId || achievedIds.has(id)) return
    setPendingId(id)
  }, [pendingId, achievedIds])

  const handleIgniteComplete = useCallback((_id: string) => {
    setIgnitingPlanetId(null)
  }, [])

  const handleSatDockComplete = useCallback((_planetId: string) => {
    // Planet gold pulse triggered inside Planet.tsx
    setSunReactCount(c => c + 1)
  }, [])

  const handleSatReturnComplete = useCallback(() => {
    setDockingSatId(null)
  }, [])

  const handleAchievementPulse = useCallback(() => {
    setSunReactCount(c => c + 1)
  }, [])

  // Quality from PerformanceMonitor
  const handleDecline = useCallback(() => {
    setQuality(q => q === 'high' ? 'med' : 'low')
  }, [])

  const bloomIntensity = quality === 'low' ? 0.8 : quality === 'med' ? 1.1 : isDesktop ? 1.6 : 1.4
  const dpr: [number, number] = quality === 'low' ? [0.8, 1.2] : quality === 'med' ? [1, 1.5] : [1, 2]

  return (
    <>
      <Canvas
        camera={{ position: [0, 6, 18], fov: 50 }}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
        dpr={dpr}
        style={{ position: 'absolute', inset: 0 }}
      >
        <AdaptiveDpr pixelated />
        <PerformanceMonitor
          onDecline={handleDecline}
        />

        <ambientLight intensity={0.08} />

        <OrbitControls
          ref={orbitRef}
          enablePan={false}
          minDistance={isDesktop ? 4 : 5}
          maxDistance={isDesktop ? 22 : 28}
          dampingFactor={0.08}
          enableDamping
          autoRotate={!hovering}
          autoRotateSpeed={0.35}
        />

        <CameraInit isDesktop={isDesktop} orbitRef={orbitRef} />

        <GalaxyDrift driftRef={driftOffset} />

        <SolarSystem
          achievedIds={achievedIds}
          ignitingPlanetId={ignitingPlanetId}
          dockingSatId={dockingSatId}
          sunReactCount={sunReactCount}
          onIgniteComplete={handleIgniteComplete}
          onPlanetDoubleClick={handlePlanetDoubleClick}
          onPlanetClick={handlePlanetDoubleClick}
          onSatDoubleClick={handleSatDoubleClick}
          onSatClick={handleSatDoubleClick}
          onSatDockComplete={handleSatDockComplete}
          onSatReturnComplete={handleSatReturnComplete}
          onAchievementPulse={handleAchievementPulse}
          onHoverChange={setHovering}
          driftOffset={driftOffset}
        />

        <EffectComposer>
          <Bloom
            intensity={bloomIntensity}
            luminanceThreshold={0.22}
            luminanceSmoothing={0.85}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>

      {pendingNode && (
        <AchievementToast
          nodeLabel={pendingNode.label}
          nodeType={pendingNode.type as 'orbit' | 'sub'}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  )
}
