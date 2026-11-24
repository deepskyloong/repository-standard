# ADR-0037 — The closeout's judgement is a knowledge guide, not a fifth ledger file

Status: Superseded in part by [ADR-0040](ADR-0040-closeout-ordering-and-lifecycle-safe-provenance.md) (2026-11-23); the four-file ledger and the guide destination still hold.

## Context

ADR-0036 settled what `summary.md` answers: acceptance, what is true now, what remains and where it went, what changed in the standard, how a reader verifies it. The pilot `rollout-oshi` also produced a second body of writing that the summary cannot hold: rules the next repository's migration would otherwise relearn — that a package carrying two targets plans the second against a spec the first rewrites, that a phase closes on the tree's residue, that a moved path costs one registry row.

That material had no home. The work-package shape is four ledger files, and `scripts/package-checks.ts` fails any other file in the package. The archive it lands in is defined as records, not rules, and `work-packages/archive/README.md` states that a live page never points there for authority. A rule kept in a package therefore has no authority while the package is open, and loses its place when the package is archived — or deleted with it.

`docs/norm/roles.md` already admits the destination: a Knowledge guide is "a method that changes what a maintainer does next time". The question this ADR settles is whether the closeout should gain a fifth ledger file, `closeout.md`, so the judgement stays beside the record it came from.

Two smaller signals pointed the same way. The installed `writing-a-work-package-closeout` skill writes exactly this genre and nothing else; it assumes a document outside the spec, plan and ledger it summarizes, because each workflow suite stops at its own ledger. And the first draft of oshi's guide opened by restating the package's acceptance, gate result and archive progress — status `summary.md` owns, that expires as soon as the archive moves, and that no other effort's guide should inherit.

## Decision

The judgement lands in one knowledge guide at `docs/knowledge/guides/`, written before the freeze. The package keeps `summary.md` and gains no fifth file.

- **Trigger.** The effort produced rules that would change the next effort. Most packages produce none, and a package that only executed a plan leaves no guide; a guide is not a closeout requirement in the way `summary.md` is.
- **Content.** The rules that transfer, each with the observation that settled it. State, counts, acceptance and residuals stay in `summary.md`; the guide cites it and does not restate it, and opens with one line naming the effort and pointing at the record.
- **Procedure.** The installed `writing-a-work-package-closeout` skill holds the full shape — the rules, the defects found and left, the verdicts with no other home, and the slots it drops when another page owns them. The norm binds only the outcome, so a repository without that skill writes the same page by hand.
- **Pointer.** `summary.md` names the guide in `Outcome` or `Evidence`; the guide's index is the live pointer. The guide is written before the archive move, because an archived package is never edited.

## Options considered

1. **A fifth ledger file, `closeout.md`, beside `summary.md`.** Rejected on three grounds. The archive binds nothing and a live page may not cite it, so a rule kept there cannot bind the next effort without rewriting the archive's role in the same change; a package is archived and may later be deleted, and the judgement would go with it; and the package shape is a role-level contract — `docs/norm/flow.md`, both `work-packages/README.md` copies, `template/effort/work-packages/`, `scripts/package-checks.ts`, its tests and the portable checker — so the cost falls on every repository the standard forges, for one document per effort.
2. **Keep the judgement in `summary.md`.** Rejected: the summary answers the frozen package's reader inside a four-section budget. Rules that transfer would turn it into a second kind of document and push state out of the budget, which ADR-0036 had just separated.
3. **One ADR per closeout.** Rejected: an ADR records a choice with rejected alternatives. A set of rules that each transfer is not a choice, and an ADR per effort floods the decision index with entries nobody consults for method.
4. **A knowledge guide outside the package.** Chosen: the destination exists in `docs/norm/roles.md`, it survives the package's lifecycle, a live page may cite it, and its budget and index links come from the docs page rules rather than from a new role.

## Consequences

- `docs/norm/flow.md` closeout step 1 defines `Verification`; step 2 gains the trigger, the content rule and the pointer, and the acceptance checklist gains one guard. No role is added, so `docs/norm/roles.md` is unchanged.
- `work-packages/README.md` and its template copy gain the closeout rule and one checklist row; `template/effort/work-packages/summary.md`'s `Verification` records the pointer snapshot and the reproduction, and the guide is named in `Outcome` or `Evidence`, not a separate line.
- No checker change: a guide is a `docs/` page by the existing role map, and its volume is the docs page's.
- `docs/knowledge/guides/` holds its first page, `migrating-a-repository-onto-the-standard.md`; `docs/README.md` lists the directory.
- `rollout-oshi`'s summary names the guide before its archive move; the package still closes through that move.
- A guide that restates acceptance, gate or archive progress is a second status report. The first draft is corrected, and the norm states the opening line so the next one does not repeat it.
