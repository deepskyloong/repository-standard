# Overlays

The core is language-agnostic. Everything a language decides lives in one overlay, activated by choosing exactly one. An overlay ships **files, not code blocks**: after copying it and installing dependencies, the repository reaches a green gate without transcription.

## What every overlay must supply

| Contract | What the overlay answers |
| --- | --- |
| C1 gate | One local command that runs format, lint, typecheck, test, and build in that order, then the document stages the overlay ships; the only command a commit message may cite |
| C2 CI forwarding | A workflow file (`.github/workflows/gate.yml`) calls the same gate with the same options; CI adds no rule the local gate does not enforce |
| C3 Code layout and boundaries | Where source, tests, and fixtures live; which imports cross which boundary; what the single-package form looks like |
| C4 Dependency and lockfile policy | The package manager, the lockfile, the frozen-install command, the rule for adding or upgrading a dependency |
| C5 Artifact tiers | What is authoritative, regenerable, and runtime; what is committed |
| C6 Language writing rules | Naming, error handling, logging, output shape; only rules that diverge from the language's default |
| C7 Toolchain traps | Reproducible failure modes only, each with the command that shows the failure. Not preferences, not style opinions |
| C8 Upgrade path | How the overlay itself moves to the next toolchain version; what must be re-run |

An overlay that states a core rule is a bug. An overlay that omits a contract is incomplete.

## TypeScript

| Contract | Default |
| --- | --- |
| Runtime and package manager | `bun`; no `npm`, no `pnpm`, no `yarn` |
| C1 gate | `bun run gate` = format check → `oxlint` → `tsc --noEmit` → `bun test` → build → `bun tools/check-messages.ts` |
| C2 CI | `.github/workflows/gate.yml`: `bun install --frozen-lockfile` then the same gate command; the lockfile is committed before CI runs |
| C3 layout | `src/<module>/` per package; `packages/*` for libraries, `apps/*` for entry points; single-package form is root `src/` |
| C4 dependencies | `bun.lock`; `bun add` / `bun remove`; no caret ranges for internal packages, workspace protocol instead |
| C5 tiers | `src/` authoritative, `dist/` regenerable, `.turbo` / caches runtime |
| C6 writing | ESM only; no default exports for modules with more than one symbol; errors as values at boundaries, thrown only at the top; messages as a coded record, never a composed string |
| C7 traps | `bun run` does not run a `check` script the way `npm` does; `tsc` path aliases need a matching `tsconfig` per package; CRLF breaks shebangs |
| C8 upgrade | Bump the toolchain in `package.json`, regenerate the lockfile, run the gate, record the trap if one appears |

## Python

| Contract | Default |
| --- | --- |
| Runtime and package manager | `uv`; Python version pinned in `.python-version` |
| C1 gate | `uv run python tools/gate.py` = `ruff format --check` → `ruff check` → `pyright` (when installed) → `pytest` → build (when a `[build-system]` exists) → `tools/check_tables.py` (R12) → `tools/check_messages.py` |
| C2 CI | `.github/workflows/gate.yml`: `uv sync --frozen` then the same gate command; the lockfile is committed before CI runs |
| C3 layout | `src/<package>/`; tests in `tests/`; workspace members under `packages/*`, each with its own `pyproject.toml` |
| C4 dependencies | `uv.lock`; `uv add` / `uv remove`; no unpinned direct dependencies in a library |
| C5 tiers | `src/` authoritative, `dist/` regenerable, `.venv/` and `__pycache__/` runtime |
| C6 writing | Type hints on public functions; no mutable default arguments; dataclasses over dicts at boundaries; output through one formatting helper; messages as a coded record, never a composed string |
| C7 traps | `uv run` inside a member uses the workspace lock; a stale `.venv` shadows the resolved interpreter; `-w` word counts fail on CJK |
| C8 upgrade | Bump `.python-version`, `uv sync`, run the gate, record the trap if one appears |

## Compatibility mechanisms

When a foreign tool cannot accept the standard's paths, pick one mechanism and record it in `docs/adapters.md`.

| Mechanism | Solves | Cost |
| --- | --- | --- |
| Entry-point script | A tool needs a command at a fixed path | One small file; must stay executable |
| Wrapper command | A tool's output path is configurable only through its CLI | A line in the tool's config; another thing to remember |
| Path constant | Code needs to agree on a location | A single exported constant; import discipline |
| Copy, do not link | A tool cannot follow a symlink or a junction | Two copies; one must be marked generated |
| Ignore and register | The path is not worth moving | A row in the adapter registry; the path stays foreign |

The last mechanism is the default. Moving a foreign tool's output costs more than one registry row, and the registry is the place where the exception is visible.
