# B-0010 — The routing-table entry limit is unenforced

## Problem

`docs/norm/rules.md` budgets the root `AGENTS.md` routing table at 12 rows. This repository's table has 13, and `bun run gate` passes. `scripts/check.ts` has no `AGENTS.md` entry in `ENTRY_LIMITS`, and `table_entries()` assumes one table per file: adding the key alone would count the change-surface table and the command table as routing rows. A strong rule with no command is the exact defect P4 names.

## Evidence

- `AGENTS.md` has 13 routing rows: six of them are one per norm page.
- `template/core/AGENTS.md` has 8 routing rows, so the template is inside the limit and the source repository is not.
- `ENTRY_LIMITS` lists `docs/README.md`, `docs/decisions/README.md`, `docs/backlog/README.md`, and `template/README.md`; `AGENTS.md` is absent.
- The `template/AGENTS.md` command table and routing table are separate, so a file-wide row count cannot express the rule.

## Minimal fix

Compress the six norm-page rows into one `docs/norm/` row; the norm index already lists its pages, and a routing table that enumerates a directory's files is a second index. That leaves 8 rows and room for one more role. Then add a section-scoped counter to `scripts/check.ts` that finds the routing section and counts its rows, and set the limit to 12.

## Revisit when

The next change to `AGENTS.md`, or the first portable checker (`B-0002`). The compression is a prerequisite for adding a `work-packages/README.md` routing row without breaking the budget.

## Outcome

Closed 2026-11-22: the routing table is 8 rows, and `scripts/check.ts` reports `budget.routing_rows` above 12 and `budget.routing_heading` when the section is missing; `docs/norm/rules.md` R4b names the routing table. Gate green, 113 tests.
