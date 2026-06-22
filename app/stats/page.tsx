'use client'
import { useState } from 'react'
import BottomNav from '@/components/ui/BottomNav'
import { colors } from '@/lib/tokens'

const TABS = ['개요', '학습', '운동', '재테크', '건강', '관계'] as const
type Tab = typeof TABS[number]

const TAB_COLORS: Record<Tab, string> = {
  '개요': colors.core,
  '학습': colors.orbits[0],
  '운동': colors.orbits[1],
  '재테크': colors.orbits[2],
  '건강': colors.orbits[3],
  '관계': colors.orbits[4],
}

// Mock weekly data (Mon–Sun, %)
const WEEKLY: Record<Tab, number[]> = {
  '개요': [72, 88, 45, 93, 67, 100, 55],
  '학습': [80, 95, 50, 100, 70, 85, 60],
  '운동': [100, 80, 30, 90, 60, 100, 40],
  '재테크': [60, 75, 55, 85, 75, 90, 70],
  '건강': [55, 90, 40, 95, 65, 100, 50],
  '관계': [70, 85, 55, 88, 72, 95, 58],
}

const DAYS = ['월', '화', '수', '목', '금', '토', '일']

// Heatmap: 7 weeks × 7 days mock values 0-1
const HEATMAP: Record<Tab, number[][]> = Object.fromEntries(
  TABS.map(t => [
    t,
    Array.from({ length: 7 }, (_, w) =>
      Array.from({ length: 7 }, (_, d) => {
        const base = WEEKLY[t][d] / 100
        const noise = (Math.sin(w * 13 + d * 7 + TABS.indexOf(t as Tab) * 3) + 1) / 2
        return Math.min(1, Math.max(0, base * 0.7 + noise * 0.3))
      })
    ),
  ])
) as Record<Tab, number[][]>

const STATS_SUMMARY: Record<Tab, { streak: number; total: number; avg: number; best: string }> = {
  '개요': { streak: 14, total: 342, avg: 78, best: '목요일' },
  '학습': { streak: 21, total: 128, avg: 82, best: '월요일' },
  '운동': { streak: 9,  total: 87,  avg: 74, best: '토요일' },
  '재테크': { streak: 14, total: 52,  avg: 71, best: '금요일' },
  '건강': { streak: 6,  total: 44,  avg: 69, best: '목요일' },
  '관계': { streak: 30, total: 31,  avg: 81, best: '주말' },
}

export default function StatsPage() {
  const [tab, setTab] = useState<Tab>('개요')
  const accent = TAB_COLORS[tab]
  const weekly = WEEKLY[tab]
  const heatmap = HEATMAP[tab]
  const summary = STATS_SUMMARY[tab]

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
        <h1
          style={{
            fontSize: '22px',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            marginBottom: '14px',
          }}
        >
          통계
        </h1>

        {/* Tab strip */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            paddingBottom: '2px',
          }}
        >
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flexShrink: 0,
                padding: '6px 14px',
                borderRadius: '20px',
                border: `1px solid ${t === tab ? TAB_COLORS[t] + '88' : colors.border}`,
                background: t === tab ? TAB_COLORS[t] + '18' : 'transparent',
                color: t === tab ? TAB_COLORS[t] : `${colors.text}55`,
                fontSize: '12px',
                fontWeight: t === tab ? 700 : 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
                letterSpacing: '0.2px',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        {/* Summary cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginBottom: '20px',
          }}
        >
          <SummaryCard label="연속 달성" value={`${summary.streak}일`} accent={accent} />
          <SummaryCard label="총 기록" value={`${summary.total}회`} accent={accent} />
          <SummaryCard label="평균 달성률" value={`${summary.avg}%`} accent={accent} />
          <SummaryCard label="가장 강한 날" value={summary.best} accent={accent} />
        </div>

        {/* Weekly bar chart */}
        <Section title="이번 주 달성률" accent={accent}>
          <WeeklyBars days={DAYS} values={weekly} accent={accent} />
        </Section>

        {/* Activity heatmap */}
        <Section title="7주 활동 히트맵" accent={accent}>
          <Heatmap data={heatmap} accent={accent} />
        </Section>

        {/* Radial score */}
        <Section title="이번 달 종합" accent={accent}>
          <RadialScore value={summary.avg} accent={accent} />
        </Section>

        {/* Trend line */}
        <Section title="월간 추이" accent={accent}>
          <TrendLine accent={accent} tab={tab} />
        </Section>
      </div>

      <BottomNav />
    </main>
  )
}

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
      <div style={{ fontSize: '10px', color: `${colors.text}44`, marginBottom: '6px', letterSpacing: '0.3px' }}>
        {label}
      </div>
      <div style={{ fontSize: '20px', fontWeight: 800, color: accent, letterSpacing: '-0.3px' }}>
        {value}
      </div>
    </div>
  )
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
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
      <div
        style={{
          fontSize: '11px',
          fontWeight: 600,
          color: accent,
          marginBottom: '14px',
          letterSpacing: '0.5px',
          textTransform: 'uppercase' as const,
          opacity: 0.8,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  )
}

