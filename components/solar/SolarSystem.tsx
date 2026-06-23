'use client'
// Renders Sun + all Planets (with nested Satellites) + orbit paths.
// Receives all interaction state from SolarSystemScene.

import { useRef } from 'react'
import * as THREE from 'three'
import { useSolarLayout } from '@/lib/use-solar-layout'
import { colors } from '@/lib/tokens'
import Sun from './Sun'
import Planet from './Planet'
import OrbitPath from './OrbitPath'
import Starfield from './Starfield'
import Comets from './Comets'
import SpaceDebris from './SpaceDebris'
import SpaceStation from './SpaceStation'

interface SolarSystemProps {
  achievedIds: Set<string>
  ignitingPlanetId: string | null
  dockingSatId: string | null
  sunReactCount: number
  onIgniteComplete: (id: string) => void
  onPlanetDoubleClick: (id: string) => void
  onPlanetClick: (id: string) => void
  onSatDoubleClick: (id: string) => void
  onSatClick: (id: string) => void
  onSatDockComplete: (planetId: string) => void
  onSatReturnComplete: () => void
  onAchievementPulse: () => void
  onHoverChange: (h: boolean) => void
  driftOffset: React.MutableRefObject<THREE.Vector3>
}

export default function SolarSystem({
  achievedIds,
  ignitingPlanetId,
  dockingSatId,
  sunReactCount,
  onIgniteComplete,
  onPlanetDoubleClick,
  onPlanetClick,
  onSatDoubleClick,
  onSatClick,
  onSatDockComplete,
  onSatReturnComplete,
  onAchievementPulse,
  onHoverChange,
  driftOffset,
}: SolarSystemProps) {
  const layout = useSolarLayout()

  return (
    <group>
      {/* ── Background (drifts with offset) ─────────────── */}
      <Starfield driftOffset={driftOffset} />
      <SpaceDebris driftOffset={driftOffset} />
      <SpaceStation />
      <Comets />

      {/* ── Orbit paths (sun space) ──────────────────────── */}
      {layout.planets.map(pl => (
        <OrbitPath
          key={`op-${pl.node.id}`}
          radius={pl.orbitRadius}
          inclination={pl.inclination}
          color={colors.orbits[pl.node.orbitIdx % colors.orbits.length]}
          opacity={0.12}
        />
      ))}

      {/* ── Sun ─────────────────────────────────────────── */}
      <Sun
        reactCount={sunReactCount}
        onDoubleClick={() => {/* sun itself not achievable */}}
        onSingleClick={() => {}}
      />

      {/* ── Planets ─────────────────────────────────────── */}
      {layout.planets.map(pl => (
        <Planet
          key={pl.node.id}
          layout={pl}
          achievedIds={achievedIds}
          dockingId={dockingSatId}
          igniting={ignitingPlanetId === pl.node.id}
          onIgniteComplete={() => onIgniteComplete(pl.node.id)}
          onDoubleClick={() => onPlanetDoubleClick(pl.node.id)}
          onSingleClick={() => onPlanetClick(pl.node.id)}
          onSatDoubleClick={onSatDoubleClick}
          onSatSingleClick={onSatClick}
          onSatDockComplete={() => onSatDockComplete(pl.node.id)}
          onSatReturnComplete={onSatReturnComplete}
          onAchievementPulse={onAchievementPulse}
          onHoverChange={onHoverChange}
        />
      ))}
    </group>
  )
}
