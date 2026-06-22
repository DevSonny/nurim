'use client'
import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/ui/BottomNav'
import { colors } from '@/lib/tokens'

const SHARE_TEMPLATES = [
  { id: 'streak', label: '연속 달성', icon: '🔥' },
  { id: 'weekly', label: '주간 리포트', icon: '📊' },
  { id: 'goal',   label: '목표 달성', icon: '⚡' },
  { id: 'custom', label: '자유 형식', icon: '✦' },
]

const MOCK_STATS = {
  streak: 14,
  weeklyAvg: 87,
  todayCount: 3,
  topOrbit: '공부',
  topOrbitColor: '#c040ff',
  quote: '작은 기록들이 쌓여 큰 변화를 만든다',
}

export default function SharePage() {
  const router = useRouter()
  const [template, setTemplate] = useState('streak')
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleCopyImage = useCallback(async () => {
    // Canvas snapshot approach using html2canvas-style manual rendering
    // For now, show copied feedback (actual canvas capture requires html2canvas)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      await navigator.share({
        title: '누림 — 오늘의 기록',
        text: `🔥 ${MOCK_STATS.streak}일 연속 달성! 매일이 자라는 곳, 누림`,
        url: window.location.origin,
      })
    }
  }, [])

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
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            background: 'none', border: 'none',
            color: `${colors.text}55`, fontSize: '20px',
            cursor: 'pointer', padding: '4px', fontFamily: 'inherit',
          }}
        >
          ←
        </button>
        <h1 style={{ fontSize: '17px', fontWeight: 700 }}>공유 카드</h1>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Template picker */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto' }}>
          {SHARE_TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              style={{
                flexShrink: 0,
                padding: '8px 14px',
                borderRadius: '12px',
                border: `1px solid ${template === t.id ? colors.core + '88' : colors.border}`,
                background: template === t.id ? `${colors.core}14` : 'rgba(255,255,255,0.03)',
                color: template === t.id ? colors.core : `${colors.text}55`,
                fontSize: '12px',
                fontWeight: template === t.id ? 700 : 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Preview card */}
        <div
          ref={cardRef}
          style={{
            borderRadius: '20px',
            overflow: 'hidden',
            marginBottom: '16px',
            border: `1px solid ${colors.border}`,
          }}
        >
          <ShareCard template={template} stats={MOCK_STATS} />
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
          <button
            onClick={handleCopyImage}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '14px',
              border: `1px solid ${colors.border}`,
              background: 'rgba(255,255,255,0.05)',
              color: copied ? colors.core : colors.text,
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
          >
            {copied ? '✓ 복사됨' : '이미지 복사'}
          </button>
          <button
            onClick={handleShare}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '14px',
              border: 'none',
              background: `linear-gradient(135deg, ${colors.core}, #0099cc)`,
              color: colors.ground,
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: `0 0 24px ${colors.core}44`,
              transition: 'all 0.2s',
            }}
          >
            공유하기
          </button>
        </div>

        {/* Post to community */}
        <button
          onClick={() => router.push('/community')}
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: '14px',
            border: `1px solid ${colors.border}`,
            background: 'transparent',
            color: `${colors.text}66`,
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          커뮤니티에 올리기
        </button>
      </div>

      <BottomNav />
    </main>
  )
}

