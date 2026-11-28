# Roles

One row per role. `Home` is the single authoritative live path; an archived path is the role's frozen state, and a legacy or moved path is a row in `docs/adapters.md` — never a second live home, and never a forwarding file at the old path. `Admission` says what may be filed there. `Exit` says what happens when it stops being true. `Authority` says how far its statements bind; a dash binds nothing.

The table describes a repository that adopts the standard. Pages that exist only to produce the standard — `docs/norm/`, `template/`, `scripts/`, and this repository's forge / audit / migrate workflow — are not roles of a generated repository; `docs/structure.md` governs them. In this repository, `docs/workflow.md` is that source page; a generated repository's `docs/workflow.md` is the effort lifecycle.

When two roles disagree, precedence is **charter > `AGENTS.md` > page-level role**. A lower level may add detail; it may not override a refusal. A routing row in `AGENTS.md` cannot authorize work the charter excludes. A general norm consumed by pointer sits outside this local chain: the source outranks a local restatement. In this repository, `docs/norm/` is the source; a red line in `AGENTS.md` is a pointer summary of its home rule, and the norm wins on drift.

## Always present

| Role | Home | Admission | Exit | Authority |
| --- | --- | --- | --- | --- |
| Storefront README | `/README.md` | Its reader contract is [repository-readme](repository-readme.md); a storefront for the repository, not an index of it | Rewritten when the install path changes | — |
| Instruction layer | `/AGENTS.md` | Red lines, exact commands, the gate, the routing table, the anti-regrowth clause | Edited when a rule's strength changes | Binds every turn of every agent and person |
| Directory index | `<dir>/README.md`, unless another row names it | Direct children membership, subtree placement, and directory-local rules that have no page role: one row per child, no totals | Deleted with the directory | Binds membership, directory-local rules, and where a child may be placed |
| Charter | `/docs/charter.md` | Scope, non-goals, hard constraints, success criteria | A non-goal is removed only by an ADR | Binds scope; a request outside it is refused |
| Structure | `/docs/structure.md` | Levels (root / member / module), placement rules, artifact tiers; membership lives in each directory README | Updated when a level or placement rule changes, not when a file is added | Binds what "where does this go" means |
| Conventions | `/docs/conventions.md` | Language, naming, citation, the five discriminations, and the form of agent-facing instructions; a target page points at the norm source and records deviations | Updated when a convention changes | Binds how a document is written |
| Committing | `/docs/committing.md` | A base pointer to `docs/norm/committing.md` plus this repository's deviations | Rewritten when the convention changes; never deleted | Binds how a commit message is written; a project may add types and scopes, never weaken the header, the why-body, or one logical change |

## Present from the first real use

| Role | Home | Admission | Exit | Authority |
| --- | --- | --- | --- | --- |
| Decision record (ADR) | `/docs/decisions/ADR-<nnnn>-slug.md` | A choice with rejected alternatives that a future maintainer would otherwise relitigate | Marked `Superseded` and linked; never deleted | Binds the choice until superseded |
| Backlog item | `/docs/backlog/B-<nnnn>-slug.md` | A deferred idea with a revisit trigger and evidence | Closed with a one-line outcome; the file and its index row stay, and the row's status becomes `closed` | Binds nothing; it is a queue |
| Backlog index | `/docs/backlog/README.md` | The queue's rules (numbering, trigger, status, closing) and one row per item, including closed; `Status` is `open` (trigger not fired), `active` (a work package is on it), `paused` (work started and stopped, resumption undecided), or `closed` (delivered, withdrawn, or superseded) | — | Binds the queue's order and state |
| Operating modes | `/docs/workflow.md` | The effort lifecycle: tracks, t0 fields, permitted compromises, and the closeout procedure; the closeout checklist lives in the work package index | Rewritten when a step changes | Binds the effort lifecycle's steps |
| Work package index | `/work-packages/README.md` | Work package governance, the open table, the closeout checklist | — | Binds the effort's closure and the open table |
| Work package | `/work-packages/<slug>/` while open; `/work-packages/archive/<slug>/` after closeout | An effort that needs a ledger: what, how, a board of work items with acceptance and evidence, result | Frozen at closeout: moved, as a unit, to `/work-packages/archive/<slug>/`; read-only, never extended | Binds the effort while it is open; no new obligations after closeout, and its evidence remains citable |
| Vocabulary | `/GLOSSARY.md` | A term whose meaning would drift without a fixed definition, with avoided synonyms | A term moves to a member when only it uses it | Binds naming in prose and code |
| Vocabulary map | `/GLOSSARY-MAP.md` | Member contexts, their paths, and their relationships; stores no definitions | — | Binds where terms are defined and how contexts relate |

