# Work packages

One directory per effort that needs a ledger: `work-packages/<slug>/`, holding four ledger files by closeout, one file per work item under `items/`, and the evidence directories it creates. A change that ends in one commit takes no package. What outlives the effort moves to `docs/`; the package itself moves to `work-packages/archive/<slug>/` at closeout and stays there as a frozen record.

## Rules

- Slug: `kebab-case`, describes the outcome (`add-retry-budget`, not `ticket-42`).
- Four ledger files: `spec.md` (what), `plan.md` (how), `board.md` (current state and the work-item index), `summary.md` (result, written at closeout). Create them from `template/effort/work-packages/`: copy `spec.md`, `plan.md`, and `board.md` into a new package; copy `items/W01.md` to `items/<ID>.md` when the first work item starts; copy `summary.md` only at closeout. `items/README.md` is the template's note, not a package file. The template's `README.md` is this page, not a package file.
- Evidence the effort produces lives in a named directory beside the ledger — a report, an inventory, or a reproduction script. It stays in git, `summary.md` names it, and closeout archives it with the package. Never create an empty evidence directory.
- The board opens with its eight-field `## Current state` block; see `docs/norm/flow.md` for its fields and the same-commit update rule. It is a snapshot, not a log.
- Work items are one file each under `items/<ID>.md`, one row each in the board's index. Each file carries dependencies, a description in the form its content needs, done-when criteria, and evidence; status lives in the board, never in the file. `done` requires evidence, and the evidence field cites artifacts and what each proves rather than restating them; a `dropped` item carries a `Disposition` naming where the work went. `plan.md` carries the phase breakdown.
- IDs are identifiers, not a sequence: `plan.md`'s row order is the order, and a phase may hold numbers issued later. A late discovery unrelated to an open item takes the next free `W<n>` and joins the phase where it was found; one that decomposes an open item takes the next letter under it, and the parent becomes a container that closes only when its children do and is never `Next` while one is open.
- `spec.md` carries a `track:` field. See `docs/workflow.md`.
- A work package that changes its goal is a new work package.
- On closeout: confirm no item is open and settle the branch state, relocate durable outputs (contracts, ADRs, topic guides at `docs/knowledge/guides/`, cases at `docs/knowledge/cases/`) and index them before writing `summary.md`, close `board.md`, move the package to `work-packages/archive/<slug>/`, and move the row to the archive index.
- Topic guides (one method or scenario per page) and cases carry no package state and never link `summary.md`: an archived package binds nothing, is never cited for authority, and may later be retired (`docs/norm/flow.md`, "Closeout — six steps, in order"). `summary.md` names durable pages by repo-root path in backticks; the package gains no fifth file.

## Open

| Slug | Goal | Track |
| --- | --- | --- |

## Archived

Closed packages move to `work-packages/archive/<slug>/`; `work-packages/archive/README.md` is their index. The table above lists open packages only, so a package's state is its location rather than a column.

## Closeout checklist

The six closeout steps are in `docs/norm/flow.md`; this checklist verifies them.

- [ ] Every work item has one file under `items/` and one row in `board.md`, every item is `done` (citing evidence) or `dropped` (carrying a `Disposition`), and `board.md` has `Status: closed`, `Next: none`, `Blocked: none`, and `Open decisions: none`.
- [ ] The branch is merged, or the maintainer's answer on an unmerged branch is recorded in `summary.md`'s `Outcome` (and in `Residuals` when left unmerged).
- [ ] Contracts, ADRs, guides, and cases have homes and directory `README.md` links; no optional role was created without its trigger.
- [ ] Where the effort produced transferable rules or incident evidence, topic guides at `docs/knowledge/guides/` and cases at `docs/knowledge/cases/` carry no package state, never link `summary.md`, and are named in `summary.md`.
- [ ] `summary.md` exists, is inside budget, recomputes closeout counts, opens with `Date:`, `Acceptance:`, `Gate:`, and `Criteria:`, and has `Outcome`, `Residuals`, `Compromises`, `Verification`, and `Evidence:`; every residual has a destination, and `Compromises` holds only the three permitted types.
- [ ] `summary.md` names every evidence directory; none is empty.
- [ ] This table no longer lists the package; `work-packages/archive/README.md` does, and the package is at `work-packages/archive/<slug>/` and frozen.
- [ ] A backlog item this effort answered is marked `closed` in `docs/backlog/README.md`.
- [ ] When the repository has a status page, it no longer names this effort as next, and its date, the fact the close moved, the next action, and the `summary.md` link are current.
- [ ] Any retired or moved path still cited by a record is registered in `docs/adapters.md` with no file at the old path, and `rg -l '<slug>'` was run with every survivor explained.
- [ ] The gate is green.
