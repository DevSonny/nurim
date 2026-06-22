# Nurim — Project CLAUDE.md

## Stack
- Next.js 15.3.9 App Router · React **19** · TypeScript
- @react-three/fiber v9 · @react-three/drei v10 · @react-three/postprocessing v3
- d3-force-3d · localStorage node store (`lib/store.ts`)

## Quality Gate (코드 변경 시 순서대로)
1. `npx tsc --noEmit` — 출력 없음 = 통과
2. dev 서버가 꺼져 있으면 `npm run dev` 실행 후 대기
3. Playwright 실행:
   ```
   node /tmp/test-nurim.js
   ```
   / · /dashboard · /settings · /pulse · /stats 전부 "OK" 확인
4. JS console 에러 있으면 무조건 수정 후 재확인, 완료로 보고하지 말 것

## Known Pitfalls

**.next 캐시 오염** — 편집 중 hot-reload 시 `Cannot find module './NNN.js'` 발생.
수정: `pkill -f "next dev"; rm -rf .next` 후 재시작.

**React 반드시 19** — r3f v9 peer requirement. React 18이면 `ReactCurrentOwner` undefined 발생. react/react-dom 절대 18로 내리지 말 것.

**three.js 패키지 설치 시** `--legacy-peer-deps` 필요.

**serverExternalPackages** — next.config.ts의 three.js 계열 패키지를 `transpilePackages`로 옮기지 말 것.

## Architecture
- `lib/store.ts` — 노드 CRUD 단일 소스 (localStorage). `getNodes()` / `getBonds()` / `addOrbit()` / `addSub()` / `deleteNode()`.
- `lib/tokens.ts` — 디자인 토큰 + 타입 전용. 런타임 노드 데이터 없음.
- 분자 씬 SSR 제외: `components/molecule/index.tsx`에서 `dynamic(..., { ssr: false })`.
- **노드 잠금 규칙**: 생성 후 이름 수정 불가, 삭제만 가능. store.ts에 update 함수 없음.