`GLOSSARY.md` is a glossary, not a norm page. Each entry is a bold term, a one- or two-sentence definition of what the term is, and an `_Avoid_` line naming the synonyms it replaces; group entries under a subheading when a natural cluster emerges. A budget, a procedure, or an implementation rule stays in the page that owns it and is linked, not restated.

### Decision record (ADR)

Reversibility is not an admission requirement. A readily reversed choice still earns an ADR when it has rejected alternatives and would otherwise be relitigated; the record prevents that repeated discussion. The cost of reversal may support the admission judgment, but is not required.

The title is the decision stated as a sentence a reader can disagree with. The file opens with a list of `Label: value` fields:

- `Status` — the state and the date it took effect: `Accepted (YYYY-MM-DD)`; once superseded, `Superseded by ADR-<nnnn> (YYYY-MM-DD)` or `Superseded in part by ADR-<nnnn> (YYYY-MM-DD)` followed by the part that still holds, with the superseding record as a Markdown link.
- `Scope` — what the decision binds and what it leaves alone.
- `Related` — links to the durable pages and records the decision touches; omitted when there are none.

A record outlives what it cites: `Related` and `Context` link durable pages and records, and name an effort, a branch, a commit, or a path that may move in backticks, never as a link (ADR-0040). The sections then answer one question each, in this order:

- `## Context` — the situation and the forces that made a choice necessary, never the argument for one side.
- `## Decision` — the rules chosen, in sentences a later maintainer can follow.
- `## Reasoning` — why the chosen rules answer those forces, one point per force and nothing else; a losing option's reason is written once, in the table.
- `## Consequences` — what becomes easier, what becomes harder or impossible, and how each cost is mitigated or watched; no argument.
- `## When to reopen` — the observable conditions under which the decision would be wrong; they are what makes the row's `Exit` apply, and a reader who finds that one holds writes the superseding ADR instead of editing the body.
- `## Rejected alternatives` — a table with one row per losing option and the reason it lost; the chosen option is not a row, and a record without a rejected alternative is a note, not a decision.

Superseding changes the `Status` line and the index row and nothing else. A record keeps the shape it was written with: a format change binds the records written after it.

## Optional, admitted by trigger

