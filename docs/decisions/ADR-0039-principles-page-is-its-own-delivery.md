# ADR-0039 — The principles page is delivered by the prompt, not by a skill

Status: Accepted (2026-11-22)

## Context

`ADR-0038` made the `coding-principles` skill a derived copy of `docs/norm/code.md`, checked by `scripts/check-code-principles-sync.ps1`, on the reasoning that an agent-facing copy is how the page reaches a session. Two observations retired that reasoning.

The composed per-turn prompt is loaded by every agent product in use, and it carries both a pointer to the chapter and a trigger line for the skill; the copy is therefore not the route. The copy also measured 28% duplication — 635 non-whitespace characters of rules and 632 of symptoms — while the rest of the skill, a boundary table repeating its own "not for" clause and six excuse/counter pairs, states no rule the page lacks.

## Decision

The page is the only home. No agent-facing copy quotes it, and no comparison runs. `proactive-invocation.md` points at `docs/norm/code.md` with the trigger wording and drops the skill, the kit deletes the comparison script, and the library's `coding-principles` skill goes with its index row.

## Options considered

1. Keep the copy and the comparison — rejected: the prompt already routes, so the copy pays a maintenance tax for a delivery it no longer provides, and the only thing that could run the comparison is a person.
2. Keep a pointer stub carrying the skill's other tables — rejected: the boundary table restates the description's "not for" clause, and the counters add no decision rule that the page's symptom column lacks.
3. Move the counters into the page — rejected: a norm page states a constraint and its symptom; persuasion is not a rule, and the page's budget belongs to rules.

## Consequences

- One source: the drift class disappears with the script, the skill's three files, and its index row.
- `docs/norm/code.md` is read on demand through the prompt, in every product, rather than quoted inline.
- i-architecture-design cites the page where it cited the skill.
- The kit's three source documents — the decoupling guide, the finding guide, and the migration case — retire with it; the norm pages and the case page are the only copies.
- `ADR-0038`'s decision stands; its consequence that the skill becomes a derived copy is superseded.
