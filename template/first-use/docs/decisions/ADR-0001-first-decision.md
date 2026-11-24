# ADR-0001 — <the decision as a sentence>

- Status: Accepted (<YYYY-MM-DD>)
- Scope: <what the decision binds, and what it leaves alone>
- Related: <durable pages and records the decision touches, as links; omit the line when there are none>

## Context

What forced the choice: the situation, the forces pulling in different directions, and the constraint that makes them conflict. Name what raised it: link a durable page or record; write an effort, a branch, or a commit in backticks, never as a link into `work-packages/`. Do not argue for one side here.

## Decision

What was chosen, stated as rules a future maintainer can follow: one sentence, or a numbered list when the choice has parts.

## Reasoning

Why the chosen rules answer the forces in `Context`: one point per force. A losing option's reason belongs in the table at the end, not here.

## Consequences

**Positive**

- What becomes easier.

**Negative**

- What becomes harder, impossible, or costs more.

**Mitigations**

- How each negative is handled, or what is watched and where.

## When to reopen

The observable conditions under which this decision would be wrong: a premise in `Context` that fails, a measured limit crossed, a capability that arrives. A reader who finds that one holds writes the ADR that supersedes this one; this file's `Status` line and its index row then change, and nothing else.

## Rejected alternatives

| Alternative | Rejection reason |
| --- | --- |
| <the option that lost> | <why it lost, against the forces in `Context`> |

At least one row, and the chosen option is not a row; it is the `Decision`. An ADR without a rejected alternative is a note, not a decision.
