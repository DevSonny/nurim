'use client'
// MandalaView — 정지 2D 만다라트 마인드맵.
// Core 중심, Orbit 방사형 링, Sub 가지로 펼친 SVG 뷰.

import { useRef, forwardRef, useImperativeHandle } from 'react'
import { colors, fonts } from '@/lib/tokens'
import type { StoredNode } from '@/lib/store'
import type { Progress } from '@/lib/aggregate'

export interface MandalaViewHandle {
  savePNG: () => void
}

interface MandalaViewProps {
  core: StoredNode | null
  orbits: StoredNode[]
  subs: StoredNode[]
  progressMap: Record<string, Progress>
  achievedIds: Set<string>
}

// ── Layout constants ──────────────────────────────────────────────────────────

const CX = 350
const CY = 350
const CORE_R   = 44
const ORBIT_DIST = 155   // main center → orbit center
const ORBIT_R   = 32
const SUB_DIST  = 92    // orbit center → sub center
const SUB_R     = 18

// Minimum angular gap between adjacent subs (no overlap + 6px margin).
// chord = 2 * SUB_DIST * sin(θ/2) >= 2*(SUB_R + 6)
const MIN_SUB_ANGLE = 2 * Math.asin(Math.min(1, (SUB_R + 6) / SUB_DIST)) // ≈ 0.57 rad

// ── Partial arc SVG path (starts at top, goes clockwise) ─────────────────────

function arcPath(cx: number, cy: number, r: number, pct: number): string {
  if (pct <= 0) return ''
  if (pct >= 1) {
    return [
      `M ${cx} ${cy - r}`,
      `A ${r} ${r} 0 1 1 ${cx - 0.001} ${cy - r}`,
    ].join(' ')
  }
  const angle = pct * 2 * Math.PI - Math.PI / 2
  const x = cx + Math.cos(angle) * r
  const y = cy + Math.sin(angle) * r
  return `M ${cx} ${cy - r} A ${r} ${r} 0 ${pct > 0.5 ? 1 : 0} 1 ${x.toFixed(2)} ${y.toFixed(2)}`
}

// ── Node circle ───────────────────────────────────────────────────────────────

