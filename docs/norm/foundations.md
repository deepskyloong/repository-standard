# Foundations

## What the standard is

A repository standard is not a directory template. It is a set of **roles** — one kind of document, one home, one admission rule, one exit rule, one authority range — plus the rules that keep the roles from duplicating each other. The tree is a consequence of the roles; copying the tree without the roles produces files nobody can place six months later.

This repository is also the norm source for repositories that already exist: a general norm — language, naming, citation, commit messages, document discipline, budgets — is written here once, and a target page points at it (`Base: {{NORM_SOURCE}}/docs/conventions.md`) instead of carrying a copy. The template supplies a new repository's shape; the norm source supplies the rules every repository that names it follows.

The standard is language-agnostic in its core and language-specific in its overlays. It is written for a repository that lives for years and is maintained by one person, alone or with agents.

This repository keeps no changelog: `git log` is it, and the decisions hold the reasoning. The standard is never published as a package; it is consumed by copying, so backward compatibility is a courtesy rather than a constraint, and a breaking change states the migration step in the same commit. There is no version number either: a repository records where it read the standard — the `Norm source:` line in `AGENTS.md`, and a `Last read` marker on each page it points at.

## Seven principles

**P1 — One role, one home.** A fact that a reader may rely on has exactly one authoritative location. Every other mention is a link or a regenerated copy with a header saying so. Two homes for one rule is the failure mode this standard exists to prevent.

**P2 — Least per-turn tax.** Only `AGENTS.md` is loaded on every turn. Everything else is read on demand, through a routing table. A rule that costs context on every turn must be a red line, a gate, or a pointer — not an explanation. A red line is a pointer summary of its home rule: it may compress the statement for per-turn load, but it does not become a second home. When the two drift, the norm wins.

**P3 — Index autonomy.** Index files state membership, not totals. No "currently 18 documents", no "12 ADRs". The count goes stale and the structure block that carries it rots with it. Each directory's README lists its own children; a parent above a directory lists directories, not files. A structure page that lists files is a second index, not structure.

**P4 — A rule without enforcement is a slogan.** Every rule declares its strength: `strong` (a command or the gate fails), `weak` (a review criterion, checked by a person or an agent), `none` (a recommendation, explicitly labeled). Do not dress a `none` as a `strong`.

**P5 — Structure over convention.** A path beats a promise. If a document must exist, it has a home; if it has no home, it does not exist and nobody will maintain it. "Please remember to write an ADR" is not a structure.

**P6 — One authority, many pointers.** A general norm is written once at its source; a consumer points at it and records only deviations, never a copied restatement. Template and skill are derivatives of the norm for the same reason: when they drift, the norm wins; when the norm is wrong, the norm changes first and the derivative follows in the same or the next commit.

**P7 — Design against use.** A design is not proved by its schema. A field, section, or step earns its place only when it changes a decision or answers "where did I leave off"; a structure that only restates another home is ceremony. Question the brief itself, not only the values it asks for: a complete-looking schema can be the wrong shape. Test the design on a live package rather than a hypothetical one; a template that has never carried a package is a proposal, a rule that has never been applied is a guess. Refine until the live use is shorter and clearer than the design it replaced; that is the practical design, not the one that reads best on paper. P7 is a review criterion (`weak`): the gate can test a projection, not whether a field changes a decision.

## Lineage

The model has industry names, one per face: **single source of truth** for the authority, **incorporation by reference** and **normative reference** for the pointer, **base and overlay** for the layering, **profile** for a local adaptation of a base specification, and **shared kernel** for the part several consumers depend on together. The anti-patterns are named too: **vendoring** copies the dependency into the consumer, and a **fork** diverges from the source. This repository says **norm source** for the role and **base pointer plus deviations** for the consumer page.

Two obligations follow from those names: a pointer must be reasonably available to its consumer, and a shared kernel's changes are announced. A private path meets the first on one machine; the second has no mechanism today, and `Last read` is only a provenance marker.

## Four layers

