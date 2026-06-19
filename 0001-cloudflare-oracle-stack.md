# ADR 0001 — Cloudflare Workers + Oracle Cloud PostgreSQL

## Status
Accepted

## Context
Supabase + Vercel 조합은 이미 이전 프로젝트에서 사용해봤다.
이번 프로젝트의 목표 중 하나는 무료 사용량이 넉넉한 다른 스택을 직접 경험해보는 것이다.

Cloudflare Workers는 TCP 직접 연결을 지원하지 않아 Oracle Cloud PostgreSQL에 바로 붙을 수 없다.
이 문제는 Cloudflare Hyperdrive(DB connection pooler + HTTP 브리지)로 해결한다.

## Decision
- Frontend/API: Cloudflare Pages + Workers
- DB: Oracle Cloud PostgreSQL (Always Free tier)
- DB 연결: Cloudflare Hyperdrive

## Alternatives Considered
- Supabase + Vercel: 이미 경험함, 이번엔 제외
- Neon + Cloudflare: PostgreSQL HTTP 드라이버로 Workers 네이티브 연결 가능하나, Oracle Free tier의 넉넉한 사양(OCPU 1, RAM 1GB) 대비 매력이 낮음

## Consequences
- Hyperdrive 세팅이 추가로 필요함 (예상 소요: 반나절)
- Oracle Cloud 콘솔에서 PostgreSQL 인스턴스 세팅 필요
- 대신 DB 용량/성능 제약이 사실상 없음 (Always Free)