function WeeklyBars({ days, values, accent }: { days: string[]; values: number[]; accent: string }) {
  const max = Math.max(...values)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '80px' }}>
      {days.map((d, i) => {
        const h = (values[i] / max) * 72
        const isToday = i === new Date().getDay() - 1
        return (
          <div
            key={d}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <div
              style={{
                width: '100%',
                height: `${h}px`,
                borderRadius: '4px 4px 2px 2px',
                background: isToday
                  ? accent
                  : `${accent}55`,
                boxShadow: isToday ? `0 0 12px ${accent}66` : undefined,
                transition: 'height 0.4s',
              }}
            />
            <span
              style={{
                fontSize: '9px',
                color: isToday ? accent : `${colors.text}44`,
                fontWeight: isToday ? 700 : 400,
              }}
            >
              {d}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function Heatmap({ data, accent }: { data: number[][]; accent: string }) {
  return (
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
                background: val < 0.1
                  ? 'rgba(255,255,255,0.04)'
                  : `${accent}${Math.round(val * 220).toString(16).padStart(2, '0')}`,
                boxShadow: val > 0.8 ? `0 0 6px ${accent}66` : undefined,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function RadialScore({ value, accent }: { value: number; accent: string }) {
  const r = 52
  const circ = 2 * Math.PI * r
  const dash = (value / 100) * circ

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle
          cx="65" cy="65" r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
        />
        <circle
          cx="65" cy="65" r={r}
          fill="none"
          stroke={accent}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          transform="rotate(-90 65 65)"
          style={{ filter: `drop-shadow(0 0 8px ${accent}99)` }}
        />
        <text
          x="65" y="60"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={accent}
          fontSize="28"
          fontWeight="800"
        >
          {value}
        </text>
        <text
          x="65" y="80"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={`${colors.text}55`}
          fontSize="10"
        >
          달성률 %
        </text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <ScoreRow label="목표 달성일" val="19일" accent={accent} />
        <ScoreRow label="미달 일수" val="3일" accent={`${colors.text}44`} />
        <ScoreRow label="최고 연속" val="21일" accent={accent} />
      </div>
    </div>
  )
}

function ScoreRow({ label, val, accent }: { label: string; val: string; accent: string }) {
  return (
    <div>
      <div style={{ fontSize: '9px', color: `${colors.text}44`, marginBottom: '2px' }}>{label}</div>
      <div style={{ fontSize: '15px', fontWeight: 700, color: accent }}>{val}</div>
    </div>
  )
}

function TrendLine({ accent, tab }: { accent: string; tab: Tab }) {
  const months = ['1월', '2월', '3월', '4월', '5월', '6월']
  const seed = TABS.indexOf(tab)
  const vals = months.map((_, i) =>
    Math.round(55 + (Math.sin(i * 1.4 + seed) + 1) * 20)
  )
  const W = 280, H = 70
  const min = Math.min(...vals) - 10
  const range = Math.max(...vals) - min + 10
  const pts = vals.map((v, i) => [
    (i / (vals.length - 1)) * (W - 20) + 10,
    H - ((v - min) / range) * (H - 16) - 8,
  ])
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const areaClose = `L${pts[pts.length - 1][0]},${H} L${pts[0][0]},${H} Z`

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg width={W} height={H + 20} viewBox={`0 0 ${W} ${H + 20}`} style={{ display: 'block' }}>
        <defs>
          <linearGradient id={`grad-${tab}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.3" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Area fill */}
        <path d={`${d} ${areaClose}`} fill={`url(#grad-${tab})`} />
        {/* Line */}
        <path d={d} fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 4px ${accent}88)` }} />
        {/* Dots */}
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="3" fill={accent}
            style={{ filter: `drop-shadow(0 0 4px ${accent})` }} />
        ))}
        {/* Labels */}
        {months.map((m, i) => (
          <text key={i} x={pts[i][0]} y={H + 14} textAnchor="middle"
            fill={`${colors.text}44`} fontSize="9">{m}</text>
        ))}
      </svg>
    </div>
  )
}
