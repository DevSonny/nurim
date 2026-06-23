import SolarCanvas from '@/components/solar'
import GoogleButton from '@/components/auth/GoogleButton'
import { colors } from '@/lib/tokens'

export default function Home() {
  return (
    <main
      style={{
        position: 'relative',
        height: '100vh',
        background: colors.ground,
        overflow: 'hidden',
      }}
    >
      {/* 3D molecule fills the viewport as backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
        }}
      >
        <SolarCanvas />
      </div>

      {/* Subtle radial haze so login card reads cleanly */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, rgba(8,8,16,0.78) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Auth card */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0',
          padding: '24px',
        }}
      >
        {/* Brand */}
        <h1
          style={{
            fontSize: 'clamp(42px, 10vw, 72px)',
            fontWeight: 800,
            letterSpacing: '-2px',
            color: colors.core,
            lineHeight: 1.0,
            marginBottom: '12px',
            textShadow: `0 0 40px ${colors.core}88, 0 0 80px ${colors.core}44`,
          }}
        >
          누림
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: colors.text,
            opacity: 0.45,
            letterSpacing: '0.5px',
            marginBottom: '48px',
          }}
        >
          매일이 자라는 곳
        </p>

        {/* Login card */}
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${colors.border}`,
            borderRadius: '20px',
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            maxWidth: '320px',
            width: '100%',
          }}
        >
          <GoogleButton />

          <p
            style={{
              fontSize: '10.5px',
              color: colors.text,
              opacity: 0.28,
              textAlign: 'center',
              lineHeight: 1.6,
            }}
          >
            계속하면 이용약관 및 개인정보처리방침에 동의하는 것입니다
          </p>
        </div>
      </div>
    </main>
  )
}
