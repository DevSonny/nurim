'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Trail } from '@react-three/drei'
import * as THREE from 'three'

const COMET_COUNT = 3
const COMET_SPEED = 28
const SPAWN_DIST  = 55

interface CometState {
  pos: THREE.Vector3
  vel: THREE.Vector3
  active: boolean
}

function randomCometVelocity(): THREE.Vector3 {
  const theta = (Math.random() - 0.5) * 1.2
  const phi   = (Math.random() - 0.5) * 1.2
  return new THREE.Vector3(
    Math.sin(theta) * COMET_SPEED,
    Math.sin(phi)   * COMET_SPEED,
    -COMET_SPEED + (Math.random() - 0.5) * 8,
  )
}

function randomCometStart(): THREE.Vector3 {
  return new THREE.Vector3(
    (Math.random() - 0.5) * 80,
    (Math.random() - 0.5) * 40,
    SPAWN_DIST + Math.random() * 20,
  )
}

export default function Comets() {
  // Individual refs so Trail can receive a RefObject
  const ref0 = useRef<THREE.Mesh>(null)
  const ref1 = useRef<THREE.Mesh>(null)
  const ref2 = useRef<THREE.Mesh>(null)
  const meshRefs = useMemo(() => [ref0, ref1, ref2], [])

  const states = useRef<CometState[]>(
    Array.from({ length: COMET_COUNT }, (_, i) => ({
      pos: randomCometStart().addScalar(i * 18),
      vel: randomCometVelocity(),
      active: i === 0,
    }))
  )
  const timers = useRef<number[]>([0, 12, 24])

  useFrame((_, delta) => {
    for (let i = 0; i < COMET_COUNT; i++) {
      const cs = states.current[i]
      timers.current[i] -= delta

      if (!cs.active) {
        if (timers.current[i] <= 0) {
          cs.pos.copy(randomCometStart())
          cs.vel.copy(randomCometVelocity())
          cs.active = true
        }
        continue
      }

      cs.pos.addScaledVector(cs.vel, delta)
      const mesh = meshRefs[i].current
      if (mesh) mesh.position.copy(cs.pos)

      if (cs.pos.length() > SPAWN_DIST * 1.8) {
        cs.active = false
        timers.current[i] = 6 + Math.random() * 10
      }
    }
  })

  return (
    <>
      {Array.from({ length: COMET_COUNT }, (_, i) => (
        <Trail
          key={i}
          target={meshRefs[i] as React.RefObject<THREE.Object3D>}
          width={0.5}
          length={8}
          color="#aaddff"
          attenuation={t => t * t}
          local={false}
        >
          <mesh ref={meshRefs[i]}>
            <sphereGeometry args={[0.08, 6, 6]} />
            <meshBasicMaterial color="#ddeeff" />
          </mesh>
        </Trail>
      ))}
    </>
  )
}
