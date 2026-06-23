'use client'
// Drifting space debris (rocks + fragments) in the far background.

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 28
const BOX   = 90

export default function SpaceDebris({ driftOffset }: { driftOffset: React.MutableRefObject<THREE.Vector3> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  const { initPos, rotSpeeds } = useMemo(() => {
    const initPos   = new Float32Array(COUNT * 3)
    const rotSpeeds = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3
      initPos[i3]   = (Math.random() - 0.5) * BOX
      initPos[i3+1] = (Math.random() - 0.5) * BOX
      initPos[i3+2] = (Math.random() - 0.5) * BOX
      rotSpeeds[i3]   = (Math.random() - 0.5) * 0.4
      rotSpeeds[i3+1] = (Math.random() - 0.5) * 0.4
      rotSpeeds[i3+2] = (Math.random() - 0.5) * 0.4
    }
    return { initPos, rotSpeeds }
  }, [])

  const rotations = useRef(new Float32Array(COUNT * 3))
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const half = BOX / 2

  useFrame((_, delta) => {
    if (!meshRef.current) return
    const off = driftOffset.current

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3
      rotations.current[i3]   += rotSpeeds[i3]   * delta
      rotations.current[i3+1] += rotSpeeds[i3+1] * delta
      rotations.current[i3+2] += rotSpeeds[i3+2] * delta

      // position with drift wrap (parallax factor 1.4 — moves faster than stars)
      let x = initPos[i3]   - off.x * 1.4
      let y = initPos[i3+1] - off.y * 1.4
      let z = initPos[i3+2] - off.z * 1.4
      if (x >  half) x -= BOX; else if (x < -half) x += BOX
      if (y >  half) y -= BOX; else if (y < -half) y += BOX
      if (z >  half) z -= BOX; else if (z < -half) z += BOX

      dummy.position.set(x, y, z)
      dummy.rotation.set(rotations.current[i3], rotations.current[i3+1], rotations.current[i3+2])
      const scale = 0.08 + (i % 5) * 0.04
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#445566"
        roughness={0.88}
        metalness={0.15}
      />
    </instancedMesh>
  )
}
