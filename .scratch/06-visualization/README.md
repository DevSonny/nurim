# 시각화 (노드 성장 애니메이션)

## What to build

Pulse 입력 시 실시간으로 노드(분자)가 자라는 시각화. D3.js 또는 Three.js + React Three Fiber 사용.

## Subtasks

### 1. D3.js 또는 Three.js 기본 구성 및 노드 렌더링

D3.js force simulation 또는 Three.js + React Three Fiber를 사용한 기본 장면 구성, Sub-Orbit들을 노드로 렌더링.

**Acceptance criteria:**
- [ ] D3.js 또는 Three.js 라이브러리 설치
- [ ] 기본 시각화 컴포넌트 생성
- [ ] Sub-Orbit 데이터를 노드로 변환
- [ ] 화면에 여러 노드 렌더링
- [ ] 성능 테스트 (노드 50개 이상 렌더링 가능)
- [ ] 모바일 반응형 처리

**Blocked by:** 04-dashboard-ui / Subtask 3

---

### 2. Pulse 입력 시 노드 성장 애니메이션

Pulse가 저장되면 해당 노드가 자라는 3D 애니메이션 구현, 실시간 업데이트.

**Acceptance criteria:**
- [ ] Pulse 저장 후 즉시 노드 크기 증가 애니메이션
- [ ] 부드러운 애니메이션 (0.5~1초)
- [ ] 60fps 목표 성능 유지
- [ ] WebSocket 또는 polling으로 실시간 업데이트
- [ ] 다중 노드 동시 애니메이션 가능
- [ ] 애니메이션 중 사용자 인터랙션 가능

**Blocked by:**
- Subtask 1
- 05-pulse / Subtask 2

---

## Overall Acceptance Criteria

- [ ] 시각화 성능 (60fps 이상)
- [ ] 노드 성장 애니메이션 부드러움
- [ ] 실시간 데이터 동기화
