'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, AdaptiveDpr, Line } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useForceLayout, type Node3D } from '@/lib/use-force-layout'
import { nodeColor, nodeBaseRadius, colors } from '@/lib/tokens'
import type { NodeDef } from '@/lib/tokens'
import { getNodes, getBonds } from '@/lib/store'

// ── MolNode ───────────────────────────────────────────────────────────────────
// absorb animation: burst (0→0.3s scale up) then fly (0.3→1.0 move+shrink)

function MolNode({
  node,
  absorbing = false,
  corePos,
  onAbsorbDone,
  onDoubleClick,
  coreFlash = 0,
}: {
  node: Node3D
  absorbing?: boolean
  corePos: THREE.Vector3
  onAbsorbDone?: () => void
  onDoubleClick?: () => void
  coreFlash?: number
}) {
  const color = nodeColor(node)
  const radius = nodeBaseRadius[node.type]
  const isCore = node.type === 'core'

  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const rippleRef = useRef<THREE.Mesh>(null)
  const rippleMat = useRef<THREE.MeshBasicMaterial>(null)
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  const pulseT = useRef(0)
  const corePulseT = useRef(0)      // separate big-pulse for core absorption reaction
  const prevFlash = useRef(coreFlash)
  const absorbT = useRef(0)
  const absorbingRef = useRef(false)
  const hovered = useRef(false)
  const originPos = useRef(new THREE.Vector3(node.x, node.y, node.z))

  // Core flash: triggered when another node is absorbed into it
  useEffect(() => {
    if (isCore && coreFlash !== prevFlash.current) {
      prevFlash.current = coreFlash
      corePulseT.current = 1
    }
  }, [coreFlash, isCore])

  useEffect(() => {
    if (absorbing) {
      absorbingRef.current = true
      absorbT.current = 0
    } else {
      absorbingRef.current = false
      absorbT.current = 0
      if (groupRef.current) groupRef.current.position.copy(originPos.current)
      if (meshRef.current) {
        meshRef.current.visible = true
        meshRef.current.scale.setScalar(1)
      }
    }
  }, [absorbing])

  useFrame((_, delta) => {
    if (!meshRef.current || !groupRef.current) return

    // ── Absorb animation ────────────────────────────────────────────
    if (absorbingRef.current) {
      // burst phase slower (0.75), fly phase faster (1.4) — distinct feel
      const burstEnd = 0.42
      const burstSpeed = 0.75
      const flySpeed = 1.4
      if (absorbT.current < burstEnd) {
        absorbT.current = Math.min(burstEnd, absorbT.current + delta * burstSpeed)
      } else {
        absorbT.current = Math.min(1, absorbT.current + delta * flySpeed)
      }
      const t = absorbT.current

      if (t <= burstEnd) {
        // Phase 1: burst — elastic overshoot to 2.8x, ripple expands
        const bt = t / burstEnd
        // elastic: overshoot past target then settle
        const elastic = bt < 0.7
          ? bt / 0.7 * 2.8                          // ramp up fast to 2.8
          : 2.8 - (bt - 0.7) / 0.3 * 0.4           // slight pullback to 2.4

        meshRef.current.scale.setScalar(elastic)
        if (matRef.current) matRef.current.emissiveIntensity = 1.6 + bt * 6.0

        // drive ripple ring outward during burst
        if (rippleRef.current && rippleMat.current) {
          rippleRef.current.scale.setScalar(1 + bt * 3.5)
          rippleMat.current.opacity = (1 - bt) * 0.7
          rippleMat.current.visible = true
        }
      } else {
        // Phase 2: fly to core, shrink 2.4 → 0
        const ft = (t - burstEnd) / (1 - burstEnd)
        const flyEase = ft < 0.5 ? 4 * ft ** 3 : 1 - (-2 * ft + 2) ** 3 / 2
        groupRef.current.position.lerpVectors(originPos.current, corePos, flyEase)
        meshRef.current.scale.setScalar(Math.max(0, 2.4 * (1 - flyEase)))
        if (matRef.current) matRef.current.emissiveIntensity = 7.6 * (1 - flyEase)
        if (rippleMat.current) rippleMat.current.visible = false
      }

      if (t >= 1) {
        absorbingRef.current = false
        meshRef.current.visible = false
        onAbsorbDone?.()
      }
      return
    }

    // ── Normal pulse / hover ────────────────────────────────────────
    if (pulseT.current > 0) pulseT.current = Math.max(0, pulseT.current - delta * 2)
    if (corePulseT.current > 0) corePulseT.current = Math.max(0, corePulseT.current - delta * 1.6)

    const hoverBump = hovered.current ? 0.12 : 0
    const pulseBump = pulseT.current * 0.35
    // Core absorption flash: elastic overshoot to 2.2x then settle back to 1
    const coreAbsorbBump = isCore
      ? corePulseT.current > 0.5
        ? (corePulseT.current - 0.5) / 0.5 * 1.2   // 0→1.2 during first half
        : corePulseT.current / 0.5 * 0.4            // 0.4→0 fade out
      : 0
    const targetScale = 1 + hoverBump + pulseBump + coreAbsorbBump
    const curr = meshRef.current.scale.x
    meshRef.current.scale.setScalar(curr + (targetScale - curr) * 0.18)

    if (matRef.current) {
      const targetEmissive = isCore
        ? 2.2 + corePulseT.current * 5.0
        : 1.6 + pulseT.current * 1.2
      matRef.current.emissiveIntensity += (targetEmissive - matRef.current.emissiveIntensity) * 0.15
    }

    if (rippleRef.current && rippleMat.current) {
      const inv = 1 - pulseT.current
      rippleRef.current.scale.setScalar(1 + inv * 2.2)
      rippleMat.current.opacity = pulseT.current * (isCore ? 0.55 : 0.4)
      rippleMat.current.visible = pulseT.current > 0.01
    }
  })

  return (
    <group ref={groupRef} position={[node.x, node.y, node.z]}>
      <mesh ref={rippleRef}>
        <ringGeometry args={[radius * 0.95, radius * 1.12, 32]} />
        <meshBasicMaterial
          ref={rippleMat}
          color={color}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh
        ref={meshRef}
        onClick={() => { pulseT.current = 1 }}
        onDoubleClick={() => { if (!isCore) { pulseT.current = 1; onDoubleClick?.() } }}
        onPointerOver={() => { hovered.current = true; document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { hovered.current = false; document.body.style.cursor = 'auto' }}
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          ref={matRef}
          color={color}
          emissive={color}
          emissiveIntensity={isCore ? 2.2 : 1.6}
          roughness={0.05}
          metalness={0.4}
        />
      </mesh>

      {!absorbing && (
        <Html
          center
          distanceFactor={12}
          position={[0, -(radius + 0.22), 0]}
          style={{
            color: '#e8e8f5',
            fontSize: isCore ? '14px' : '11px',
            fontWeight: isCore ? 800 : 600,
            fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif",
            background: 'rgba(0,0,0,0.60)',
            padding: '2px 7px',
            borderRadius: '10px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            userSelect: 'none',
            letterSpacing: '0.2px',
          }}
        >
          {node.label}
        </Html>
      )}
    </group>
  )
}

// ── CoreRings ─────────────────────────────────────────────────────────────────

function CoreRings({ flashRef }: { flashRef: React.MutableRefObject<number> }) {
  const r1 = useRef<THREE.Mesh>(null)
  const r2 = useRef<THREE.Mesh>(null)
  const m1 = useRef<THREE.MeshBasicMaterial>(null)
  const m2 = useRef<THREE.MeshBasicMaterial>(null)
  const ringRadius = nodeBaseRadius.core * 2.1
  const flashT = useRef(0)

  useFrame((_, delta) => {
    if (flashRef.current > 0) { flashT.current = 1; flashRef.current = 0 }
    if (flashT.current > 0) flashT.current = Math.max(0, flashT.current - delta * 2.5)

    const speed = 1 + flashT.current * 5
    if (r1.current) r1.current.rotation.y += delta * 0.5 * speed
    if (r2.current) r2.current.rotation.x += delta * 0.38 * speed
    if (m1.current) m1.current.opacity = 0.22 + flashT.current * 0.4
    if (m2.current) m2.current.opacity = 0.15 + flashT.current * 0.3
  })

  return (
    <>
      <mesh ref={r1} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[ringRadius, 0.008, 4, 90]} />
        <meshBasicMaterial ref={m1} color={colors.core} transparent opacity={0.22} />
      </mesh>
      <mesh ref={r2} rotation={[0, Math.PI / 5, Math.PI / 4]}>
        <torusGeometry args={[ringRadius, 0.006, 4, 90]} />
        <meshBasicMaterial ref={m2} color={colors.core} transparent opacity={0.15} />
      </mesh>
    </>
  )
}

