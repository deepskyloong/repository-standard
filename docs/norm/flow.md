# Flow: levels, work packages, closeout

## Three levels

A file lives at the lowest level that owns its fact. Shared facts climb; a fact used by one module never climbs.

| Level | Owns | Entry files | Never owns |
| --- | --- | --- | --- |
| Root | Scope, cross-member rules, the gate, the work-package queue, shared vocabulary | `README.md`, `AGENTS.md`, `GLOSSARY.md` (when shared terms exist) | A rule that only one member needs |
| Member | Its own charter-level facts, its own contracts, its own vocabulary, its own toolchain deviations | `README.md`; `AGENTS.md` only when it differs from the root's | A rule that only one module needs |
| Module | Its own boundary rule, its own README when the module is a real abstraction | `README.md` (optional); `AGENTS.md` only after the deferred threshold is met | Anything two modules share |

`GLOSSARY-MAP.md` exists only when there are member-level vocabularies. It lists the member contexts, their paths, and their relationships; it stores no definitions. A term defined in two places is a bug, even when the two definitions agree.

## Information flow

```text
idea
  └─ docs/backlog/B-<nnnn>-<slug>.md        (deferred, with a revisit trigger)
       └─ work-packages/<slug>/spec.md    (what this effort will do; track field)
            ├─ plan.md                    (how, with risks and stop conditions)
            ├─ board.md                   (current state, and the index of work items)
            ├─ items/<ID>.md              (one work item: description, done-when, evidence)
            └─ summary.md                 (acceptance, then outcome, residuals, compromises and verification; 4 sections)
                 ├─ docs/contracts/<topic>.md   (a fact consumers may rely on)
                 ├─ docs/decisions/ADR-<nnnn>-*.md   (a choice with rejected alternatives)
                 ├─ docs/knowledge/guides|cases|notes
                 └─ (nothing)                 (most efforts end here)
```

The four ledger files and `items/` may sit beside evidence directories the effort produces; `summary.md` names each directory and what it answers, and closeout archives them with the package.

Most work packages produce only `summary.md` and disappear. That is the normal case, not a failure. A standard that forces every effort to yield an ADR produces ADRs nobody reads.

## t0 — creating a work package

A package carries state that a single commit cannot: a phase boundary, an open decision, a blocked item, a hand-off, or work that spans more than one working session. Open one when at least one of those exists. A change that ends in one commit takes no package: edit, run the gate, commit, and write the ADR when the change is a decision.

Create `work-packages/<slug>/` by copying `spec.md`, `plan.md`, and `board.md` from `template/effort/work-packages/`; copy `items/W01.md` to `items/<ID>.md` when the first work item starts, and `summary.md` only at closeout. The template's `README.md` is the work-package index, not a package file. Create an evidence directory only when the first item exists; never an empty one.

Four fields before any work starts:

1. **Goal**: one sentence, testable.
2. **Non-goal**: at least one thing this effort will not do. A work package without a non-goal expands until it stalls.
3. **Acceptance**: how a reader will know it is done — one or more observable criteria, each a command, a file, or a state.
4. **`track:`**: which workflow suite this effort runs on, as a field in `spec.md`. Values are free-form (`default`, `spec-flow`, `superpowers`, `none`), but the field is mandatory. `track:` never moves the package out of `work-packages/<slug>/`; a suite writes its own root only when registered in `docs/adapters.md`.

Initialize `board.md` with an eight-field `## Current state`: updated date, status (`open` / `closed`), phase, last gate with date and per-repository pointer, next action, last completed item, blocked items, and open decisions. A `## Repositories` table follows it with each repository's branch, gate command, and last result; the work-item index follows. `Next` names a `doing` or `todo` item, the closeout action, or `none`; `Last done` names one done item, one clause, and its commit(s); `Blocked` names every blocked item with its reason. An open decision is one question and its owner; a settled decision belongs in the ADR or the item's evidence, not in the block. The `Current state` block is a snapshot, not a log, and lives inside `board.md`: it is not a fifth ledger file. Rewrite it in the same commit as any change to a work item, a decision, a branch, or the gate. A stale block is a defect.

If this effort answers a backlog item, set that row's `Status` to `active` in `docs/backlog/README.md` before work starts.

## Work items

Each item has a stable `W<n>` ID, one file at `items/<ID>.md`, its dependencies, a description, observable done-when criteria, and evidence. `done` requires evidence — a commit, a command, a file, or a decision; without one it stays open. Describe it in the form the content needs — prose, list, table, or small diagram — one screen: what the item is and must hold, not the story. Done-when criteria are item-specific bullets, each a separate check: a clause true of every item — the gate, the evidence requirement — is a standing condition, not a criterion. One item is one reviewable commit or one outcome; a heading per concern splits it.

