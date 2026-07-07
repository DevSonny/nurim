'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/ui/BottomNav'
import { colors, fonts, fontSize } from '@/lib/tokens'
import { useGraph } from '@/lib/use-data'
import { api } from '@/lib/api-client'
import type { Node } from '@/lib/use-data'
import { seedPulseData, clearPulseData } from '@/lib/seed-data'
import type { StoredNode } from '@/lib/aggregate'

const MAX_ORBITS = 8
const MAX_SUBS_PER_ORBIT = 8

// ── DeleteConfirm modal ───────────────────────────────────────────────────────

function DeleteConfirm({
  node,
  hasChildren,
  onConfirm,
  onCancel,
}: {
  node: StoredNode
  hasChildren: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  const accent = colors.orbits[node.orbitIdx % colors.orbits.length]
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8,8,16,0.88)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '24px',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          background: 'rgba(14,14,26,0.98)',
          border: `1px solid ${colors.border}`,
          borderRadius: '20px',
          padding: '24px',
          maxWidth: '320px',
          width: '100%',
          boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>
          <span style={{ color: accent }}>{node.label}</span> 삭제
        </div>
        {hasChildren && (
          <div
            style={{
              fontSize: '12px',
              color: '#ff4466',
              background: 'rgba(255,68,102,0.1)',
              border: '1px solid rgba(255,68,102,0.25)',
              borderRadius: '10px',
              padding: '10px 12px',
              marginBottom: '14px',
              lineHeight: 1.5,
            }}
          >
            이 행성의 세부 항목도 함께 삭제됩니다
          </div>
        )}
        <div style={{ fontSize: '13px', color: `${colors.text}77`, marginBottom: '20px', lineHeight: 1.5 }}>
          삭제하면 복구할 수 없습니다. 계속할까요?
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={onCancel} style={cancelBtnStyle}>취소</button>
          <button onClick={onConfirm} style={deleteBtnStyle}>삭제</button>
        </div>
      </div>
    </div>
  )
}

// ── AddInput inline ───────────────────────────────────────────────────────────

