'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/ui/BottomNav'
import { colors, fonts, fontSize } from '@/lib/tokens'
import { useGraph } from '@/lib/use-data'
import { api } from '@/lib/api-client'
import { getProgress } from '@/lib/aggregate'
import type { Progress, PulseKind } from '@/lib/aggregate'

type InputMode = '점수' | '시간' | '체크' | '투자' | '진행도'

const MODES: { key: InputMode; label: string; icon: string }[] = [
  { key: '점수',  label: '점수',  icon: '★' },
  { key: '시간',  label: '시간',  icon: '◷' },
  { key: '체크',  label: '체크',  icon: '✓' },
  { key: '투자',  label: '투자',  icon: '₩' },
  { key: '진행도', label: '진행도', icon: '▥' },
]

const MODE_KIND: Record<InputMode, PulseKind> = {
  '점수': 'score',
  '시간': 'time',
  '체크': 'check',
  '투자': 'money',
  '진행도': 'progress',
}

export default function PulsePage() {
  const router = useRouter()
  const { nodes, pulses, isLoading, mutate } = useGraph()
  
  const [selectedOrbit, setSelectedOrbit] = useState<string | null>(null)
  const [selectedSub, setSelectedSub] = useState<string | null>(null)

  const [mode, setMode] = useState<InputMode>('점수')
  const [score, setScore] = useState(7)
  const [timeVal, setTimeVal] = useState(30)
  const [checked, setChecked] = useState(false)
  const [amount, setAmount] = useState(50000)
  const [investSign, setInvestSign] = useState<'income' | 'expense'>('income')
  const [progress, setProgress] = useState(60)
  const [memo, setMemo] = useState('')

  if (isLoading) return null

  const ORBIT_NODES = nodes.filter(n => n.type === 'orbit')
  const SUB_NODES = nodes.filter(n => n.type === 'sub')

  const selectedNode = ORBIT_NODES.find(n => n.id === selectedOrbit)
  const subNodes = selectedOrbit
    ? SUB_NODES.filter(n => n.parentId === selectedOrbit)
    : []

  const accentIdx = selectedNode ? selectedNode.orbitIdx : -1
  const accent = accentIdx >= 0 ? colors.orbits[accentIdx % colors.orbits.length] : colors.core

  let progressData: Progress | null = null
  const targetId = selectedSub ?? selectedOrbit
  if (targetId) {
    const p = getProgress(nodes, pulses, targetId)
    progressData = p.hasGoal ? p : null
  }

  const handleSave = async () => {
    if (!selectedOrbit) return
    const targetId = selectedSub ?? selectedOrbit

    // 모드별 값 정규화
    let value: number
    switch (mode) {
      case '점수':   value = score; break
      case '시간':   value = timeVal; break
      case '체크':   value = checked ? 1 : 0; break
      case '투자':   value = investSign === 'expense' ? -amount : amount; break
      case '진행도': value = progress; break
      default:       value = 0
    }

    await api.pulses.create({
      nodeId: targetId,
      value,
      kind: MODE_KIND[mode],
      memo: memo.trim() || undefined,
    })
    mutate()
    router.push('/dashboard')
  }

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
          padding: '52px 24px 20px',
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => router.back()}
            style={{
              background: 'none',
              border: 'none',
              color: `${colors.text}55`,
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px',
              fontFamily: 'inherit',
            }}
          >
            ←
          </button>
          <h1 style={{ fontSize: '17px', fontWeight: 700 }}>교신 기록</h1>
          <div style={{ width: '28px' }} />
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Orbit selector */}
        <Label>어떤 영역?</Label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {ORBIT_NODES.map(n => {
            const c = colors.orbits[n.orbitIdx % colors.orbits.length]
            const active = selectedOrbit === n.id
            return (
              <button
                key={n.id}
                onClick={() => { setSelectedOrbit(active ? null : n.id); setSelectedSub(null) }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: `1px solid ${active ? c : colors.border}`,
                  background: active ? `${c}18` : 'transparent',
                  color: active ? c : `${colors.text}66`,
                  fontSize: '13px',
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                  boxShadow: active ? `0 0 16px ${c}33` : undefined,
                }}
              >
                {n.label}
              </button>
            )
          })}
        </div>

        {/* Sub selector */}
        {subNodes.length > 0 && (
          <>
            <Label>세부 항목</Label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {subNodes.map(n => {
                const active = selectedSub === n.id
                return (
                  <button
                    key={n.id}
                    onClick={() => setSelectedSub(active ? null : n.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '16px',
                      border: `1px solid ${active ? accent : colors.border}`,
                      background: active ? `${accent}14` : 'transparent',
                      color: active ? accent : `${colors.text}55`,
                      fontSize: '12px',
                      fontWeight: active ? 700 : 500,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.15s',
                    }}
                  >
                    {n.label}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* Progress preview card — shown when selected node has a goal */}
        {progressData && (
          <div
            style={{
              background: `${accent}0d`,
              border: `1px solid ${accent}33`,
              borderRadius: '14px',
              padding: '14px 16px',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontSize: fontSize.xs, color: `${accent}88`, marginBottom: '6px', letterSpacing: '0.3px' }}>
              현재 진행
            </div>
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: fontSize.xl,
                fontWeight: 800,
                color: accent,
                marginBottom: '8px',
                letterSpacing: '-0.5px',
              }}
            >
              {progressData.current}
              <span style={{ fontSize: fontSize.sm, fontWeight: 500, opacity: 0.7 }}>
                /{progressData.target}{progressData.unit}
              </span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${progressData.pct * 100}%`,
                  background: accent,
                  borderRadius: '2px',
                  boxShadow: `0 0 8px ${accent}88`,
                  transition: 'width 0.3s',
                }}
              />
            </div>
          </div>
        )}

        {/* Mode selector */}
        <Label>기록 방식</Label>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', overflowX: 'auto' }}>
          {MODES.map(m => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              style={{
                flexShrink: 0,
                padding: '8px 14px',
                borderRadius: '12px',
                border: `1px solid ${mode === m.key ? accent : colors.border}`,
                background: mode === m.key ? `${accent}18` : 'rgba(255,255,255,0.03)',
                color: mode === m.key ? accent : `${colors.text}55`,
                fontSize: '12px',
                fontWeight: mode === m.key ? 700 : 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {/* Value input */}
        <div
          style={{
            background: 'rgba(255,255,255,0.025)',
            border: `1px solid ${accent}33`,
            borderRadius: '18px',
            padding: '20px',
            marginBottom: '16px',
          }}
        >
          {mode === '점수' && (
            <ScoreInput value={score} onChange={setScore} accent={accent} />
          )}
          {mode === '시간' && (
            <TimeInput value={timeVal} onChange={setTimeVal} accent={accent} />
          )}
          {mode === '체크' && (
            <CheckInput value={checked} onChange={setChecked} accent={accent} />
          )}
          {mode === '투자' && (
            <AmountInput value={amount} onChange={setAmount} sign={investSign} onSignChange={setInvestSign} accent={accent} />
          )}
          {mode === '진행도' && (
            <ProgressInput value={progress} onChange={setProgress} accent={accent} />
          )}
        </div>

        {/* Memo */}
        <Label>메모 (선택)</Label>
        <textarea
          value={memo}
          onChange={e => setMemo(e.target.value)}
          placeholder="오늘 느낀 점을 짧게..."
          rows={3}
          style={{
            width: '100%',
            padding: '14px',
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${colors.border}`,
            borderRadius: '14px',
            color: colors.text,
            fontSize: '13px',
            fontFamily: 'inherit',
            resize: 'none',
            outline: 'none',
            marginBottom: '24px',
            lineHeight: 1.6,
          }}
        />

        {/* Save */}
        <button
          onClick={handleSave}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '14px',
            border: 'none',
            background: selectedOrbit
              ? `linear-gradient(135deg, ${accent}, ${accent}99)`
              : 'rgba(255,255,255,0.07)',
            color: selectedOrbit ? colors.ground : `${colors.text}44`,
            fontSize: '15px',
            fontWeight: 700,
            cursor: selectedOrbit ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
            letterSpacing: '0.3px',
            boxShadow: selectedOrbit ? `0 0 24px ${accent}44` : undefined,
            transition: 'all 0.2s',
          }}
        >
          기록하기
        </button>
      </div>

      <BottomNav />
    </main>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: '11px',
        fontWeight: 600,
        color: `${colors.text}55`,
        letterSpacing: '0.5px',
        textTransform: 'uppercase' as const,
        marginBottom: '10px',
      }}
    >
      {children}
    </div>
  )
}

