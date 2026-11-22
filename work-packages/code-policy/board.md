# Board

## Current state

- Updated: 2026-11-22
- Status: open
- Phase: P2 — Enforcement
- Gate: all green (2026-11-22; two soft standard warnings)
- Next: W05 — return coded findings from this repository's checker
- Last done: W04 — both overlays express the record and gate its catalog
- Blocked: none
- Open decisions: whether `docs/contracts/findings.md` is admitted with W05's coded checker or waits for the portable checker (maintainer)

## Repositories

| Repository | Branch | Gate command | Last result |
| --- | --- | --- | --- |
| repository-standard | `feature/code-policy` | `bun run gate` | PASS 2026-11-22 (178 markdown files, 90 tests, 0 fail; two soft warnings (`flow.md`, `roles.md`)) |

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
| [W05](items/W05.md) | Return coded findings from this repository's checker | todo |

### P3 — Downstream

| Item | Title | Status |
| --- | --- | --- |
| [W06](items/W06.md) | Admit the findings topic and decide its contract | todo |
| [W07](items/W07.md) | Derive the skill from the norm | todo |
| [W08](items/W08.md) | Record the migration as a case | todo |
