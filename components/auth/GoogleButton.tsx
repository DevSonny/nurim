'use client'
import { signIn } from 'next-auth/react'
import { colors } from '@/lib/tokens'

export default function GoogleButton() {
  return (
    <button
      onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
      style={{
        width: '100%',
        padding: '13px 24px',
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        background: 'rgba(255,255,255,0.07)',
        color: colors.text,
        fontSize: '14px',
        fontWeight: 600,
        fontFamily: 'inherit',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        letterSpacing: '0.2px',
        transition: 'background 0.2s, border-color 0.2s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.background = 'rgba(255,255,255,0.11)'
        el.style.borderColor = `${colors.core}66`
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.background = 'rgba(255,255,255,0.07)'
        el.style.borderColor = colors.border
      }}
    >
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M44.5 20H24v8.5h11.7C34.1 33.6 29.5 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l6.3-6.3C34.5 5.9 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10.6 0 19.3-7.4 20-17.5.1-.8.1-1.7.1-2.5 0-1.2-.1-2.4-.3-3.5H44.5z"
        />
        <path
          fill="#34A853"
          d="M6.3 14.7l7 5.1C15.1 16 19.2 13 24 13c3 0 5.7 1.1 7.8 2.9l6.3-6.3C34.5 5.9 29.5 4 24 4c-7.8 0-14.6 4.5-17.7 10.7z"
        />
        <path
          fill="#FBBC05"
          d="M24 44c5.2 0 9.9-1.8 13.5-4.7l-6.5-5.3C29.1 35.6 26.6 36 24 36c-5.5 0-10-3.4-11.7-8.2l-6.9 5.3C8.8 39.6 16 44 24 44z"
        />
        <path
          fill="#EA4335"
          d="M44 24c0-1.2-.1-2.4-.3-3.5H24v8.5h11.7c-.8 2.5-2.5 4.6-4.7 6l6.5 5.3C41.5 37.1 44 30.9 44 24z"
        />
      </svg>
      Google로 계속하기
    </button>
  )
}