function ScoreInput({ value, onChange, accent }: { value: number; onChange: (v: number) => void; accent: string }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
        <span style={{ fontSize: '11px', color: `${colors.text}44` }}>점수</span>
        <span style={{ fontSize: '36px', fontWeight: 800, color: accent }}>{value}</span>
      </div>
      <input
        type="range" min={1} max={10} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: accent }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: `${colors.text}33`, marginTop: '4px' }}>
        <span>1</span><span>10</span>
      </div>
    </div>
  )
}

function TimeInput({ value, onChange, accent }: { value: number; onChange: (v: number) => void; accent: string }) {
  const h = Math.floor(value / 60)
  const m = value % 60
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
        <span style={{ fontSize: '11px', color: `${colors.text}44` }}>시간</span>
        <span style={{ fontSize: '32px', fontWeight: 800, color: accent }}>
          {h > 0 ? `${h}h ` : ''}{m}m
        </span>
      </div>
      <input
        type="range" min={5} max={240} step={5} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: accent }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: `${colors.text}33`, marginTop: '4px' }}>
        <span>5분</span><span>4시간</span>
      </div>
    </div>
  )
}

function CheckInput({ value, onChange, accent }: { value: boolean; onChange: (v: boolean) => void; accent: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '15px', fontWeight: 600 }}>오늘 완료했나요?</span>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: '56px',
          height: '30px',
          borderRadius: '15px',
          border: 'none',
          background: value ? accent : 'rgba(255,255,255,0.1)',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.2s',
          boxShadow: value ? `0 0 16px ${accent}55` : undefined,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '3px',
            left: value ? '29px' : '3px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'white',
            transition: 'left 0.2s',
          }}
        />
      </button>
    </div>
  )
}

