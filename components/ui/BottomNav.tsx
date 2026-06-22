'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { colors } from '@/lib/tokens'

const ITEMS = [
  { href: '/dashboard', label: '홈',   icon: '◉' },
  { href: '/pulse',     label: '펄스', icon: '⊕' },
  { href: '/stats',     label: '통계', icon: '▦' },
  { href: '/community', label: '피드', icon: '⊞' },
  { href: '/settings',  label: '설정', icon: '⚙' },
]

export default function BottomNav() {
  const path = usePathname()

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '10px 16px',
        background: 'rgba(12,12,22,0.82)',
        border: `1px solid ${colors.border}`,
        borderRadius: '28px',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        zIndex: 50,
        boxShadow: `0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)`,
      }}
    >
      {ITEMS.map(item => {
        const active = path === item.href || path.startsWith(item.href + '/')
        const isPulse = item.href === '/pulse'
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              padding: isPulse ? '0' : '8px 16px',
              borderRadius: isPulse ? '50%' : '18px',
              background: isPulse
                ? `linear-gradient(135deg, ${colors.core}, #0099cc)`
                : active
                  ? 'rgba(0,238,255,0.10)'
                  : 'transparent',
              width: isPulse ? '50px' : undefined,
              height: isPulse ? '50px' : undefined,
              justifyContent: isPulse ? 'center' : undefined,
              color: isPulse ? colors.ground : active ? colors.core : `${colors.text}66`,
              fontSize: isPulse ? '24px' : '18px',
              textDecoration: 'none',
              transition: 'all 0.18s',
              boxShadow: isPulse
                ? `0 0 20px ${colors.core}55, 0 4px 12px rgba(0,0,0,0.4)`
                : undefined,
              marginTop: isPulse ? '-14px' : undefined,
              border: isPulse ? `2px solid rgba(12,12,22,0.9)` : 'none',
            }}
          >
            <span style={{ lineHeight: 1 }}>{item.icon}</span>
            {!isPulse && (
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: active ? 700 : 500,
                  letterSpacing: '0.3px',
                }}
              >
                {item.label}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
