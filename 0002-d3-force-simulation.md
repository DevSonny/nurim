# ADR 0002 — D3 force simulation + Framer Motion

## Status
Accepted

## Context
분자형 그래프(Core + Orbits)를 시각화해야 한다.
UI 퀄리티와 애니메이션이 서비스의 핵심 가치 중 하나다.

## Decision
- 그래프 시각화: D3.js force simulation (노드가 물리적으로 튕기고 연결되는 효과)
- 애니메이션: Framer Motion (노드 성장, 페이지 전환)

## Alternatives Considered
- React Flow: 노드-엣지 편집에 강하지만 물리 시뮬레이션 애니메이션이 약함
- CSS 직접 구현: 단순한 구조엔 가능하나 분자형 동적 레이아웃 구현이 어려움

## Consequences
- D3 러닝커브가 있으나 바이브 코딩(AI 활용) 전제로 진행
- force simulation이 모바일 성능에 영향을 줄 수 있음 — 노드 수 제한 필요 (Orbit 최대 8개 권장)
