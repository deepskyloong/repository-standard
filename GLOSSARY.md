# repository-standard

The vocabulary of the repository standard: the words this repository uses for roles, levels, work packages, rules, and artifacts, so a norm page, a template, or a commit message can name the same thing the same way.

## Language

### Structure and roles

**repository standard**: The artifact this repository defines: the document roles, rules, flow, budgets, and the copyable template a repository follows or copies.

_Avoid_: skeleton (the former name), framework, boilerplate

**role**: One kind of document with one home, one admission rule, one exit rule, and one authority range.

_Avoid_: doc type, category

**home**: The single path where a role lives.

_Avoid_: location, place

**norm**: The binding text of the repository standard, under `docs/norm/`; a consumer points at a norm source and records only deviations.

_Avoid_: spec (for this sense), standard (the whole artifact)

**norm source**: The repository that holds a general norm once; a consumer names it on one line and points at it, recording only deviations.

_Avoid_: template, upstream, gold standard

**layer**: One of the four strata the standard is built from: core, overlay, adapter, optional.

_Avoid_: level (reserved for root/member/module)

**level**: The ownership tier of a file: root, member, module.

_Avoid_: layer

**overlay**: The per-language part of the standard: toolchain, gate, code layout, and writing rules.

_Avoid_: plugin, extension

**adapter**: The registry and compatibility whitelist for third-party suite tracks, legacy paths that cannot move yet, and moved paths with their successor; not a physical directory layer.

_Avoid_: integration layer

**suite track**: A directory a third-party workflow suite owns and loads by name; registered as a permanent adapter, never relocated.

_Avoid_: adapter folder, foreign dir

### Work packages

**track**: The workflow suite an effort runs on, recorded in the work package's spec.

_Avoid_: pipeline, flow

**work package**: One effort's four ledger artifacts under `work-packages/<slug>/` — spec, plan, board, and summary — plus its `items/` files and the package evidence it owns.

_Avoid_: task, ticket

**board (work package)**: `work-packages/<slug>/board.md`: the package's eight-field handoff card and the index of its work items, one row per item linking to `items/<ID>.md`; it is the only place a status lives.

_Avoid_: todo, tracker

**work item**: One reviewable unit of a work package — a stable `W<n>` ID (a letter suffix when it decomposes a parent item), the status its board records, and a file at `items/<ID>.md` carrying dependencies, the description, done-when criteria, and evidence.

_Avoid_: task, ticket, job, step

**parent item**: A work item whose lettered children carry its work; it holds none of its own, stays `doing` until the last child closes, and its done-when names the set.

_Avoid_: epic, umbrella

**package evidence**: A report, inventory, or reproduction script a work package owns and cites; it lives beside the four ledger files, is named in `summary.md`, and archives with the package.

_Avoid_: package artifact, attachment

**closeout**: The end of a work package, when its summary is written and its durable output is relocated.

_Avoid_: wrap-up

### Rules and budgets

**tombstone**: Historical: the forwarding stub a repository left at a moved path before ADR-0028 retired the role; records written before 2026-11-19 name it. A moved path is now a `docs/adapters.md` row, and no file is left behind.

_Avoid_: redirect, alias

**volume budget**: The size limit of a document, measured in the unit that `docs/norm/rules.md` defines.

_Avoid_: length, size

**entry budget**: The count limit of an index or table, measured in the unit that `docs/norm/rules.md` defines.

_Avoid_: line limit

**single-package degeneration**: The form a single-package repository takes: `src/` and `tests/` at the root, with no member level.

_Avoid_: simplified mode

### Code

**principle**: A constraint that applies wherever code is written, stated once at `docs/norm/code.md`; it is `weak` and every entry names an observable symptom.

_Avoid_: best practice, guideline, convention (for this sense)

**pattern**: A solution shape a repository adopts when its condition holds, stated one per page; it is not a constraint that applies everywhere.

_Avoid_: best practice, recipe, template (for this sense)

### Specs and artifacts

**spec (work package)**: `work-packages/<slug>/spec.md`: what one effort will do.

_Avoid_: spec (unqualified)

**spec (contract)**: `docs/contracts/<topic>.md`: what must stay true across efforts.

_Avoid_: spec (unqualified)

**generated artifact**: A file produced by a command and marked so a reader knows not to edit it.

_Avoid_: build output

**legacy path**: A repository path kept during migration because a frozen record still cites it; retirable when the last consumer is gone.

_Avoid_: old dir, moved path
