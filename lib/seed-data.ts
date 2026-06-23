'use client'
// 테스트용 샘플 Pulse 데이터 주입.
// 최근 90일간 현실적인 패턴으로 생성.

import { getNodes, addPulse, setGoal, clearPulses } from './store'
import type { PulseKind } from './store'

function dateOffset(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Seeded pseudo-random (deterministic by index)
function fakeRand(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

export function seedPulseData(): void {
  const nodes = getNodes()
  const orbitNodes = nodes.filter(n => n.type === 'orbit')
  const subNodes   = nodes.filter(n => n.type === 'sub')

  // Set goals on default nodes if missing
  const byId = Object.fromEntries(nodes.map(n => [n.id, n]))

  // 러닝 → accumulation 100km/월
  const running = subNodes.find(n => n.label === '러닝') ?? subNodes[0]
  if (running && !running.goalType) {
    setGoal(running.id, { goalType: 'accumulation', target: 100, unit: 'km', period: 'month' })
  }

  // 코딩 → repetition 90분/일
  const coding = subNodes.find(n => n.label === '코딩') ?? subNodes[1]
  if (coding && !coding.goalType) {
    setGoal(coding.id, { goalType: 'repetition', target: 90, unit: '분', period: 'day' })
  }

  // 영어 → repetition 점수 8/일
  const english = subNodes.find(n => n.label === '영어')
  if (english && !english.goalType) {
    setGoal(english.id, { goalType: 'repetition', target: 8, unit: '점', period: 'day' })
  }

  // 투자 → accumulation 500000원/월
  const invest = subNodes.find(n => n.label === '투자')
  if (invest && !invest.goalType) {
    setGoal(invest.id, { goalType: 'accumulation', target: 500000, unit: '원', period: 'month' })
  }

  // Generate 90 days of pulses
  let idx = 0
  for (let day = 89; day >= 0; day--) {
    const date = dateOffset(day)
    const dow = new Date(date).getDay() // 0=Sun

    // Skip some days for realistic gaps (≈20% miss rate)
    if (fakeRand(idx++) < 0.18) continue

    // Running — 3~12km, 'check' kind (값 = km)
    if (running) {
      const isWeekend = dow === 0 || dow === 6
      if (isWeekend || fakeRand(idx++) > 0.35) {
        const km = isWeekend
          ? 6 + Math.round(fakeRand(idx++) * 8)
          : 3 + Math.round(fakeRand(idx++) * 5)
        addPulse(running.id, km, date, undefined, 'check' as PulseKind)
      }
    }

    // Coding — 30~150분
    if (coding) {
      if (dow !== 0 && fakeRand(idx++) > 0.25) {
        const mins = 30 + Math.round(fakeRand(idx++) * 120)
        addPulse(coding.id, mins, date, undefined, 'time' as PulseKind)
      }
    }

    // English score
    if (english) {
      if (fakeRand(idx++) > 0.3) {
        const score = 5 + Math.round(fakeRand(idx++) * 5)
        addPulse(english.id, score, date, undefined, 'score' as PulseKind)
      }
    }

    // Investment — 수입 위주, 20%는 지출(음수)로 ± 데모
    if (invest) {
      if (fakeRand(idx++) < 0.15) {
        const amounts = [50000, 100000, 200000, 500000]
        const amount = amounts[Math.floor(fakeRand(idx++) * amounts.length)]
        const isExpense = fakeRand(idx++) < 0.2
        addPulse(invest.id, isExpense ? -amount : amount, date, undefined, 'money' as PulseKind)
      }
    }

    // Orbit-level pulses for 건강/관계 (no subs)
    orbitNodes.forEach(orbit => {
      const mySubIds = subNodes.filter(s => s.parentId === orbit.id).map(s => s.id)
      const hasSubPulses = mySubIds.length > 0
      if (!hasSubPulses && fakeRand(idx++) > 0.45) {
        addPulse(orbit.id, Math.round(1 + fakeRand(idx++) * 4), date, undefined, 'check' as PulseKind)
      }
    })
  }
}

export function clearPulseData(): void {
  clearPulses()
}
