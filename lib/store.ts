'use client'
// Dynamic node store — replaces hardcoded NODES/BONDS in tokens.ts
// Nodes are immutable after creation (label locked). Only deletion allowed.

import { colors } from './tokens'
import type { NodeDef, BondDef } from './tokens'

export interface StoredNode extends NodeDef {
  createdAt: number
  achievedAt?: number   // optional — set when node is "달성". undefined = not achieved.
}

const STORAGE_KEY = 'nurim_nodes_v1'
const MAX_ORBITS = 8
const MAX_SUBS_PER_ORBIT = 6

// ── Default initial nodes ─────────────────────────────────────────────────────

const DEFAULT_NODES: StoredNode[] = [
  { id: 'core',  type: 'core',  label: '나',    orbitIdx: -1, createdAt: 0 },
  { id: 'study', type: 'orbit', label: '공부',  orbitIdx: 0,  createdAt: 1 },
  { id: 'exer',  type: 'orbit', label: '운동',  orbitIdx: 1,  createdAt: 2 },
  { id: 'fin',   type: 'orbit', label: '재테크',orbitIdx: 2,  createdAt: 3 },
  { id: 'hlth',  type: 'orbit', label: '건강',  orbitIdx: 3,  createdAt: 4 },
  { id: 'rel',   type: 'orbit', label: '관계',  orbitIdx: 4,  createdAt: 5 },
  { id: 's1',    type: 'sub',   label: '영어',  orbitIdx: 0,  parentId: 'study', createdAt: 6 },
  { id: 's2',    type: 'sub',   label: '코딩',  orbitIdx: 0,  parentId: 'study', createdAt: 7 },
  { id: 's3',    type: 'sub',   label: '러닝',  orbitIdx: 1,  parentId: 'exer',  createdAt: 8 },
  { id: 's4',    type: 'sub',   label: '요가',  orbitIdx: 1,  parentId: 'exer',  createdAt: 9 },
  { id: 's5',    type: 'sub',   label: '투자',  orbitIdx: 2,  parentId: 'fin',   createdAt: 10 },
]

// ── Storage helpers ───────────────────────────────────────────────────────────

function load(): StoredNode[] {
  if (typeof window === 'undefined') return DEFAULT_NODES
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_NODES
    const parsed = JSON.parse(raw) as StoredNode[]
    // Always ensure core exists
    if (!parsed.find(n => n.id === 'core')) {
      parsed.unshift(DEFAULT_NODES[0])
    }
    return parsed
  } catch {
    return DEFAULT_NODES
  }
}

function save(nodes: StoredNode[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes))
}

// ── Public API ────────────────────────────────────────────────────────────────

export function getNodes(): StoredNode[] {
  return load()
}

export function getBonds(): BondDef[] {
  const nodes = load()
  const bonds: BondDef[] = []
  for (const n of nodes) {
    if (n.type === 'orbit') bonds.push({ source: 'core', target: n.id })
    if (n.type === 'sub' && n.parentId) bonds.push({ source: n.parentId, target: n.id })
  }
  return bonds
}

export function getOrbitColor(orbitIdx: number): string {
  return colors.orbits[orbitIdx % colors.orbits.length]
}

/** Add a new orbit node. Returns null if at max capacity. */
export function addOrbit(label: string): StoredNode | null {
  const nodes = load()
  const orbits = nodes.filter(n => n.type === 'orbit')
  if (orbits.length >= MAX_ORBITS) return null

  // Next available orbitIdx
  const usedIdxs = new Set(orbits.map(o => o.orbitIdx))
  let orbitIdx = 0
  while (usedIdxs.has(orbitIdx)) orbitIdx++

  const node: StoredNode = {
    id: `orbit_${Date.now()}`,
    type: 'orbit',
    label: label.trim(),
    orbitIdx,
    createdAt: Date.now(),
  }
  save([...nodes, node])
  return node
}

/** Add a sub-node under an orbit. Returns null if orbit not found or at max. */
export function addSub(parentId: string, label: string): StoredNode | null {
  const nodes = load()
  const parent = nodes.find(n => n.id === parentId && n.type === 'orbit')
  if (!parent) return null

  const subs = nodes.filter(n => n.type === 'sub' && n.parentId === parentId)
  if (subs.length >= MAX_SUBS_PER_ORBIT) return null

  const node: StoredNode = {
    id: `sub_${Date.now()}`,
    type: 'sub',
    label: label.trim(),
    orbitIdx: parent.orbitIdx,
    parentId,
    createdAt: Date.now(),
  }
  save([...nodes, node])
  return node
}

/** Delete a node. If orbit, also removes its subs. Core cannot be deleted. */
export function deleteNode(id: string): boolean {
  const nodes = load()
  const node = nodes.find(n => n.id === id)
  if (!node || node.type === 'core') return false

  const filtered = nodes.filter(n =>
    n.id !== id && (node.type !== 'orbit' || n.parentId !== id)
  )
  save(filtered)
  return true
}

export function resetToDefaults() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

// ── Achievement API ───────────────────────────────────────────────────────────

/** Mark a node as achieved (on=true) or reset to un-achieved (on=false). */
export function setAchieved(id: string, on = true): void {
  const nodes = load()
  const updated = nodes.map(n =>
    n.id === id ? { ...n, achievedAt: on ? Date.now() : undefined } : n
  )
  save(updated)
}

export function isAchieved(id: string): boolean {
  return !!load().find(n => n.id === id)?.achievedAt
}

export function getAchievedIds(): Set<string> {
  const nodes = load()
  return new Set(nodes.filter(n => n.achievedAt).map(n => n.id))
}

export { MAX_ORBITS, MAX_SUBS_PER_ORBIT }
