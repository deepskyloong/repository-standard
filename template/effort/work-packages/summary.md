# Summary — <slug>

**Date:** <YYYY-MM-DD>

**Acceptance:** <met / not met> — <one sentence naming any unmet criterion>

**Gate:** `<command>` — <YYYY-MM-DD>, <result at closeout; include counts and the commit when they identify the verified tree>

**Criteria:**

- <one spec acceptance clause> — <command, path, or state, with the observed result>

## Outcome

- Target: <one sentence naming the delivered result>
  - <For a multi-part effort, a distinct user- or maintainer-visible result, its owning path, and its observable behavior; add bullets by result, not by changed file, and omit nested bullets when the Target sentence suffices>
- Standard: <ADR-nnnn — one clause; or "none">
- Program: <backlog item state and what opens next; or "none">
- Branch: <`<branch>` — merged at `<commit>`, or left unmerged for review (`<destination>`)>

## Residuals

<None. | - <what remains> — kind: <known limitation | new finding | deferred work> — destination: <B-nnnn | trigger | nothing, accepted because ...>>

## Compromises

<None. | - <Scope reduction | Track switch | Artifact deferral> — <what changed>; destination or trigger: <...>>

## Verification

- Survivors: <each pointer that remains at closeout and why it is valid; use `rg -l '<slug>'`>
- Reproduce: `<command>` — <expected or observed result>; `<command>` — <expected or observed result>
- Not applicable: <check and why it does not apply; omit this line when none>

Evidence: `<directory>/` — <what it answers>; `docs/knowledge/guides/<topic>.md` — <what it settles>; "none" if none
