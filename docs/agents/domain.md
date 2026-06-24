# Domain Docs: Single-Context Layout

This project uses a **single-context** layout with one `CONTEXT.md` at the repo root and ADRs in `docs/adr/`.

## Structure

```
.
├── CONTEXT.md
├── docs/
│   ├── adr/
│   │   ├── 001-stack-choice.md
│   │   ├── 002-visualization-tech.md
│   │   └── ...
│   └── agents/
│       ├── issue-tracker.md
│       ├── triage-labels.md
│       └── domain.md
└── ...
```

## Reading Context

Agents and humans should read:

1. **`CONTEXT.md`** first — project domain language, key concepts, constraints
2. **`docs/adr/`** second — past architectural decisions, rationale for current choices
3. **Issue tickets** (`.scratch/*/README.md`) third — specific task details

## Domain Vocabulary

See `CONTEXT.md` for terms like Core, Orbit, Sub-Orbit, Pulse, Proof, and node visualization.

## No Multi-Context

This project is not a monorepo. All domain context is centralized in a single `CONTEXT.md` file. If the project grows to multiple domains, migrate to multi-context with `CONTEXT-MAP.md`.
