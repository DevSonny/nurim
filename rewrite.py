import re

with open('/home/sonny/nurim/lib/aggregate.ts', 'r') as f:
    content = f.read()

# 1. Imports
content = re.sub(r"import \{ getPulses, getNodes \} from '\./store'\nimport type \{ PulseKind \} from '\./store'\n", "", content)

interfaces = """export type PulseKind = 'score' | 'time' | 'check' | 'money' | 'progress'

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
"""
content = content.replace("// ── Date helpers", interfaces + "\n// ── Date helpers")

# 2. getProgress
content = content.replace("export function getProgress(nodeId: string): Progress {", "export function getProgress(nodes: StoredNode[], pulses: Pulse[], nodeId: string): Progress {")
content = content.replace("  const nodes = getNodes()\n", "")
content = content.replace("    const pulses = getPulses(nodeId)", "    const nodePulses = pulses.filter(p => p.nodeId === nodeId)")
content = content.replace("const current = pulses\n", "const current = nodePulses\n")
content = content.replace("getProgress(s.id)", "getProgress(nodes, pulses, s.id)")

# 3. getNodeKind
content = content.replace("export function getNodeKind(nodeId: string): PulseKind {", "export function getNodeKind(nodes: StoredNode[], pulses: Pulse[], nodeId: string): PulseKind {")
content = content.replace("const pulses = getPulses(nodeId)", "const nodePulses = pulses.filter(p => p.nodeId === nodeId)")
content = content.replace("for (const p of pulses) {", "for (const p of nodePulses) {")
content = content.replace("const node = getNodes().find(n => n.id === nodeId)", "const node = nodes.find(n => n.id === nodeId)")

# 4. getCategoryTotals
content = content.replace("export function getCategoryTotals(\n  ids: string[] | null,\n  range: 'month' | 'all',\n): CategoryTotal[] {", "export function getCategoryTotals(\n  nodes: StoredNode[], pulses: Pulse[],\n  ids: string[] | null,\n  range: 'month' | 'all',\n): CategoryTotal[] {")
content = content.replace("  const nodes = getNodes()\n", "")
content = content.replace("const orbitAndSubIds = getOrbitAndSubIds(orbit.id)", "const orbitAndSubIds = getOrbitAndSubIds(nodes, orbit.id)")
content = content.replace("const pulses = scopedIds.flatMap(id => getPulses(id)).filter(p =>", "const scopedPulses = pulses.filter(p => scopedIds.includes(p.nodeId)).filter(p =>")
content = content.replace("if (pulses.length === 0) continue", "if (scopedPulses.length === 0) continue")
content = content.replace("for (const p of pulses) {", "for (const p of scopedPulses) {")

# 5. getSeries
content = content.replace("export function getSeries(\n  nodeIdOrIds: string | string[],", "export function getSeries(\n  pulses: Pulse[],\n  nodeIdOrIds: string | string[],")
content = content.replace("const allPulses = ids.flatMap(id => getPulses(id))", "const allPulses = pulses.filter(p => ids.includes(p.nodeId))")

# 6. getStreak
content = content.replace("export function getStreak(nodeId?: string | null): number {", "export function getStreak(pulses: Pulse[], nodeId?: string | null): number {")
content = content.replace("const pulses = nodeId ? getPulses(nodeId) : getPulses()", "const targetPulses = nodeId ? pulses.filter(p => p.nodeId === nodeId) : pulses")
content = content.replace("if (pulses.length === 0) return 0", "if (targetPulses.length === 0) return 0")
content = content.replace("const datesWithPulses = new Set(pulses.map(p => p.date))", "const datesWithPulses = new Set(targetPulses.map(p => p.date))")

# 7. getTotal
content = content.replace("export function getTotal(nodeId?: string | null): number {", "export function getTotal(pulses: Pulse[], nodeId?: string | null): number {")
content = content.replace("const pulses = nodeId ? getPulses(nodeId) : getPulses()", "const targetPulses = nodeId ? pulses.filter(p => p.nodeId === nodeId) : pulses")
content = content.replace("return pulses.reduce((sum, p) => sum + p.value, 0)", "return targetPulses.reduce((sum, p) => sum + p.value, 0)")

# 8. getActivityRate
content = content.replace("export function getActivityRate(ids: string[] | null = null): number {", "export function getActivityRate(pulses: Pulse[], ids: string[] | null = null): number {")
content = content.replace("const pulses = ids ? ids.flatMap(id => getPulses(id)) : getPulses()", "const targetPulses = ids ? pulses.filter(p => ids.includes(p.nodeId)) : pulses")
content = content.replace("if (pulses.length === 0) return 0", "if (targetPulses.length === 0) return 0")
content = content.replace("const sortedDates = [...new Set(pulses.map(p => p.date))].sort()", "const sortedDates = [...new Set(targetPulses.map(p => p.date))].sort()")

# 9. getBestDayOfWeek
content = content.replace("export function getBestDayOfWeek(ids: string[] | null = null): string {", "export function getBestDayOfWeek(pulses: Pulse[], ids: string[] | null = null): string {")
content = content.replace("const pulses = ids ? ids.flatMap(id => getPulses(id)) : getPulses()", "const targetPulses = ids ? pulses.filter(p => ids.includes(p.nodeId)) : pulses")
content = content.replace("if (pulses.length === 0) return '-'", "if (targetPulses.length === 0) return '-'")
content = content.replace("pulses.forEach(p => {", "targetPulses.forEach(p => {")

# 10. getTodayPulseCount
content = content.replace("export function getTodayPulseCount(): number {", "export function getTodayPulseCount(pulses: Pulse[]): number {")
content = content.replace("return getPulses().filter(p => p.date === today).length", "return pulses.filter(p => p.date === today).length")

# 11. getThisWeekRate
content = content.replace("export function getThisWeekRate(): number {", "export function getThisWeekRate(pulses: Pulse[]): number {")
content = content.replace("const allPulses = getPulses()\n  const pulsedDates = new Set(allPulses.filter(p => p.date >= weekStart).map(p => p.date))", "const pulsedDates = new Set(pulses.filter(p => p.date >= weekStart).map(p => p.date))")

# 12. getOrbitAndSubIds
content = content.replace("export function getOrbitAndSubIds(orbitId: string): string[] {", "export function getOrbitAndSubIds(nodes: StoredNode[], orbitId: string): string[] {")
content = content.replace("  const nodes = getNodes()\n", "")

# 13. getHeatmap
content = content.replace("export function getHeatmap(\n  nodeIdOrIds: string | string[],", "export function getHeatmap(\n  pulses: Pulse[],\n  nodeIdOrIds: string | string[],")
content = content.replace("const pulses = ids.flatMap(id => getPulses(id))", "const targetPulses = pulses.filter(p => ids.includes(p.nodeId))")
content = content.replace("pulses.forEach(p => {", "targetPulses.forEach(p => {")

with open('/home/sonny/nurim/lib/aggregate.ts', 'w') as f:
    f.write(content)
