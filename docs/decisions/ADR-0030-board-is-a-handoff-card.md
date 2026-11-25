# ADR-0030 — The board's Current state is a handoff card

Status: Accepted (2026-11-20). Superseded in part by [ADR-0036](ADR-0036-closeout-summary-answers-reader-questions.md) (2026-11-21); the board decision still holds.

## Context

The work-package board had accumulated thirteen `Current state` fields: updated date, status, branch, gate, last done, phase, focus, progress, todo, next, blocked, open decisions, and read-first pointers. A review of oshi's board at 2026-11-20 found that the fields were all present but three of them had turned the block into a summary or a log:

- `Open decisions` read `none — R1 settled … R4 settled`, so it recorded four closed decisions and no open question.
- `Gate` packed two repositories' measurements into one line and treated a dated result as a conclusion; `Progress` had changed from `20 done / 3 todo / 1 umbrella` to `22 done / 2 todo`, silently changing its unit.
- `Last done` merged four W07g findings and the W07 closure into one paragraph; `Next` restated W08's internal order; `Status` mixed the package state, the programme, and this package's role in it.

The template had its own gaps: `Status` only offered `open` while an archived package writes `closed`; `Progress` had no `doing` even though the index did; `Branch` and `Gate` were single-valued and could not express the standard and oshi repositories; `Read first` promised plan decisions and check-ins that the plan template did not carry; `summary.md` had three sections and no place for the compromises the norm allows; the template's example index row was not a link; and `_template.md`'s "split at the headings" instruction conflicted with `summary.md` being written only at closeout.

The first proposal was a larger board: keep `Acceptance`, add `Repositories`, five item statuses, five progress counts, open decisions only, and a checker that recomputed the projections. The maintainer rejected the formal parts: a field earns its line only if it changes the next action or answers "where did I leave off". That test removes the fields that restate the index or the closeout.

## Decision

The board is a handoff card: an eight-field `Current state`; the index below it is the only list.

- **The eight fields.** `Updated`, `Status` (`open` / `closed`), `Phase`, `Gate` (a summary with a date and a pointer to the per-repository detail), `Next`, `Last done`, `Blocked`, `Open decisions`. **`Read first` is cut.** It listed the ledger files, the board, and the current item—all adjacent and already named by the package; a preface that only points at its neighbors is ceremony. When a package has a non-obvious entry, `Next` or the item names it.
- **`Repositories` table.** Each repository's branch, gate command, and last result live below the block; the `Gate` line no longer packs two repositories.
- **`Acceptance` is not on the board.** It is a closeout material: the spec states how a reader will know the effort is done, and `summary.md` records `Acceptance: met / not met — <command or output>`. The dashboard does not duplicate it. The cost is that a package with a goal gap and an acceptance gap both in `todo` no longer distinguishes them at a glance; the spec and summary do, and the closeout checklist reads them.
- **`Progress` and `Todo` are cut.** They are projections of the index: the index is the list, `Next` is the first action, `Blocked` is the exception. A count is a derived convenience that drifts on every status flip; the oshi board's `1 umbrella` is the evidence. If a reader needs a count, the index supplies it; the board does not store it.
- **`Focus` is merged into `Next`, then cut.** `Next` is the next action, not the first `todo`: a `doing` item is `finish W<n>`; otherwise the first `todo` is the action that starts it; a finished item set is `closeout — <action>`, or `none`. One field says what to do; the index status says whether it is in progress.
- **`Open decisions` is one open question and its owner; settled decisions are not restated.** A settled decision lives in its ADR or in the item's evidence. No `D<n>` numbering and no decisions table in `plan.md`: the plan carries the approach, phases, risks, and check-ins; the board carries the one question that still needs a ruling.
- **`Last done` is one item, one clause, and the commit(s) that closed it.** It answers "where did I leave off" without becoming a work log; the item file and `git log` hold the detail.
- **The template is a directory of files, not one scaffold.** `template/effort/work-packages/` carries `README.md` (the work-package index a target copies), `spec.md`, `plan.md`, `board.md`, `summary.md`, and `items/W01.md` (with `items/README.md`). A package copies the three working files into `work-packages/<slug>/`, copies `items/W01.md` to `items/<ID>.md`, and copies `summary.md` only at closeout. `_template.md` is deleted.
- **`summary.md` opens with `Acceptance:` and has four sections.** `Done`, `Not done`, `Compromises`, `What a future maintainer must know`; the norm's three permitted compromises now have a home. `rules.md` changes the summary's section count from three to four; a frozen summary keeps the shape it was written with.
- **The checker validates the projections, not the prose.** `boardDashboard` checks the eight fields are present and non-empty, the fields keep their order, `Status` against the package's location, `Updated` as a date, `Phase` as `P<n> — <focus>`, the `Repositories` header and its four-cell rows, item statuses in `todo | doing | blocked | done | dropped`, a dropped item's `Disposition`, `Next` against one `doing`/`todo` item or `closeout`/`none`, `Blocked` against exactly the blocked rows, and `Last done` against one done item. It does not recompute counts or compare the gate's measurements.

