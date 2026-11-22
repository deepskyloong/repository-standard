# B-0005 — Roll the repository standard out to the five source repositories

## Problem

`B-0002`, `B-0003`, and `B-0004` depend on a repository being forged or migrated, but no item tracks the rollout itself. The triggers are real events that only happen if someone schedules them; without this item, they are wishes with a plausible-sounding condition.

## Evidence

- The five source repositories have different maturity: oshi has the most complete backlog, gearset the richest module form, bun-toolkit the largest `AGENTS.md`, python-toolkit the clearest layout page, personal-agent-kit the only generated artifact.
- Each migration surfaces a different assumption in the norm; a rollout that skips one leaves that assumption untested.
- The kit retired its code-prose corpus into the standard on 2026-11-22 — the principles and patterns pages, and the migration case; its migration tests the generated-artifact contract alone.
- One package for all five was rejected on 2026-11-17: oshi's migration is the first application of a draft norm and changes it as it goes (ADR-0006 through ADR-0016), so the later repositories' phases would be planned against a norm oshi will not leave in place. The rollout runs one work package per repository.

## Plan

1. One work package per repository, in order: oshi, bun-toolkit, python-toolkit, gearset, personal-agent-kit. Open the next package only when the previous closes; the norm it follows is the one the previous migration left. This item keeps its five-repository name because it tracks the program, while a package is named for the repository it migrates.
2. Each package audits its repository immediately before the first move, records `audits/<repo>.md`, and stops for the maintainer before touching anything.
3. Oshi first: its backlog is the reference shape, and the cost of a wrong call is lowest.
4. Bun-toolkit: the `AGENTS.md` split and the adapter registry get their first real test.
5. Python-toolkit: the layout page and the index autonomy rule get their test.
6. Gearset last among the code repositories: it supplies the six-module sample that settles `B-0003`, and the module level is resolved against it.
7. The committing norm moved into `docs/norm/committing.md` on 2026-11-18; `docs/committing.md` is a base pointer plus this repository's deviations. A consumer without a `Norm source:` line points its `Base:` at the new absolute path until it defines one, then uses `{{NORM_SOURCE}}/docs/norm/committing.md`. The template's page is a pointer.
8. Personal-agent-kit: the generated artifact contract gets its test. Its unit of work is a skill, so the work-package flow does not apply.
9. Close when every repository is migrated or carries a reasoned exception recorded here or in its `docs/adapters.md`.

## Progress

- oshi — merged into `main` at `2cb1380` (local fast-forward from `1b52545`; `origin/main` moved `08a5414..2cb1380`), worktree removed, and archived at `work-packages/archive/rollout-oshi/`: the standard's roles are at their canonical paths, every audit finding has a disposition, and both gates are green. Next repository: bun-toolkit; this item stays active.

## Revisit when

Bun-toolkit's package is ready to open; audit it and stop for the maintainer before the first move.
