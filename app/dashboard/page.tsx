'use client'
import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import BottomNav from '@/components/ui/BottomNav'
import { colors, fonts, fontSize } from '@/lib/tokens'
import { getNodes, getAchievedIds } from '@/lib/store'
import type { StoredNode } from '@/lib/store'
import {
  getStreak,
  getTodayPulseCount,
  getThisWeekRate,
  getProgress,
} from '@/lib/aggregate'
import type { Progress } from '@/lib/aggregate'
import type { MandalaViewHandle } from '@/components/mandala/MandalaView'

const SolarCanvas = dynamic(() => import('@/components/solar'), { ssr: false })
const MandalaView = dynamic(
  () => import('@/components/mandala/MandalaView'),
  { ssr: false }
)

export default function DashboardPage() {
  const router = useRouter()
  const [view, setView] = useState<'3d' | '2d'>('3d')

  // Live stats
  const [streak, setStreak] = useState(0)
  const [todayCount, setTodayCount] = useState(0)
  const [weekRate, setWeekRate] = useState(0)
  const [progressItems, setProgressItems] = useState<{ node: StoredNode; prog: Progress }[]>([])
  const [achievedIds, setAchievedIds] = useState<Set<string>>(new Set())

  // Mandala data
  const [core, setCore] = useState<StoredNode | null>(null)
  const [orbits, setOrbits] = useState<StoredNode[]>([])
  const [subs, setSubs] = useState<StoredNode[]>([])
  const [progressMap, setProgressMap] = useState<Record<string, Progress>>({})

  const mandalaRef = useRef<MandalaViewHandle>(null)

  // Live date
  const now = new Date()
  const dateLabel = `${now.getFullYear()}년 ${now.getMonth() + 1}월`

  const refresh = () => {
    const nodes = getNodes()
    const orbitNodes = nodes.filter(n => n.type === 'orbit')
    const subNodes = nodes.filter(n => n.type === 'sub')
    const coreNode = nodes.find(n => n.type === 'core') ?? null
    const achieved = getAchievedIds()

    setStreak(getStreak())
    setTodayCount(getTodayPulseCount())
    setWeekRate(getThisWeekRate())
    setAchievedIds(achieved)

    // Progress items for HUD (nodes with goals)
    const items = [...orbitNodes, ...subNodes]
      .map(n => ({ node: n, prog: getProgress(n.id) }))
      .filter(({ prog }) => prog.hasGoal)
    setProgressItems(items)

    // Mandala data
    setCore(coreNode)
    setOrbits(orbitNodes)
    setSubs(subNodes)
    const map: Record<string, Progress> = {}
    nodes.forEach(n => { map[n.id] = getProgress(n.id) })
    setProgressMap(map)
  }

  useEffect(() => { refresh() }, [])

  return (
    <main
      style={{
        position: 'relative',
        height: '100vh',
        background: colors.ground,
        overflow: 'hidden',
      }}
    >
      {/* 3D / 2D canvas */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {view === '3d' ? (
          <SolarCanvas />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 16px 100px',
            }}
          >
            <MandalaView
              ref={mandalaRef}
              core={core}
              orbits={orbits}
              subs={subs}
              progressMap={progressMap}
              achievedIds={achievedIds}
            />
          </div>
        )}
      </div>

      {/* Edge vignette (3D only) */}
      {view === '3d' && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 90% 70% at 50% 50%, transparent 40%, rgba(8,8,16,0.65) 100%)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Top bar */}
      <header
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px 16px',
        }}
      >
        <div
          style={{
            fontSize: fontSize.xs,
            color: `${colors.text}55`,
            letterSpacing: '0.5px',
            fontWeight: 500,
          }}
        >
          {dateLabel}
        </div>

        <div
          style={{
            fontSize: '22px',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            color: colors.core,
            textShadow: `0 0 24px ${colors.core}66`,
            pointerEvents: 'none',
          }}
        >
          누림
        </div>

        {/* 2D/3D toggle + settings */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setView(v => v === '3d' ? '2d' : '3d')}
            style={{
              background: `${colors.core}14`,
              border: `1px solid ${colors.core}33`,
              borderRadius: '10px',
              color: colors.core,
              fontSize: fontSize.xs,
              fontWeight: 700,
              cursor: 'pointer',
              padding: '5px 10px',
              fontFamily: 'inherit',
              letterSpacing: '0.3px',
            }}
          >
            {view === '3d' ? '2D' : '3D'}
          </button>

          {view === '2d' && (
            <button
              onClick={() => mandalaRef.current?.savePNG()}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: `1px solid ${colors.border}`,
                borderRadius: '10px',
                color: `${colors.text}88`,
                fontSize: fontSize.xs,
                cursor: 'pointer',
                padding: '5px 8px',
                fontFamily: 'inherit',
              }}
              title="이미지 저장"
            >
              ↓
            </button>
          )}

          <button
            onClick={() => router.push('/settings')}
            style={{
              background: 'none',
              border: 'none',
              color: `${colors.text}55`,
              fontSize: '16px',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            ⚙
          </button>
        </div>
      </header>

      {/* Quick stats — bottom left */}
      <div
        style={{
          position: 'absolute',
          bottom: 110,
          left: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          pointerEvents: 'none',
        }}
      >
        <StatChip label="연속 달성" value={`${streak}일`} color={colors.core} />
        <StatChip label="오늘 교신" value={String(todayCount)} color="#c040ff" />
        <StatChip label="이번 주" value={`${weekRate}%`} color="#44ff88" />
      </div>

      {/* Progress HUD — bottom right */}
      {progressItems.length > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: 110,
            right: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            pointerEvents: 'none',
            maxWidth: 160,
          }}
        >
          {progressItems.slice(0, 4).map(({ node, prog }) => {
            const c = colors.orbits[node.orbitIdx % colors.orbits.length]
            return (
              <div
                key={node.id}
                style={{
                  background: 'rgba(8,8,16,0.65)',
                  border: `1px solid ${c}33`,
                  borderRadius: '10px',
                  padding: '6px 10px',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10px', color: `${colors.text}66` }}>{node.label}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: c, fontFamily: fonts.display }}>
                    {prog.current}{prog.unit}
                  </span>
                </div>
                <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${prog.pct * 100}%`, background: c, borderRadius: '2px', boxShadow: `0 0 4px ${c}` }} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Node hint (3D only) */}
      {view === '3d' && progressItems.length === 0 && (
        <p
          style={{
            position: 'absolute',
            bottom: 110,
            right: 24,
            fontSize: '10px',
            color: `${colors.text}33`,
            textAlign: 'right',
            lineHeight: 1.7,
            pointerEvents: 'none',
          }}
        >
          위성·행성 클릭 — 달성
        </p>
      )}

      <BottomNav />
    </main>
  )
}

function StatChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(8,8,16,0.65)',
        border: `1px solid ${color}33`,
        borderRadius: '12px',
        padding: '7px 12px',
        backdropFilter: 'blur(12px)',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 8px ${color}`,
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: '10px', color: `${colors.text}66`, letterSpacing: '0.3px' }}>
        {label}
      </span>
      <span
        style={{
          fontSize: fontSize.sm,
          fontWeight: 700,
          color,
          marginLeft: '2px',
          fontFamily: fonts.display,
        }}
      >
        {value}
      </span>
    </div>
  )
}
