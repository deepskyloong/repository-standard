# Rules, budgets, retirement

## Scope and strength

This table covers cross-role rules. The steps in `flow.md` and the migrate mode of `workflow.md` are review criteria — `weak` — unless a row below marks them `strong`. `strong` means a command fails. `weak` means a person or an agent must check it and say so. `none` means a recommendation, labeled as such. A rule presented as strong but enforced by nothing is the defect this table prevents.

A rule earns a row only when it cuts across roles. A constraint on one artifact's shape — such as how a work item's done-when criteria are written — belongs in the page that owns that artifact (`flow.md`, "Work items"), not here. This table is a cross-role register, not a home for every review note.

## Rules

| # | Rule | Strength | Enforcement |
| --- | --- | --- | --- |
| R1 | One fact, one home | weak | Review: the same rule stated twice is a finding. Semantic duplication cannot be grepped reliably. |
| R2 | Index autonomy: no totals in indexes or structure pages | strong | `scripts/check.ts` scans the index pages and both `structure.md` pages for count-plus-noun patterns |
| R3 | Change surface: norm → template → skill in the same or next commit; a page that only points at the norm source needs no edit | weak | Review against the `AGENTS.md` table |
| R4a | Volume budgets are measured in non-whitespace characters and carry a soft and a hard line; soft is a review signal, hard fails the gate | strong | `scripts/check.ts` measures every budgeted file, warns above soft and fails above hard |
| R4b | Entry budgets are measured in table rows | strong | `scripts/check.ts` counts rows in the index tables and in the routing table that carry a limit |
| R5 | Every `docs/` page maps to a declared role, including optional ones | strong | `scripts/check.ts` role-path map; an unmapped path fails |
| R6 | No empty directories | strong | `scripts/check.ts` fails on a directory with no files |
| R7 | Files under a generated path carry the generated header | strong | `scripts/check.ts` scans `dist/` and any file whose first line self-declares generated |
| R8 | English for repository-maintained markdown | strong | `scripts/check.ts` scans markdown for CJK, including full-width punctuation. Commit messages, comments, and test names are review criteria |
| R9 | No history in living documents | weak | Review: `status.md` is rewritten in place; a backlog row changes status instead of disappearing; a closed work package moves from the open table to the archive index |
| R10 | Record method, not measurement | weak | Review: a count, duration, coverage number, resolved version, benchmark, or size that can drift is written as the command that produces it, or dated `for-the-record` |
| R11 | File naming follows the convention | strong | `scripts/check.ts` naming check, with explicit patterns for ADRs and backlog names |
| R12 | Markdown tables are not column-aligned: one space around every cell | strong | `scripts/check.ts` table check: cell padding and cell count per row; a Python target runs the same check through the overlay's gate stage (`docs/norm/overlays.md`, Python C1). Markdown is formatted by Prettier with a compact-table plugin; code formatters skip `*.md` |
| R13 | Admission is a content test: a role takes only the jobs its admission names. Durability is not admission, and a directory name is not a role. A source set that serves more than one job splits before any role move | weak | Review: a role holding a job its admission does not cover is a finding; the migration map carries one row per target page with its job and admission clause |

## Naming and citation

- Files: `kebab-case.md`; ADRs `ADR-<nnnn>-slug.md`; backlog `B-<nnnn>-slug.md`. All-caps names are reserved for roles: `README.md`, `AGENTS.md`, `GLOSSARY.md`, `GLOSSARY-MAP.md`.
- Numbered records use four digits: ADR `ADR-0001`, backlog `B-0001`. Record IDs start at `0001`. Norm pages are named by subject, not numbered; their order lives in `docs/norm/README.md`, so adding a page does not renumber the set. A migrated ADR series is zero-padded to four digits at migration and is never renumbered. A migrated backlog series is zero-padded to four digits at migration and is never renumbered: padding is not renumbering, and one width per series is the only shape a checker can express.
- Prose is not hard-wrapped; one paragraph is one line. Code fences, tables, YAML, and a run of two or more `Label: value` fields keep their line breaks. The gate calls the `md-tools` CLI, which is the rule's only implementation.
- Cite a file plus a section name (`docs/norm/roles.md`, "Five discriminations"). Do not cite section numbers or line numbers.
- Section headings are unnumbered by default. Number them only when the number is part of the artifact a consumer cites: a legal clause, a fixed contract section, or a numbered procedure. A number added for visual order becomes wrong when the section moves.

Naming and the prose rule are gated by `scripts/check.ts`; the other bullets are review criteria.

## Budget units

Two units, never interchangeable:

- **Volume** — non-whitespace characters, excluding table delimiter rows. Measures reading cost; a delimiter row is formatting, not content, so its width cannot change a budget.
- **Entry** — table rows. Measures scannability.

Lines are not a volume unit: the same budget expressed in lines gives opposite verdicts for documents of similar size. Word count is not a volume unit either: it splits on whitespace, so a Chinese paragraph reports far fewer words than characters. See `docs/decisions/ADR-0003-volume-budget-unit.md` for the measured samples.

## Budgets

