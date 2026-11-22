# ADR-0038 — Code principles are a norm page and a pattern chapter

Status: Superseded in part by [ADR-0039](ADR-0039-principles-page-is-its-own-delivery.md) (2026-11-22); the page-and-chapter decision and the charter narrowing still hold.

## Context

`docs/charter.md` admits the set of document roles and the rules that keep them from duplicating, and it puts "Business architecture, module design, or algorithm choices" out of scope. Four code-level facts nevertheless recur across the maintainer's repositories: human-readable output is a projection of state, a message code is an API, a threshold is a parameter, and a finding carries a tier and one fix. `personal-agent-kit` holds three documents on them under `references/`, one case under `experience/`, and two rule files under `rules/`; its `coding-principles` skill quotes the same eleven rules.

One page cannot hold the corpus. The decoupling guide measures 12,601 non-whitespace characters against the 10,000 soft line for a `docs/` page, and the plan is to collect one page per pattern topic.

The overlays already ship language-level writing rules under C6, so the language-specific half has a home. The language-agnostic half has none, and the charter's "Language style guides beyond the gate and the artifact tiers" is already contradicted by C6: the line has blurred rather than been drawn.

`scripts/doc-checks.ts` and `package-checks.ts` build every finding inside the check that fires — `fail(\`missing required file: ${name}\`)` — with no code and no facts. That is a live instance of the problem the method names, and a proof this repository can run on itself.

## Decision

Code principles that apply to any repository are in scope. Business architecture, algorithm choices, and the internal design of one system stay out.

Two forms, two homes:

- **Principle** — a constraint that applies wherever code is written, at `docs/norm/code.md`. Its strength is `weak` unless a gate enforces it, declared once for the page; every item names an observable symptom, so a judgment becomes a review test.
- **Pattern** — a solution shape adopted when a condition holds, at `docs/norm/code/<topic>.md`, one topic per page. `docs/norm/code/README.md` is the chapter index: one row per topic, a one-line gist, a relative link, and the chapter's admission and exit. A pattern page states its adoption condition, the shape, the guards, and the verification.

`docs/norm/code.md` is the page an adopting repository points at — `Code policy: {{NORM_SOURCE}}/docs/norm/code.md` — and it links the chapter instead of restating a topic.

The chapter is a norm chapter, not a role of a generated repository. `docs/norm/roles.md` gains no row, `template/` gains no directory, and `docs/structure.md` governs the paths. `scripts/docs-model.ts` admits `docs/norm/code/(README|[a-z0-9-]+)\.md`.

The language expression belongs to the overlay's C6 and to a gate stage; the norm page does not choose a mechanism. An agent-facing copy — a skill that quotes a principle block — names the norm page as its source, and a command proves the two agree; it is a derived copy, not a second home.

## Options considered

1. One page, `docs/norm/code.md` only — rejected: the first pattern alone is 12,601 characters against the soft line, and every later topic would grow the same page.
2. A new optional role at `docs/patterns/<topic>.md` — rejected: the content is norm-source-only; a role would add a template directory and a `roles.md` row for documents no generated repository should own.
3. File the corpus under `docs/knowledge/guides/` — rejected: a knowledge guide's authority is `—`; it binds nothing, and a repository naming the norm source could not rely on it.
4. Keep code principles out and leave C6 as the only code surface — rejected: the charter already contradicts C6, and the language-agnostic half stays homeless.
5. Vendor the kit's corpus into this repository — rejected: a second home, Chinese examples the gate rejects, and an index whose admission names `references/` and `experience/`, directories this repository does not have.
6. Let the skill be the source and the norm page the copy — rejected: a target repository cannot rely on a skill library it does not install; the norm source is the consumer-facing authority.

## Consequences

- `docs/norm/code.md`, `docs/norm/code/README.md`, and one page per topic. The chapter appears with its first topic and is never empty.
- `docs/norm/README.md` gains two rows; `docs-model.ts` one role pattern; `template/core/AGENTS.md` one routing row, nine of twelve.
- `docs/charter.md` and `README.md` change in the same commit as this record.
- Two bullets already owned by `docs/norm/committing.md` enter the principles page as one pointer, not as restatements; the set is ten items, not eleven.
- `GLOSSARY.md` defines Principle and Pattern, avoiding "best practice".
- The `coding-principles` skill becomes a derived copy; `rules/coding-principles.md` and `rules/coding-patterns.md` stop being sources.
- Findings stay a pattern until a consumer depends on the JSON; `docs/contracts/findings.md` is admitted then, not now.
- The budget is unchanged: any `docs/` page is 10,000 soft and 16,000 hard; the chapter index is a directory README at 6,000 and 12,000.
