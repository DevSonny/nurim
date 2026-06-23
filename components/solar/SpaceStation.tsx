'use client'
// Low-poly space station built from primitives only (no asset loading).
// Slowly drifts across the far background, then recycles.

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const DRIFT_SPEED = 1.8
const SPAWN_X     = 70
const SPAWN_Y_RANGE = 18
const SPAWN_Z     = -35

export default function SpaceStation() {
  const groupRef = useRef<THREE.Group>(null)
  const pos = useRef(new THREE.Vector3(SPAWN_X, (Math.random() - 0.5) * SPAWN_Y_RANGE, SPAWN_Z))
  const vel = useRef(new THREE.Vector3(-DRIFT_SPEED, 0, 0))
  const rotSpeed = useRef(new THREE.Vector3(0.005, 0.012, 0.003))

  useFrame((_, delta) => {
    if (!groupRef.current) return
    pos.current.addScaledVector(vel.current, delta)
    groupRef.current.position.copy(pos.current)
    groupRef.current.rotation.x += rotSpeed.current.x
    groupRef.current.rotation.y += rotSpeed.current.y
    groupRef.current.rotation.z += rotSpeed.current.z

    // Respawn on the other side
    if (pos.current.x < -SPAWN_X) {
      pos.current.set(SPAWN_X, (Math.random() - 0.5) * SPAWN_Y_RANGE, SPAWN_Z - Math.random() * 10)
    }
  })

  const METAL = { color: '#8899aa', roughness: 0.35, metalness: 0.85 }
  const PANEL = { color: '#1144aa', emissive: '#1144aa', emissiveIntensity: 0.3, roughness: 0.1, metalness: 0.95 }
  const LIGHT = { color: '#00ccff', emissive: '#00ccff', emissiveIntensity: 1.2, roughness: 0.1, metalness: 0.5 }

  return (
    <group ref={groupRef} position={[SPAWN_X, 0, SPAWN_Z]} scale={1.1}>
      {/* Central hub cylinder */}
      <mesh>
        <cylinderGeometry args={[0.55, 0.55, 2.4, 12]} />
        <meshStandardMaterial {...METAL} />
      </mesh>

      {/* Rotating habitat ring (torus) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.6, 0.22, 8, 36]} />
        <meshStandardMaterial {...METAL} />
      </mesh>

      {/* Connecting spokes */}
      {[0, 1, 2, 3].map(i => (
        <mesh key={i} rotation={[0, 0, (i / 4) * Math.PI * 2]}>
          <cylinderGeometry args={[0.05, 0.05, 1.1, 4]} />
          <meshStandardMaterial {...METAL} />
          <mesh position={[0, 0.55, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 1.1, 4]} />
            <meshStandardMaterial {...METAL} />
          </mesh>
        </mesh>
      ))}

      {/* Main solar panel arm — horizontal */}
      <mesh position={[3.2, 0, 0]}>
        <boxGeometry args={[3.4, 0.06, 1.1]} />
        <meshStandardMaterial {...PANEL} />
      </mesh>
      <mesh position={[-3.2, 0, 0]}>
        <boxGeometry args={[3.4, 0.06, 1.1]} />
        <meshStandardMaterial {...PANEL} />
      </mesh>

      {/* Communication dish */}
      <group position={[0, 1.6, 0]}>
        <mesh>
          <cylinderGeometry args={[0.04, 0.04, 0.7, 6]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
        <mesh position={[0, 0.42, 0]} rotation={[Math.PI / 5, 0, 0]}>
          <cylinderGeometry args={[0.36, 0.28, 0.09, 10]} />
          <meshStandardMaterial color="#ccddee" roughness={0.15} metalness={0.9} />
        </mesh>
      </group>

      {/* Docking port modules */}
      {[-1, 0, 1].map(i => (
        <mesh key={i} position={[0, i * 0.65, 0.62]}>
          <boxGeometry args={[0.32, 0.32, 0.32]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
      ))}

      {/* Running lights */}
      {[[-1.6, 0, 0], [1.6, 0, 0], [0, 1.2, 0]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.07, 6, 6]} />
          <meshStandardMaterial {...LIGHT} />
        </mesh>
      ))}
    </group>
  )
}