`Evidence` gives each artifact one entry, naming what it proves: bullets when several, a table when one carries several facts, one sentence when one. Detail stays in the artifact: cite a report, a map or a measurement by path and one clause, not by recital. The item file is working state with no volume budget; the board carries no item prose: neither grows a narrative the other duplicates.

`plan.md` groups the work items into phases, names the IDs in each phase, and states each phase's exit condition; it does not restate the item detail. `board.md` carries the current state and the index: one row per item, its status (`todo`, `doing`, `blocked`, `done`, or `dropped`), and a link to `items/<ID>.md`, grouped under the plan's phase headings. It is the only place a status lives; an item file never states one. A dropped item keeps its file and a `Disposition` naming where the work went — a backlog item, a successor, or `dropped, no successor`.

IDs are identifiers, not a sequence: `plan.md`'s row order and the board's index carry the order, and a phase may hold numbers issued later. A discovery unrelated to an open item takes the next free `W<n>` and joins the phase in which it was found. A discovery that decomposes an open item's outcome takes the next letter under it — `W07g` under `W07` — and the parent becomes a container: the work it still carried moves into its children, it carries none of its own, stays `doing` until the last child closes, and its done-when names the child set; it is never `Next` while a child is open. A closed item is not reopened; a later discovery gets a new ID.

## Runtime — the three permitted compromises

An effort may deviate from its plan in exactly three ways, each recorded in `summary.md`:

| Compromise | Allowed when | Record |
| --- | --- | --- |
| Scope reduction | The acceptance criterion is still met | Which goal was dropped and where it moved (backlog or nothing) |
| Track switch | The chosen suite cannot express the work | Old track, new track, why |
| Artifact deferral | A contract or ADR is not yet knowable | The trigger that will produce it |

All three are recorded under `## Compromises` in `summary.md`; a summary without that section is incomplete. A known limitation or a new finding is not a compromise; it goes under `## Residuals` with a destination or trigger. Anything else — a changed goal, a changed acceptance criterion — is a new work package, not a compromise.

## Closeout — six steps, in order

1. **Confirm closure and the branch state.** Every work item in `board.md` must be `done` (with evidence) or `dropped` (with a `Disposition`); if any item is `todo`, `doing`, or `blocked`, stop — unmet acceptance is `Acceptance: not met`, not an open item. Check the branch in `board.md`'s `Repositories` table: if it is not merged into the trunk, ask the maintainer before freezing — land it now, leave it for review, or drop it. Closeout never merges on its own; an unmerged branch left behind is both a `Branch:` state in `Outcome` and a residual with a destination.
2. **Relocate what outlives the effort and index it.** A fact consumers rely on → `docs/contracts/`. A choice with rejected alternatives → `docs/decisions/`. A method that changes future behavior → `docs/knowledge/guides/<topic>.md` (zero or more pages, one method or topic per page; update an existing guide when one already owns the topic). An incident whose evidence chain is worth citing → `docs/knowledge/cases/<topic>.md` (evidence only, never rules). Create `docs/knowledge/` and its subtree `README.md`s on first trigger, and add each new page to its directory `README.md` (plus the parent index row on first admission).
3. **Write `summary.md` and close `board.md`.** Review and update any draft `summary.md` against `spec.md` and `board.md` rather than overwriting blind. It opens with `Date: YYYY-MM-DD`, `Acceptance: met / not met — <one sentence>`, one `Gate:` line per repository (`<command> — <date>, <result>`), and a `Criteria:` block with one line per `spec.md` acceptance clause (`<clause> — <command, path, or state>`), then four sections — `Outcome` (target, standard, program, and `Branch:`), `Residuals` (each with a kind and a destination or trigger), `Compromises` (only the three permitted types; `None.` when none), and `Verification` (the closeout pointer snapshot and reproduction commands) — plus the `Evidence:` footer. Recompute every count at closeout rather than inheriting numbers from earlier items or audits; do not restate the diff or paste guide rules back into the summary. Set `board.md` to `Status: closed`, `Next: none`, `Blocked: none`, and `Open decisions: none`.
4. **Freeze the package.** Move `work-packages/<slug>/` to `work-packages/archive/<slug>/` as a unit, taking the four ledger files, `items/`, and the evidence directories `summary.md` names; a runtime artifact a successor package now owns stays with the successor. A frozen package is read-only.
5. **Update the package and backlog indexes.** Remove the row from `work-packages/README.md` and add it to `work-packages/archive/README.md`, linking `summary.md`. If the effort answers a backlog item, write its outcome and set that row's `Status` to `closed` in `docs/backlog/README.md`. An index that still calls a closed item `open` is worse than no index.
6. **Register moved paths and verify pointers.** Any retired directory or moved file that a record still cites gets a row in `docs/adapters.md` (old path, successor, citing records, retirement condition), leaving no file at the old path (ADR-0028). Run `rg -l '<slug>'` so `Verification` explains every survivor, and run the gate.