function AmountInput({ value, onChange, sign, onSignChange, accent }: {
  value: number
  onChange: (v: number) => void
  sign: 'income' | 'expense'
  onSignChange: (s: 'income' | 'expense') => void
  accent: string
}) {
  const expenseColor = '#ff4466'
  const valueColor = sign === 'expense' ? expenseColor : accent
  return (
    <div>
      {/* 수입/지출 toggle */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
        {(['income', 'expense'] as const).map(s => (
          <button
            key={s}
            onClick={() => onSignChange(s)}
            style={{
              flex: 1,
              padding: '7px',
              borderRadius: '10px',
              border: `1px solid ${sign === s ? (s === 'income' ? accent : expenseColor) : colors.border}`,
              background: sign === s ? (s === 'income' ? `${accent}18` : `${expenseColor}18`) : 'transparent',
              color: sign === s ? (s === 'income' ? accent : expenseColor) : `${colors.text}44`,
              fontSize: '12px',
              fontWeight: sign === s ? 700 : 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            {s === 'income' ? '+ 수입' : '− 지출'}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
        <span style={{ fontSize: '11px', color: `${colors.text}44` }}>금액</span>
        <span style={{ fontSize: '28px', fontWeight: 800, color: valueColor }}>
          {sign === 'expense' ? '−' : '+'}{value.toLocaleString()}원
        </span>
      </div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {[10000, 50000, 100000, 500000].map(v => (
          <button
            key={v}
            onClick={() => onChange(v)}
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              border: `1px solid ${value === v ? valueColor : colors.border}`,
              background: value === v ? `${valueColor}18` : 'transparent',
              color: value === v ? valueColor : `${colors.text}55`,
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {v.toLocaleString()}
          </button>
        ))}
      </div>
    </div>
  )
}

function ProgressInput({ value, onChange, accent }: { value: number; onChange: (v: number) => void; accent: string }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
        <span style={{ fontSize: '11px', color: `${colors.text}44` }}>진행도</span>
        <span style={{ fontSize: '36px', fontWeight: 800, color: accent }}>{value}%</span>
      </div>
      <div
        style={{
          height: '8px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '12px',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${value}%`,
            background: accent,
            borderRadius: '4px',
            boxShadow: `0 0 8px ${accent}88`,
            transition: 'width 0.2s',
          }}
        />
      </div>
      <input
        type="range" min={0} max={100} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: accent }}
      />
    </div>
  )
}
