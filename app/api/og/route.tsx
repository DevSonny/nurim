import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const streak = searchParams.get('streak') ?? '0'
  const orbit = searchParams.get('orbit') ?? '누림'
  const avg = searchParams.get('avg') ?? '0'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0d0d1a 0%, #0a0a14 60%, #0d0818 100%)',
          padding: '48px 52px',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Glow orb top-right */}
        <div
          style={{
            position: 'absolute',
            top: -60,
            right: -40,
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,238,255,0.18) 0%, transparent 70%)',
          }}
        />
        {/* Glow orb bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: -40,
            left: 60,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(192,64,255,0.14) 0%, transparent 70%)',
          }}
        />

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px' }}>
          <div
            style={{
              fontSize: '28px',
              fontWeight: 900,
              color: '#00eeff',
              letterSpacing: '-1px',
              textShadow: '0 0 30px rgba(0,238,255,0.6)',
            }}
          >
            누림
          </div>
          <div
            style={{
              width: 1,
              height: 20,
              background: 'rgba(255,255,255,0.15)',
              margin: '0 4px',
            }}
          />
          <div style={{ fontSize: '13px', color: 'rgba(232,232,245,0.4)', letterSpacing: '1px' }}>
            NURIM
          </div>
        </div>

        {/* Streak hero */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '12px' }}>
          <div
            style={{
              fontSize: '96px',
              fontWeight: 900,
              color: '#00eeff',
              lineHeight: 1,
              textShadow: '0 0 60px rgba(0,238,255,0.5)',
            }}
          >
            {streak}
          </div>
          <div style={{ paddingBottom: '12px' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#e8e8f5' }}>일</div>
            <div style={{ fontSize: '14px', color: 'rgba(232,232,245,0.45)' }}>연속 달성</div>
          </div>
        </div>

        {/* Sub stats */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          {[
            { label: '최강 영역', val: orbit, color: '#c040ff' },
            { label: '주간 달성률', val: `${avg}%`, color: '#44ff88' },
          ].map(s => (
            <div
              key={s.label}
              style={{
                padding: '8px 14px',
                background: `${s.color}18`,
                border: `1px solid ${s.color}33`,
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <div style={{ fontSize: '10px', color: `${s.color}88` }}>{s.label}</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div
          style={{
            padding: '12px 14px',
            background: 'rgba(255,255,255,0.04)',
            borderLeft: '3px solid rgba(0,238,255,0.4)',
            fontSize: '13px',
            color: 'rgba(232,232,245,0.45)',
            fontStyle: 'italic',
            lineHeight: 1.5,
          }}
        >
          작은 기록들이 쌓여 큰 변화를 만든다
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
