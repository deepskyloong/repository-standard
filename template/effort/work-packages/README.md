# Work packages

One directory per effort that needs a ledger: `work-packages/<slug>/`, holding four ledger files by closeout, one file per work item under `items/`, and the evidence directories it creates. A change that ends in one commit takes no package. What outlives the effort moves to `docs/`; the package itself moves to `work-packages/archive/<slug>/` at closeout and stays there as a frozen record.

## Rules

- Slug: `kebab-case`, describes the outcome (`add-retry-budget`, not `ticket-42`).
- Four ledger files: `spec.md` (what), `plan.md` (how), `board.md` (current state and the work-item index), `summary.md` (result, written at closeout). Create them from the standard's template at `{{NORM_SOURCE}}/template/effort/work-packages/`: copy `spec.md`, `plan.md`, and `board.md` into `work-packages/<slug>/`; copy `items/W01.md` to `items/<ID>.md` when the first work item starts; copy `summary.md` only at closeout. `items/README.md` is the template's note, not a package file. The template's `README.md` is this page, not a package file.
- Evidence the effort produces lives in a named directory beside the ledger — a report, an inventory, or a reproduction script. It stays in git, `summary.md` names it, and closeout archives it with the package. Never create an empty evidence directory.
- The board opens with its eight-field `## Current state` block; see `docs/workflow.md` for its fields and the same-commit update rule. It is a snapshot, not a log.
- Work items are one file each under `items/<ID>.md`, one row each in the board's index. Each file carries dependencies, a description in the form its content needs, done-when criteria, and evidence; status lives in the board, never in the file. `done` requires evidence, and the evidence field cites artifacts and what each proves rather than restating them; a `dropped` item carries a `Disposition` naming where the work went. `plan.md` carries the phase breakdown.
- IDs are identifiers, not a sequence: `plan.md`'s row order is the order, and a phase may hold numbers issued later. A late discovery unrelated to an open item takes the next free `W<n>` and joins the phase where it was found; one that decomposes an open item takes the next letter under it, and the parent becomes a container that closes only when its children do and is never `Next` while one is open.
- `spec.md` carries a `track:` field. See `docs/workflow.md`.
- A work package that changes its goal is a new work package.
- On closeout: write `summary.md`, take the four ledger files, `items/`, and the evidence directories it names, move the package to `work-packages/archive/<slug>/`, and move the row to the archive index.
- A closeout that produced rules writes one knowledge guide at `docs/knowledge/guides/` before the freeze; `summary.md` names it, and it cites the summary for state instead of restating it. The package gains no fifth file: an archived package binds nothing, and a live page never cites it for authority (`{{NORM_SOURCE}}/docs/norm/flow.md`, closeout step 2).

## Open

| Slug | Goal | Track | Status |
| --- | --- | --- | --- |
| — | — | — | — |

## Archived

Closed packages move to `work-packages/archive/<slug>/`; `work-packages/archive/README.md` is their index. The table above lists open packages only, so a package's state is its location rather than a column.

## Closeout checklist

The six closeout steps are in `docs/workflow.md`; this checklist verifies them.

- [ ] `summary.md` opens with `Date:`, `Acceptance:`, `Gate:`, and `Criteria:`, and has `Outcome`, `Residuals`, `Compromises`, and `Verification`; every residual has a destination, and `Compromises` holds only the three permitted types.
- [ ] `summary.md` names every evidence directory; none is empty.
- [ ] Contracts, ADRs, and knowledge files have homes and index links.
- [ ] Where the effort produced rules that outlive it, `summary.md` names the guide at `docs/knowledge/guides/`, and the guide cites the summary instead of restating state.
- [ ] `rg -l '<slug>'` was run.
- [ ] Every done work item cites evidence; every dropped item carries a `Disposition`; every open item is in the board's index, and the dashboard's `Next` and `Blocked` point at the right rows.
- [ ] Every work item has one file under `items/` and one row in the board's index.
- [ ] This table no longer lists the package; `work-packages/archive/README.md` does.
- [ ] The package is at `work-packages/archive/<slug>/` and frozen.
- [ ] The branch is merged, or the maintainer's answer on an unmerged branch is recorded in `summary.md`'s `Outcome`.
- [ ] The gate is green.