// ── MolBond ───────────────────────────────────────────────────────────────────

function MolBond({ src, tgt, fading }: { src: Node3D; tgt: Node3D; fading?: boolean }) {
  const color = nodeColor(src as NodeDef)
  const points: [number, number, number][] = [
    [src.x, src.y, src.z],
    [tgt.x, tgt.y, tgt.z],
  ]
  return (
    <Line
      points={points}
      color={color}
      lineWidth={1.2}
      transparent
      opacity={fading ? 0.08 : 0.3}
    />
  )
}

// ── MoleculeGraph ─────────────────────────────────────────────────────────────

function MoleculeGraph({
  absorbingIds,
  absorbedIds,
  coreFlashCount,
  onNodeDoubleClick,
  onAbsorbDone,
}: {
  absorbingIds: Set<string>
  absorbedIds: Set<string>
  coreFlashCount: number
  onNodeDoubleClick: (id: string) => void
  onAbsorbDone: (id: string) => void
}) {
  const nodes = useForceLayout()
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]))
  const coreNode = nodes.find(n => n.id === 'core')
  const corePos = coreNode
    ? new THREE.Vector3(coreNode.x, coreNode.y, coreNode.z)
    : new THREE.Vector3(0, 0, 0)
  const coreFlash = useRef(0)

  if (nodes.length === 0) return null

  const visibleNodes = nodes.filter(n => !absorbedIds.has(n.id))

  return (
    <group>
      {getBonds().map(b => {
        const s = nodeMap[b.source]
        const t = nodeMap[b.target]
        if (!s || !t) return null
        // hide bond if either endpoint is fully absorbed
        if (absorbedIds.has(b.source) || absorbedIds.has(b.target)) return null
        const fading = absorbingIds.has(b.source) || absorbingIds.has(b.target)
        return (
          <MolBond key={`${b.source}-${b.target}`} src={s} tgt={t} fading={fading} />
        )
      })}
      {visibleNodes.map(n => (
        <MolNode
          key={n.id}
          node={n}
          corePos={corePos}
          absorbing={absorbingIds.has(n.id)}
          onAbsorbDone={() => onAbsorbDone(n.id)}
          onDoubleClick={() => onNodeDoubleClick(n.id)}
          coreFlash={n.type === 'core' ? coreFlashCount : 0}
        />
      ))}
      {coreNode && (
        <group position={[coreNode.x, coreNode.y, coreNode.z]}>
          <CoreRings flashRef={coreFlash} />
        </group>
      )}
    </group>
  )
}

