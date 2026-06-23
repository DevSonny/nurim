export const colors = {
  ground: '#080810',
  text: '#e8e8f5',
  textMuted: 'rgba(232, 232, 245, 0.45)',
  surface: 'rgba(255, 255, 255, 0.04)',
  border: 'rgba(255, 255, 255, 0.09)',
  core: '#00eeff',
  orbits: ['#c040ff', '#44ff88', '#ffb830', '#ff4466', '#4488ff'] as const,
} as const

export const fonts = {
  display: 'var(--font-display, "Space Grotesk"), sans-serif',
  body: 'Pretendard, var(--font-display, "Space Grotesk"), system-ui, sans-serif',
} as const

export const fontSize = {
  xs:   13,
  sm:   15,
  base: 17,
  lg:   20,
  xl:   26,
  xl2:  36,
  hero: 'clamp(48px, 10vw, 80px)',
} as const

export type NodeType = 'core' | 'orbit' | 'sub'

export interface NodeDef {
  id: string
  type: NodeType
  label: string
  orbitIdx: number
  parentId?: string
  // 선택 목표 (Pulse 추적용 — 생성 후 setGoal()로만 수정 허용)
  goalType?: 'accumulation' | 'repetition'
  target?: number
  unit?: string
  period?: 'day' | 'week' | 'month'
}

export interface BondDef {
  source: string
  target: string
}

export const NODES: NodeDef[] = [
  { id: 'core',  type: 'core',  label: '나',     orbitIdx: -1 },
  { id: 'study', type: 'orbit', label: '공부',   orbitIdx: 0 },
  { id: 'exer',  type: 'orbit', label: '운동',   orbitIdx: 1 },
  { id: 'fin',   type: 'orbit', label: '재테크', orbitIdx: 2 },
  { id: 'hlth',  type: 'orbit', label: '건강',   orbitIdx: 3 },
  { id: 'rel',   type: 'orbit', label: '관계',   orbitIdx: 4 },
  { id: 's1',    type: 'sub',   label: '영어',   orbitIdx: 0, parentId: 'study' },
  { id: 's2',    type: 'sub',   label: '코딩',   orbitIdx: 0, parentId: 'study' },
  { id: 's3',    type: 'sub',   label: '러닝',   orbitIdx: 1, parentId: 'exer' },
  { id: 's4',    type: 'sub',   label: '요가',   orbitIdx: 1, parentId: 'exer' },
  { id: 's5',    type: 'sub',   label: '투자',   orbitIdx: 2, parentId: 'fin' },
]

export const BONDS: BondDef[] = [
  { source: 'core',  target: 'study' },
  { source: 'core',  target: 'exer' },
  { source: 'core',  target: 'fin' },
  { source: 'core',  target: 'hlth' },
  { source: 'core',  target: 'rel' },
  { source: 'study', target: 's1' },
  { source: 'study', target: 's2' },
  { source: 'exer',  target: 's3' },
  { source: 'exer',  target: 's4' },
  { source: 'fin',   target: 's5' },
]

// orbitIdx on sub-nodes equals their parent's orbitIdx — no NODES lookup needed
export function nodeColor(node: NodeDef): string {
  if (node.type === 'core') return colors.core
  return colors.orbits[node.orbitIdx % colors.orbits.length]
}

export const nodeBaseRadius: Record<NodeType, number> = {
  core: 0.52,
  orbit: 0.30,
  sub: 0.16,
}
