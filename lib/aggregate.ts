'use client'
// Aggregate functions over Pulse data.
// All date arithmetic uses local timezone.


export type PulseKind = 'score' | 'time' | 'check' | 'money' | 'progress'

export interface StoredNode {
  id: string
  type: 'core' | 'orbit' | 'sub'
  label: string
  orbitIdx: number
  parentId?: string
  createdAt: number
  achievedAt?: number
  goalType?: 'accumulation' | 'repetition'
  target?: number
  unit?: string
  period?: 'day' | 'week' | 'month'
}

export interface Pulse {
  id: string
  nodeId: string
  date: string
  value: number
  kind?: PulseKind
  memo?: string
  createdAt: number
}

// ── Date helpers ──────────────────────────────────────────────────────────────

export function toDateStr(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function getPeriodStart(period: 'day' | 'week' | 'month'): string {
  const now = new Date()
  if (period === 'day') {
    return toDateStr(now)
  } else if (period === 'week') {
    const d = new Date(now)
    const dow = d.getDay() // 0=Sun
    d.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1))
    return toDateStr(d)
  } else {
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
  }
}

// ── Progress ──────────────────────────────────────────────────────────────────

export interface Progress {
  current: number
  target: number
  unit: string
  pct: number   // 0–1
  hasGoal: boolean
}

const NO_PROGRESS: Progress = { current: 0, target: 0, unit: '', pct: 0, hasGoal: false }

export function getProgress(nodes: StoredNode[], pulses: Pulse[], nodeId: string): Progress {
  const node = nodes.find(n => n.id === nodeId)
  if (!node) return NO_PROGRESS

  // Node has explicit goal
  if (node.goalType && node.target !== undefined && node.target > 0) {
    const nodePulses = pulses.filter(p => p.nodeId === nodeId)
    const target = node.target
    const unit = node.unit ?? ''
    const period = node.period ?? 'month'

    if (node.goalType === 'accumulation') {
      const start = getPeriodStart(period)
      const current = nodePulses
        .filter(p => p.date >= start)
        .reduce((sum, p) => sum + p.value, 0)
      return { current: Math.round(current * 10) / 10, target, unit, pct: Math.min(1, current / target), hasGoal: true }
    } else {
      // repetition: today
      const today = toDateStr()
      const current = nodePulses
        .filter(p => p.date === today)
        .reduce((sum, p) => sum + p.value, 0)
      return { current: Math.round(current * 10) / 10, target, unit, pct: Math.min(1, current / target), hasGoal: true }
    }
  }

  // Orbit rollup: average of sub-nodes that have goals
  if (node.type === 'orbit') {
    const subs = nodes.filter(n => n.parentId === nodeId && n.goalType && n.target !== undefined && n.target > 0)
    if (subs.length > 0) {
      const progresses = subs.map(s => getProgress(nodes, pulses, s.id))
      const avgPct = progresses.reduce((sum, p) => sum + p.pct, 0) / subs.length
      return { current: Math.round(avgPct * 100), target: 100, unit: '%', pct: avgPct, hasGoal: true }
    }
  }

  return NO_PROGRESS
}

// ── Kind utilities ────────────────────────────────────────────────────────────

export function pulseUnit(kind: PulseKind): string {
  switch (kind) {
    case 'score':    return '점'
    case 'time':     return '분'
    case 'check':    return '회'
    case 'money':    return '원'
    case 'progress': return '%'
  }
}

export function kindAgg(kind: PulseKind): 'sum' | 'avg' {
  return (kind === 'score' || kind === 'progress') ? 'avg' : 'sum'
}

export function formatValue(value: number, kind: PulseKind): string {
  if (kind === 'money') {
    const sign = value >= 0 ? '+' : '-'
    return `${sign}${Math.abs(Math.round(value)).toLocaleString()} 원`
  }
  if (kind === 'time') {
    const mins = Math.round(value)
    if (mins >= 60) {
      const h = Math.floor(mins / 60)
      const m = mins % 60
      return m > 0 ? `${h}h ${m}m` : `${h}h`
    }
    return `${mins} 분`
  }
  if (kind === 'score' || kind === 'progress') {
    return `${Math.round(value * 10) / 10} ${pulseUnit(kind)}`
  }
  return `${Math.round(value)} ${pulseUnit(kind)}`
}

export function getNodeKind(nodes: StoredNode[], pulses: Pulse[], nodeId: string): PulseKind {
  const nodePulses = pulses.filter(p => p.nodeId === nodeId)
  const kindCounts: Partial<Record<PulseKind, number>> = {}
  for (const p of nodePulses) {
    if (p.kind) kindCounts[p.kind] = (kindCounts[p.kind] ?? 0) + 1
  }
  let best: PulseKind = 'check'
  let bestCount = 0
  for (const [k, cnt] of Object.entries(kindCounts)) {
    if ((cnt ?? 0) > bestCount) { bestCount = cnt ?? 0; best = k as PulseKind }
  }
  if (bestCount === 0) {
    const node = nodes.find(n => n.id === nodeId)
    const u = node?.unit ?? ''
    if (u.includes('분') || u.includes('h')) return 'time'
    if (u.includes('원') || u.includes('₩')) return 'money'
    if (u.includes('점')) return 'score'
    if (u.includes('%')) return 'progress'
  }
  return best
}

