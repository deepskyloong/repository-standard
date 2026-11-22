# Board

## Current state

- Updated: 2026-11-22
- Status: open
- Phase: P3 — Downstream
- Gate: all green (2026-11-22; 108 tests, two soft standard warnings)
- Next: W07 — the kit derives from the norm
- Last done: W06 — the findings topic is admitted, the contract deferred
- Blocked: none
- Open decisions: none

## Repositories

| Repository | Branch | Gate command | Last result |
| --- | --- | --- | --- |
| repository-standard | `feature/code-policy` | `bun run gate` | PASS 2026-11-22 (179 markdown files, 108 tests, 0 fail; two soft warnings (`flow.md`, `roles.md`)) |

## Work items

### P0 — Decision

| Item | Title | Status |
| --- | --- | --- |
| [W01](items/W01.md) | Accept `ADR-0038` and narrow the charter | done |

### P1 — Norm pages

| Item | Title | Status |
| --- | --- | --- |
| [W02](items/W02.md) | Write the principles page | done |
| [W03](items/W03.md) | Open the code chapter with `messages` | done |

### P2 — Enforcement

| Item | Title | Status |
| --- | --- | --- |
| [W04](items/W04.md) | Express the pattern in both overlays and gate it | done |
| [W05](items/W05.md) | Return coded findings from this repository's checker | done |

### P3 — Downstream

| Item | Title | Status |
| --- | --- | --- |
| [W06](items/W06.md) | Admit the findings topic and decide its contract | done |
| [W07](items/W07.md) | Derive the skill from the norm | todo |
| [W08](items/W08.md) | Record the migration as a case | todo |
