import MoleculeCanvas from '@/components/molecule'
import BottomNav from '@/components/ui/BottomNav'
import { colors } from '@/lib/tokens'

export default function DashboardPage() {
  return (
    <main
      style={{
        position: 'relative',
        height: '100vh',
        background: colors.ground,
        overflow: 'hidden',
      }}
    >
      {/* 3D molecule backdrop */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <MoleculeCanvas />
      </div>

      {/* Edge vignette */}
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
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            color: `${colors.text}55`,
            letterSpacing: '0.5px',
            fontWeight: 500,
          }}
        >
          2024년 6월
        </div>
        <div
          style={{
            fontSize: '22px',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            color: colors.core,
            textShadow: `0 0 24px ${colors.core}66`,
          }}
        >
          누림
        </div>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: `${colors.text}55`,
            fontSize: '16px',
            cursor: 'pointer',
            padding: '4px',
            pointerEvents: 'all',
          }}
        >
          ⚙
        </button>
      </header>

      {/* Quick stats — bottom left */}
      <div
        style={{
          position: 'absolute',
          bottom: 110,
          left: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          pointerEvents: 'none',
        }}
      >
        <StatChip label="연속 달성" value="14일" color={colors.core} />
        <StatChip label="오늘 펄스" value="3" color="#c040ff" />
        <StatChip label="이번 주" value="87%" color="#44ff88" />
      </div>

      {/* Node hint — bottom right */}
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
        클릭 — 펄스
        <br />
        더블클릭 — 달성
      </p>

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
          fontSize: '13px',
          fontWeight: 700,
          color,
          marginLeft: '2px',
        }}
      >
        {value}
      </span>
    </div>
  )
}