// ── Category totals ───────────────────────────────────────────────────────────

export interface CategoryTotal {
  orbitId: string
  orbitLabel: string
  orbitIdx: number
  kind: PulseKind
  unit: string
  value: number
  agg: 'sum' | 'avg'
}

export function getCategoryTotals(
  nodes: StoredNode[], pulses: Pulse[],
  ids: string[] | null,
  range: 'month' | 'all',
): CategoryTotal[] {
  const orbits = nodes.filter(n => n.type === 'orbit')
  const now = new Date()
  const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const results: CategoryTotal[] = []

  for (const orbit of orbits) {
    const orbitAndSubIds = getOrbitAndSubIds(nodes, orbit.id)
    const scopedIds = ids ? orbitAndSubIds.filter(id => ids.includes(id)) : orbitAndSubIds
    if (scopedIds.length === 0) continue

    const scopedPulses = pulses.filter(p => scopedIds.includes(p.nodeId)).filter(p =>
      range === 'month' ? p.date.startsWith(monthStr) : true
    )
    if (scopedPulses.length === 0) continue

    const byKind = new Map<PulseKind, number[]>()
    for (const p of scopedPulses) {
      const k: PulseKind = p.kind ?? 'check'
      if (!byKind.has(k)) byKind.set(k, [])
      byKind.get(k)!.push(p.value)
    }

    for (const [kind, values] of byKind.entries()) {
      const agg = kindAgg(kind)
      const value = agg === 'sum'
        ? values.reduce((s, v) => s + v, 0)
        : values.reduce((s, v) => s + v, 0) / values.length
      results.push({ orbitId: orbit.id, orbitLabel: orbit.label, orbitIdx: orbit.orbitIdx, kind, unit: pulseUnit(kind), value, agg })
    }
  }
  return results
}

// ── Series (time-series for charts) ──────────────────────────────────────────

