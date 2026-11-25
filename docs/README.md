# docs/ — index and governance

## Governance

- **Authority**: this directory holds the norm, its supporting policy pages, decision records, and deferred items. It does not hold templates (that is `template/`) or tooling (`scripts/`).
- **What goes here**: a document whose reader is a maintainer of the standard. A document whose reader is a user of a generated repository belongs in `template/`.
- **What does not go here**: project-specific business documentation, language tutorials, copies of values owned by `template/` or `scripts/`.
- **Structure**: each topic gets its own file. A new subdirectory gets its own README before it gets a second file. The top-level index lists direct children — docs pages and subdirectories — in one row each, and does not repeat a subdirectory's file list.
- **Naming**: follows `conventions.md`; this page does not restate the naming rules.
- **Change flow**: a normative change lands in `docs/norm/` first; supporting pages follow in the same commit; `template/` follows in the same commit or in the next one with a pointer left behind.

## Index

| File / directory | Content |
| --- | --- |
| [charter.md](charter.md) | Scope, non-goals, hard constraints, success criteria |
| [structure.md](structure.md) | Levels, placement rules, artifact tiers |
| [conventions.md](conventions.md) | Language, naming, citation, five role discriminations, agent-facing instruction form |
| [committing.md](committing.md) | Commit message convention: a base pointer to the norm source plus this repository's deviations |
| [workflow.md](workflow.md) | The source's forge / audit / migrate workflow; the effort lifecycle norm is in `docs/norm/flow.md`, and its target page is `template/effort/docs/workflow.md` |
| [norm/](norm/README.md) | The binding text: foundations, roles, repository README, flow, rules, overlays, committing |
| [decisions/](decisions/README.md) | ADRs — choices and rejected alternatives |
| [backlog/](backlog/README.md) | Deferred items with revisit triggers |
| [knowledge/](knowledge/README.md) | Methods, incidents and explanations that change what a maintainer does next time |
