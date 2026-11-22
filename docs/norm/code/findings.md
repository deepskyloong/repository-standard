# Findings

A finding is a message that demands a decision: facts, a tier, and one action. The record, its four concerns, and the twelve invariants belong to the [messages](messages.md) page; this page carries what a finding adds and what its report promises. A lint, an audit row, and a warning are findings whether or not the program calls them that.

## What a finding adds

| Field | Holds | Test |
| --- | --- | --- |
| `level` | `fail` or `warn` — fix now, or judge and keep | Is it a machine value the renderer turns into a label? |
| `headline` | A short name with no facts | Would it survive a threshold change untouched? |
| `action` | One imperative fix | Can it be executed without choosing between two instructions? |
| `qualifier` | The "may keep" clause | Does it change act or keep? If not, delete it |
| `ref` | A docs path or a heading name | Is it a pointer, not a second explanation? |

Two rules keep the first and the last from drifting:

- **A qualifier is not a rationale.** `kept when the page has a second section` qualifies the decision. Why the threshold is what it is belongs in the page that states the threshold, once.
- **`ref` names a section, never its position.** A repository that forbids ordinal citations cannot write `§5`; the heading text, or a docs path and the heading after it, survives an insertion above.

## Tiers

Two levels, and a tier suffix only when one fact has two dispositions. `budget.volume_hard` and `budget.volume_soft` are the same measurement under two rules — a hard budget and a soft one — so the code carries the tier. Two unrelated facts never share a code by sharing a level.

The template states the fact; the level carries the disposition. A soft template whose verb orders a fix is a defect of that template, not a reason to promote the finding: a reader who keeps the file is obeying the level and disobeying the sentence.

## The report

One finding renders to one line, location first: `path:line: problem`, `path: problem` where no line exists, and a finding about the run rather than a file starts with its subject (`prose: ...`). The line is for a reviewer who follows it in an editor. Anything that must be grouped, counted, suppressed, or tested is read from `code` and `params`; no consumer may branch on the line.

Labels, ordering, and grouping are the renderer's, so one record set serves a flat list, a per-file report, and a sorted summary without a wording change. A narrator may add context and may never soften a `fail` into a suggestion.

## The worked instance

This repository's gate reports through one catalog. `scripts/findings.ts` holds 67 codes across seven domains; checks name a code and pass the facts; `scripts/check.ts` is the only place that prints. The catalog refuses to load when a code loses its domain, a level leaves the two, or a template cannot format from dummy params, and `scripts/zz-coverage.test.ts` fails when a code has no fixture behind it. A checker that applies these rules to other repositories is bound by them in its own: a self-audit that ships unchecked wording is the first counter-example a reader will find.

## Contract

No `docs/contracts/findings.md` yet, on purpose. A contract earns its page when a consumer depends on the exact fields — a program other than the renderer reading `code`, `level`, or a `params` key. The named trigger is the portable checker at `B-0002`: when it reads records rather than lines, its change lands the field set, the stability rule, and the versioning rule at `docs/contracts/findings.md` together. Until then the messages page's tenth invariant freezes the names, and a `--json` surface written for one repository needs no contract.
