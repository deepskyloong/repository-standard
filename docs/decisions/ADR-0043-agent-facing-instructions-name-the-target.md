# ADR-0043 — An agent-facing instruction names the target behavior

- Status: Accepted (2026-11-25)
- Scope: The form of instructions an agent follows: `AGENTS.md`, skill steps, and pointed-to pages that direct the next action; frozen records, commit messages, and descriptive prose stay outside it
- Related: [ADR-0016](ADR-0016-norm-source-pointer.md), [ADR-0042](ADR-0042-reversibility-is-not-admission.md), [roles.md](../norm/roles.md), [conventions.md](../conventions.md)

## Context

The `writing-for-agents` skill, "Leading words", says that steering by prohibition makes the forbidden behavior available while the negation is a weak modifier, and that the target behavior should be stated instead. The standard had no binding home for that rule. Target repositories point at `{{NORM_SOURCE}}/docs/conventions.md` (ADR-0016), so an external skill cannot bind them. The Conventions role already owns document discipline, but its admission named only language, naming, citation, and the five discriminations.

The rule has a real boundary. Hard invariants such as "No secrets, no destructive commands" and "Never delete an ADR" state refusals that a positive paraphrase can soften or make less exact. A blanket ban on negation would also make frozen records and historical prose look defective. The rule therefore has to bind the form of live instructions without dissolving hard guardrails or ordering a rewrite of evidence.

## Decision

1. **State the target.** In an instruction an agent follows, name the observable action that completes it: `A paragraph is one line`, instead of naming the prohibited action.
2. **Reserve prohibitions.** Keep a prohibition only for a hard guardrail whose refusal cannot be expressed as a target, and pair it with a positive target where one can be stated. Express an exact condition as `only when` where a condition, rather than a refusal, is the fact.
3. **Keep the target checkable.** A rewrite that replaces an exact prohibition with an adjective such as `clear` or `concise`, and names no observable action, is a no-op.
4. **Apply on write and revision.** The rule binds an instruction when it is written or revised. Frozen ADR bodies, commit messages, descriptive prose, and existing hard guardrails keep their wording; this decision orders no bulk rewrite.
5. **One home.** `docs/conventions.md`, "Document discipline", states the rule. `docs/norm/roles.md` admits it to the Conventions role; target pages point at the norm source and record deviations.
6. **Review, not parse.** The rule is `weak`: a person or an agent applies it in review and says so. The gate does not judge intent, and no checker stage parses positive and negative prose.

## Reasoning

- **A target is a completion criterion.** An agent can tell whether one paragraph is one line without interpreting a forbidden action; a prohibition leaves the desired end state implicit.
- **A hard guardrail expresses refusal.** "A destructive command needs explicit instruction" still names the permitted condition; "proceed carefully" would lose the refusal that stops the run.
- **Prospective application protects evidence.** Frozen ADRs and commit messages record what was true at the time. Rewriting them to satisfy a new prose rule would make the diff carry a meaning the record never had.
- **An existing role beats a new one.** Conventions already binds how a document is written and is reached by a base pointer from target repositories; adding a norm page or an always-loaded red line would spend context to create a second home.

## Consequences

**Positive**

- Agent-facing instructions written or revised end on an observable action more often.
- Target repositories inherit one rule through their conventions pointer; the template carries no copy that can drift.
- Hard guardrails stay exact, and reviewers have words for why they are exempt.

**Negative**

- Mixed phrasing remains until existing instructions are revised; this decision does not normalize the tree.
- Reviewers must distinguish a steer from a hard guardrail, which is a judgment a gate cannot make.
- A positive rewrite can look compliant while saying nothing; weak enforcement relies on review discipline.

**Mitigations**

- Ask on review: "Can this be written as an observable target without losing the refusal?" If not, keep the prohibition and pair it with the target that applies.
- The `Scope` and Decision name the excluded documents, so a frozen record is not treated as a finding.
- `AGENTS.md` names the rule's change surface; the conventions page remains the one home for the wording.

## When to reopen

1. Reviews repeatedly turn hard guardrails into conditional targets that no longer stop the run, or accept positive rewrites with no observable action while the same agent behavior returns.
2. A checker can reliably distinguish a live instruction, a hard guardrail, and a frozen record across the corpus; the rule's strength can then be reconsidered.

## Rejected alternatives

| Alternative | Rejection reason |
| --- | --- |
| Keep the rule only in the external `writing-for-agents` skill | Target repositories do not consume a user's skill library; a general norm needs a repository home and a pointer |
| Treat every negative sentence as a defect | Hard guardrails and exact refusals need negation; frozen records would be rewritten for a rule that was never meant to govern evidence |
| Put the full rule in `AGENTS.md` as a red line | It is a writing convention, not a per-turn invariant; the anti-regrowth clause reserves that layer for red lines, commands, and routing |
| Add a strong gate rule that parses negation | Intent, guardrails, and historical prose cannot be classified reliably by a text scan; dressing that judgment as `strong` contradicts P4 |
