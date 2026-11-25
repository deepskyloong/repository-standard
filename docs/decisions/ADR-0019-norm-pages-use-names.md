# ADR-0019 — Norm pages are named by subject, not numbered

## Status

Accepted (2026-11-18). Superseded in part by [ADR-0027](ADR-0027-retire-governance-role.md) (2026-11-19); the norm-page naming rule still holds.

## Context

The norm pages lived at `docs/spec/<nnnn>-<slug>.md`. The number was an ordinal, not an ID (ADR-0004), and the set is a group of independent questions, not a sequence. The prefix imposed a total order the pages do not have: a new page appended after `0007`, so the file order and the reading order had already diverged. It also made `docs/spec/` a third, unlisted sense of "spec" beside the work package's `spec.md` and the contract; `roles.md` ("Five discriminations", 2) admits only two senses, and the third was the directory everyone read first.

The word that fits the binding text is **norm**. The repository already uses it: `GLOSSARY.md` defines a **norm source**, `committing.md` calls its page a norm, and the template's `Norm source:` line is the only placeholder a consumer resolves. The work package's `spec.md` keeps its word: a specification of an effort is what "spec" describes.

## Decision

The binding text lives at `docs/norm/<slug>.md`; the file name and H1 carry the subject, not a number. `docs/norm/README.md` carries the order as reading paths: a first pass and a reference set. ADRs and backlog items keep four-digit IDs; only the living norm pages lose numbers. The version label is `standard vN`, recorded in `README.md` and `docs/norm/README.md`. The project commit type for this layer is `norm`, not `spec`. The template and consumers point at `{{NORM_SOURCE}}/docs/norm/committing.md`.

## Options considered

- **Keep the numbers and append.** Rejected: the number is a false total order, insertion is only possible at the end, and the directory remains a third sense of "spec".
- **Rename the directory to `docs/standard/`.** Rejected: `standard` is the whole artifact; the folder would read as the standard's standard, and "the standard" would still name both the whole and one directory.
- **Rename the work package's `spec.md` instead.** Rejected: "spec" is the right word for an effort's intent, and it is already defined that way in `GLOSSARY.md`; the root is the one that should yield.
- **Keep `docs/spec/` and drop only the numbers.** Rejected: the collision with the work package's `spec.md` survives, and the directory still carries the wrong name for the binding text.

## Consequences

Every live pointer moves once: `AGENTS.md`, `README.md`, `GLOSSARY.md`, the docs pages, the template, the checker, the backlog, and the consumers. `scripts/check.py` changes its role pattern, its required-page list, and its version check. ADR-0004's spec-page clause is superseded; its four-digit record rule still holds. `docs/spec/` is removed: archived packages are mechanically repointed to the new paths, a narrow exception to ADR-0017's read-only rule and ADR-0018's frozen-record rule, taken because a forwarding `docs/spec/` directory would read as a live spec layer. Their substance and dates are unchanged; only path tokens and the words naming the moved layer were updated. A norm page that no longer binds anything is deleted, as `governance.md` says; no tombstone is needed for a page with no frozen citation.
