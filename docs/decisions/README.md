# Decisions

Each choice with rejected alternatives gets its own file. An ADR is never deleted; when a decision is replaced, the old file is marked `Superseded` and links to its replacement.

## Index

| ADR | Decision | Status |
| --- | --- | --- |
| [ADR-0001](ADR-0001-spec-repo-and-thin-skill.md) | The specification lives in a standalone repository; the skill is a thin entry point | Accepted |
| [ADR-0002](ADR-0002-manual-skill-invocation.md) | The skill is manually invoked, not description-triggered | Accepted |
| [ADR-0003](ADR-0003-volume-budget-unit.md) | Volume budgets measure non-whitespace characters, not lines or words | Accepted |
| [ADR-0004](ADR-0004-numbered-file-prefixes.md) | Numbered files use four digits; citable records carry a type prefix | Superseded in part by ADR-0019 |
| [ADR-0005](ADR-0005-directory-inventories.md) | Directory inventories belong to directory READMEs, not to `structure.md` | Accepted |
| [ADR-0006](ADR-0006-status-page-home.md) | Status lives at the docs top level, not inside the operations directory | Accepted |
| [ADR-0007](ADR-0007-vocabulary-home.md) | The vocabulary home is `GLOSSARY.md`; `CONTEXT.md` is a legacy alias | Accepted |
| [ADR-0008](ADR-0008-vocabulary-format.md) | The vocabulary body follows the domain-modeling glossary format; the map lists contexts and relationships | Accepted |
| [ADR-0009](ADR-0009-work-package-ledger.md) | The work package is a work item ledger; the plan carries the phase breakdown | Superseded in part by ADR-0033 |
| [ADR-0010](ADR-0010-suite-tracks-are-adapters.md) | Suite tracks are permanent adapters; legacy paths are the retirable kind | Accepted |
| [ADR-0011](ADR-0011-tombstone-role.md) | A tombstone is a role at the old path; the gate enforces its shape | Accepted |
| [ADR-0012](ADR-0012-markdown-tables-are-not-aligned.md) | Markdown tables are not column-aligned; a compact-table formatter owns the shape | Superseded in part by ADR-0035 |
| [ADR-0013](ADR-0013-two-tier-volume-budgets.md) | Volume budgets carry a soft judgment line and a hard failure line | Accepted |
| [ADR-0014](ADR-0014-backlog-carries-no-priority.md) | The backlog carries no priority field | Accepted |
| [ADR-0015](ADR-0015-migrated-adr-series-zero-padded.md) | A migrated ADR series is zero-padded to four digits; a migrated backlog series keeps its width | Superseded in part by ADR-0031 |
| [ADR-0016](ADR-0016-norm-source-pointer.md) | General norms are consumed by pointer, not copy | Accepted |
| [ADR-0017](ADR-0017-closed-work-packages-archive.md) | Closed work packages move to `tasks/archive/`; the open table lists only open packages | Superseded in part by ADR-0020 |
| [ADR-0018](ADR-0018-repository-standard-rename.md) | The repository and its artifact are named the repository standard | Accepted |
| [ADR-0019](ADR-0019-norm-pages-use-names.md) | Norm pages are named by subject; the binding text lives at `docs/norm/` | Accepted |
| [ADR-0020](ADR-0020-work-package-home-is-work-packages.md) | The work-package home is `work-packages/`; `tasks/` is left to a suite track | Accepted |
| [ADR-0021](ADR-0021-package-evidence.md) | A work package carries the evidence it owns | Accepted |
| [ADR-0022](ADR-0022-architecture-role.md) | Architecture is a role, not a contract or a structure section | Accepted |
| [ADR-0023](ADR-0023-role-table-boundaries.md) | The role table describes a generated repository; a directory index lists direct children | Accepted |
| [ADR-0024](ADR-0024-checker-runtime-and-tests.md) | The document checker is TypeScript, split by responsibility, and tested | Accepted |
| [ADR-0025](ADR-0025-ci-omits-prose.md) | CI runs every gate stage but the prose one, and names the omission | Accepted |
| [ADR-0026](ADR-0026-per-suite-map-role.md) | The per-suite map is a role, not the adapter registry | Accepted |
| [ADR-0027](ADR-0027-retire-governance-role.md) | Governance is not a role; the norm and the red lines carry it | Accepted |
| [ADR-0028](ADR-0028-a-moved-path-is-a-row.md) | A moved path is one registry row; no file is left at the old path | Accepted |
| [ADR-0029](ADR-0029-work-item-files.md) | A work item is a file under `items/`; `board.md` carries the snapshot and its index | Superseded in part by ADR-0033 |
| [ADR-0030](ADR-0030-board-is-a-handoff-card.md) | The board's `Current state` is an eight-field handoff card; the index is the only list | Accepted; summary section names superseded in part by ADR-0036 |
| [ADR-0031](ADR-0031-backlog-series-is-four-digits.md) | Every backlog series is four digits; a migrated one is padded at migration and never renumbered | Accepted |
| [ADR-0032](ADR-0032-role-page-pointer.md) | A role page links the norm it relies on; only a general-norm page is a base pointer | Accepted |
| [ADR-0033](ADR-0033-item-description-form.md) | An item description takes the form its content needs and stays one screen | Accepted |
| [ADR-0034](ADR-0034-evidence-one-entry-per-artifact.md) | Evidence gives each artifact one entry and names what it proves | Accepted |
| [ADR-0035](ADR-0035-python-overlay-r12-stage.md) | The Python overlay ships R12's table stage | Accepted |
| [ADR-0036](ADR-0036-closeout-summary-answers-reader-questions.md) | The closeout summary answers the reader's questions | Accepted |
| [ADR-0037](ADR-0037-closeout-judgement-is-a-guide.md) | The closeout's judgement is a knowledge guide, not a fifth ledger file | Accepted |
| [ADR-0038](ADR-0038-code-principles-are-a-norm-chapter.md) | Code principles are a norm page and a pattern chapter, not knowledge pages or a role | Superseded in part by ADR-0039 |
| [ADR-0039](ADR-0039-principles-page-is-its-own-delivery.md) | The principles page is delivered by the prompt, not by a quoting skill | Accepted |

## Format

`ADR-<nnnn>-slug.md`, with `Status`, `Context`, `Decision`, `Options considered`, `Consequences`. Options must include at least one rejected alternative and the reason it lost; an ADR without a rejected alternative is a note, not a decision.
