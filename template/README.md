# Template

Copyable starting points for a repository that adopts the standard. Read `docs/norm/roles.md` first: the template is a consequence of the roles, and copying it without them produces files nobody can place later.

## Copy order

1. `core/` → repository root. Copy the hidden files `.editorconfig`, `.gitattributes`, and `.githooks/` with the rest; they carry cross-editor defaults and the optional commit check. If you want that check, run `git config core.hooksPath .githooks` after copying; it rejects a hard-wrapped body while no `Body width:` is recorded. Replace the values in the table below, except the command values, which the overlay decides.
2. `overlays/<language>/` → copy every file except the overlay's `README.md` to the repository root, including `.github/workflows/gate.yml`. Set the gate command in `README.md` and `AGENTS.md`, install dependencies, run the gate until green.
3. `first-use/` → only when the first ADR, the first backlog item, or the first shared term appears. Copy the matching piece only; its `docs/README.md` is a merge fragment, not a replacement. Rename the copied ADR or backlog item to its slug, and replace its title and its index row.
4. `effort/` → only when the first work package starts. Copy `docs/workflow.md` into the existing `docs/`; copy `docs/adapters.md` and `docs/suite-tracks.md` only when their role triggers fire; append only the rows for pages actually copied. Never overwrite `docs/README.md`. Copy the template's `work-packages/README.md` to the target's `work-packages/README.md`; create the first package from `spec.md`, `plan.md`, and `board.md` in `template/effort/work-packages/`; copy `items/W01.md` to `items/<ID>.md` when the first work item starts, and `summary.md` only at closeout; `items/README.md` is the template's note, not a package file.

Do not copy all four at day one. Each segment has a trigger, and copying it early creates exactly the empty structure the standard forbids.

## Values to replace

| Value | Where it appears | Set when |
| --- | --- | --- |
| `<project-name>` | `README.md`, `AGENTS.md`, overlay files, `GLOSSARY.md` (first-use copy) | Step 1 |
| `<one-line purpose>` | `AGENTS.md`, `docs/charter.md` | Step 1 |
| `<one-line purpose and audience>` | `README.md` | Step 1 |
| `<owner>` | `docs/charter.md` | Step 1 |
| `<path or URL>` | The `Norm source:` line in `AGENTS.md` | Step 1 |
| `<YYYY-MM-DD>` | `Last read` in `docs/conventions.md` and `docs/committing.md`; `Status` in the first ADR; dates in the board and summary (first-use / effort copies) | Step 1, the forge date; Step 3, when the first ADR is written; Step 4, when those package files are written |
| `<language>` | `AGENTS.md` | Step 2, once the overlay is chosen |
| `<install-command>` | `README.md`, `AGENTS.md` | Step 2, from the overlay README |
| `<gate-command>` | `README.md`, `AGENTS.md` | Step 2, after the overlay README states it |
| `<focused-test-command>` | `AGENTS.md` | Step 2, when the overlay defines one |
| `<suite name>` | `track` in `work-packages/spec.md` | Step 4, when the first package is written |
| `<angle-bracket prompt>` inside a file copied from `first-use/` or `effort/` | The fill-in prompts of the first ADR (its title and index cell share one), the board, an item, `summary.md`, and any optional page copied from `effort/` | Step 3 or Step 4, when that file is first written; a prompt left in place is a failure |

`<repo-path>` does not appear in `core/`; it exists only in pointers a later migration generates.

## Notation that survives

These are grammar, not values. Replacing them would break the rule that uses them.

| Token | Meaning |
| --- | --- |
| `<nnnn>` | Backlog number, four digits |
| `<slug>` | Work package slug |
| `<topic>` | Contract, operation, or knowledge topic |
| `<member>` | Workspace member name |
| `<command>` | Command named in a generated header |
| `<type>` | Commit type |
| `<scope>` | Commit scope |
| `{{NORM_SOURCE}}` | The norm source; resolved from the `Norm source:` line in `AGENTS.md`, never replaced |
| `<test-path>` | Path to one test file |
| `<what changed and why>` | Commit summary |
| `<overlay files>` | Tree placeholder for the chosen overlay |
| `<any constraint that would make a reviewer say "you cannot do that">` | Charter prompt |

A value left unreplaced is a failure; a notation left in place is correct. `{{NORM_SOURCE}}` is the one token a generated repository keeps and resolves from its `Norm source:` line. `scripts/check.ts` does not test this distinction; grep for `<` and `{{` in the copied repository and classify each hit against the two tables.

## What not to copy

- Do not copy `AGENTS.md` routing rows for pages that do not exist. The template marks optional pages with "(when present)"; delete the row when the page is absent.
- Do not copy optional roles. `docs/contracts/`, `docs/operations/`, `docs/toolchain/`, `docs/knowledge/`, `docs/suite-tracks.md`, and `docs/adapters.md` appear when their trigger does.
- Do not copy the package files (`spec.md`, `plan.md`, `board.md`, `summary.md`, `items/`) into `work-packages/` root; they are the first package's files, not the governance index.
- Do not copy the source repository's root `.githooks/commit-msg` wrapper; `core/.githooks/commit-msg` is the full script a target needs.
- Do not copy a budget number without its unit and its command.
- Do not copy the norm pages themselves into a repository. A repository carries its own charter, structure, and conventions, which point back when they need the rationale.
