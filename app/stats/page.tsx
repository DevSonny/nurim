'use client'
import { useState, useEffect } from 'react'
import BottomNav from '@/components/ui/BottomNav'
import { colors, fonts, fontSize } from '@/lib/tokens'
import { useGraph } from '@/lib/use-data'
import {
  getSeries,
  getStreak,
  getActivityRate,
  getBestDayOfWeek,
  getOrbitAndSubIds,
  getHeatmap,
  getCategoryTotals,
  formatValue,
  getThisWeekRate,
} from '@/lib/aggregate'
import type { CategoryTotal, StoredNode } from '@/lib/aggregate'
import { useIsDesktop } from '@/lib/use-media'

type Timeframe = 'day' | 'week' | 'month'
const TIMEFRAME_LABELS: Record<Timeframe, string> = { day: '일간', week: '주간', month: '월간' }
const SERIES_COUNT: Record<Timeframe, number> = { day: 14, week: 8, month: 6 }
const DAYS_7 = ['월', '화', '수', '목', '금', '토', '일']

export default function StatsPage() {
  const isDesktop = useIsDesktop()
  const { nodes, pulses, isLoading, isError } = useGraph()
  const [tab, setTab] = useState<string>('개요')
  const [timeframe, setTimeframe] = useState<Timeframe>('week')

  if (isError) return <div>Error loading data</div>
  if (isLoading) return null

  const orbits = nodes.filter(n => n.type === 'orbit')
  const tabs = ['개요', ...orbits.map(o => o.label)]

  const accent = (() => {
    if (tab === '개요') return colors.core
    const orbit = orbits.find(o => o.label === tab)
    return orbit ? colors.orbits[orbit.orbitIdx % colors.orbits.length] : colors.core
  })()

  const tabIds: string[] | null = (() => {
    if (tab === '개요') return null
    const orbit = orbits.find(o => o.label === tab)
    if (!orbit) return null
    return getOrbitAndSubIds(nodes, orbit.id)
  })()

  const metric = tabIds ? 'kind' : 'count'
  const seriesIds = tabIds ?? nodes.map(n => n.id)
  const count = SERIES_COUNT[timeframe]
  const series = getSeries(pulses, seriesIds, timeframe, count, { metric })
  const seriesUnit = series[0]?.unit ?? '회'

  const streak = tabIds ? getStreak(pulses, tabIds[0]) : getStreak(pulses)
  const activityRate = getActivityRate(pulses, tabIds)
  const bestDay = getBestDayOfWeek(pulses, tabIds)
  const thisWeekRate = getThisWeekRate(pulses)
  const heatmap = getHeatmap(pulses, tabIds ?? nodes.map(n => n.id).filter(id => {
    const node = nodes.find(n => n.id === id)
    return node?.type !== 'core'
  }))

  const categoryTotalsAll = getCategoryTotals(nodes, pulses, tabIds, 'all')
  const categoryTotalsMonth = getCategoryTotals(nodes, pulses, tabIds, 'month')

  const trendSeries = getSeries(pulses, seriesIds, 'month', 6, { metric })

  return (
    <main
      style={{
        minHeight: '100vh',
        background: colors.ground,
        color: colors.text,
        overflowY: 'auto',
        paddingBottom: 100,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '52px 24px 16px',
          position: 'sticky',
          top: 0,
          background: `${colors.ground}ee`,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          zIndex: 20,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.5px' }}>통계</h1>
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['day', 'week', 'month'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '10px',
                  border: `1px solid ${timeframe === tf ? accent + '88' : colors.border}`,
                  background: timeframe === tf ? accent + '18' : 'transparent',
                  color: timeframe === tf ? accent : `${colors.text}55`,
                  fontSize: 11,
                  fontWeight: timeframe === tf ? 700 : 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {TIMEFRAME_LABELS[tf]}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '2px' }}>
          {tabs.map(t => {
            const isActive = t === tab
            const c = t === '개요'
              ? colors.core
              : (() => {
                  const orbit = orbits.find(o => o.label === t)
                  return orbit ? colors.orbits[orbit.orbitIdx % colors.orbits.length] : colors.core
                })()
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flexShrink: 0,
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: `1px solid ${isActive ? c + '88' : colors.border}`,
                  background: isActive ? c + '18' : 'transparent',
                  color: isActive ? c : `${colors.text}55`,
                  fontSize: '12px',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
              >
                {t}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ padding: '20px 20px 0', maxWidth: isDesktop ? 760 : undefined, margin: '0 auto' }}>
        {/* Summary cards — 4개: 연속/활동비율/가장강한날/이번주활동률 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isDesktop ? 'repeat(4, 1fr)' : '1fr 1fr',
            gap: '10px',
            marginBottom: '20px',
          }}
        >
          <SummaryCard label="연속 달성" value={`${streak}일`} accent={accent} />
          <SummaryCard label="활동 비율" value={`${activityRate}%`} accent={accent} />
          <SummaryCard label="가장 강한 날" value={bestDay} accent={accent} />
          <SummaryCard label="이번 주 달성" value={`${thisWeekRate}%`} accent={accent} />
        </div>

        {/* Bar chart */}
        <Section title={`${TIMEFRAME_LABELS[timeframe]} 기록`} accent={accent} unit={seriesUnit}>
          {series.every(s => s.value === 0) ? (
            <EmptyChart accent={accent} />
          ) : (
            <BarChart series={series} accent={accent} timeframe={timeframe} />
          )}
        </Section>

        {/* 카테고리별 합계 */}
        {categoryTotalsAll.length > 0 && (
          <Section title="카테고리별 합계" accent={accent}>
            <CategoryList totals={categoryTotalsAll} orbits={orbits} />
          </Section>
        )}

        {/* Heatmap */}
        <Section title="7주 활동 히트맵" accent={accent}>
          {heatmap.every(row => row.every(v => v === 0)) ? (
            <EmptyChart accent={accent} />
          ) : (
            <Heatmap data={heatmap} accent={accent} />
          )}
        </Section>

        {/* 이번 달 종합 — 중앙 정렬 도넛 + 월별 단위합계 */}
        <Section title="이번 달 종합" accent={accent}>
          <RadialScore value={activityRate} streak={streak} accent={accent} isDesktop={isDesktop} />
          {categoryTotalsMonth.length > 0 && (
            <MonthTotalsGrid totals={categoryTotalsMonth} orbits={orbits} />
          )}
        </Section>

        {/* 월간 추이 */}
        <Section title="월간 추이" accent={accent} unit={trendSeries[0]?.unit ?? '회'}>
          {trendSeries.every(s => s.value === 0) ? (
            <EmptyChart accent={accent} />
          ) : (
            <TrendLine series={trendSeries} accent={accent} isDesktop={isDesktop} />
          )}
        </Section>
      </div>

      <BottomNav />
    </main>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SummaryCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${accent}22`,
        borderRadius: '14px',
        padding: '16px',
      }}
    >
      <div style={{ fontSize: '10px', color: `${colors.text}44`, marginBottom: '6px', letterSpacing: '0.3px' }}>{label}</div>
      <div style={{ fontSize: '20px', fontWeight: 800, color: accent, letterSpacing: '-0.3px', fontFamily: fonts.display }}>{value}</div>
    </div>
  )
}

function Section({ title, accent, unit, children }: { title: string; accent: string; unit?: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: `1px solid ${colors.border}`,
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
        <div
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: accent,
            letterSpacing: '0.5px',
            textTransform: 'uppercase' as const,
            opacity: 0.8,
          }}
        >
          {title}
        </div>
        {unit && (
          <div style={{ fontSize: '10px', color: `${colors.text}33`, fontWeight: 500 }}>· {unit}</div>
        )}
      </div>
      {children}
    </div>
  )
}

function EmptyChart({ accent }: { accent: string }) {
  return (
    <div style={{ padding: '20px', textAlign: 'center', color: `${colors.text}33`, fontSize: '12px' }}>
      아직 기록이 없어요 ·{' '}
      <span style={{ color: `${accent}88` }}>교신에서 기록을 시작하세요</span>
    </div>
  )
}

function fmtTick(v: number, unit: string): string {
  if (unit === '원') {
    const abs = Math.abs(v)
    if (abs >= 10000) return `${Math.round(abs / 10000)}만`
    return String(Math.round(abs))
  }
  if (v >= 1000) return `${Math.round(v / 1000)}k`
  return String(Math.round(v * 10) / 10)
}

function BarChart({ series, accent, timeframe }: {
  series: { label: string; value: number; unit: string }[]
  accent: string
  timeframe: Timeframe
}) {
  const absMax = Math.max(1, ...series.map(s => Math.abs(s.value)))
  const show = timeframe === 'day' ? series.slice(-10) : series
  const unit = series[0]?.unit ?? ''
  const mid = absMax / 2
  const EXPENSE_COLOR = '#ff4466'

  return (
    <div>
      <div style={{ display: 'flex', gap: '4px' }}>
        {/* Y-axis */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          alignItems: 'flex-end', width: '30px', height: '80px', paddingBottom: '16px',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '8px', color: `${colors.text}44`, lineHeight: 1 }}>{fmtTick(absMax, unit)}</span>
          <span style={{ fontSize: '8px', color: `${colors.text}33`, lineHeight: 1 }}>{fmtTick(mid, unit)}</span>
          <span style={{ fontSize: '8px', color: `${colors.text}44`, lineHeight: 1 }}>0</span>
        </div>
        {/* Bars */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '5px', height: '80px' }}>
          {show.map((s, i) => {
            const h = (Math.abs(s.value) / absMax) * 72
            const isLast = i === show.length - 1
            const isNeg = s.value < 0
            const barColor = isNeg ? EXPENSE_COLOR : (isLast ? accent : `${accent}55`)
            return (
              <div
                key={s.label}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
              >
                <div
                  style={{
                    width: '100%',
                    height: `${Math.max(h, s.value !== 0 ? 2 : 0)}px`,
                    borderRadius: '4px 4px 2px 2px',
                    background: barColor,
                    boxShadow: isLast && !isNeg ? `0 0 12px ${accent}66` : undefined,
                    transition: 'height 0.4s',
                  }}
                />
                <span
                  style={{
                    fontSize: '9px',
                    color: isLast ? accent : `${colors.text}44`,
                    fontWeight: isLast ? 700 : 400,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function CategoryList({ totals, orbits }: { totals: CategoryTotal[]; orbits: StoredNode[] }) {
  const EXPENSE_COLOR = '#ff4466'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {totals.map((t, i) => {
        const orbit = orbits.find(o => o.id === t.orbitId)
        const orbitColor = orbit ? colors.orbits[orbit.orbitIdx % colors.orbits.length] : colors.core
        const isNegMoney = t.kind === 'money' && t.value < 0
        const valueColor = t.kind === 'money' ? (isNegMoney ? EXPENSE_COLOR : orbitColor) : orbitColor
        return (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '12px', color: `${colors.text}66`, marginRight: '6px' }}>{t.orbitLabel}</span>
              <span style={{ fontSize: '10px', color: `${colors.text}33` }}>{t.unit}</span>
            </div>
            <span
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: valueColor,
                fontFamily: fonts.display,
                letterSpacing: '-0.3px',
              }}
            >
              {formatValue(t.value, t.kind)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function Heatmap({ data, accent }: { data: number[][]; accent: string }) {
  return (
    <div>
      <div style={{ display: 'flex', gap: '3px', marginBottom: '3px', paddingLeft: '2px' }}>
        {DAYS_7.map(d => (
          <div key={d} style={{ flex: 1, textAlign: 'center', fontSize: '8px', color: `${colors.text}33` }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {data.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', gap: '3px' }}>
            {week.map((val, di) => (
              <div
                key={di}
                style={{
                  flex: 1,
                  aspectRatio: '1',
                  borderRadius: '3px',
                  background: val < 0.05
                    ? 'rgba(255,255,255,0.04)'
                    : `${accent}${Math.round(Math.max(0, val) * 220).toString(16).padStart(2, '0')}`,
                  boxShadow: val > 0.8 ? `0 0 6px ${accent}66` : undefined,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function RadialScore({
  value, streak, accent, isDesktop,
}: { value: number; streak: number; accent: string; isDesktop: boolean }) {
  const r = 56
  const circ = 2 * Math.PI * r
  const dash = (value / 100) * circ
  const svgSize = isDesktop ? 200 : 170

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={svgSize} height={svgSize} viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={r}
          fill="none"
          stroke={accent}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          transform="rotate(-90 70 70)"
          style={{ filter: `drop-shadow(0 0 10px ${accent}99)` }}
        />
        <text x="70" y="62" textAnchor="middle" dominantBaseline="middle"
          fill={accent} fontSize="30" fontWeight="800" fontFamily="'Space Grotesk', sans-serif">
          {value}
        </text>
        <text x="70" y="82" textAnchor="middle" dominantBaseline="middle"
          fill={`${colors.text}55`} fontSize="10">
          활동률 %
        </text>
      </svg>
      <div style={{ display: 'flex', gap: '32px', marginTop: '12px' }}>
        <ScoreRow label="현재 연속" val={`${streak}일`} accent={accent} />
        <ScoreRow label="활동률" val={`${value}%`} accent={`${colors.text}44`} />
      </div>
    </div>
  )
}

function ScoreRow({ label, val, accent }: { label: string; val: string; accent: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '9px', color: `${colors.text}44`, marginBottom: '2px' }}>{label}</div>
      <div style={{ fontSize: '15px', fontWeight: 700, color: accent, fontFamily: fonts.display }}>{val}</div>
    </div>
  )
}

function MonthTotalsGrid({ totals, orbits }: { totals: CategoryTotal[]; orbits: StoredNode[] }) {
  const EXPENSE_COLOR = '#ff4466'
  return (
    <div
      style={{
        marginTop: '20px',
        borderTop: `1px solid ${colors.border}`,
        paddingTop: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '100%',
      }}
    >
      <div style={{ fontSize: '10px', color: `${colors.text}33`, letterSpacing: '0.3px', textTransform: 'uppercase', marginBottom: '2px' }}>
        이번 달 항목별
      </div>
      {totals.map((t, i) => {
        const orbit = orbits.find(o => o.id === t.orbitId)
        const orbitColor = orbit ? colors.orbits[orbit.orbitIdx % colors.orbits.length] : colors.core
        const isNegMoney = t.kind === 'money' && t.value < 0
        const valueColor = t.kind === 'money' ? (isNegMoney ? EXPENSE_COLOR : orbitColor) : orbitColor
        return (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: `${colors.text}66` }}>{t.orbitLabel}</span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: valueColor, fontFamily: fonts.display }}>
              {formatValue(t.value, t.kind)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function TrendLine({
  series, accent, isDesktop,
}: { series: { label: string; value: number; unit: string }[]; accent: string; isDesktop: boolean }) {
  const vals = series.map(s => s.value)
  const unit = series[0]?.unit ?? ''
  const W = 260, H = 70
  const AXIS_W = 30
  const max = Math.max(...vals)
  if (max === 0) return <EmptyChart accent={accent} />
  const min = Math.max(0, Math.min(...vals) - Math.ceil(max * 0.1))
  const range = Math.max(max - min, 1)

  const pts = vals.map((v, i) => [
    AXIS_W + (i / Math.max(vals.length - 1, 1)) * (W - 20) + 10,
    H - ((v - min) / range) * (H - 16) - 8,
  ])
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const areaClose = `L${pts[pts.length - 1][0]},${H} L${pts[0][0]},${H} Z`
  const gradId = `grad-trend-${accent.replace('#', '')}`
  const totalW = W + AXIS_W

  const yMax = fmtTick(max, unit)
  const yMin = fmtTick(min, unit)

  return (
    <div style={{ overflowX: isDesktop ? 'visible' : 'auto' }}>
      <svg
        width={isDesktop ? '100%' : totalW}
        height={H + 20}
        viewBox={`0 0 ${totalW} ${H + 20}`}
        style={{ display: 'block' }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.3" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Y-axis ticks */}
        <text x={AXIS_W - 3} y="10" textAnchor="end" fill={`${colors.text}44`} fontSize="8">{yMax}</text>
        <text x={AXIS_W - 3} y={H - 4} textAnchor="end" fill={`${colors.text}33`} fontSize="8">{yMin}</text>
        {/* Chart */}
        <path d={`${d} ${areaClose}`} fill={`url(#${gradId})`} />
        <path d={d} fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${accent}88)` }} />
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="3" fill={accent}
            style={{ filter: `drop-shadow(0 0 4px ${accent})` }} />
        ))}
        {series.map((s, i) => (
          <text key={i} x={pts[i][0]} y={H + 14} textAnchor="middle"
            fill={`${colors.text}44`} fontSize="9">{s.label}</text>
        ))}
      </svg>
    </div>
  )
}
