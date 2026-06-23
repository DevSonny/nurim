// Deterministic planet archetype + palette from nodeId / orbitIdx.
// Pure — no three.js, no React, no side effects.

import { colors } from './tokens'
import { h01 } from './hash'

export type Archetype = 'gas' | 'rocky' | 'ringed' | 'ice' | 'alien'

// One archetype per slot — order matters for visual variety in the first 5 orbits.
const ARCHETYPE_TABLE: Archetype[] = [
  'gas',    // 0 — Jupiter-ish swirling bands
  'rocky',  // 1 — Mercury/Mars cratered rock
  'ringed', // 2 — Saturn with ring system
  'alien',  // 3 — glowing unknown world
  'ice',    // 4 — icy blue world
  'gas',    // 5+
  'rocky',
  'alien',
]

export interface PlanetArchetype {
  archetype: Archetype
  seed: number                         // h01(nodeId) in [0,1)
  colA: readonly [number, number, number]  // shadow  (vec3 for GLSL)
  colB: readonly [number, number, number]  // mid
  colC: readonly [number, number, number]  // highlight
  glow: readonly [number, number, number]  // alien/emissive pop
  bandFreq: number       // gas band density
  spinDir: number        // 1 or -1
  tilt: number           // orbital inclination (radians)
  hasRing: boolean
}

// ── colour helpers ────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16)
  return [((n >> 16) & 0xff) / 255, ((n >> 8) & 0xff) / 255, (n & 0xff) / 255]
}

function scale(c: [number, number, number], f: number): [number, number, number] {
  return [
    Math.min(1, Math.max(0, c[0] * f)),
    Math.min(1, Math.max(0, c[1] * f)),
    Math.min(1, Math.max(0, c[2] * f)),
  ]
}

/** Crude hue shift by rotating R↔B channel slightly */
function hueShift(
  c: [number, number, number],
  t: number,       // -1 .. 1
): [number, number, number] {
  return [
    Math.min(1, Math.max(0, c[0] + t * 0.28)),
    Math.min(1, Math.max(0, c[1] + t * 0.08)),
    Math.min(1, Math.max(0, c[2] - t * 0.25)),
  ]
}

// ── main export ───────────────────────────────────────────────────────────────

export function getPlanetArchetype(nodeId: string, orbitIdx: number): PlanetArchetype {
  const seed = h01(nodeId)
  const archetype = ARCHETYPE_TABLE[orbitIdx % ARCHETYPE_TABLE.length]
  const hasRing = archetype === 'ringed'

  // Base colour aligned to the orbit's accent (matches settings / pulse / stats)
  const baseHex = colors.orbits[orbitIdx % colors.orbits.length]
  const base = hexToRgb(baseHex)

  const colA = scale(base, 0.30)                        // dark
  const colB = base                                      // mid (as-is)
  const colC = scale(hueShift(base, seed - 0.5), 1.55)  // bright + slight hue variety
  const glow: [number, number, number] =
    archetype === 'alien'
      ? scale(hueShift(base, 0.7), 2.4)
      : scale(base, 2.0)

  return {
    archetype,
    seed,
    colA,
    colB,
    colC,
    glow,
    bandFreq: 3 + Math.floor(seed * 7),
    spinDir: seed < 0.5 ? 1 : -1,
    tilt: (seed - 0.5) * 0.28,
    hasRing,
  }
}
