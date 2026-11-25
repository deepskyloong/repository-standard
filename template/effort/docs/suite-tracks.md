# Suite tracks

Each workflow suite this repository runs writes into roots it owns and loads by name. This page records that shape per suite; `docs/adapters.md` carries the tolerance and the disposition, and `{{NORM_SOURCE}}/docs/norm/roles.md`, "Suite tracks", carries the rule.

## Tracks

| Track | Roots | What reads it | Artifacts |
| --- | --- | --- | --- |
| `<suite>` | `<root>` | `<skills that load the path>` | `<files the suite writes>` |

## Rules layered on a suite default

A suite's own layout and content form are recorded, never changed. When this repository layers a rule on top of a suite default — a naming rule, a scoping rule, a closeout name — it is named in the track's section, and the lever is the rule or the suite's own configuration key, never a file move.

## Adding a track

Add a section when the suite first writes here, or when its output root is configured ahead of the first run. That same change adds the registry row in `docs/adapters.md`, which owns the whitelist and the disposition.
