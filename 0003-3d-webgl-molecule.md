# ADR 0003: 3D WebGL 분자 시각화 (ADR 0002 Supersede)

## 상태
Accepted

## 맥락

ADR 0002는 2D D3 force simulation + Framer Motion을 채택했다.
디자인 개혁 검토 결과 다음 이유로 3D WebGL로 전환한다.

1. **품질 격차**: CSS/SVG 글로우는 발광·블룸·깊이감이 약해 항상 싸 보인다.
   WebGL postprocessing bloom은 CSS로 낼 수 없는 발광 깊이를 제공한다.
2. **분자가 핵심 가치**: ADR 0002가 "UI 퀄리티와 애니메이션이 서비스의 핵심 가치"라고
   선언했으므로, 분자 렌더는 최고 품질 기술을 써야 한다. CSS 흉내로 타협하면 안 된다.
3. **3D > 2D**: 드래그 회전·깊이감·카메라 움직임으로 더 강한 상호작용.
   연간 성장 리셋 시 "지난 별자리 아카이브" 표현에도 3D 공간이 적합하다.
4. **코드 직접 디자인**: Penpot으로 3D를 표현할 수 없다. 분자는 코드가 진실의 원천.

## 결정

- **react-three-fiber (r3f)**: React 방식 three.js 래퍼. JSX로 3D 씬 선언.
- **@react-three/drei**: OrbitControls, Html, AdaptiveDpr 등 유틸.
- **@react-three/postprocessing + postprocessing**: Bloom 효과. 핵심 품질 차이.
- **d3-force-3d**: 3D force 레이아웃. z축 포함 물리 시뮬레이션.
- 레이아웃 계산만 d3-force-3d, 렌더링은 커스텀 r3f (완전한 머티리얼·bloom 제어).

## 기각된 대안

- **react-force-graph-3d**: 배터리 포함 레이아웃이나 커스텀 머티리얼·bloom 제어 불가.
  분자가 제품 핵심 가치이므로 커스텀 r3f 선택.
- **2D 유지 (ADR 0002)**: 품질 격차 해소 불가. Penpot 목업보다 구현이 열화되는 문제 미해결.

## 모바일 성능 전략

- `<AdaptiveDpr />` (drei): 성능 압박 시 DPR 자동 축소
- 노드 캡: Orbit≤8, Sub-Orbit≤8 → 최대 ~72노드
- Bloom luminanceThreshold로 selective bloom (어두운 영역 제외)
- 저사양 폴백: 정적 스냅샷 이미지 (Phase 2에서 구현)

## 결과

- ADR 0002 (2D D3 force-sim + Framer Motion) supersede
- three.js 번들 ~600KB gzip 추가 (Cloudflare Pages 캐시로 완화)
- 데스크톱 60fps, 중급 모바일 30fps+ 목표
- Penpot은 2D 화면(Auth/Stats/Feed) 레이아웃 레퍼런스로 강등
