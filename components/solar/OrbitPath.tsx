'use client'
import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

interface OrbitPathProps {
  radius: number
  inclination: number   // X-axis tilt in radians
  color: string
  opacity?: number
  segments?: number
}

export default function OrbitPath({
  radius,
  inclination,
  color,
  opacity = 0.12,
  segments = 80,
}: OrbitPathProps) {
  const points = useMemo<[number, number, number][]>(() => {
    const pts: [number, number, number][] = []
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2
      // Flat circle, then tilt around X
      const x = Math.cos(a) * radius
      const z = Math.sin(a) * radius
      const yTilt = z * Math.sin(inclination)
      const zTilt = z * Math.cos(inclination)
      pts.push([x, yTilt, zTilt])
    }
    return pts
  }, [radius, inclination, segments])

  return (
    <Line
      points={points}
      color={color}
      lineWidth={0.6}
      transparent
      opacity={opacity}
    />
  )
}
