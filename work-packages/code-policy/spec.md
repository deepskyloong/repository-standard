# code-policy

- **Goal**: The standard admits code principles as a norm page and code patterns as a norm chapter, so a repository that names the norm source is bound by the principles and adopts a pattern when its condition holds, and the agent-facing copies derive from the norm instead of being maintained in parallel.
- **Non-goal**: This package does not move the kit's skill-production guides (`skill-readme-guide.md`, `skill-script-testing-guide.md`, `skill-data-placement-guide.md`, `skill-changelog-guide.md`), and it writes no pattern that no repository needs yet. It does not choose a language's mechanism: that stays in the overlay's C6, and the norm page states only what is language-agnostic.
- **Acceptance**: `docs/norm/code.md` and `docs/norm/code/messages.md` exist and are indexed; `DOC_ROLE_PATHS` admits the chapter; `template/core/AGENTS.md` carries the pointer row; both overlay READMEs name the language expression and ship a stage that fails a duplicated code and a digit in a template; `bun run gate` is green; the `coding-principles` skill names `docs/norm/code.md` as its source, and a command proves its quoted block agrees with the page; `docs/knowledge/cases/finding-catalog-migration.md` exists with no CJK and cites sections by name.
- **track**: default

## Context

The maintainer's repositories share one base, and code principles were the half with no home: the overlays answer a language's toolchain, and `docs/norm/` answered documents only. Three code-prose documents in `personal-agent-kit/references/`, one case in its `experience/`, and two rule files under its `rules/` were the corpus offered. `docs/charter.md` excluded module design, so the scope changes first, in `ADR-0038`. One page cannot hold the corpus: the decoupling guide measures 12,601 non-whitespace characters against the 10,000 soft line, and the plan is one page per pattern topic.