export function getSeries(
  pulses: Pulse[],
  nodeIdOrIds: string | string[],
  granularity: 'day' | 'week' | 'month',
  count: number,
  opts?: { metric?: 'count' | 'kind' },
): { label: string; value: number; unit: string }[] {
  const ids = Array.isArray(nodeIdOrIds) ? nodeIdOrIds : [nodeIdOrIds]
  const allPulses = pulses.filter(p => ids.includes(p.nodeId))
  const metric = opts?.metric ?? 'kind'

  // Determine dominant kind across all pulses
  let dominantKind: PulseKind = 'check'
  if (metric === 'kind') {
    const kindCounts: Partial<Record<PulseKind, number>> = {}
    for (const p of allPulses) {
      if (p.kind) kindCounts[p.kind] = (kindCounts[p.kind] ?? 0) + 1
    }
    let bestCount = 0
    for (const [k, cnt] of Object.entries(kindCounts)) {
      if ((cnt ?? 0) > bestCount) { bestCount = cnt ?? 0; dominantKind = k as PulseKind }
    }
  }

  const unit = metric === 'count' ? '회' : pulseUnit(dominantKind)
  const agg = metric === 'count' ? 'sum' : kindAgg(dominantKind)
  const now = new Date()
  const result: { label: string; value: number; unit: string }[] = []

  for (let i = count - 1; i >= 0; i--) {
    let bucketPulses: typeof allPulses
    let label: string

    if (granularity === 'day') {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const dateStr = toDateStr(d)
      bucketPulses = allPulses.filter(p => p.date === dateStr)
      label = `${d.getMonth() + 1}/${d.getDate()}`
    } else if (granularity === 'week') {
      const weekStart = new Date(now)
      const dow = weekStart.getDay()
      weekStart.setDate(weekStart.getDate() - (dow === 0 ? 6 : dow - 1) - i * 7)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)
      const startStr = toDateStr(weekStart)
      const endStr = toDateStr(weekEnd)
      bucketPulses = allPulses.filter(p => p.date >= startStr && p.date <= endStr)
      label = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`
    } else {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const mStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      bucketPulses = allPulses.filter(p => p.date.startsWith(mStr))
      label = `${d.getMonth() + 1}월`
    }

    let value: number
    if (metric === 'count') {
      value = bucketPulses.length
    } else {
      const relevant = bucketPulses.filter(p => (p.kind ?? 'check') === dominantKind)
      if (relevant.length === 0) {
        value = 0
      } else if (agg === 'sum') {
        value = relevant.reduce((s, p) => s + p.value, 0)
      } else {
        value = relevant.reduce((s, p) => s + p.value, 0) / relevant.length
      }
    }

    result.push({ label, value, unit })
  }

  return result
}

// ── Streak ────────────────────────────────────────────────────────────────────

/** Consecutive days ending today (or yesterday if no pulse today) with ≥1 pulse.
 *  If nodeId is null, counts any pulse across all nodes. */
export function getStreak(pulses: Pulse[], nodeId?: string | null): number {
  const targetPulses = nodeId ? pulses.filter(p => p.nodeId === nodeId) : pulses
  if (targetPulses.length === 0) return 0

  const datesWithPulses = new Set(targetPulses.map(p => p.date))
  const now = new Date()

  // Start from today; if no pulse today, start from yesterday
  const checkDate = new Date(now)
  if (!datesWithPulses.has(toDateStr(checkDate))) {
    checkDate.setDate(checkDate.getDate() - 1)
  }

  let streak = 0
  for (let i = 0; i < 366; i++) {
    if (datesWithPulses.has(toDateStr(checkDate))) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

// ── Total ─────────────────────────────────────────────────────────────────────

export function getTotal(pulses: Pulse[], nodeId?: string | null): number {
  const targetPulses = nodeId ? pulses.filter(p => p.nodeId === nodeId) : pulses
  return targetPulses.reduce((sum, p) => sum + p.value, 0)
}

// ── Activity rate (% of days active since first pulse) ───────────────────────

export function getActivityRate(pulses: Pulse[], ids: string[] | null = null): number {
  const targetPulses = ids ? pulses.filter(p => ids.includes(p.nodeId)) : pulses
  if (targetPulses.length === 0) return 0

  const sortedDates = [...new Set(targetPulses.map(p => p.date))].sort()
  const firstDate = sortedDates[0]
  const now = new Date()
  const daysSinceFirst = Math.max(
    1,
    Math.floor((now.getTime() - new Date(firstDate).getTime()) / 86400000) + 1
  )
  return Math.round((sortedDates.length / daysSinceFirst) * 100)
}

// ── Best day of week ──────────────────────────────────────────────────────────

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

export function getBestDayOfWeek(pulses: Pulse[], ids: string[] | null = null): string {
  const targetPulses = ids ? pulses.filter(p => ids.includes(p.nodeId)) : pulses
  if (targetPulses.length === 0) return '-'

  const dayCounts = Array(7).fill(0)
  targetPulses.forEach(p => {
    const dow = new Date(p.date).getDay()
    dayCounts[dow]++
  })

  const maxIdx = dayCounts.indexOf(Math.max(...dayCounts))
  return DAY_NAMES[maxIdx] + '요일'
}

// ── Dashboard stats ───────────────────────────────────────────────────────────

export function getTodayPulseCount(pulses: Pulse[]): number {
  const today = toDateStr()
  return pulses.filter(p => p.date === today).length
}

export function getThisWeekRate(pulses: Pulse[]): number {
  const weekStart = getPeriodStart('week')
  const pulsedDates = new Set(pulses.filter(p => p.date >= weekStart).map(p => p.date))

  const now = new Date()
  const weekStartDate = new Date(weekStart)
  const daysSoFar = Math.floor((now.getTime() - weekStartDate.getTime()) / 86400000) + 1

  return Math.round((pulsedDates.size / Math.max(daysSoFar, 1)) * 100)
}

// ── Orbit helper ──────────────────────────────────────────────────────────────

export function getOrbitAndSubIds(nodes: StoredNode[], orbitId: string): string[] {
  const subs = nodes.filter(n => n.parentId === orbitId)
  return [orbitId, ...subs.map(n => n.id)]
}

// ── Heatmap (weeksBack × 7 days) — 0-1 values ────────────────────────────────

export function getHeatmap(
  pulses: Pulse[],
  nodeIdOrIds: string | string[],
  weeksBack = 7,
): number[][] {
  const ids = Array.isArray(nodeIdOrIds) ? nodeIdOrIds : [nodeIdOrIds]
  const targetPulses = pulses.filter(p => ids.includes(p.nodeId))
  const now = new Date()

  // Find max daily value for normalization
  const dailyTotals: Record<string, number> = {}
  targetPulses.forEach(p => {
    dailyTotals[p.date] = (dailyTotals[p.date] ?? 0) + p.value
  })
  const maxVal = Math.max(1, ...Object.values(dailyTotals))

  return Array.from({ length: weeksBack }, (_, wi) =>
    Array.from({ length: 7 }, (_, di) => {
      // wi=0 is oldest week. di=0 is Monday.
      const d = new Date(now)
      const dow = d.getDay()
      // Monday of current week
      d.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1))
      // Go back (weeksBack-1-wi) weeks, then add di days
      d.setDate(d.getDate() - (weeksBack - 1 - wi) * 7 + di)
      const dateStr = toDateStr(d)
      return (dailyTotals[dateStr] ?? 0) / maxVal
    })
  )
}