// ── AbsorbToast ───────────────────────────────────────────────────────────────

function AbsorbToast({
  nodeLabel,
  onConfirm,
  onCancel,
}: {
  nodeLabel: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 110,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        background: 'rgba(10,10,20,0.94)',
        border: `1px solid ${colors.core}55`,
        borderRadius: '16px',
        padding: '14px 18px',
        backdropFilter: 'blur(20px)',
        whiteSpace: 'nowrap',
        boxShadow: `0 0 32px ${colors.core}22, 0 8px 24px rgba(0,0,0,0.5)`,
        fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif",
      }}
    >
      <div style={{ fontSize: '13px', color: colors.text, lineHeight: 1.5 }}>
        <span style={{ color: colors.core, fontWeight: 700 }}>{nodeLabel}</span>
        {' '}목표를 달성으로 처리할까요?
      </div>
      <div style={{ fontSize: '11px', color: `${colors.text}44` }}>
        하위 항목도 함께 Core로 흡수됩니다
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '8px',
            background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${colors.border}`,
            borderRadius: '10px',
            color: `${colors.text}88`,
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          취소
        </button>
        <button
          onClick={onConfirm}
          style={{
            flex: 1,
            padding: '8px',
            background: `linear-gradient(135deg, ${colors.core}, #0099cc)`,
            border: 'none',
            borderRadius: '10px',
            color: '#080810',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: `0 0 14px ${colors.core}44`,
          }}
        >
          달성 ✓
        </button>
      </div>
    </div>
  )
}

