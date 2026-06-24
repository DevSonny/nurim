# Triage Labels

This project uses the following canonical triage label vocabulary for issues. Since issues are stored as markdown files under `.scratch/`, these labels are tracked as metadata fields within each issue document rather than as GitHub labels.

## Canonical Labels

| Label | Meaning | Usage |
|-------|---------|-------|
| `needs-triage` | Maintainer needs to evaluate | Not used; all issues pre-evaluated before `.scratch/` |
| `needs-info` | Waiting on reporter | Not used; solo project |
| `ready-for-agent` | Fully spec'd, AFK-ready | Default state for all `.scratch/` issues |
| `ready-for-human` | Needs human implementation | Not used; solo developer |
| `wontfix` | Will not be actioned | Can be added to deprecated issues |

## Implementation

Since this is a markdown-based tracker, labels are represented as frontmatter or inline metadata:

```markdown
# Issue Title

**Status:** ready-for-agent
**Blocked by:** [other-issue]
**Priority:** High

## What to build
...
```

## No Duplicate Labels

All `.scratch/` issues are created with `ready-for-agent` status, indicating they are fully specified and ready for implementation.