function NodeCircle({
  cx, cy, r, color, label, progress, achieved, large,
  labelDir,
}: {
  cx: number; cy: number; r: number; color: string
  label: string; progress: Progress; achieved: boolean; large: boolean
  labelDir?: number   // radians — where to place the label (outside circle)
}) {
  const pct = progress.pct
  const arcR = r + (large ? 6 : 4)
  const d = arcPath(cx, cy, arcR, pct)

  // Label position: inside circle if large (orbit), outside if small (sub)
  const labelInside = large
  const labelDist = labelInside ? 0 : r + 13
  const labelAngle = labelDir ?? 0
  const lx = labelInside ? cx : cx + Math.cos(labelAngle) * labelDist
  const ly = labelInside ? cy - 3 : cy + Math.sin(labelAngle) * labelDist

  return (
    <g>
      {/* Background circle */}
      <circle
        cx={cx} cy={cy} r={r}
        fill={`${color}18`}
        stroke={achieved ? '#ffcc44' : `${color}55`}
        strokeWidth={achieved ? 2 : 1.5}
      />

      {/* Progress arc */}
      {pct > 0.01 && (
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={large ? 3 : 2.5}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color}88)` }}
        />
      )}

      {/* Achievement glow */}
      {achieved && (
        <circle cx={cx} cy={cy} r={r + 1} fill="none" stroke="#ffcc44" strokeWidth={1} opacity={0.5} />
      )}

      {/* Label */}
      <text
        x={lx}
        y={ly + (large ? 1 : 0)}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={achieved ? '#ffcc44' : (labelInside ? color : `${color}ee`)}
        fontSize={large ? 13 : 10}
        fontWeight={700}
        fontFamily="Pretendard, system-ui, sans-serif"
      >
        {label}{achieved ? ' ✦' : ''}
      </text>

      {/* Progress label — below main label */}
      {progress.hasGoal && progress.target > 0 && (
        <text
          x={lx}
          y={ly + (large ? 16 : 12)}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontSize={large ? 9 : 8}
          fontFamily="'Space Grotesk', sans-serif"
          opacity={0.85}
        >
          {progress.current}/{progress.target}{progress.unit}
        </text>
      )}
    </g>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

const MandalaView = forwardRef<MandalaViewHandle, MandalaViewProps>(
  function MandalaView({ core, orbits, subs, progressMap, achievedIds }, ref) {
    const svgRef = useRef<SVGSVGElement>(null)

    useImperativeHandle(ref, () => ({
      savePNG() {
        if (!svgRef.current) return
        const svgStr = new XMLSerializer().serializeToString(svgRef.current)
        const canvas = document.createElement('canvas')
        canvas.width = 700; canvas.height = 700
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        const img = new Image()
        img.onload = () => {
          ctx.fillStyle = '#080810'
          ctx.fillRect(0, 0, 700, 700)
          ctx.drawImage(img, 0, 0)
          canvas.toBlob(blob => {
            if (!blob) return
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url; a.download = 'nurim-mandala.png'; a.click()
            URL.revokeObjectURL(url)
          })
        }
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr)
      },
    }))

    // Orbit angles: evenly spaced, starting from top (-π/2)
    const n = Math.max(orbits.length, 1)
    const orbitAngles = orbits.map((_, i) => (i / n) * 2 * Math.PI - Math.PI / 2)

    return (
      <svg
        ref={svgRef}
        viewBox="0 0 700 700"
        style={{ width: '100%', height: '100%', maxWidth: 700, maxHeight: 700, display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <rect width="700" height="700" fill={colors.ground} />

        {/* Subtle reference circles */}
        <circle cx={CX} cy={CY} r={ORBIT_DIST}
          fill="none" stroke={`${colors.border}`} strokeWidth={0.5} strokeDasharray="4 6" />
        <circle cx={CX} cy={CY} r={ORBIT_DIST + SUB_DIST}
          fill="none" stroke={`${colors.border}`} strokeWidth={0.3} strokeDasharray="2 8" opacity={0.5} />

        {orbits.map((orbit, oi) => {
          const angle = orbitAngles[oi]
          const ox = CX + Math.cos(angle) * ORBIT_DIST
          const oy = CY + Math.sin(angle) * ORBIT_DIST
          const orbitColor = colors.orbits[orbit.orbitIdx % colors.orbits.length]
          const orbitProgress = progressMap[orbit.id] ?? { current: 0, target: 0, unit: '', pct: 0, hasGoal: false }
          const mySubNodes = subs.filter(s => s.parentId === orbit.id)

          // Sub spread: ensure no overlap using MIN_SUB_ANGLE
          const totalSpread = mySubNodes.length <= 1
            ? 0
            : Math.min((mySubNodes.length - 1) * MIN_SUB_ANGLE, Math.PI * 0.72)
          const stepAngle = mySubNodes.length > 1 ? totalSpread / (mySubNodes.length - 1) : 0
          const subAngles = mySubNodes.map((_, si) =>
            mySubNodes.length === 1 ? angle : angle - totalSpread / 2 + si * stepAngle
          )

          return (
            <g key={orbit.id}>
              {/* Core → orbit connector */}
              <line
                x1={CX + Math.cos(angle) * CORE_R}
                y1={CY + Math.sin(angle) * CORE_R}
                x2={ox - Math.cos(angle) * ORBIT_R}
                y2={oy - Math.sin(angle) * ORBIT_R}
                stroke={`${orbitColor}30`}
                strokeWidth={1.5}
              />

              {/* Orbit → sub connectors */}
              {mySubNodes.map((sub, si) => {
                const sa = subAngles[si]
                const sx = ox + Math.cos(sa) * SUB_DIST
                const sy = oy + Math.sin(sa) * SUB_DIST
                return (
                  <line
                    key={`conn-${sub.id}`}
                    x1={ox + Math.cos(sa) * ORBIT_R}
                    y1={oy + Math.sin(sa) * ORBIT_R}
                    x2={sx - Math.cos(sa) * SUB_R}
                    y2={sy - Math.sin(sa) * SUB_R}
                    stroke={`${orbitColor}22`}
                    strokeWidth={1}
                  />
                )
              })}

              {/* Orbit node */}
              <NodeCircle
                cx={ox} cy={oy} r={ORBIT_R}
                color={orbitColor}
                label={orbit.label}
                progress={orbitProgress}
                achieved={achievedIds.has(orbit.id)}
                large={true}
              />

              {/* Sub nodes */}
              {mySubNodes.map((sub, si) => {
                const sa = subAngles[si]
                const sx = ox + Math.cos(sa) * SUB_DIST
                const sy = oy + Math.sin(sa) * SUB_DIST
                const subProgress = progressMap[sub.id] ?? { current: 0, target: 0, unit: '', pct: 0, hasGoal: false }
                // Label points outward from orbit center
                const labelDir = sa
                return (
                  <NodeCircle
                    key={sub.id}
                    cx={sx} cy={sy} r={SUB_R}
                    color={orbitColor}
                    label={sub.label}
                    progress={subProgress}
                    achieved={achievedIds.has(sub.id)}
                    large={false}
                    labelDir={labelDir}
                  />
                )
              })}
            </g>
          )
        })}

        {/* Core node (drawn last, on top) */}
        <circle cx={CX} cy={CY} r={CORE_R + 10}
          fill="none" stroke={`${colors.core}18`} strokeWidth={10} />
        <circle
          cx={CX} cy={CY} r={CORE_R}
          fill={`${colors.core}18`}
          stroke={colors.core}
          strokeWidth={2}
          style={{ filter: `drop-shadow(0 0 12px ${colors.core}88)` }}
        />
        <text
          x={CX} y={CY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={colors.core}
          fontSize={18}
          fontWeight={800}
          fontFamily="Pretendard, system-ui, sans-serif"
        >
          {core?.label ?? '나'}
        </text>
      </svg>
    )
  }
)

export default MandalaView