// ── MoleculeScene (root) ──────────────────────────────────────────────────────

export default function MoleculeScene() {
  const [absorbingIds, setAbsorbingIds] = useState<Set<string>>(new Set())
  const [absorbedIds, setAbsorbedIds] = useState<Set<string>>(new Set())
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [coreFlashCount, setCoreFlashCount] = useState(0)
  const cascadeTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => {
    document.body.style.cursor = 'auto'
    cascadeTimers.current.forEach(clearTimeout)
  }, [])

  const handleDoubleClick = useCallback((id: string) => {
    if (absorbingIds.has(id) || absorbedIds.has(id) || pendingId) return
    setPendingId(id)
  }, [absorbingIds, absorbedIds, pendingId])

  const handleConfirm = useCallback(() => {
    if (!pendingId) return
    const id = pendingId
    setPendingId(null)
    setAbsorbingIds(prev => new Set([...prev, id]))
  }, [pendingId])

  const handleCancel = useCallback(() => {
    setPendingId(null)
  }, [])

  const handleAbsorbDone = useCallback((id: string) => {
    setAbsorbingIds(prev => { const n = new Set(prev); n.delete(id); return n })
    setAbsorbedIds(prev => new Set([...prev, id]))
    setCoreFlashCount(c => c + 1)

    // Cascade sub-nodes with staggered delay
    const subs = getNodes().filter(n => n.parentId === id)
    subs.forEach((sub, i) => {
      const t = setTimeout(() => {
        setAbsorbingIds(prev => new Set([...prev, sub.id]))
      }, 300 + i * 250)
      cascadeTimers.current.push(t)
    })
  }, [])

  const pendingNode = pendingId ? getNodes().find(n => n.id === pendingId) : null

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <AdaptiveDpr pixelated />
        <ambientLight intensity={0.1} />
        <pointLight position={[6, 6, 6]} intensity={2.5} color="#00eeff" />
        <pointLight position={[-6, -4, -6]} intensity={1.5} color="#c040ff" />
        <pointLight position={[0, -8, 2]} intensity={1.2} color="#44ff88" />

        <OrbitControls
          enablePan={false}
          minDistance={4}
          maxDistance={22}
          dampingFactor={0.08}
          enableDamping
          autoRotate
          autoRotateSpeed={1.2}
        />

        <MoleculeGraph
          absorbingIds={absorbingIds}
          absorbedIds={absorbedIds}
          coreFlashCount={coreFlashCount}
          onNodeDoubleClick={handleDoubleClick}
          onAbsorbDone={handleAbsorbDone}
        />

        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.12}
            luminanceSmoothing={0.85}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>

      {pendingNode && (
        <AbsorbToast
          nodeLabel={pendingNode.label}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  )
}
