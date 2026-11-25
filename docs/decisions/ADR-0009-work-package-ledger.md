# ADR-0009 — The work package is a work item ledger

Status: Accepted (2026-11-16). Superseded in part by [ADR-0029](ADR-0029-work-item-files.md) (2026-11-19) and [ADR-0033](ADR-0033-item-description-form.md) (2026-11-20); the four-ledger and work-item principles still hold.

## Context

The work package's `todo.md` was a one-line checklist: `- [ ] Step — done when: <observable>`. That shape is enough for a few steps, but the five-repository rollout has more than twenty steps, long-lived phases, and dependencies between them. The one-line form records acceptance but not the work unit's scope, dependencies, overall progress, or the evidence that proves a step is done. `plan.md` carries the approach and the migration guide, but it has no phase-level work breakdown, so the reader must infer the work units from the checklist.

The first fix, a `Current state` block at the top of `todo.md`, made the gap visible: the block is a dashboard, not the ledger, and without a `## Work items` boundary it reads as part of the checklist. A separate `progress.md` would add a fifth file and a second state home; an append-only work log would duplicate `git log` and `summary.md`, and `0004` R9 forbids history in a living document.

## Decision

The work package remains four files, and the work unit moves inside `todo.md`:

- `plan.md` carries a **work breakdown**: phases, the work item IDs in each phase, and each phase's exit condition. It does not restate the item detail.
- `todo.md` opens with the **`Current state` dashboard**, then `## Work items` with phase headings. Each item is a stable `W<n>` block with status (`todo`, `doing`, `blocked`, `done`), dependencies, a prose description, one or more observable done-when criteria, and evidence.
- `done` requires evidence: a commit, a command, a file, or a decision. An item without evidence stays open.
- The description is prose; the done-when criteria are a bullet list because each is a separate check. There is no `Notes` field and no second plan inside the item.
- One work item is one reviewable commit or one primary outcome. If it needs more, it is split into another `W<n>`.

## Options considered

1. **Keep the one-line checklist.** Rejected: it is compact, but it cannot carry scope, dependencies, progress, or proof for a multi-item effort; the reader reconstructs the work from prose elsewhere.
2. **Rename `todo.md` to `progress.md`.** Rejected: the file's primary job is still the ordered work list, not a status page. A rename changes a role home and every pointer, while the checklist still needs a home; `progress` also invites an append-only log.
3. **Add a separate `progress.md` or work log.** Rejected: it creates a fifth file and a second state home, duplicating `todo.md` and `plan.md`; `git log` and `summary.md` already own history.
4. **Put ticket detail in `plan.md`.** Rejected: `plan.md` is how and why; item scope, acceptance, and evidence would duplicate `todo.md`, and the plan would become a second ledger.
5. **Work item ledger in `todo.md` plus a phase breakdown in `plan.md`.** Chosen: one detail home, one dashboard, one phase overview; no new file.

## Consequences

- `0003-flow.md` defines the work item and the phase breakdown; `0002-roles.md` names the work items in the Work package admission.
- `template/effort/docs/workflow.md`, `template/effort/tasks/_template.md`, and both `tasks/README.md` copies carry the schema.
- The rollout's `todo.md` is rewritten as `W01`–`W21`; `plan.md` gains the phase table; the dashboard stays at the top.
- A `done` item without evidence is a defect; the closeout checklist checks evidence and `Current state`.
- The work package still has four files. `progress.md`, a work log, and ticket detail in `plan.md` are rejected.
- The gate checks structure only; the prose and evidence quality remain review criteria.