Most packages produce no guide or case: durable knowledge exists when a rule or incident outlives the effort, not because the package closed. A guide carries the rules that change the next effort, each with the observation that settled it (or a Markdown link to the durable `case` or `ADR`); state, counts, acceptance, and residuals stay in `summary.md`. Because an archived work package may later be retired and deleted, cross-lifecycle references stay unlinked: a guide never links `summary.md` or depends on it staying on disk — any provenance note names the package, branch, or commit in past-tense backticked text — and `summary.md` names durable `docs/` pages by repo-root path in backticks, while live directory `README.md`s carry the live links (ADR-0040).

A guide needs only this skeleton. Its opening names the method and when to use it; each rule carries its observation inline or through a durable link. Add sections only as the content requires: headings and body structure follow the method, prose, steps, examples, tables, and code are all admissible, and neither a metadata block nor a fixed `Evidence` section is mandatory.

```markdown
# <Topic>

<The method this page settles and when a maintainer should use it.>

## <Content-owned heading>

<Rule, procedure, or explanation, with the observation that settled it or a link to the durable case or ADR.>
```

## Who decides and how a change is reviewed

The owner decides a package's scope and non-goals, and any change to a role's home. An agent may write prose, templates, and the gate within the rules this standard states; the red lines it must respect every turn live in `AGENTS.md`. Removing or moving a role needs an ADR with the rejected alternatives; a budget change needs the old value, the new value, and one measured sample.

A review is adversarial by default: the reviewer tries to break the structure rather than praise it, and the output format is fixed — `[blocker|major|minor|nit] section — problem / why / minimal fix`. A finding without a section reference cannot be adjudicated. Every finding is accepted, accepted with a different fix and the reason recorded, or deferred to the backlog with a revisit trigger; a deferred finding does not disappear.

## Acceptance checklist

Run before declaring a work package closed:

- [ ] Every work item has one file under `items/` and one row in `board.md`, every item is `done` (citing evidence) or `dropped` (with a `Disposition`), and `board.md` has `Status: closed`, `Next: none`, `Blocked: none`, and `Open decisions: none`.
- [ ] The branch is merged, or the maintainer's answer on an unmerged branch is recorded in `summary.md`'s `Outcome` (and in `Residuals` when left unmerged).
- [ ] Every contract, ADR, guide, or case produced by the effort has a home and a link from its directory `README.md`, and no optional role was created without its trigger.
- [ ] Where the effort produced transferable rules or incident evidence, topic guides at `docs/knowledge/guides/` and cases at `docs/knowledge/cases/` carry no package state, never link `summary.md`, and are named in `summary.md`.
- [ ] `summary.md` exists, is inside budget, recomputes closeout counts, opens with `Date:`, `Acceptance:`, `Gate:`, and `Criteria:`, and has `Outcome`, `Residuals`, `Compromises`, `Verification`, and `Evidence:`; every residual has a destination, and `Compromises` holds only the three permitted types.
- [ ] `summary.md` names every evidence directory, and no evidence directory is empty.
- [ ] The package is at `work-packages/archive/<slug>/` and read-only, and its row moved from `work-packages/README.md` to `work-packages/archive/README.md`.
- [ ] A backlog item this effort answered is marked `closed` in `docs/backlog/README.md`.
- [ ] Any retired or moved path still cited by a record has a row in `docs/adapters.md` with no file at the old path, and `rg -l '<slug>'` was run with every survivor explained.
- [ ] The gate is green.

## Adapter closeout

A third-party suite that writes into the repository is not migrated; it is registered. `docs/adapters.md` carries one row per suite track: its roots, what reads it, the compatibility whitelist, and the disposition — the track is permanent, and no closeout step relocates it. The suite keeps writing where it writes; the standard stops pretending that path is its own.

The artifact shape a suite writes at those roots, and every repository rule layered on the suite's default, live in `docs/suite-tracks.md`; the registry carries the tolerance and the disposition, the map carries the shape. Splitting them keeps a tolerant row from becoming a directory layer.

A suite's closed packages stay in the track. A repository does not fold them into `work-packages/<slug>/`: the suite loads its path by name, so a move changes nothing on disk and leaves two layouts behind.

A legacy path that survives migration follows the other row kind: it appears in `docs/adapters.md`, and it is removed only when its last consumer is gone. Forcing a foreign tool to accept a new path costs more than one line in a registry.
