# ADR-0023 — The role table describes a generated repository

Status: Accepted (2026-11-19). Superseded in part by [ADR-0028](ADR-0028-a-moved-path-is-a-row.md) (2026-11-19); the role-table and directory-index boundaries still hold.

## Context

`roles.md` is the single role table, but it had drifted from the shape the template actually generates. It named `docs/README.md` as a `Domains doc index`, said Governance is always present while `template/core` and the day-one checklist do not carry it, let Operating modes absorb the norm source's forge / audit / migrate workflow, and left the closeout checklist in both `template/effort/docs/workflow.md` and `template/effort/work-packages/README.md`. A reader could not tell which page was the authority for a directory inventory, a first-use page, or a closeout check.

ADR-0005 fixed directory inventories in directory READMEs but said `docs/README.md` lists subdirectories only. The page also lists the top-level docs pages. A new general role was needed for the directory inventory, not a special case for `docs/`.

## Decision

The table describes a repository that adopts the standard. Pages that exist only to produce the standard — `docs/norm/`, `template/`, `scripts/`, and this repository's forge / audit / migrate workflow — are not roles of a generated repository; `docs/structure.md` governs them. In this repository, `docs/workflow.md` is the source page; a generated repository's `docs/workflow.md` is the effort lifecycle.

- A `Directory index` role has home `<dir>/README.md`, unless another row names it. It owns direct children membership, subtree placement, and directory-local rules that have no page role. `docs/README.md` is its instance; the `Domains doc index` row is removed. `Member README`, `Backlog index`, and `Work package index` are named specializations.
- A directory index lists direct children — files and directories — in one row each. A parent above a directory lists directories, not files. This refines ADR-0005's "subdirectories only" phrase for `docs/README.md`; ADR-0005's decision that inventories live in directory READMEs stands.
- Governance is present from the first real use, with the first work package. It is not always present; `template/core` and the day-one checklist do not carry it.
- Operating modes covers the effort lifecycle: tracks, t0 fields, permitted compromises, and the closeout procedure. The norm source's forge / audit / migrate workflow is a source-only page, `docs/workflow.md`, not this role. The closeout checklist lives in the work package index; the workflow pages keep the five steps and point to that checklist.
- Where a role owns a state vocabulary, the table states it. Backlog status is `open`, `active`, `paused`, or `closed`, with the boundary to a work package. Status is a cross-package snapshot that links to packages. Index pages record state; they do not define it.
- Pair tests were added for Charter / Instruction layer, Status / Work package, Tombstone / Adapter, and Structure / Directory index.

ADR-0006's status home stands. The local role map now includes the optional `docs/status.md` path so a copy that carries the page does not fail; the skeleton itself still carries no status page.

## Options considered

1. Add `governance.md` to `template/core` so "always present" becomes true — rejected: it would force a page with no first-use reader into day one, and `template/effort` already joins governance with the first work package. The table was wrong, not the template.
2. Keep `Domains doc index` and add a second `Directory index` only for member and module directories — rejected: two roles for one job, and `docs/README.md` would remain a special case. One generic role, specialized by named exceptions, is cheaper.
3. Keep the `docs/README.md` "subdirectories only" rule and delete its file rows — rejected: the page's reader needs the top-level docs pages in the same index; deleting them would make the index less useful and contradict `docs/structure.md`'s direct-children rule.
4. Leave Operating modes as the union of the target lifecycle and the source's forge / audit / migrate workflow — rejected: a generated repository gets a role page it cannot use, and the source's own workflow already lives in `docs/workflow.md`. One role, one job.
5. Keep both closeout checklists and declare one canonical — rejected: two homes drift. The checklist belongs to the work package index; the workflow page points to it.
6. Move the backlog status definitions to `docs/backlog/README.md` and leave `roles.md` silent — rejected: the `Backlog index` row would have no state semantics, and a template index would have no norm source for its states. `roles.md` owns the role's admission and state vocabulary; index pages point.

## Consequences

- `roles.md` has seven always-present roles: Storefront README, Instruction layer, Directory index, Charter, Structure, Conventions, Committing. Governance sits in the first-use table, and the pair tests gain four rows.
- `docs/structure.md` and `template/core/docs/structure.md` say a directory index lists direct children; a parent above a directory lists directories, not files.
- `docs/README.md` says it lists direct children and does not repeat a subdirectory's file list.
- `docs/backlog/README.md` and `template/first-use/docs/backlog/README.md` point to `roles.md` for the four states.
- `template/effort/docs/workflow.md` points its summary budget to `{{NORM_SOURCE}}/docs/norm/rules.md` and removes the duplicate acceptance checklist; `template/effort/work-packages/README.md` and `work-packages/README.md` point to the five steps.
- `scripts/check.py` adds `docs/status.md` to the role map, fixes the knowledge path regex, gives docs subdirectory READMEs 6,000/12,000 and work-package summaries 3,750/6,000, applies the 40-row directory-index limit (60 for backlog indexes), and checks the first-use backlog status.
- `AGENTS.md` invariant 4 says entries are table rows; the change surface includes `docs/norm/roles.md` and `docs/norm/foundations.md`.
- The target checker remains `B-0002`; these checks are local to this repository. `B-0002` records the portable check set, including the status role and the directory-index entry limit.
- N = 0: no applied repository stops complying. The generated shape is unchanged; the table now matches it.