## Options considered

1. **Minimal fix: keep the thirteen fields and correct their values.** Rejected as the decision: it makes the board accurate for one day and leaves the status-report shape that produced the drift; every status flip still edits `Progress` and `Todo`, and every settled decision still has a place to accumulate. It was kept as the fallback for a package that cannot afford a schema change.
2. **Keep `Acceptance` on the board.** Rejected: it changes once, at closeout, and the spec already states it; the summary records the result. The cost is accepted: the dashboard no longer distinguishes a goal gap from an acceptance gap when both are `todo`; the spec, the summary, and the closeout checklist do.
3. **Keep `Progress` and `Todo`, and have the checker recompute them.** Rejected: the index is already the list, a count adds no next action, and a projection that must be recomputed is a second place to be wrong. A single `Open: n` was considered and rejected as `Todo` in another name.
4. **Keep `Focus` separate, with `Next` as the first `todo`.** Rejected: two fields describe one decision; a `doing` item means the next action is to finish it, so `Next` can say that without a second line. The index still shows the `doing` status.
5. **Keep `Open decisions` as a numbered table and a plan `Decisions` section.** Rejected: settled decisions are a log, not a handoff; the ADR and the item's evidence are their home. One open question with an owner is the only content that changes a next action.
6. **Keep `_template.md` as one file with headings.** Rejected: copying and splitting is a step that can be half-done, the example index row was not a link, and the files could not be checked as a package. The directory is the same shape as the target, so a copy is a copy.
7. **Keep the three-section summary.** Rejected: the norm permits three compromises and the summary had no `Compromises` section; a compromise recorded nowhere is not recorded. The fourth section is the home.

## Consequences

- `docs/norm/flow.md` changes the package tree, the t0 copy step, the `Current state` fields, the item statuses, the compromise record, closeout step 1, and the acceptance checklist.
- `docs/norm/rules.md` changes the summary's section count; a frozen summary keeps its old shape, so the archived packages are not rewritten.
- `template/effort/work-packages/` gains `spec.md`, `plan.md`, `board.md`, `summary.md`, and `items/`; `_template.md` is deleted. `template/effort/README.md`, `template/README.md`, `template/effort/work-packages/README.md`, `work-packages/README.md`, and the skill's forge step copy the files instead of splitting a scaffold.
- `scripts/package-checks.ts` gains `boardDashboard` (with `packages`); `scripts/doc-checks.ts` keeps the generic checks; `scripts/check-context.ts` holds the read model; `scripts/docs-model.ts` drops `_template.md` from the role names; the tests cover the new checks.
- `work-packages/rollout-oshi/board.md` migrates to the eight fields and the `Repositories` table in the same change; `items/W09.md` writes the four-section summary.
- The board and item files remain working state with no volume budget. The index remains the only list; the board remains the only place a status lives.
