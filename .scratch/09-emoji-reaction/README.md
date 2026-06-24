# 이모지 반응

## What to build

Proof에 이모지 반응 추가 및 실시간 카운팅 표시.

## Subtasks

### 1. 이모지 반응 UI 및 API

Proof 아래 이모지 반응 버튼 (5개 이모지), 반응 추가/제거, 실시간 카운팅.

**Acceptance criteria:**
- [ ] Proof마다 5개 이모지 버튼 표시 (👍, 🔥, 🎉, 💪, 🌟)
- [ ] POST /api/proof/[id]/reaction - 이모지 반응 추가
- [ ] DELETE /api/proof/[id]/reaction - 반응 제거 (사용자의 반응만)
- [ ] 반응 카운팅 실시간 업데이트
- [ ] 사용자의 반응 강조 표시 (색상 변경, 배경 색 등)
- [ ] 같은 이모지 중복 추가 방지
- [ ] 반응 추가/제거 시 약간의 애니메이션

**Blocked by:** 08-proof / Subtask 2

---

## Overall Acceptance Criteria

- [ ] 이모지 반응 추가/제거 동작
- [ ] 실시간 카운팅 업데이트
- [ ] 중복 반응 방지
