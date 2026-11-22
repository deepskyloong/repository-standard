# Repository Standard

A language-agnostic standard for maintainers starting a long-lived repository and for readers entering one: what each document is for, where it lives, how work moves from an idea to a recorded decision, and which code principles hold across repositories.

## Why this exists

Five source repositories grew five different documentation systems. They converged on the same kinds of document — rules, indexes, decisions, a backlog, work packages, knowledge — but disagreed on where each belonged, what it was called, and how large it could grow. A new repository had to reinvent the layout; an agent entering an existing one had to guess where the next document belonged.

The standard fixes the roles, the placement rules, and the budgets. It leaves the language, the toolchain, and the project's vocabulary to the project.

## What it asks for

The standard separates statements that most repositories blur:

- **What must hold** — the charter says what the project accepts; the instruction layer says what every turn must do; the glossary fixes what words mean.
- **What was decided** — decision records keep the choice and the alternatives that lost; the backlog keeps deferred work with a revisit trigger.
- **What is being executed** — work packages carry an effort from spec to closeout.
- **What was learned** — knowledge pages keep what should change the next attempt.

Each home has an admission rule, an exit, an authority, and a size budget. A repository adopts only the roles it needs; optional roles appear when their trigger does, and the rest stay absent.

The standard does not prescribe a language, framework, documentation site, or CI provider. It prescribes where a statement belongs and how much it may hold.

## Adopting it

1. Do not copy this repository. Copy `template/core/` into the new repository root, including `.editorconfig`, `.gitattributes`, and `.githooks/`; pick one overlay under `template/overlays/` and follow its README; replace every `<placeholder>`. If you want the optional commit check, run `git config core.hooksPath .githooks`.
2. Run the day-one checklist in `docs/workflow.md` (mode: forge) and the gate command its overlay names. In this repository, `bun install && bun run gate` checks the standard itself.
3. When the first work package starts, copy `template/effort/` and create `work-packages/<slug>/spec.md` with a `track:` line.

## Reading it

For a person: this file → `docs/charter.md` → `docs/norm/foundations.md` → `docs/norm/roles.md`.

For an agent: `AGENTS.md` → the routing table there → the one norm page the task needs.

## Keeping the standard

`docs/norm/` is the binding text. A role or budget change lands there first, then in `template/` and `AGENTS.md` in the same commit. The gate checks the result: `bun run gate`.

The gate is green in this checkout. The optional commit hook ships in the template; it is a convenience, not a norm requirement. A portable checker for repositories created from the template remains deferred (`docs/backlog/B-0002`).
