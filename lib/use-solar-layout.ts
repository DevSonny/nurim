'use client'
import { useMemo } from 'react'
import { getNodes } from './store'
import type { StoredNode } from './store'
import { getPlanetArchetype } from './planet-archetype'
import type { PlanetArchetype } from './planet-archetype'
import { h01 } from './hash'
import { nodeBaseRadius } from './tokens'

const TAU = Math.PI * 2
const R0 = 3.2        // innermost orbit radius
const GAP = 1.65      // spacing between orbits
const SPEED_BASE = 0.42  // Kepler-ish base speed

// ── types ─────────────────────────────────────────────────────────────────────

export interface SatelliteLayout {
  node: StoredNode
  orbitRadius: number
  orbitSpeed: number
  phase0: number
  spinSpeed: number
  size: number
  satIndex: number
}

export interface PlanetLayout {
  node: StoredNode
  archetype: PlanetArchetype
  orbitRadius: number
  orbitSpeed: number
  phase0: number
  inclination: number   // tilt of orbital plane (radians, around X)
  spinSpeed: number
  size: number
  satellites: SatelliteLayout[]
}

export interface SolarLayout {
  core: StoredNode | null
  planets: PlanetLayout[]
}

// ── hook ──────────────────────────────────────────────────────────────────────

export function useSolarLayout(): SolarLayout {
  return useMemo(() => {
    const nodes = getNodes()
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
      const size        = nodeBaseRadius.orbit * (0.82 + seed * 0.42)

      const mySubNodes = subNodes.filter(s => s.parentId === node.id)

      const satellites: SatelliteLayout[] = mySubNodes.map((sub, si) => {
        const ss = h01(sub.id)
        return {
          node: sub,
          orbitRadius: size + 0.52 + si * 0.36,
          orbitSpeed:  orbitSpeed * (2.2 + ss * 1.8) * 3,
          phase0:      (si / Math.max(mySubNodes.length, 1)) * TAU + ss * 1.3,
          spinSpeed:   0.9 + ss * 1.1,
          size:        nodeBaseRadius.sub * (0.88 + ss * 0.24),
          satIndex:    si,
        }
      })

      return {
        node,
        archetype:   getPlanetArchetype(node.id, idx),
        orbitRadius,
        orbitSpeed,
        phase0,
        inclination,
        spinSpeed,
        size,
        satellites,
      }
    })

    return { core, planets }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
