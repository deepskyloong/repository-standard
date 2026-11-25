# ADR-0024 — The document checker is TypeScript, split by responsibility, and tested

Status: Accepted (2026-11-19). Superseded in part by [ADR-0028](ADR-0028-a-moved-path-is-a-row.md) (2026-11-19); the TypeScript checker split and test rule still hold.

## Context

`scripts/check.py` was the last Python subject in a Bun repository. Two gate stages existed only to lint it (`uvx ruff format --check scripts`, `uvx ruff check scripts`), so the gate ran two language toolchains to check one language's tree, and `uv` could not leave either way: the prose stage runs `md-tools` out of the python-toolkit checkout named by `MD_TOOLS_PROJECT`, which stays Python.

The checker also had no seam for a test. Its measurement helpers — `volume`, `table_entries`, `split_cells`, `tombstone_state` — were exercised only by whatever the real tree happened to contain, and every markdown file was read five or six times across the checks. `B-0010` wants a section-scoped row counter and `B-0002` wants twelve candidate rules; both would land on helpers that no test can call directly.

`B-0002` already chose overlay-native checkers: a TypeScript repository must not need Python, and a Python repository must not need Bun. A Bun repository holding its checker in Python contradicted that decision in the one repository that states it.

The port itself made the case for tests. The first TypeScript version inverted the delimiter filter in `volume()`, which dropped every non-table line: a soft breach on `docs/norm/roles.md` disappeared and the gate stayed green. A differential run against the Python file caught it; nothing else would have, because a checker that under-reports looks exactly like a checker that finds nothing.

## Decision

The gate's document stage is three TypeScript modules with a test beside the rules.

- `scripts/docs-model.ts` measures: line splitting, stripping, volume, entries, cell splitting, tombstone shape, the budget tables, and the naming and role patterns. No filesystem, no process — every function is directly testable.
- `scripts/doc-checks.ts` holds one function per rule over a `Context`, which walks the repository once and caches text and listings. Each check returns findings; none writes to shared state or exits.
- `scripts/check.ts` reports: it builds the context at the repository root, orders the findings, prints `WARN`, `FAIL`, or `PASS`, and returns the exit code.
- `bun test scripts` is a gate stage, and the tests are the contract: one case per rule, seeded into a temporary repository.
- Ruff leaves with its subject. `ruff.toml` goes with it, and `uvx` no longer appears in `package.json`.
- `uv` and `MD_TOOLS_PROJECT` stay, because the prose rule's only implementation is `md-tools`.
- Records written before this decision — `docs/decisions/`, `work-packages/` — keep naming `scripts/check.py`. They cite the path that existed when the decision was made; live pages are repointed.

Python's `\b` and `\d` are Unicode-aware and JavaScript's are ASCII. R8 keeps repository markdown free of CJK, so the difference is unreachable here; a non-CJK non-ASCII page would be the first place to look if a count finding ever moves.

## Options considered

1. Three modules with a test per rule, `bun test` as a gate stage — chosen. It gives the pure functions a caller that is not the real tree, and it stops the five reads per file.
2. Keep Python and pin the ruff version — rejected: it pins drift without removing it, leaves two runtimes in a repository whose overlay contract says one, and puts the only test seam behind `pytest` in a repository with no other Python.
3. A single-file TypeScript port — rejected: the port is verifiable, but `volume` and `split_cells` would stay reachable only through the repository, which is the state this ADR is leaving.
4. One module per check, seventeen files — rejected: every check imports the same helpers, and no reader opens a check in isolation. The split follows responsibility — measure, check, report — not file count.
5. Copy the checker into `template/` as the portable one — rejected: `B-0002` wants overlay-native copies, and no target repository exists yet to run it against.

## Consequences

- `bun run gate` runs four commands: `bun fmt --check` over code, Prettier over Markdown, `bun test scripts`, and `scripts/check.ts`. The gate's observable contract is unchanged — same finding text, same `WARN`/`FAIL`/`PASS` shape, same exit code.
- CI is untouched: it runs `bun run gate`, and the workflow already installs Python and `uv` for the prose stage.
- `AGENTS.md`'s gate paragraph names the test stage, and its change-surface rows point at `docs-model.ts` for budgets, naming patterns, role patterns, and generated paths.
- `B-0002`'s TypeScript half is now a copy-and-trim of a tested implementation rather than a reimplementation.
- N = 0: no applied unit stops complying. The one behavior that changed is that a file without a trailing newline now splits correctly; the tree has none.
