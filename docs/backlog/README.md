# Backlog

Deferred items only: an item here binds nothing, and records a decision not yet made with the evidence that would settle it.

## Rules

- Each item is its own file, `B-<nnnn>-<slug>.md`, numbered with four digits; a migrated backlog series is zero-padded to four digits at migration and is never renumbered. The index carries order.
- Every item states `Revisit when`: the event that makes it actionable — a condition outside the item, or a freed slot in the plan. A date is not a trigger; an item that names neither is a wish.
- **Status lives in the index, not the item file.** The four states and their boundaries are defined in `docs/norm/roles.md` (Backlog index); the index records the state, not a second definition.
- Closing: write a one-line outcome under `## Outcome`, set the row to `closed`, keep the file and the row. Closed rows stay; the index is an inventory, not a to-do list.

## Index

| ID | Item | Status | Revisit when |
| --- | --- | --- | --- |
| [B-0001](B-0001-toolchain-role.md) | Whether `docs/toolchain/` survives | open | A third trap file, or two traps stop reproducing |
| [B-0002](B-0002-portable-skeleton-check.md) | A checker for target repositories | open | The first forge, or a migration's overlay step |
| [B-0003](B-0003-module-agents-threshold.md) | The module `AGENTS.md` threshold | open | gearset supplies a six-module sample |
| [B-0004](B-0004-overlay-config-validation.md) | Validate overlay configs | open | The first forge, or a migration's overlay step |
| [B-0005](B-0005-rollout-five-repositories.md) | Roll out to the five repositories | active | The first migration (oshi) completes; the next package opens then |
| [B-0006](B-0006-backlog-index-growth.md) | Index growth under a fixed entry budget | open | Any index exceeds 40 rows, or a second repository migrates |
| [B-0007](B-0007-frozen-evidence-role.md) | A home for frozen evidence | open | A second repository keeps a frozen protocol |
| [B-0008](B-0008-tombstone-role.md) | Tombstones have no role row | closed | The first tombstone in the rollout |
| [B-0009](B-0009-module-readme-budget.md) | Module README has no budget | open | gearset's five module READMEs are measured |
| [B-0010](B-0010-routing-entry-limit.md) | Routing-table limit is unenforced | closed | The next `AGENTS.md` change |
| [B-0011](B-0011-overlay-markdown-formatting.md) | Overlays format no Markdown | open | The first forge needing Markdown normalization |
| [B-0012](B-0012-bun-fmt-table-layout.md) | bun fmt may keep tables compact | open | bun fmt gains a table padding setting |
| [B-0013](B-0013-commit-base-home.md) | The commit base lives outside the norm source | closed | The norm-source model lands, or the commit convention changes |
| [B-0014](B-0014-rename-norm-source.md) | The repository still presents itself as a skeleton | closed | `B-0005` closes and the placeholder model is in place |