| Role | Home | Admission | Exit | Authority | Trigger |
| --- | --- | --- | --- | --- | --- |
| Durable contract | `/docs/contracts/<topic>.md` | A fact a consumer may rely on across efforts: API shape, data schema, CLI surface, compatibility promise | Deleted when the artifact it constrains is deleted | Binds its consumers; a break needs a migration step | A second effort depends on the same fact |
| Architecture | `/docs/architecture/<topic>.md` | How the system is organized and what a change must respect: components and their boundaries, data and control flow, failure responses, invariants; an interface promise belongs to contracts and a choice's reason to an ADR | Deleted when the system it describes is gone | Binds a change's shape; a contradiction updates the page or records why not | The first change that must respect a boundary it does not own |
| Operations page | `/docs/operations/<topic>.md` | A procedure someone must follow under pressure: deploy, rollback, restore, rotate | Deleted when the procedure disappears | Binds the operator; a step that cannot be followed is a bug | The first procedure that cannot be remembered |
| Status | `/docs/status.md` | Current phase, what works, what does not work, next action; aggregated across open fronts, linking to packages | Rewritten in place; a close replaces the line it moved, never appending beside it | — | The project has more than one open front |
| Toolchain traps | `/docs/toolchain/<language>.md` | Reproducible failure modes and their fix, each with the command that shows it | Deleted when the trap stops reproducing | Binds the trap's treatment; a fix that ignores the reproduction command is a bug | The second environment-specific trap |
| Knowledge guide | `/docs/knowledge/guides/<topic>.md` | A method that changes what a maintainer does next time | Deleted when it stops being true | — | The same mistake is about to be made twice |
| Knowledge case | `/docs/knowledge/cases/<topic>.md` | One incident, with the evidence that settled it | Deleted when the evidence is no longer citable | Binds the evidence it records; a later decision may cite it, not restate it | An incident worth citing in a review |
| Knowledge note | `/docs/knowledge/notes/<topic>.md` | A short observation that does not yet justify a guide | Promoted or deleted | — | A thought worth keeping but not yet proven |
| Knowledge explainer | `/docs/knowledge/explainers/<topic>.md` | A subsystem explained from zero, in the order it runs, for a reader who does not yet have its vocabulary | Deleted when a guide, a contract, or an architecture page covers the same ground | Binds no rule; each section ends at the page that owns the fact | A new maintainer must reach operability without reading the architecture page |
| Suite tracks | `/docs/suite-tracks.md` | Each installed workflow suite's owned roots and the artifact shape it writes at them, including the repository rules layered on the suite's defaults; the suite's own layout and content form are recorded, never changed | Entry removed when the suite is uninstalled | Binds which root a suite writes and what shape its artifacts take; a repository rule layered on a suite default is recorded here | A third-party suite writes into a repository path the repository does not own |
| Adapter registry | `/docs/adapters.md` | Foreign suites' owned track roots (permanent), legacy paths that cannot move yet (retirable), moved paths with their successor, the whitelist, and the disposition | A row is removed when the suite is uninstalled, the legacy path retires, or the last record citing a moved path is deleted | Binds where a path may be written, and where a moved path's contents live | A third-party suite writes into the repository, a frozen record blocks a path move, or a path a record cites has moved |
| Module rules | `<member>/src/<module>/AGENTS.md` | Rules that differ from the member's and would be wrong at member level | Deleted when the module stops being a boundary | Binds the module | Deferred: see the threshold note below |
| Member README | `<member>/README.md` | What the member is for, its direct children, how to run its tests, where its own docs start | Deleted when the member is removed | — | The repository has more than one member |

A trigger is an admission condition, not a rule; it carries no `strong` / `weak` label. Countable triggers (`a second effort`, `the second trap`, `more than one open front`) are observable; judgment triggers (`the first change that must respect a boundary`, `an incident worth citing`) are review decisions, not gate conditions.

An explainer is narrative, not a rule: it walks a subsystem in the order it runs and says a term once, pointing at `GLOSSARY.md` for the definition. Every `##` section ends at the page that owns the fact it used — the first section, which says why the page exists, is exempt — so the reader can stop reading the explainer at any point and still be on owned ground. A page that would mostly link instead of explain is an index, not an explainer.

### Status page

Whether a repository needs the page at all is a second test. A repository on one front reads its state from that package's `board.md`; a stable repository reads it from the backlog and `git log`; the page serves a repository still being shaped, where several fronts move at different speeds, the next action is not settled by an existing plan, and a reader must recover the whole state without shared memory. The general rule — a trigger is a floor, and an absent optional role is correct — is `foundations.md` "When a role is admitted".

Status is the snapshot a reader finishes in one pass. Three line kinds are admitted: a present fact (a number that can drift carries its date or the command that produces it — `rules.md` R10), an open front with its next action, or a pointer to the page that owns the detail.

Everything else is refused: a finished effort's narrative, a closed milestone's verdict and counts, and a decision's reasoning belong to the package, the plan and the ADR. Status states the conclusion and links the record; a second copy outlives a rewrite and then contradicts it.

A close edits four slots — the page's date, the fact it moved, the next action, the closeout link — and leaves the rest as it was. A sentence appended beside the old one is how a snapshot becomes a log.

Headings follow `rules.md` "Naming and citation": a living page changes shape while frozen records cite it, and a renumbered page carries one line mapping the old numbers to the new titles.

## Five discriminations

These separate roles that five source repositories kept merging. They are normative here; a target repository's `docs/conventions.md` carries a base pointer to the norm source instead of a paraphrase.

