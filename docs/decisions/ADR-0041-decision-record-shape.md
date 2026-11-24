# ADR-0041 — A decision record separates the decision, its reasoning, its exit conditions, and the alternatives that lost

- Status: Accepted (2026-11-24)
- Scope: The shape of a decision record and the row budget of the decisions index; records already written are not restructured, and no checker stage is added
- Related: [ADR-0013](ADR-0013-two-tier-volume-budgets.md), [ADR-0040](ADR-0040-closeout-ordering-and-lifecycle-safe-provenance.md), [B-0002](../backlog/B-0002-portable-skeleton-check.md), [B-0006](../backlog/B-0006-backlog-index-growth.md), [roles.md](../norm/roles.md), [the first ADR template](../../template/first-use/docs/decisions/ADR-0001-first-decision.md)

## Context

The template's record had five parts: a bare `Status` line, `Context`, `Decision`, `Options considered`, and `Consequences`. In use it failed four ways. The options list carried the chosen option's reasons beside the rejected ones, so the argument for the decision sat outside `Decision` and a reader could not cite the rule without the debate. "What must be checked later" lived inside `Consequences` as an afterthought, with no procedure when the check fired. The records already written had drifted from the template: `ADR-0004` and `ADR-0040` carry a date and a supersession relation on the `Status` line that the template never showed. And nothing said what a decision did not bind.

The oshi repository, rolled onto this standard in the `rollout-oshi` package, kept the records it had migrated from `docs/adrs/`; they share a richer shape that its index describes as legacy: a `Status` / `Scope` / `Related` header, a `Decision` of numbered rules, a separate `Reasoning`, `Consequences` split into what is positive, negative, and mitigated, a `When to reopen` list, and a `Rejected alternatives` table. `ADR-0040` had also just made cross-lifecycle links a defect: a durable page that links into `work-packages/archive/` breaks `docs.broken_link` when the package is retired, so a template that says "link the effort" plants findings.

The decisions index sat at its entry budget, 40 rows, with this record unnumbered.

## Decision

1. **The record's shape is the one `docs/norm/roles.md`, "Decision record (ADR)", states**: a `Status` / `Scope` / `Related` list, then `Context`, `Decision`, `Reasoning`, `Consequences` in its three parts, `When to reopen`, and a `Rejected alternatives` table. `Reasoning` argues only for the chosen rules; a losing option's reason is written once, as a table row; `Consequences` carries no argument.
2. **Links follow the record's lifetime.** `Related` and `Context` link durable pages and records; an effort, a branch, a commit, or a path that may move is named in backticks, never linked — `ADR-0040`'s rule applied to the record.
3. **Superseding edits the `Status` line and the index row, nothing else.** `Status` carries the state and the date it took effect, in one of the three forms the norm states.
4. **Records written before this one keep their shape.** No record is restructured; a format change binds the records written after it.
5. **The decisions index holds 60 rows.** `ENTRY_LIMITS` moves `docs/decisions/README.md` from 40 to 60 rows and its volume budget from 6,000/12,000 to 8,000/16,000, derived as `ADR-0013` derives an index's lines from its row cap.

## Reasoning

- **A citable rule needs a home without the debate.** `Decision` as rules and `Reasoning` as the argument let a later page cite the rule; the old options list made every citation carry the comparison.
- **A losing option's reason belongs once.** The old list restated the chosen option's case inside each rejected item; a table with one row per alternative and no chosen row removes the mirror image.
- **Exit conditions make the disposition testable.** The roles table already says a record exits by being marked `Superseded`; `When to reopen` states what a reader observes before doing that, which the old "what must be checked later" never did.
- **Scope and the header cost one line each.** They answer "does this bind my case" before the reader reaches `Context`, and a stated `Status` grammar stops the template lagging the records again.
- **Grandfathering is the frozen-record precedent.** `docs/norm/rules.md` lets a frozen `summary.md` keep the shape it was written with; forty records are evidence, not text to normalize, and a reformat diff would hand every line to the formatting commit.
- **Sixty rows is the budget the backlog index already carries**, at 122 characters per measured row plus a 311-character preamble, 7,753 projected against an 8,000 soft line; `B-0006` records the question that comes after it.

## Consequences

**Positive**

- A new record states its rule, its argument, its costs, and its exit conditions in separate, citable sections.
- The decisions README and the first-use README point at the norm and list no sections, so a later shape change leaves them untouched.
- The index has room for the next twenty records.

**Negative**

- The record is heavier: three header fields and six sections, and a two-option decision reads as near mirror images in `Reasoning` and the table.
- No gate stage checks the section set or the `Status` grammar; the shape is a review criterion.
- `docs/norm/roles.md` grows to about 14,700 of its 16,000 hard characters.

**Mitigations**

- The admission test is unchanged — a choice a future maintainer would otherwise relitigate — and `docs/norm/flow.md` already says most efforts produce no ADR; a one-force decision writes one `Reasoning` point.
- The old records show what drift looks like; a `Status`-vocabulary check modelled on `backlog.status` is the first stage to add if the grammar drifts again.
- The next paragraph added to `roles.md` measures first; a second shape paragraph may need the page split by the roles it describes.

## When to reopen

1. A repository's decisions index passes 60 rows; the options `B-0006` lists for the backlog index — exclude superseded rows from the budget, admit an archive index as a role, or prune — apply to decisions too.
2. Records routinely reach review with an empty or one-word `Reasoning`, `Mitigations`, or `When to reopen`; the section is then a form field, and the shape is cut back.
3. A checker stage for record shapes is admitted; `Status` and the section set become strong rules.

## Rejected alternatives

| Alternative | Rejection reason |
| --- | --- |
| Keep the five-part shape and document only the `Status` grammar | The options list still carries the chosen option's argument, exit conditions still have no home, and nothing says what a decision does not bind |
| Rewrite the forty existing records to the new shape | A reformat diff over frozen evidence that hands every line to one commit; `docs/norm/rules.md` already lets a frozen record keep the shape it was written with |
| Adopt oshi's header table and two-digit title | An empty-headed two-column table is not a register; the board's `Label: value` list is this standard's multi-field idiom and renders on every engine; the four-digit em-dash title is `ADR-0004` and `ADR-0015` |
| Keep 40 rows and move superseded records to a second index | A new role for a limit twenty more rows defer; the backlog index already holds 60 rows including closed ones, and `B-0006` names the next question |
| Put the shape in a new norm page | One page per artifact shape fragments the role table; the `GLOSSARY.md` and explainer paragraphs beside their rows are the precedent, and the page has room for one more paragraph |
