'use client'
import { useEffect, useState } from 'react'
import { getNodes, getBonds } from './store'
import type { NodeDef } from './tokens'
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
} from 'd3-force-3d'

export interface Node3D extends NodeDef {
  x: number
  y: number
  z: number
}

const LINK_DIST_CORE_ORBIT = 2.8
const LINK_DIST_ORBIT_SUB = 1.6

function linkDistance(link: { source: Node3D; target: Node3D }): number {
  const { source, target } = link
  if (source.type === 'core' || target.type === 'core') return LINK_DIST_CORE_ORBIT
  return LINK_DIST_ORBIT_SUB
}

export function useForceLayout(): Node3D[] {
  const [nodes, setNodes] = useState<Node3D[]>([])

  useEffect(() => {
    const storedNodes = getNodes()
    const bonds = getBonds()

    const nodeData: Node3D[] = storedNodes.map(n => ({
      ...n,
      x: (Math.random() - 0.5) * 4,
      y: (Math.random() - 0.5) * 4,
      z: (Math.random() - 0.5) * 4,
    }))

    const nodeById = Object.fromEntries(nodeData.map(n => [n.id, n]))

    const linkData = bonds
      .map(b => ({ source: nodeById[b.source], target: nodeById[b.target] }))
      .filter(l => l.source && l.target)

    const sim = forceSimulation(nodeData, 3)
      .force('link', forceLink(linkData).distance(linkDistance).strength(0.9))
      .force('charge', forceManyBody().strength(-10).distanceMax(7))
      .force('center', forceCenter(0, 0, 0))
      .alphaDecay(0.02)
      .velocityDecay(0.4)
      .stop()

    for (let i = 0; i < 400; i++) sim.tick()
    setNodes([...nodeData])

    return () => { sim.stop() }
  }, [])

  return nodes
}