function ShareCard({
  template,
  stats,
}: {
  template: string
  stats: typeof MOCK_STATS
}) {
  const bg = `linear-gradient(135deg, #0d0d1a 0%, #0a0a14 60%, #0d0818 100%)`

  return (
    <div
      style={{
        background: bg,
        padding: '28px 24px',
        minHeight: '220px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative glow orbs */}
      <div style={{
        position: 'absolute', top: '-30px', right: '-20px',
        width: '140px', height: '140px', borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.core}22 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20px', left: '10%',
        width: '100px', height: '100px', borderRadius: '50%',
        background: `radial-gradient(circle, #c040ff22 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Brand */}
      <div style={{
        fontSize: '11px', fontWeight: 700, color: `${colors.text}44`,
        letterSpacing: '1.5px', textTransform: 'uppercase' as const,
        marginBottom: '16px',
      }}>
        NURIM · 누림
      </div>

      {template === 'streak' && (
        <StreakCard stats={stats} />
      )}
      {template === 'weekly' && (
        <WeeklyCard stats={stats} />
      )}
      {template === 'goal' && (
        <GoalCard stats={stats} />
      )}
      {template === 'custom' && (
        <CustomCard stats={stats} />
      )}

      {/* Bottom quote */}
      <div style={{
        marginTop: '20px',
        padding: '10px 12px',
        background: 'rgba(255,255,255,0.04)',
        borderLeft: `2px solid ${colors.core}55`,
        borderRadius: '0 8px 8px 0',
        fontSize: '11px',
        color: `${colors.text}55`,
        fontStyle: 'italic',
        lineHeight: 1.5,
      }}>
        {stats.quote}
      </div>
    </div>
  )
}

function StreakCard({ stats }: { stats: typeof MOCK_STATS }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
        <span style={{
          fontSize: '64px', fontWeight: 900, color: colors.core,
          lineHeight: 1,
          textShadow: `0 0 30px ${colors.core}88`,
        }}>
          {stats.streak}
        </span>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: colors.text }}>일</div>
          <div style={{ fontSize: '12px', color: `${colors.text}55` }}>연속 달성</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <MiniStat label="오늘 기록" val={`${stats.todayCount}개`} color={colors.core} />
        <MiniStat label="주간 달성률" val={`${stats.weeklyAvg}%`} color="#c040ff" />
        <MiniStat label="최강 영역" val={stats.topOrbit} color={stats.topOrbitColor} />
      </div>
    </div>
  )
}

function WeeklyCard({ stats }: { stats: typeof MOCK_STATS }) {
  const DAYS = ['월', '화', '수', '목', '금', '토', '일']
  const vals = [72, 88, 45, 93, 67, 100, 55]
  return (
    <div>
      <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: colors.text }}>
        이번 주 리포트
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '60px', marginBottom: '8px' }}>
        {DAYS.map((d, i) => (
          <div key={d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
            <div style={{
              width: '100%', height: `${(vals[i] / 100) * 52}px`,
              background: i === 4 ? colors.core : `${colors.core}44`,
              borderRadius: '3px 3px 1px 1px',
              boxShadow: i === 4 ? `0 0 8px ${colors.core}66` : undefined,
            }} />
            <span style={{ fontSize: '8px', color: `${colors.text}44` }}>{d}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: '20px', fontWeight: 800, color: colors.core }}>
        평균 {stats.weeklyAvg}%
      </div>
    </div>
  )
}

function GoalCard({ stats }: { stats: typeof MOCK_STATS }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle
          cx="50" cy="50" r="40" fill="none"
          stroke={colors.core} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={`${(stats.weeklyAvg / 100) * 251} 251`}
          transform="rotate(-90 50 50)"
          style={{ filter: `drop-shadow(0 0 6px ${colors.core}99)` }}
        />
        <text x="50" y="46" textAnchor="middle" fill={colors.core} fontSize="20" fontWeight="800">
          {stats.weeklyAvg}
        </text>
        <text x="50" y="60" textAnchor="middle" fill={`${colors.text}55`} fontSize="9">
          달성률
        </text>
      </svg>
      <div>
        <div style={{ fontSize: '13px', color: `${colors.text}55`, marginBottom: '6px' }}>이달의 목표</div>
        <div style={{ fontSize: '22px', fontWeight: 800, color: colors.text, marginBottom: '4px' }}>
          {stats.topOrbit} 마스터
        </div>
        <div style={{ fontSize: '12px', color: stats.topOrbitColor }}>
          🔥 {stats.streak}일 연속 중
        </div>
      </div>
    </div>
  )
}

function CustomCard({ stats }: { stats: typeof MOCK_STATS }) {
  return (
    <div>
      <div style={{ fontSize: '28px', fontWeight: 900, color: colors.text, lineHeight: 1.2, marginBottom: '12px' }}>
        오늘도<br />
        <span style={{ color: colors.core, textShadow: `0 0 20px ${colors.core}66` }}>성장했다</span>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <MiniStat label="연속" val={`${stats.streak}일`} color={colors.core} />
        <MiniStat label="기록" val={`${stats.todayCount}개`} color="#44ff88" />
      </div>
    </div>
  )
}

function MiniStat({ label, val, color }: { label: string; val: string; color: string }) {
  return (
    <div style={{
      padding: '6px 10px',
      background: `${color}14`,
      border: `1px solid ${color}33`,
      borderRadius: '8px',
    }}>
      <div style={{ fontSize: '8px', color: `${color}88`, marginBottom: '2px' }}>{label}</div>
      <div style={{ fontSize: '13px', fontWeight: 700, color }}>{val}</div>
    </div>
  )
}
