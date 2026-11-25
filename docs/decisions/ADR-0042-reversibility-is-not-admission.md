# ADR-0042 — Reversibility is not an ADR admission requirement

- Status: Accepted (2026-11-25)
- Scope: Admission of decision records; their shape, supersession, and independence from work packages stay unchanged
- Related: [ADR-0041](ADR-0041-decision-record-shape.md), [roles.md](../norm/roles.md)

## Context

The role table admits a choice with rejected alternatives that a future maintainer would otherwise relitigate. It does not say whether that choice must also be hard to reverse. A reader can therefore import a stricter ADR convention and reject a record whose alternatives are likely to return merely because changing the implementation would be cheap.

The two readings diverge on low-cost but recurring debates. A choice between two viable tools, for example, may have a cheap migration path while still consuming maintainer attention whenever its rationale is lost. The maintainer ruled that such a choice should be recorded to prevent repeated discussion.

## Decision

Apply the role table's admission test without a reversibility threshold. A readily reversed choice with rejected alternatives earns an ADR when a future maintainer would otherwise relitigate it; the record exists to prevent that repeated discussion. The cost of reversal may support the admission judgment, but its absence never disqualifies the record.

## Reasoning

- **The avoided cost is repeated discussion, not only reversal.** A cheap change can still consume the same review and decision effort each time its rationale is lost.
- **One admission test prevents divergent readings.** Making relitigation sufficient keeps a reader from adding a reversal-cost threshold that the role table does not state.

## Consequences

**Positive**

- A reversible choice with recurring alternatives has a durable, indexed rationale.
- Reviewers and agents can apply the same admission rule without estimating implementation or migration cost.

**Negative**

- More ADRs may be written for choices whose implementation is easy to change.
- Likely relitigation remains a judgment and can be overstated to justify an unnecessary record.

**Mitigations**

- The existing guards stay: rejected alternatives are mandatory, most work packages produce no ADR, and neither package size nor implementation cost substitutes for the admission test.

## When to reopen

1. Reversible-choice records routinely carry alternatives that were never seriously considered, or reviewing them costs more than the repeated discussions they prevent.

## Rejected alternatives

| Alternative | Rejection reason |
| --- | --- |
| Require a meaningful cost of reversal | It excludes choices whose rejected alternatives still generate repeated discussion; the ADR prevents that discussion cost as well as migration cost |
| Keep the reversibility question implicit | Readers can import different ADR conventions and reach opposite admission decisions from the same role table |
| Record reversible choices only in commit messages | The rationale remains in history but lacks the decisions index, status, scope, and reopen conditions that make the choice reusable instead of repeatedly rediscovered |
