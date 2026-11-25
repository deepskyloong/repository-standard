# docs/ — index and governance

## Governance

- **What goes here**: documents whose reader is a maintainer of this project. A document whose reader is a user belongs in the root `README.md`.
- **What does not go here**: generated files, toolchain configuration (it lives beside the code it configures), or a copy of a value owned elsewhere.
- **Structure**: each topic gets its own file. A new subdirectory gets its own `README.md` before it gets a second file. The index lists direct children in one row each and does not repeat a subdirectory's file list.
- **Naming**: follows `conventions.md`; this page does not restate the naming rules.
- **Optional roles**: `contracts/`, `architecture/`, `operations/`, `toolchain/`, `knowledge/`, `suite-tracks.md`, `status.md`, and `adapters.md` appear when their trigger does. Their absence is correct.

## Index

| Child | Content |
| --- | --- |
| [charter.md](charter.md) | Scope, non-goals, constraints, success criteria |
| [structure.md](structure.md) | Levels, placement rules, artifact tiers |
| [conventions.md](conventions.md) | Language, naming, citation, five discriminations, agent-facing instruction form |
| [committing.md](committing.md) | A base pointer to the committing norm plus this repository's deviations |
