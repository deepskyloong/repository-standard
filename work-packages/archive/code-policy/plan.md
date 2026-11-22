# Plan

## Approach

Change the scope in one decision, then land the two forms the scope admits: a principles page every adopting repository points at, and a chapter whose pages a repository adopts by condition. Enforce the checkable half through the overlays and prove it on this repository's own checker, so the method is tested on a live package before the kit's copies become derived. The migration case lands last, as evidence for the pages that already exist.

## Work breakdown

| Phase | Work items | Exit condition |
| --- | --- | --- |
| P0 — Decision | W01 | `ADR-0038` is accepted; the charter no longer excludes module design; the storefront README names code principles |
| P1 — Norm pages | W02–W03 | `docs/norm/code.md` and `docs/norm/code/messages.md` exist, are indexed, and the chapter is admitted by `DOC_ROLE_PATHS` |
| P2 — Enforcement | W04–W05 | Both overlays name the expression and ship the stage; the checker returns coded findings with one fixture per code |
| P3 — Downstream | W06–W08 | The findings topic and its contract decision are recorded; the skill derives from the norm with a passing comparison; the case cites the norm pages and carries no CJK |

The table names the phases and their exit conditions; row order is the order, a phase may hold numbers issued later, and each item's description, acceptance, and evidence live in `items/<ID>.md`.

## Risks

| Risk | Mitigation | Stop condition |
| --- | --- | --- |
| The principles page becomes an unenforceable style essay | Only a constraint with an observable symptom enters; a checkable rule moves to a pattern page or a gate stage | A principle reaches review with no symptom |
| The corpus grows faster than its index | One row per topic, a one-line gist, a relative link; no topic without a page | A row has no page, or a page is missing from the index |
| The skill copy silently drifts from the norm page | The skill names the norm page as source and the kit carries a script that compares the quoted block | The comparison cannot run |
| `messages.md` stays above the soft line | Drop the worked applications and compress the two opening sections | The page exceeds 10,000 after the trim |
| The charter change widens the scope past what the standard can govern | The ADR states three boundaries: cross-repository, language-agnostic, or an overlay's C6 | A proposed page describes one system's internal design |

## Check-in points

Stop and confirm with the maintainer at each of these, rather than at every commit:

- After W01: the ADR's three boundaries and the charter wording.
- After W03: the chapter's shape, its index, and the split of `messages.md` from the general guide.
- Before W05: the checker refactor's scope, which decides whether the findings topic and its contract are admitted now.

## Out of scope

The kit's skill-production guides; a language's style beyond the overlay's C6; a findings JSON contract before a consumer depends on it; the other four rollout repositories.
