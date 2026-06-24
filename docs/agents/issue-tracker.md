# Issue Tracker: Local Markdown

Issues live as markdown files under `.scratch/`. This repository does not use GitHub Issues or a centralized issue tracker; instead, issues are tracked locally as part of the codebase.

## File Structure

```
.scratch/
├── 01-project-setup/
│   └── README.md
├── 02-google-oauth/
│   └── README.md
├── 03-core-crud/
│   └── README.md
├── 04-dashboard-ui/
│   └── README.md
├── 05-pulse/
│   └── README.md
├── 06-visualization/
│   └── README.md
├── 07-achievement/
│   └── README.md
├── 08-proof/
│   └── README.md
└── 09-emoji-reaction/
    └── README.md
```

## Issue Format

Each issue is a markdown file with the following structure:

```markdown
# [Issue Title]

## What to build

[Concise description of the end-to-end behavior]

## Subtasks

### [Subtask Name]

[Description]

**Acceptance criteria:**
- [ ] Criterion 1
- [ ] Criterion 2

**Blocked by:** [Other issue reference]

---

## Overall Acceptance Criteria

- [ ] Overall criterion 1
- [ ] Overall criterion 2
```

## Creating and Updating Issues

1. Create a new directory under `.scratch/` with a descriptive name
2. Add a `README.md` file following the format above
3. Commit to git and push to the repository

## Issue Workflow

1. Pick an issue from `.scratch/`
2. Work through the subtasks in dependency order
3. Check off acceptance criteria as you complete them
4. When all subtasks are complete, update the issue status in `README.md`

## No External Request Surface

Pull requests are not tracked as issues; this is a solo project with no external request surface.
