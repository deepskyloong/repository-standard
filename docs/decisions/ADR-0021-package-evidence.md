# ADR-0021 — A work package carries the evidence it owns

Status: Accepted (2026-11-18). Superseded in part by [ADR-0029](ADR-0029-work-item-files.md) (2026-11-19); the package-evidence rule still holds.

## Context

ADR-0009 fixed the work package at four ledger files: `spec.md`, `plan.md`, `todo.md`, and `summary.md`; it rejected `progress.md`, a work log, and ticket detail in `plan.md`. ADR-0017 fixed the closeout: the package moves as a unit and its ledger files stay read-only; ADR-0020 moved the home to `work-packages/archive/`. `flow.md` described the package by its count at creation and again in the Current state block, and its closeout step already took the ledger files and any evidence the package still owns.

Oshi's audit package carries `audits/` (the audit report, its index, and the move records) and `tools/` (the inventory and pointer script) beside the four ledger files. The report is committed, cited by the package, and needed by the audit closeout; the script reproduces its numbers. `structure.md` classified a report produced by a run as Runtime, which is not in git. The four-file rule had no name for this material, and `GLOSSARY.md` defined a work package as "four artifacts". The audit report is a report body, not a rule, a template, or a regenerable index. Without a category it is either a violation or an exception with no home.

The open package also has no `summary.md` yet: `summary.md` is the closeout record, and `flow.md` described the package as a four-file whole while open, which did not say when summary appears.

## Decision

A work package has four ledger files — `spec.md`, `plan.md`, `todo.md`, and `summary.md` written at closeout — and may carry the evidence it owns in named directories it creates on demand.

- Evidence is package-local: a measurement report, an inventory, a pointer or reproduction script, or a dated review the ledger cites. It lives under `work-packages/<slug>/<name>/`.
- Evidence stays in git, is named in `summary.md` with what it answers, and moves with the package at closeout unless a successor package owns it as a runtime artifact.
- Evidence is not a role, has no durable home in `docs/`, and never becomes a second home for a contract, a decision, or a knowledge page.
- Evidence carries no `docs/` volume budget. `summary.md` keeps its 3,750/6,000 budget; the evidence's own structure governs its length.
- `scripts/check.py` gains a package check: `spec.md`, `plan.md`, and `todo.md` always; `summary.md` for an archived package; every top-level directory named in `summary.md` when one exists; and no file beside the four ledger files. The generic link, table, and English checks already cover package markdown.

ADR-0009 and ADR-0017 stand. This ADR names material they left unnamed; it does not reverse their decisions. `summary.md` is still the closeout record; an open package may carry three ledger files until then.

## Options considered

1. Four ledger files plus named package evidence — chosen. It names the material the ledger already cites, keeps the package the unit of closure, and leaves the four-file ledger intact.
2. Move `audits/` and `tools/` into `docs/` and `scripts/` — rejected: a one-off audit report would get a durable home and a second source; the archive would lose the evidence that explains its findings.
3. Treat the audit report as Runtime and keep it out of git — rejected: the report is cited by the package and needed by the audit closeout; removing it breaks the trail.
4. Add `evidence.md` as a fifth ledger file — rejected: ADR-0009 rejected a fifth progress file; evidence is heterogeneous, and an index in `summary.md` is enough.
5. Give evidence a `docs/` volume budget — rejected: no sample supports a line; `oshi.md` is 11,284 non-whitespace and would become a soft breach, and splitting the report for a number has no reader benefit.
6. Record an exception and leave the rule alone — rejected: the exception has no home, the template keeps teaching the wrong shape, and the next package invents a different evidence directory.

## Consequences

- `GLOSSARY.md` names package evidence; `structure.md` and `template/core/docs/structure.md` add the tier; `rules.md` states the no-budget rule; `flow.md` says four ledger files and names evidence in closeout.
- `work-packages/README.md` and `template/effort/` follow; the template's summary carries an `Evidence:` line, and no empty evidence directory is created.
- `scripts/check.py` gains the package check; `SKILL.md`'s forge step says four ledger files.
- Oshi's `audits/` and `tools/` become legal without a move; the archived packages still pass with their four ledger files and no evidence.
- N = 0: no applied unit stops complying. The change is a refinement, not a reversal.
