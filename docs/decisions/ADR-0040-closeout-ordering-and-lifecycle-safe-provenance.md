# ADR-0040 — Closeout orders relocation before summary and decouples guide provenance from package lifetime

Status: Accepted (2026-11-23)

## Context

ADR-0037 placed transferable closeout rules in "one knowledge guide" at `docs/knowledge/guides/`, required the guide to open with one line pointing at `summary.md`, and left the full guide shape to the installed `writing-a-work-package-closeout` skill. Reconciling that skill with `docs/norm/flow.md` surfaced four defects:

- **Guide cardinality and unit.** One effort can settle methods on two unrelated topics, and forcing both into one "effort guide" breaks `docs/norm/roles.md` (`/docs/knowledge/guides/<topic>.md`) and R13. Conversely, when a topic guide already exists from an earlier effort, updating it cannot open the whole page with one effort's header; and splitting a guide to one atomic rule per file would break a single nine-rule method like `migrating-a-repository-onto-the-standard.md` into nine fragments and spend the 40-row directory index cap.
- **Cross-lifecycle link rot.** An archived work package (`work-packages/archive/<slug>/` or a suite track) may later be retired and deleted, while a knowledge guide is deleted when its method stops being true (`roles.md`). A Markdown link across that boundary fails `docs.broken_link` in both directions: a guide linking `summary.md` breaks when the package is deleted, and a frozen `summary.md` linking a guide breaks when the guide retires while M5 forbids editing frozen records.
- **Step ordering and board closure.** `flow.md` wrote `summary.md` in step 1 before durable pages were relocated in step 2, before the branch state was confirmed in step 3, and before directory indexes were updated; an agent following the steps in order had to rewrite `summary.md` three times. Meanwhile `flow.md`'s checklist still carried runtime wording ("every open item is in the board's index"), and `scripts/package-checks.ts` allowed an archived board to keep `blocked` items or active `Next`, `Blocked`, and `Open decisions` fields.
- **Authority inversion.** Naming an external skill in `flow.md` as the holder of a document shape inverts P6: the norm is the source, and a skill executes it downstream.

## Decision

1. **Closeout order and board gate.** Closeout runs in dependency order: confirm no item on `board.md` is `todo`, `doing`, or `blocked` (`Acceptance: not met` records unmet quality, not open work) and settle an unmerged branch with the maintainer; relocate durable contracts, ADRs, guides, and cases and add their directory `README.md` rows (creating `docs/knowledge/` and its indexes on first trigger); write or review `summary.md` with counts recomputed at closeout and set `board.md` to `Status: closed`, `Next: none`, `Blocked: none`, and `Open decisions: none`; freeze the package to `work-packages/archive/<slug>/`; update the package and backlog indexes; and register cited moved paths in `docs/adapters.md` before verifying `rg -l '<slug>'` and the gate. `scripts/package-checks.ts` enforces the closed-board state on archived packages.
2. **Topic-scoped guides and cases.** Closeout writes or updates zero or more topic guides at `docs/knowledge/guides/<topic>.md` — one method or work scenario per page, never a miscellaneous effort bundle and never one file per bullet — plus an optional case at `docs/knowledge/cases/<topic>.md` when an incident's evidence chain outlives the effort. `docs/norm/flow.md` owns this contract directly; `writing-a-work-package-closeout` executes the norm without non-standard fallback shapes.
3. **Lifecycle-safe provenance.** Live directory `README.md`s and links between live durable pages (`guide` to `case` or `ADR`) use Markdown links checked by `links()`. Cross-lifecycle references stay unlinked: a guide stands on the observation it records (or links the durable `case` or `ADR`), never links `summary.md` or relies on it staying on disk, and writes any effort provenance as past-tense backticked text (slug, branch, or commit); `summary.md` names durable `docs/` paths in backticks.

## Options considered

1. **Keep ADR-0037's single effort-scoped guide opening with a pointer to `summary.md`.** Rejected: a multi-topic effort violates `<topic>.md` and R13, an existing topic guide cannot open with a single effort's header, and a live pointer into `work-packages/archive/` rots when the package retires.
2. **Split guides to one rule per page and require bidirectional Markdown links between `summary.md` and `guides/`.** Rejected: one-rule-per-page fragments one coherent method across files and exhausts the 40-row directory index budget, while Markdown links across the archive/live boundary fail `docs.broken_link` whenever either side is retired.
3. **Topic-scoped `0..n` guides and optional cases written before `summary.md`, with unlinked provenance across the archive boundary and norm-owned rules.** Chosen: each role keeps its own lifecycle, live indexes keep link checking on live pages, and closeout steps run without forward references.

## Consequences

- `ADR-0037` is marked superseded in part by this ADR; the four-file ledger and the `docs/knowledge/guides/` destination stand.
- `docs/norm/flow.md`, `work-packages/README.md`, `template/effort/work-packages/README.md`, and `template/effort/work-packages/summary.md` update the closeout order, the guide/case cardinality, the unlinked cross-lifecycle provenance rule, and the closeout checklist; `flow.md` drops the external skill reference.
- `docs/norm/rules.md` and `docs/conventions.md` extend the section-number citation ban to line numbers.
- `scripts/findings.ts`, `scripts/package-checks.ts`, and `scripts/package-checks.test.ts` fail an archived `board.md` that retains `todo`, `doing`, or `blocked` items or non-`none` `Next`, `Blocked`, or `Open decisions` fields.
- `writing-a-work-package-closeout` aligns downstream as an executor of `docs/norm/flow.md`, dropping non-standard fallbacks and creating `docs/knowledge/` on first trigger.
