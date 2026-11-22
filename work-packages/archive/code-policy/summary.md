# Summary — code-policy

**Date:** 2026-11-22

**Acceptance:** met — the standard carries code principles as a norm page and patterns as a chapter, both overlays gate the message record, and this repository's own checker returns coded findings.

**Gate:** `bun run gate` — 2026-11-22, PASS (182 markdown files, 108 tests, 0 fail; two soft volume warnings)

**Criteria:**

- `docs/norm/code.md` and `docs/norm/code/messages.md` exist and are indexed — 2,294 and 8,874 non-whitespace characters; rows in `docs/norm/README.md` and the chapter index
- `DOC_ROLE_PATHS` admits the chapter — `scripts/docs-model.ts`; three chapter pages pass the role check
- `template/core/AGENTS.md` carries the pointer row — routing table, row nine
- Both overlay READMEs name the language expression and ship the stage — `tools/check_messages.py`, `tools/check-messages.ts`; six fixtures produce the same codes and exit status
- `bun run gate` is green — PASS above
- The skill names `docs/norm/code.md` as its source and a command proves agreement — `scripts/check-code-principles-sync.ps1` prints `PASS — 10 items agree`
- `docs/knowledge/cases/finding-catalog-migration.md` exists with no CJK and cites sections by name — 4,443 non-whitespace characters, 0 CJK, links to the two norm pages

## Outcome

- Target: a repository that names the norm source inherits ten code principles at `docs/norm/code.md`, adopts a pattern by condition from the chapter index, and — when it writes a catalog — finds a stage in its overlay that fails a duplicated code and a digit in a template. This repository's gate reports 67 coded findings through one catalog.
- Standard: `ADR-0038` — code principles are in scope; one principles page plus one page per pattern topic; the charter narrowed to exclude business architecture, algorithm choices, and one system's internal design.
- Program: the corpus lives at the standard now, and the kit derives from it; `docs/contracts/findings.md` stays closed until a consumer reads records rather than lines (`B-0002` is that candidate).

## Residuals

- `docs/contracts/findings.md` — kind: deferred work — destination: the trigger named at `docs/norm/code/findings.md`, the first consumer that reads `code`, `level`, or a `params` key
- The kit's two reference guides keep their worked examples — kind: known limitation — destination: each names the norm page as its authority; prose that repeats a page cannot be gated the way code can
- The skills library has no git history — kind: known limitation — destination: accepted because `CHANGELOG.md` records the change and the comparison script fails on drift

## Compromises

- Artifact deferral — the findings JSON contract; destination: the same trigger, recorded on the page and in `B-0002`

## Verification

- Survivors: `work-packages/archive/code-policy/` (this package) and its row in `work-packages/archive/README.md`; `rg -l 'code-policy'` finds no live page outside the archive
- Reproduce: `bun run gate`; `bun test scripts`; `E:\Projects\personal-agent-kit\scripts\check-code-principles-sync.ps1`

Evidence: none — every finding in `items/` is a path or a measured count.
