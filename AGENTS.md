# AGENTS.md — repository-standard maintenance manual

This repository holds the repository standard. It is not a project built with it; it is the standard existing repositories point at, and the template a new one copies.

This file is the per-turn rule layer: red lines, the gate, and the routing table. Everything explanatory lives in `docs/` and is read on demand.

## Hard invariants

1. **The norm binds; the template and the skill are downstream.** A role, a budget, or a discrimination changes in `docs/norm/` first, then in the pages and steps that state it. A page that only points at the norm source needs no edit. Three-way drift is the failure this repository exists to prevent.
2. **One role, one home.** No two norm pages may define the same role. If a page needs another page's definition, it links instead of restating.
3. **English only.** Prose, templates, comments, commit messages. No CJK in this repository.
4. **Budgets are measured, not asserted.** Volume is non-whitespace characters; entries are table rows. Both units and their commands are defined in `docs/norm/rules.md`. A number without a unit and a command is noise.
5. **No pre-built empty directories.** A directory appears when its trigger does, and its README appears with it.
6. **The template never leads the norm.** A template page points at a general norm or states only what cannot be pointed at — paths, commands, overlay mechanics; a rule the norm does not state is a bug in the template.

## Gate

```bash
bun run gate
```

It runs the Bun format check over code, the Prettier check over Markdown, the checker's tests, and the document checks. The document checks cover every `docs/` and `template/` directory that contains markdown has a README, every `docs/` page maps to a declared role, every internal markdown link resolves, every markdown file's volume is inside its hard budget (a soft breach prints a warning), index tables and each routing table are inside their row limits, file names follow the naming convention, indexes carry no totals, every work package has its ledger files, its board's `Next`, `Blocked`, and `Last done` agree with its index, and every summary names its evidence, no unfinished marker survives, and no paragraph is hard-wrapped. The prose stage calls the `md-tools` CLI in the python-toolkit checkout named by `MD_TOOLS_PROJECT`; an unset variable fails the gate rather than skipping the stage. CI runs the same stages except the prose one on push and pull request (`bun run gate:ci`), because `md-tools` is not reachable from CI; the workflow names the omission and the pass line repeats it, and CI adds no stage the command does not run. Run it after any norm or template edit. A green run is the minimum for a commit, not evidence that the prose is right.

## Which file answers which question

| Task | Read |
| --- | --- |
| Understand a role, a level, a rule, a budget, or an overlay | `docs/norm/README.md` |
| Write or review a repository README | `docs/norm/repository-readme.md` |
| Change the README contract | `docs/norm/repository-readme.md`, `template/core/README.md` |
| Move an existing repository onto this standard (Mode 3), or operate on a target | `docs/workflow.md` |
| Change where this repository's own files live | `docs/structure.md` |
| Change language, naming, citation, or a discrimination | `docs/conventions.md` |
| Change the commit message convention | `docs/norm/committing.md`, `docs/committing.md` |
| Ask why a choice was made, or what is deferred | `docs/decisions/`, `docs/backlog/` |

## Change surface — same commit, or it is incomplete

| Change | Also update |
| --- | --- |
| Add / rename / remove a role | `docs/norm/roles.md`, the matching `template/` file, the skill's mode steps, `scripts/docs-model.ts` role patterns |
| Change a budget or its unit | `docs/norm/rules.md`, `docs/norm/roles.md`, this file, `scripts/docs-model.ts` budget tables, the portable checker's copy (`B-0002`) |
| Change a level or a placement rule | `docs/norm/roles.md`, `docs/norm/foundations.md`, `docs/structure.md`, `template/core/docs/structure.md` |
| Add / remove an overlay | `docs/norm/overlays.md`, `template/overlays/`, the compatibility table |
| Change a gate command | `docs/norm/overlays.md`, this file, every overlay README, `package.json`, `.github/workflows/gate.yml` |
| Move or rename a directory | every pointer, proven by `rg -l '<old-path>'` returning nothing |
| Change a placeholder value or notation | `template/README.md` |
| Change naming or citation rules | `docs/norm/rules.md`, `docs/conventions.md`, `template/core/docs/conventions.md`, `docs/README.md`, `template/core/docs/README.md`, `scripts/docs-model.ts` naming patterns |
| Change the commit convention | `docs/norm/committing.md`, `docs/committing.md`, `template/core/docs/committing.md` |
| Change the closeout steps, the acceptance checklist, or the summary shape | `work-packages/README.md`, `template/effort/work-packages/README.md`, `template/effort/work-packages/summary.md`, `template/effort/docs/workflow.md` |
| Change the skill's modes or steps | `SKILL.md`, `docs/norm/roles.md` when a mode reads a new role |
| Change a generated path | `docs/norm/rules.md`, `scripts/docs-model.ts` `GENERATED_DIRS` |

## Anti-regrowth

This file holds red lines, the gate, and the routing table. Everything else goes into the page the routing table points at. A line is promoted here only when it would bite on an unrelated task. When a section grows, move it and chase every pointer.