1. **Four documents, four jobs.** `AGENTS.md` is instruction (what must hold now); `GLOSSARY.md` is vocabulary (what a word means and which synonyms are avoided); an ADR is a decision (which options existed and why the others lost); `architecture` is the system's organization (what the components are, how they connect, and what a change must respect). Test: a choice with rejected alternatives is an ADR; a fact a consumer may rely on is a contract; an explanation of internal organization is architecture.
2. **`spec` has two senses.** `work-packages/<slug>/spec.md` is the work package's specification: temporary, ends with the effort. `docs/contracts/<topic>.md` is the durable contract: survives the effort. Never let one word carry both; when a sentence says "the spec", it must be obvious which one. The binding text is not a third sense: it lives under `docs/norm/`.
3. **README serves users, the charter serves maintainers.** README answers "how do I use this"; the charter answers "why does this exist and what will it refuse to do".
4. **Budgets state a unit.** Volume is non-whitespace characters; entries are table rows. They measure different things and are not interchangeable.
5. **Shared terms have a home.** A term shared across the repository lives in the root `GLOSSARY.md`; a term used by one member lives in that member's `GLOSSARY.md`; `GLOSSARY-MAP.md` lists contexts, their paths, and their relationships; it stores no definitions.

## Role boundaries

Two roles can seem to admit the same sentence. Apply the pair's test, then state the sentence once and link from the other page.

| Pair | Test |
| --- | --- |
| Charter / Architecture | Does violating it change what the project is (charter) or how it works (architecture)? |
| Structure / Architecture | Is it a repository path (structure) or a runtime component and its flow (architecture)? |
| Structure / Directory index | Is it a repository-wide level or placement rule (structure), or the membership and local rules of one subtree (directory index)? |
| Architecture / Instruction layer | Does it constrain a change's shape (architecture) or what must hold every turn (`AGENTS.md`)? |
| Contracts / Architecture | Can a consumer file a bug because it changed (contracts), or is it read to understand the system (architecture)? |
| Charter / Contracts | Is it a measured success criterion (charter) or a guarantee a consumer relies on (contracts)? |
| Charter / Conventions | Is it what the project accepts (charter) or how a document is written (conventions)? |
| Charter / Instruction layer | Does it define what the project accepts or refuses (charter), or what every turn must do (`AGENTS.md`)? |
| Status / Work package | Cross-package snapshot (status) versus one effort's state (work package); status links, the package owns the detail |
| Suite tracks / Adapter registry | Does it record the artifact shape a suite writes at its roots and the rules layered on its defaults (suite tracks), or the roots with their tolerated files and disposition (adapter registry)? |
| Operating modes / Suite tracks | Does the rule bind every effort in the repository, whatever suite runs it (operating modes), or the artifacts one suite writes at its roots (suite tracks)? A suite never owns the lifecycle or the authorization, and it may only narrow its own artifacts below them |
| Architecture, Contracts / Operations | Does it describe a system response or format (architecture, contracts), or steps a person runs (operations)? |
| Explainer / Architecture, Guide, Glossary | Does it walk a newcomer through how the subsystem works (explainer), state what a change must respect (architecture), a method a maintainer applies next time (guide), or what a term means (glossary)? |

When both still admit it, the narrower exit owns it: artifact (contracts), system shape (architecture), scope (charter). The other page links; it does not restate.

## Module-level rules: deferred

Module-level `AGENTS.md` is not admitted at v1. The threshold is measurable: a member has at least six modules, and at least two of them need a rule that would be wrong at member level. The threshold and its sample source are in `docs/backlog/B-0003`; until both hold, module rules live in the member's `AGENTS.md` under a module heading.

## Roles that are deliberately absent

- **Changelog.** `git log` is the changelog; an ADR holds the reasoning. A `CHANGELOG.md` duplicates both and goes stale.
- **Roadmap.** A roadmap is a backlog with dates that will be wrong. Use the backlog's `Revisit when` field.
- **Contributing guide.** The instruction layer, the gate command, and `docs/committing.md` are the contributing guide.
- **Deep directory `README.md` below a member or module.** A member or module README is a role and belongs in that directory. A directory below a member or module gets a line in its parent's README, not its own file.