| Layer | Contains | Rule |
| --- | --- | --- |
| `core` | Language-agnostic roles, rules, flow, budgets | Every repository has it. No exceptions. |
| `overlay` | Toolchain, gate command, code layout, dependency policy, writing rules for one language | Exactly one overlay is active. Two overlays in one repository is a monorepo with two languages, which is a special case, not the default. |
| `adapter` | A registry of third-party suite tracks that own their directories, legacy paths that cannot move yet, moved paths with their successor, plus a compatibility whitelist | Never a physical directory. It is a table in `docs/adapters.md`. |
| `optional` | Roles that appear only under a trigger: `docs/contracts/`, `docs/architecture/`, `docs/operations/`, `docs/toolchain/`, `docs/knowledge/`, `docs/suite-tracks.md`, `docs/status.md`, module-level `AGENTS.md` | Absent by default. An absent optional role is correct, not incomplete. |

The distinction between `adapter` and `optional` matters. `optional` is a role you may add; `adapter` is a foreign system you cannot move and must therefore register.

## Canonical tree

```text
<repo>/
├── README.md                  # storefront
├── AGENTS.md                  # instruction layer: red lines, gate, routing
├── GLOSSARY.md                # vocabulary (when shared terms exist)
├── GLOSSARY-MAP.md            # vocabulary map (when member vocabularies exist)
├── docs/
│   ├── README.md              # index + governance of the docs tree
│   ├── charter.md             # scope, non-goals
│   ├── structure.md           # layout, placement rules, artifact tiers
│   ├── conventions.md         # language, naming, citation, discriminations, instruction form
│   ├── committing.md          # commit norm pointer and deviations
│   ├── status.md              # current phase, what works, next action (optional)
│   ├── suite-tracks.md        # suite-owned roots and artifact shape (optional)
│   ├── adapters.md            # adapter registry (when its trigger fires)
│   ├── contracts/             # durable contracts (optional)
│   ├── architecture/          # system organization (optional)
│   ├── operations/            # runbooks (optional)
│   ├── decisions/             # ADRs (from the first real decision)
│   ├── backlog/               # B-<nnnn> items (from the first deferred item)
│   ├── toolchain/             # reproducible traps only (optional)
│   └── knowledge/             # guides / cases / notes (optional)
├── work-packages/
│   ├── README.md              # work package governance + index
│   └── <slug>/                # spec.md, plan.md, board.md, summary.md; items/<ID>.md
├── src/                       # source, single-package form
├── tests/                     # tests, single-package form
└── <overlay files>            # package.json, pyproject.toml, gate config
```

A monorepo replaces `src/` and `tests/` with `apps/` and `packages/`, each member carrying its own `README.md`, `src/`, `tests/`, `AGENTS.md` (when it earns one), and docs. The root keeps only the entry files (`README.md`, `AGENTS.md`), the shared vocabulary (`GLOSSARY.md`, and `GLOSSARY-MAP.md` when member vocabularies exist), plus `docs/` and `work-packages/`.

The tree is the role set, not a snapshot. Optional roles appear only when their trigger does, and each directory's `README.md` lists its current children.

## Single-package degeneration

A repository with one package must not fake a monorepo. Apply all four:

1. Remove `apps/` and `packages/`; `src/` and `tests/` sit at the root.
2. Remove member-level `README.md`, `AGENTS.md`, and `docs/`; the root files absorb them.
3. Keep the root `docs/` roles unchanged. The degeneration removes a level, not a role.
4. The overlay's code-boundary rules survive; the member boundary rules do not apply.

Degeneration is a form of the standard, not an exception to it. A repository that is one package today and three members tomorrow promotes by adding the level back; it does not rewrite the roles.

## When a role is admitted

A role enters a repository only when all five hold:

1. A real document needs it — not a hypothetical future one.
2. Its home is chosen and does not collide with an existing role.
3. Its admission rule is written: what may be filed there.
4. Its exit rule is written: what happens when it stops being true.
5. Its budget is stated with a unit and a command.

If any of the five is missing, the role does not exist yet. Write it down in `docs/backlog/` instead, with the trigger that would admit it.
