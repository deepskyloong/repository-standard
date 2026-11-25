# Effort template

The lifecycle segment is added when the first work package starts; the optional role pages in its `docs/` fragment wait for their own triggers. Apply the two segments to the target repository root:

- `docs/*` → copy `workflow.md` with the first work package and any optional page whose role trigger has fired into the existing `docs/`; append only their rows from `docs/README.md` to the existing index. Keep the core page's governance section.
- `work-packages/` → create `work-packages/` at the root and copy `work-packages/README.md` to it. Copy `spec.md`, `plan.md`, and `board.md` into the first `work-packages/<slug>/`; copy `items/W01.md` to `items/<ID>.md` when the first work item starts, and `summary.md` only at closeout. `items/README.md` is the template's note, not a package file.

Do not copy this `README.md`, and do not copy `docs/README.md` over the existing one. The existing `docs/README.md` is the repository's index; this one is a merge fragment.

## What arrives

| File | Role | When |
| --- | --- | --- |
| `docs/workflow.md` | The lifecycle norm's base pointer, plus this repository's deviations | The first work package |
| `docs/suite-tracks.md` | Each installed suite's roots, artifact shape, and the rules layered on its defaults | The Suite tracks role trigger |
| `docs/adapters.md` | Suite tracks, legacy paths, and moved paths, as a registry | The Adapter registry role trigger |
| `work-packages/README.md` | Work package governance, the open table, and the archive pointer | The first work package |
| `work-packages/spec.md`, `plan.md`, `board.md` | The package files; copy into the first `work-packages/<slug>/` | The first work package |
| `work-packages/items/W01.md` | The item template; copy to `items/<ID>.md` | The first work item |
| `work-packages/summary.md` | The closeout summary; copy only at closeout | Closeout |

The package files are not roles. `spec.md`, `plan.md`, and `board.md` become the first package's ledger; `items/W01.md` becomes `items/<ID>.md`; `summary.md` is copied only at closeout.

A package may also carry evidence directories it creates — a report, an inventory, or a reproduction script. `summary.md` names each one, and closeout archives it with the package. Do not create an empty one.

At the first closeout, `work-packages/archive/` appears with its README; do not create it at first use.

Do not add this before the first work package. An empty `work-packages/` table trains readers to ignore it.
