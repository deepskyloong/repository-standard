# Adapters

Third-party suites that own directories in this repository, legacy paths that cannot move yet, and moved paths with a successor. This is a registry, not a directory layer. The per-suite artifact shape lives in `docs/suite-tracks.md`; this page carries the tolerance and the disposition.

## Registry

| Kind | Suite / path | Path | What reads it | Whitelist | Disposition |
| --- | --- | --- | --- | --- | --- |
| suite track | `<suite>` | `<root>` | `<consumer>` | `<allowed files>` | leave; suite-owned while installed |
| legacy path | `<reason>` | `<path>` | `<consumer>` | `<allowed files>` | retire when the last consumer is gone |
| moved path | `<reason>` | `<old path>` | `<successor>`; the records that cite the old path | nothing on disk | delete the row when the last citing record is deleted |

## Rules

1. A suite writes where it writes. Do not make the repository bend so one tool can keep its habit.
2. A suite track is permanent while the suite is installed. Its file layout and content form belong to the suite; do not relocate, merge, or normalize it. A closed package stays in its track; it is not folded into `work-packages/<slug>/`.
3. A legacy path is a repository path that cannot move because a frozen record cites it. Its closeout route is one of: move into the canonical role; mark generated and leave; delete after the last consumer disappears.
4. A moved path keeps no file at the old path: the row names the successor, the old path stops existing, and the successor's provenance row is what a search for the old path lands on (ADR-0028).
5. The whitelist names exactly which files or directories are tolerated. Everything else under that path is a finding.
6. A legacy path is removed only when its last consumer is gone, proven by `rg -l '<path>'`.
7. A row is removed when the suite is uninstalled, the legacy path retires, or the last record citing a moved path is deleted. A row that stays after that is a stale exception.

## When to add a row

- A suite writes into the repository at a path the standard does not own.
- A migration cannot move a path because a frozen record cites it.
- A migration moved a path that a frozen record cites.
- A tool cannot follow a symlink or a junction.

If none of them holds, do not add a row. An adapter registry with one entry is cheap; with ten, it is a second undocumented layout.
