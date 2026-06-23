'use client'
import { colors } from '@/lib/tokens'

interface AchievementToastProps {
  nodeLabel: string
  nodeType: 'orbit' | 'sub'
  onConfirm: () => void
  onCancel: () => void
}

export default function AchievementToast({
  nodeLabel,
  nodeType,
  onConfirm,
  onCancel,
}: AchievementToastProps) {
  const subText = nodeType === 'orbit'
    ? '행성이 황금빛으로 변하며 궤도에 안착합니다'
    : '인공위성이 임무를 완수하고 행성으로 귀환합니다'

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 110,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        background: 'rgba(10,10,20,0.94)',
        border: `1px solid ${colors.core}55`,
        borderRadius: '16px',
        padding: '14px 18px',
        backdropFilter: 'blur(20px)',
        whiteSpace: 'nowrap',
        boxShadow: `0 0 32px ${colors.core}22, 0 8px 24px rgba(0,0,0,0.5)`,
        fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif",
        minWidth: '220px',
      }}
    >
      <div style={{ fontSize: '13px', color: colors.text, lineHeight: 1.5 }}>
        <span style={{ color: colors.core, fontWeight: 700 }}>{nodeLabel}</span>
        {' '}달성으로 처리할까요?
      </div>
      <div style={{ fontSize: '11px', color: `${colors.text}44` }}>
        {subText}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '8px',
            background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${colors.border}`,
            borderRadius: '10px',
            color: `${colors.text}88`,
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          취소
        </button>
        <button
          onClick={onConfirm}
          style={{
            flex: 1,
            padding: '8px',
            background: `linear-gradient(135deg, ${colors.core}, #0099cc)`,
            border: 'none',
            borderRadius: '10px',
            color: '#080810',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: `0 0 14px ${colors.core}44`,
          }}
        >
          달성 ✦
        </button>
      </div>
    </div>
  )
}
