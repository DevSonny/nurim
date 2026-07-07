'use client'
import { useMemo } from 'react'
import { useGraph } from './use-data'
import type { Node } from './use-data'
import { getPlanetArchetype } from './planet-archetype'
import type { PlanetArchetype } from './planet-archetype'
import { h01 } from './hash'
import { nodeBaseRadius } from './tokens'
import { getProgress } from './aggregate'

const TAU = Math.PI * 2
const R0 = 3.2        // innermost orbit radius
const GAP = 1.65      // spacing between orbits
const SPEED_BASE = 0.42  // Kepler-ish base speed

// ── types ─────────────────────────────────────────────────────────────────────

export interface SatelliteLayout {
  node: Node
  orbitRadius: number
  orbitSpeed: number
  phase0: number
  spinSpeed: number
  size: number
  satIndex: number
  progressPct: number          // 0-1 from getProgress
  progressLabel?: string       // e.g. "35/100km" — only when hasGoal
}

export interface PlanetLayout {
  node: Node
  archetype: PlanetArchetype
  orbitRadius: number
  orbitSpeed: number
  phase0: number
  inclination: number   // tilt of orbital plane (radians, around X)
  spinSpeed: number
  size: number
  satellites: SatelliteLayout[]
  progressPct: number          // 0-1 from getProgress
  progressLabel?: string       // e.g. "35/100km" — only when hasGoal
}

export interface SolarLayout {
  core: Node | null
  planets: PlanetLayout[]
}

// ── hook ──────────────────────────────────────────────────────────────────────

export function useSolarLayout(): SolarLayout {
  const { nodes, pulses } = useGraph()

  return useMemo(() => {
    const core = nodes.find(n => n.type === 'core') ?? null
    const orbitNodes = nodes.filter(n => n.type === 'orbit')
    const subNodes   = nodes.filter(n => n.type === 'sub')

    const planets: PlanetLayout[] = orbitNodes.map(node => {
      const seed = h01(node.id)
      const idx  = node.orbitIdx

      const orbitRadius = R0 + idx * GAP
      const orbitSpeed  = SPEED_BASE / Math.sqrt(orbitRadius)  // inner planets faster
      const phase0      = (idx / Math.max(orbitNodes.length, 1)) * TAU + seed * 0.5
      const inclination = (seed - 0.5) * 0.28
      const spinSpeed   = 0.28 + seed * 0.44

      // Progress-based size scaling — grows with accumulated pulses
      const prog = getProgress(nodes as any, pulses as any, node.id)
      const baseSize = nodeBaseRadius.orbit * (0.82 + seed * 0.42)
      const size     = baseSize * (1 + 0.35 * prog.pct)
      const progressLabel = prog.hasGoal
        ? `${prog.current}/${prog.target}${prog.unit}`
        : undefined

      const mySubNodes = subNodes.filter(s => s.parentId === node.id)

      const satellites: SatelliteLayout[] = mySubNodes.map((sub, si) => {
        const ss = h01(sub.id)
        const subProg = getProgress(nodes as any, pulses as any, sub.id)
        const subBaseSize = nodeBaseRadius.sub * (1.1 + ss * 0.3)
        const subSize = subBaseSize * (1 + 0.35 * subProg.pct)
        return {
          node: sub,
          orbitRadius: size + 0.52 + si * 0.36,
          orbitSpeed:  orbitSpeed * (2.2 + ss * 1.8),
          phase0:      (si / Math.max(mySubNodes.length, 1)) * TAU + ss * 1.3,
          spinSpeed:   0.9 + ss * 1.1,
          size:        subSize,
          satIndex:    si,
          progressPct: subProg.pct,
          progressLabel: subProg.hasGoal
            ? `${subProg.current}/${subProg.target}${subProg.unit}`
            : undefined,
        }
      })

      return {
        node,
        archetype:     getPlanetArchetype(node.id, idx),
        orbitRadius,
        orbitSpeed,
        phase0,
        inclination,
        spinSpeed,
        size,
        satellites,
        progressPct:   prog.pct,
        progressLabel,
      }
    })

    return { core, planets }
  }, [nodes, pulses])
}
