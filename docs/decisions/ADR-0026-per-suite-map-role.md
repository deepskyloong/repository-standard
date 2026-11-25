# ADR-0026 — The per-suite map is a role, not the adapter registry

Status: Accepted (2026-11-19). Superseded in part by [ADR-0028](ADR-0028-a-moved-path-is-a-row.md) (2026-11-19); the Suite tracks role still holds.

## Context

ADR-0010 made suite tracks permanent adapters and recorded in its Consequences that `docs/development-workflows.md` remains the per-suite map while the registry carries the disposition. `docs/norm/roles.md` never admitted that page: the Adapter registry row names roots, the whitelist and the disposition, and the Operating modes row's "tracks" is the field a work package records in its `spec.md` — `docs/norm/flow.md` says the track is never a directory root. The standard therefore required a page it gave no home, and `template/effort/docs/adapters.md` states the boundary deliberately: "This is a registry, not a directory layer."

The one sample is oshi's `docs/development-workflows.md`, 16,611 non-whitespace on 2026-11-19 (HEAD `9c27e08`), over the 16,000 hard line. It serves three jobs: each suite's roots and artifact shape, the boundary between repository-owned and suite-owned paths, and the isolated-checkout procedure. Four closed packages cite it, so the path cannot simply disappear.

## Decision

Admit one optional role, **Suite tracks**, at `/docs/suite-tracks.md`. Its admission is each installed workflow suite's owned roots and the artifact shape it writes at them, including the repository rules layered on the suite's defaults; the suite's own layout and content form are recorded, never changed. Exit: entry removed when the suite is uninstalled. Authority: binds which root a suite writes and what shape its artifacts take; a rule layered on a suite default is recorded here. Trigger: a third-party suite writes into a repository path the repository does not own.

The adapter registry keeps the roots, the whitelist and the disposition; the map keeps the shape. A boundary test separates them: is it the tolerated files and their closeout (registry), or the artifact shape the suite loads by name (map)?

## Options considered

1. **Fold the map into `docs/adapters.md`.** Rejected: the merged page serves two readers and lands near 13,500 against a 16,000 hard line; and it requires deleting "a registry, not a directory layer", a boundary the template states on purpose. A tolerant row would then carry the suite's own layout, which is the failure ADR-0010 separated.
2. **Assign the map to Operating modes (`/docs/workflow.md`).** Rejected: that role's "tracks" is the spec field, and `docs/norm/flow.md` says the track is never a directory root; the lifecycle plus four layouts exceeds the 16,000 hard line; and a root map inside a lifecycle page invites exactly the confusion the field rule prevents.
3. **Leave the page unregistered and file the gap in the backlog.** Rejected: the page is live with readers and closed-package citations. A legacy path is for a frozen record, and a backlog item cannot place a live page.
4. **Admit a new role.** Chosen.

## Consequences

- `docs/norm/roles.md` gains the row and the Suite tracks / Adapter registry boundary pair; `docs/norm/flow.md` "Adapter closeout" says which page carries the shape.
- `template/effort/docs/suite-tracks.md` is the starting point, its merge fragment lists it, and `template/effort/docs/adapters.md` points at it.
- `scripts/docs-model.ts` admits the path and a checker test covers it; `docs/workflow.md` "Mapping table" gains the source pattern.
- The skill needs no edit: forge copies `template/effort/` as a unit and migrate derives the page set from `docs/norm/roles.md`, so no mode enumerates role pages.
- This is a first application with one sample. A second repository keeping a per-suite map is the evidence that confirms the role; if the next two migrations produce none, review whether the row should fold back into the registry instead of keeping a page for one repository.
- Oshi's `docs/development-workflows.md` splits into the map, a `docs/structure.md` boundary section and a knowledge guide; the old path becomes a tombstone, and the four closed-package citations resolve through it.