function AddInput({
  placeholder,
  accent,
  onAdd,
  onClose,
}: {
  placeholder: string
  accent: string
  onAdd: (label: string) => boolean
  onClose: () => void
}) {
  const [val, setVal] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const submit = () => {
    const trimmed = val.trim()
    if (!trimmed) { setError('이름을 입력하세요'); return }
    if (trimmed.length > 12) { setError('12자 이하로 입력하세요'); return }
    const ok = onAdd(trimmed)
    if (!ok) { setError('최대 개수에 도달했습니다'); return }
    onClose()
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        padding: '12px',
        background: `${accent}0d`,
        border: `1px solid ${accent}33`,
        borderRadius: '14px',
        marginTop: '8px',
      }}
    >
      <input
        ref={inputRef}
        value={val}
        onChange={e => { setVal(e.target.value); setError('') }}
        onKeyDown={e => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') onClose() }}
        placeholder={placeholder}
        maxLength={12}
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid ${error ? '#ff4466' : colors.border}`,
          borderRadius: '10px',
          padding: '10px 14px',
          color: colors.text,
          fontSize: '14px',
          fontFamily: 'inherit',
          outline: 'none',
        }}
      />
      {error && (
        <div style={{ fontSize: '11px', color: '#ff4466' }}>{error}</div>
      )}
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
        <button onClick={onClose} style={cancelBtnStyle}>취소</button>
        <button
          onClick={submit}
          style={{
            padding: '7px 16px',
            background: `linear-gradient(135deg, ${accent}, ${accent}99)`,
            border: 'none',
            borderRadius: '10px',
            color: colors.ground,
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: `0 0 12px ${accent}44`,
          }}
        >
          추가
        </button>
      </div>
    </div>
  )
}

// ── GoalInput ─────────────────────────────────────────────────────────────────

type GoalType = 'accumulation' | 'repetition'
type GoalPeriod = 'day' | 'week' | 'month'
const PERIOD_LABEL: Record<GoalPeriod, string> = { day: '일간', week: '주간', month: '월간' }

function GoalInput({
  node,
  accent,
  onSave,
  onClose,
}: {
  node: StoredNode
  accent: string
  onSave: (goalType: GoalType, target: number, unit: string, period: GoalPeriod) => void
  onClose: () => void
}) {
  const existing = node.goalType ? {
    goalType: node.goalType,
    target: node.target ?? 0,
    unit: node.unit ?? '',
    period: (node.period ?? 'month') as GoalPeriod,
  } : null

  const [goalType, setGoalType] = useState<GoalType>((existing?.goalType as GoalType) ?? 'accumulation')
  const [target, setTarget] = useState(String(existing?.target ?? ''))
  const [unit, setUnit] = useState(existing?.unit ?? '')
  const [period, setPeriod] = useState<GoalPeriod>(existing?.period ?? 'month')
  const [error, setError] = useState('')

  const submit = () => {
    const num = Number(target)
    if (!target || isNaN(num) || num <= 0) { setError('목표값을 입력하세요 (0 초과)'); return }
    onSave(goalType, num, unit.trim(), period)
  }

  return (
    <div
      style={{
        padding: '14px',
        background: `${accent}0a`,
        border: `1px solid ${accent}33`,
        borderRadius: '14px',
        marginTop: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <div style={{ fontSize: fontSize.xs, color: `${accent}cc`, fontWeight: 600, letterSpacing: '0.4px' }}>
        목표 설정
      </div>

      {/* goalType toggle */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {(['accumulation', 'repetition'] as const).map(gt => (
          <button
            key={gt}
            onClick={() => setGoalType(gt)}
            style={{
              flex: 1,
              padding: '7px',
              borderRadius: '10px',
              border: `1px solid ${goalType === gt ? accent : colors.border}`,
              background: goalType === gt ? `${accent}1a` : 'transparent',
              color: goalType === gt ? accent : `${colors.text}55`,
              fontSize: fontSize.xs,
              fontWeight: goalType === gt ? 700 : 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {gt === 'accumulation' ? '누적형' : '반복형'}
          </button>
        ))}
      </div>

      {/* target + unit */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <input
          type="number"
          value={target}
          onChange={e => { setTarget(e.target.value); setError('') }}
          placeholder="목표값"
          min={1}
          style={{
            flex: 2,
            padding: '8px 10px',
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${error ? '#ff4466' : colors.border}`,
            borderRadius: '10px',
            color: colors.text,
            fontSize: fontSize.base,
            fontFamily: fonts.display,
            fontWeight: 700,
            outline: 'none',
          }}
        />
        <input
          type="text"
          value={unit}
          onChange={e => setUnit(e.target.value)}
          placeholder="단위 (km, 분…)"
          maxLength={6}
          style={{
            flex: 3,
            padding: '8px 10px',
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${colors.border}`,
            borderRadius: '10px',
            color: colors.text,
            fontSize: fontSize.xs,
            fontFamily: 'inherit',
            outline: 'none',
          }}
        />
      </div>

      {/* period — only for accumulation */}
      {goalType === 'accumulation' && (
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['day', 'week', 'month'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: '8px',
                border: `1px solid ${period === p ? accent : colors.border}`,
                background: period === p ? `${accent}14` : 'transparent',
                color: period === p ? accent : `${colors.text}55`,
                fontSize: 11,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {PERIOD_LABEL[p]}
            </button>
          ))}
        </div>
      )}

      {error && <div style={{ fontSize: 11, color: '#ff4466' }}>{error}</div>}

      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
        <button onClick={onClose} style={cancelBtnStyle}>취소</button>
        <button
          onClick={submit}
          style={{
            padding: '7px 18px',
            background: `linear-gradient(135deg, ${accent}, ${accent}99)`,
            border: 'none',
            borderRadius: '10px',
            color: colors.ground,
            fontSize: fontSize.xs,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          저장
        </button>
      </div>
    </div>
  )
}

// ── GoalBadge ─────────────────────────────────────────────────────────────────

function GoalBadge({ node, accent, onEdit }: { node: StoredNode; accent: string; onEdit: () => void }) {
  if (!node.goalType || node.target === undefined) return null
  const periodLabel = node.goalType === 'accumulation'
    ? `/ ${PERIOD_LABEL[(node.period ?? 'month') as GoalPeriod]}`
    : '/ 일'
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 8px',
        background: `${accent}14`,
        border: `1px solid ${accent}33`,
        borderRadius: '20px',
        cursor: 'pointer',
      }}
      onClick={onEdit}
    >
      <span style={{ fontSize: 11, color: `${accent}cc` }}>
        목표: {node.target}{node.unit} {periodLabel}
      </span>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const router = useRouter()
  const { nodes, pulses, mutate, isLoading } = useGraph()
  const [addingOrbit, setAddingOrbit] = useState(false)
  const [addingSubFor, setAddingSubFor] = useState<string | null>(null)
  const [deletingNode, setDeletingNode] = useState<StoredNode | null>(null)
  const [settingGoalFor, setSettingGoalFor] = useState<string | null>(null)

  if (isLoading) return null

  const orbits = nodes.filter(n => n.type === 'orbit')

  const handleAddOrbit = (label: string): boolean => {
    if (orbits.length >= MAX_ORBITS) return false
    api.nodes.create({ type: 'orbit', label, orbitIdx: orbits.length }).then(() => mutate())
    return true
  }

  const handleAddSub = (parentId: string) => (label: string): boolean => {
    const subs = nodes.filter(n => n.type === 'sub' && n.parentId === parentId)
    if (subs.length >= MAX_SUBS_PER_ORBIT) return false
    const parentOrbit = nodes.find(n => n.id === parentId)
    api.nodes.create({ type: 'sub', label, parentId, orbitIdx: parentOrbit?.orbitIdx ?? 0 }).then(() => mutate())
    return true
  }

  const handleDeleteConfirm = () => {
    if (!deletingNode) return
    api.nodes.delete(deletingNode.id).then(() => {
      mutate()
      setDeletingNode(null)
    })
  }

  const handleSaveGoal = (
    id: string,
    goalType: GoalType,
    target: number,
    unit: string,
    period: GoalPeriod,
  ) => {
    api.nodes.update(id, { goalType, target, unit: unit || undefined, period }).then(() => {
      mutate()
      setSettingGoalFor(null)
    })
  }

  const handleClearGoal = (id: string) => {
    api.nodes.update(id, { goalType: null, target: null, unit: null, period: null }).then(() => {
      mutate()
      setSettingGoalFor(null)
    })
  }

  const deletingNodeHasChildren =
    deletingNode?.type === 'orbit'
      ? nodes.some(n => n.parentId === deletingNode.id)
      : false

  return (
    <main
      style={{
        minHeight: '100vh',
        background: colors.ground,
        color: colors.text,
        overflowY: 'auto',
        paddingBottom: 100,
        fontFamily: fonts.body,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '52px 24px 20px',
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
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
        <h1 style={{ fontSize: '17px', fontWeight: 700 }}>나의 우주 구성</h1>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Notice: lock after creation */}
        <div
          style={{
            background: `${colors.core}0d`,
            border: `1px solid ${colors.core}22`,
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '24px',
            fontSize: '12px',
            color: `${colors.text}77`,
            lineHeight: 1.6,
          }}
        >
          생성 후 이름 수정 불가 — 삭제만 가능합니다
        </div>

        {/* Orbit list */}
        {orbits.map(orbit => {
          const accent = colors.orbits[orbit.orbitIdx % colors.orbits.length]
          const subs = nodes.filter(n => n.type === 'sub' && n.parentId === orbit.id)
          const canAddSub = subs.length < MAX_SUBS_PER_ORBIT
          const isAddingSub = addingSubFor === orbit.id

          return (
            <div
              key={orbit.id}
              style={{
                background: `${accent}0a`,
                border: `1px solid ${accent}22`,
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '12px',
              }}
            >
              {/* Orbit header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: accent,
                      boxShadow: `0 0 8px ${accent}88`,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: '15px', fontWeight: 700, color: accent }}>
                    {orbit.label}
                  </span>
                  <span style={{ fontSize: '11px', color: `${colors.text}44` }}>
                    세부 {subs.length}/{MAX_SUBS_PER_ORBIT}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <button
                    onClick={() => {
                      setSettingGoalFor(settingGoalFor === orbit.id ? null : orbit.id)
                      setAddingSubFor(null)
                    }}
                    style={{
                      background: `${accent}0d`,
                      border: `1px solid ${accent}33`,
                      borderRadius: '8px',
                      color: `${accent}cc`,
                      fontSize: '11px',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      fontFamily: 'inherit',
                    }}
                    title="목표 설정"
                  >
                    목표
                  </button>
                  <button
                    onClick={() => setDeletingNode(orbit)}
                    style={iconDeleteBtnStyle}
                    title="삭제"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Goal badge */}
              <GoalBadge
                node={orbit}
                accent={accent}
                onEdit={() => setSettingGoalFor(orbit.id)}
              />

              {/* GoalInput — inline when active */}
              {settingGoalFor === orbit.id && (
                <GoalInput
                  node={orbit}
                  accent={accent}
                  onSave={(gt, t, u, p) => handleSaveGoal(orbit.id, gt, t, u, p)}
                  onClose={() => setSettingGoalFor(null)}
                />
              )}
              {orbit.goalType && settingGoalFor !== orbit.id && (
                <button
                  onClick={() => handleClearGoal(orbit.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: `${colors.text}33`,
                    fontSize: '10px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    padding: '2px 0',
                    marginTop: '2px',
                  }}
                >
                  목표 삭제
                </button>
              )}

              {/* Sub-nodes */}
              {subs.length > 0 && (
                <div style={{ marginBottom: isAddingSub ? '0' : '8px', marginTop: '8px' }}>
                  {subs.map(sub => {
                    const isSettingSubGoal = settingGoalFor === sub.id
                    return (
                      <div key={sub.id} style={{ marginBottom: '4px' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '4px 8px 4px 10px',
                              background: `${accent}14`,
                              border: `1px solid ${accent}30`,
                              borderRadius: '20px',
                            }}
                          >
                            <span style={{ fontSize: '12px', color: `${accent}cc` }}>
                              {sub.label}
                            </span>
                            {sub.goalType && (
                              <span style={{ fontSize: '10px', color: `${accent}88` }}>
                                목표: {sub.target}{sub.unit}
                              </span>
                            )}
                            <button
                              onClick={() => setDeletingNode(sub)}
                              style={{
                                background: 'none', border: 'none',
                                color: `${colors.text}44`, fontSize: '11px',
                                cursor: 'pointer', padding: '1px 2px',
                                lineHeight: 1, borderRadius: '50%',
                                display: 'flex', alignItems: 'center',
                              }}
                            >✕</button>
                          </div>
                          <button
                            onClick={() => setSettingGoalFor(isSettingSubGoal ? null : sub.id)}
                            style={{
                              background: 'none',
                              border: `1px solid ${accent}22`,
                              borderRadius: '8px',
                              color: `${accent}66`,
                              fontSize: '10px',
                              cursor: 'pointer',
                              padding: '3px 7px',
                              fontFamily: 'inherit',
                            }}
                          >
                            {sub.goalType ? '목표 수정' : '+ 목표'}
                          </button>
                          {sub.goalType && (
                            <button
                              onClick={() => handleClearGoal(sub.id)}
                              style={{
                                background: 'none', border: 'none',
                                color: `${colors.text}22`, fontSize: '10px',
                                cursor: 'pointer', fontFamily: 'inherit',
                              }}
                            >삭제</button>
                          )}
                        </div>
                        {isSettingSubGoal && (
                          <GoalInput
                            node={sub}
                            accent={accent}
                            onSave={(gt, t, u, p) => handleSaveGoal(sub.id, gt, t, u, p)}
                            onClose={() => setSettingGoalFor(null)}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Add sub input */}
              {isAddingSub && (
                <AddInput
                  placeholder="세부 항목 이름 (최대 12자)"
                  accent={accent}
                  onAdd={handleAddSub(orbit.id)}
                  onClose={() => setAddingSubFor(null)}
                />
              )}

              {/* Add sub button */}
              {!isAddingSub && canAddSub && (
                <button
                  onClick={() => {
                    setAddingSubFor(orbit.id)
                    setAddingOrbit(false)
                  }}
                  style={{
                    marginTop: subs.length > 0 ? '8px' : '0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 12px',
                    background: 'transparent',
                    border: `1px dashed ${accent}44`,
                    borderRadius: '10px',
                    color: `${accent}88`,
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ fontSize: '14px' }}>+</span> 세부 항목 추가
                </button>
              )}
            </div>
          )
        })}

        {/* Empty state */}
        {orbits.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: `${colors.text}44`,
              fontSize: '14px',
            }}
          >
            아직 행성이 없어요<br />
            <span style={{ fontSize: '12px' }}>아래 버튼으로 첫 번째 행성을 추가하세요</span>
          </div>
        )}

        {/* Add orbit input */}
        {addingOrbit && (
          <AddInput
            placeholder="행성 이름 (최대 12자)"
            accent={colors.core}
            onAdd={handleAddOrbit}
            onClose={() => setAddingOrbit(false)}
          />
        )}

        {/* Add orbit button */}
        {!addingOrbit && orbits.length < MAX_ORBITS && (
          <button
            onClick={() => { setAddingOrbit(true); setAddingSubFor(null) }}
            style={{
              width: '100%',
              marginTop: '8px',
              padding: '14px',
              background: `${colors.core}0d`,
              border: `1px dashed ${colors.core}44`,
              borderRadius: '14px',
              color: `${colors.core}cc`,
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '7px',
              transition: 'all 0.18s',
            }}
          >
            <span style={{ fontSize: '18px' }}>+</span>
            행성 추가 ({orbits.length}/{MAX_ORBITS})
          </button>
        )}

        {orbits.length >= MAX_ORBITS && (
          <div
            style={{
              marginTop: '8px',
              padding: '12px',
              textAlign: 'center',
              fontSize: '12px',
              color: `${colors.text}44`,
            }}
          >
            최대 {MAX_ORBITS}개 행성에 도달했습니다
          </div>
        )}
      </div>

      {/* 개발용: 테스트 데이터 */}
      <div
        style={{
          margin: '24px 20px 0',
          padding: '14px 16px',
          background: 'rgba(255,255,255,0.02)',
          border: `1px solid ${colors.border}`,
          borderRadius: '14px',
        }}
      >
        <div style={{ fontSize: '11px', color: `${colors.text}44`, marginBottom: '10px', letterSpacing: '0.3px' }}>
          테스트 데이터 (개발용)
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => { seedPulseData(nodes).then(() => mutate()) }}
            style={{
              flex: 1,
              padding: '9px',
              background: `${colors.core}0d`,
              border: `1px solid ${colors.core}33`,
              borderRadius: '10px',
              color: `${colors.core}cc`,
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            샘플 90일 주입
          </button>
          <button
            onClick={() => { clearPulseData(pulses).then(() => mutate()) }}
            style={{
              flex: 1,
              padding: '9px',
              background: 'rgba(255,68,102,0.06)',
              border: '1px solid rgba(255,68,102,0.2)',
              borderRadius: '10px',
              color: 'rgba(255,68,102,0.7)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            교신 데이터 초기화
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deletingNode && (
        <DeleteConfirm
          node={deletingNode}
          hasChildren={deletingNodeHasChildren}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingNode(null)}
        />
      )}

      <BottomNav />
    </main>
  )
}

// ── Shared button styles ──────────────────────────────────────────────────────

const cancelBtnStyle: React.CSSProperties = {
  flex: 1,
  padding: '8px 16px',
  background: 'rgba(255,255,255,0.05)',
  border: `1px solid ${colors.border}`,
  borderRadius: '10px',
  color: `${colors.text}88`,
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
}

const deleteBtnStyle: React.CSSProperties = {
  flex: 1,
  padding: '8px 16px',
  background: 'rgba(255,68,102,0.15)',
  border: '1px solid rgba(255,68,102,0.4)',
  borderRadius: '10px',
  color: '#ff4466',
  fontSize: '12px',
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
}

const iconDeleteBtnStyle: React.CSSProperties = {
  background: 'rgba(255,68,102,0.08)',
  border: '1px solid rgba(255,68,102,0.2)',
  borderRadius: '8px',
  color: 'rgba(255,68,102,0.6)',
  fontSize: '11px',
  cursor: 'pointer',
  padding: '4px 8px',
  fontFamily: 'inherit',
  transition: 'all 0.15s',
}
