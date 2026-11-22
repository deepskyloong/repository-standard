# Python overlay

Applies to a repository managed with `uv`. Copy every file in this directory **except this README** to the repository root; replace `<project-name>`; run `uv sync` then `uv run python tools/gate.py`. A fresh copy is green before any real package exists.

## Files

| File | Role |
| --- | --- |
| `pyproject.toml` | Project metadata, dev dependencies, ruff and pytest config |
| `.python-version` | Interpreter pin read by `uv` |
| `.gitignore` | Runtime, regenerable, and cache paths |
| `tools/gate.py` | The gate runner |
| `tools/check_tables.py` | R12's table stage; a repository that registers a frozen legacy path passes `--exempt` |
| `tools/check_messages.py` | The message-catalog stage; a repository that declares no catalog passes |
| `.github/workflows/gate.yml` | CI forwarding: frozen install, then the local gate |
| `src/example_package/__init__.py` | Seed module; rename the directory and replace the code |
| `tests/test_smoke.py` | Seed test; replace or delete |

## Commands

| Action | Command |
| --- | --- |
| Install | `uv sync` |
| Gate | `uv run python tools/gate.py` |
| Focused test | `uv run pytest <test-path> -q` |

`uv sync` creates `uv.lock`; commit it before the first CI run. The CI job uses `uv sync --frozen` and fails without a committed lockfile.

## C1 — gate

```bash
uv run python tools/gate.py
```

Stages, fail-fast: `ruff format --check` → `ruff check` → `pyright` when installed → `pytest` → `python -m build` when the project has a `[build-system]` → `tools/check_tables.py` (R12) → `tools/check_messages.py`.

The last two stages read the repository rather than the package: the table stage fails a padded table cell, and the message stage fails a catalog whose placeholders and params disagree. A repository that registers a frozen legacy path passes `--exempt <prefix>` to the table stage in `tools/gate.py`.

The gate is a script, not a `[project.scripts]` entry. A workspace root is not an installable package, so `uv run gate` would fail with `Failed to spawn: gate`. The script form works in both a single-package repository and a workspace root.

A commit message cites `uv run python tools/gate.py`, never `pytest` alone.

## C2 — CI

`.github/workflows/gate.yml` runs `uv sync --frozen`, then `uv run python tools/gate.py`. CI adds no stage the local gate does not run. The frozen install needs `uv.lock` committed; a fresh copy becomes CI-ready after the first `uv sync` and a commit that includes the lockfile.

## C3 — layout

- Single package: `src/<package>/`, `tests/` at the root.
- Workspace: `packages/<member>/src/<member>/`, `packages/<member>/tests/`; the root `pyproject.toml` keeps the dev group and the tool config.
- A member imports another member by distribution name, never by relative path.
- `__pycache__/`, `.venv/`, `dist/`, `*.egg-info/` are runtime or regenerable and are not committed.

## C4 — dependencies

`uv add`, `uv add --dev`, `uv remove`; `uv.lock` is committed. CI uses `uv sync --frozen`. A member's dependency added without a lockfile change is a finding.

## C5 — artifact tiers

| Tier | Paths |
| --- | --- |
| Authoritative | `src/`, `tests/`, `tools/`, config files |
| Regenerable | `dist/`, `*.egg-info/` |
| Runtime | `.venv/`, `__pycache__/`, `.pytest_cache/`, `.ruff_cache/` |

## C6 — language rules

- Type hints on public functions; `from __future__ import annotations` at the top of a module with modern syntax.
- No mutable default arguments.
- Dataclasses or typed mappings at boundaries, not bare dicts.
- Output through one formatting helper; no scattered `print` calls in library code.
- One formatter is authoritative: editors call `ruff format`, not a reimplementation.
- A message a human reads is a `NamedTuple` of `code` and `params`; the check returns it, and one renderer turns it into text. An exception carries the same pair.
- Wording lives in one module as `SPECS: dict[Code, Spec]`, where `Spec` is a `NamedTuple` of `template` and `params`. A code is a literal string, never built at run time.
- Every value the sentence names is a field of `params`; a threshold typed into the template is a stale number with a commit date.
- Declare the catalog in `[tool.messages] module`; `tools/check_messages.py` then holds its shape: namespaced codes, placeholders equal to params, one wording per code, no number typed outside a placeholder. A wording that legitimately carries one is listed under `exempt`; export `PARTS` when the catalog is merged, so the stage can prove no code was overwritten.

## C7 — traps

- **A stale `.venv` shadows the resolved interpreter.** `uv sync` recreates it; `uv run --no-sync` does not. When an import works in one member and fails in another, delete `.venv` and sync again.
- **A frozen install needs a committed lockfile.** `uv sync --frozen` fails on a fresh template until `uv.lock` is committed; run `uv sync` once and commit the lockfile.
- **`uv run` inside a member uses the workspace lock.** A member that pins a version the workspace excludes fails only at run time.
- **`pytest` exits 5 when it collects no tests.** The template ships one seed test for this reason; deleting it without replacing it turns the gate red.
- **`python -m build` on a workspace root fails.** The gate runs the build stage only when a `[build-system]` exists; a workspace root normally has none.
- **`wc -w` does not count Chinese.** A 5,891-character Chinese document reports about 1,000 words. Budgets use non-whitespace characters.
- **`ruff target-version` below the runtime hides syntax.** Raise it when ruff supports the interpreter in `.python-version`.
- **The message stage imports the package, so it needs the project environment.** `python tools/check_messages.py` outside `uv run` fails with `ModuleNotFoundError`; the gate calls it with the interpreter `uv` resolved.

Verified 2026-11-14 (for-the-record): uv 0.13.1, Python 3.15.0, ruff 0.17.5, pytest 9.2.0.

## C8 — upgrade

Raise `.python-version`, run `uv sync` to refresh `uv.lock`, run the gate, and record any behavior change as a trap above. When the `uv` version changes, update `version` in `.github/workflows/gate.yml` in the same commit. Raise `target-version` only when the ruff release supports the new interpreter; a config pinned below the runtime hides syntax the runtime accepts.