| Document | Volume (soft / hard) | Entry |
| --- | --- | --- |
| Root `AGENTS.md` | ≤20,000 / ≤32,000 | routing table ≤12 rows |
| Root `README.md` | ≤10,000 / ≤16,000 | install ≤3 steps |
| Any `docs/` page | ≤10,000 / ≤16,000 | — |
| `docs/norm/roles.md` | ≤18,000 / ≤24,000 | — |
| ADR | ≤7,500 / ≤12,000 | — |
| Backlog item | ≤5,000 / ≤8,000 | — |
| `docs/workflow.md` | ≤10,000 / ≤16,000 | — |
| `docs/committing.md` | ≤5,000 / ≤8,000 | — |
| Member `README.md` | ≤10,000 / ≤16,000 | — |
| Member `AGENTS.md` | ≤10,000 / ≤16,000 | — |
| Module `AGENTS.md` (deferred) | ≤5,000 / ≤8,000 | — |
| Directory `README.md` (index) | ≤6,000 / ≤12,000 | ≤40 rows |
| Backlog index | ≤8,000 / ≤16,000 | ≤60 rows |
| Decisions index | ≤8,000 / ≤16,000 | ≤60 rows |
| Overlay `README.md` (a guide, not an index) | ≤10,000 / ≤16,000 | — |
| `status.md` | ≤10,000 / ≤16,000 EN; ≤5,000 / ≤8,000 ZH | — |
| `GLOSSARY.md` | ≤7,500 / ≤12,000 | — |
| `GLOSSARY-MAP.md` | ≤2,500 / ≤4,000 | — |
| `work-packages/<slug>/summary.md`, `work-packages/archive/<slug>/summary.md` | ≤3,750 / ≤6,000 | 4 sections (structural, not table rows; a frozen summary keeps the shape it was written with) |

Package evidence — a report, inventory, or reproduction script a work package owns — carries no volume budget; `summary.md` names it, and the evidence's own structure governs its length. `work-packages/<slug>/spec.md`, `plan.md`, `board.md`, and its `items/<ID>.md` files are working state, not durable reading artifacts; they carry no volume budget. `summary.md` is the closeout reading artifact and carries the budget above.

The EN/ZH split exists because a Chinese character costs roughly 2.7× the tokens of an English character. A single number would either over-constrain Chinese or under-constrain English. The ZH limit is half the EN limit.

A volume budget has two lines. Soft is where judgment starts: a file may stay above it, and the gate prints a warning instead of failing. Hard is where the file is too long for its role: the gate fails. For prose, soft is a quarter above the old single line and hard is twice it, because that line is where files were shaped to stop; a judgment line placed on it would flag the normal top of the distribution rather than an outlier. An index derives its soft line from its row cap instead: 40 rows at the measured ~117 characters per row plus a preamble is about 5,100, so 6,000, and hard is double that. `docs/decisions/ADR-0013-two-tier-volume-budgets.md` records how the numbers were set and what was rejected. A limit with no judgment space stays one number.

A directory `README.md` is an index and gets 6,000/12,000, from its 40-row cap at the measured ~117 characters per row plus a preamble; the backlog and decisions indexes' 60 rows give 8,000/16,000. An overlay `README.md` is a guide and gets 10,000/16,000. The path decides, not the file name.

`docs/norm/roles.md` carries its own line because it is a reference catalog read by question rather than end to end: its volume is binding role rows and the admission tests that keep roles apart, not narrative. The measured sample on 2026-11-28 is 16,206 non-whitespace characters, leaving 1,794 to the soft line and 7,794 to the hard line.

A `docs/committing.md` is short by design: `docs/norm/committing.md` carries the norm, and the page carries only a pointer and this repository's deviations. The 5,000 limit exists so it cannot grow into a second copy of the norm.

## Measuring

PowerShell:

```powershell
$p = 'AGENTS.md'
$t = [IO.File]::ReadAllText((Resolve-Path -LiteralPath $p))
$lines = $t -split "`n" | Where-Object { $_ -notmatch '^\|[\s:|-]+\|$' }
($lines -join "`n" -replace '\s', '').Length        # volume
(Get-Content -LiteralPath $p).Count                # physical lines; neither unit
(Get-Content -LiteralPath $p | Where-Object { $_ -match '^\|' -and $_ -notmatch '^\|[\s:|-]+\|$' }).Count - 1  # entries: table rows, header excluded
```

Bash:

```bash
grep -vE '^\|[[:space:]:-]+\|$' AGENTS.md | tr -d '[:space:]' | wc -m  # volume
wc -l < AGENTS.md                                   # physical lines; neither unit
awk '/^\|/ && !/^\|[\s:|-]+\|$/ {n++} END {print n-1}' AGENTS.md  # entries: table rows, header excluded
```

The gate's `volume()` function is authoritative; the commands above match it by dropping table delimiter rows.

`(Get-Content).Count` counts physical lines, including blank ones; `Measure-Object -Line` does not. Neither is a volume unit.

## Retirement and the three exceptions

Default: an artifact that stops being true is deleted. `git log` keeps it, and deleting is the only way a reader can tell what is current.

Three exceptions:

1. **ADR** — never deleted. Marked `Superseded` and linked to its replacement. A decision's rejected alternatives are the record's value.
2. **Closed backlog item** — the file and its index row stay; the row's status becomes `closed`. Its `Evidence` may be cited by a later item.
3. **Superseded contract** — kept only while a consumer still cites it, then deleted.

An artifact that is "kept just in case" is not an exception; it is the start of a second home. A closed work package is not a fifth exception either: it is the frozen exit of a role (`roles.md`), and `work-packages/archive/README.md` names it.

## Generated artifacts

A file under `dist/` — or any file whose first line self-declares — carries:

```text
generated by <command> — do not edit
```

as its first line, followed by a blank line. The gate regenerates it and fails when the content differs. An unmarked generated file is treated as authoritative and will be edited by hand; that is the failure the header prevents. `dist/` is the only generated directory in the standard today; a repository that adds another must add it to the gate's list.
