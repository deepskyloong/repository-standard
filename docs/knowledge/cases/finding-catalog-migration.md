# Finding catalog migration (`i-skill-audit`)

> Date: 2026-10-23 · Status: done · Scope: `skills/i-skill-audit`
>
> Question: 67 problem sentences were built inside the checks. Could they move into a catalog without changing what the audit finds?
>
> Rules: [findings](../../norm/code/findings.md). Method: [messages](../../norm/code/messages.md).

## 1. Starting point

67 literal `(problem, action)` pairs across six check modules. The inventory ran before any edit:

| Property | Count |
| --- | --- |
| Pairs total | 67 |
| Carried `{placeholders}` | 53 |
| Fully fixed strings | 14 |
| Marked the soft tier with a dash | 15 |
| Actions joining two clauses with a semicolon | 17 |
| Carried a tier or judgment word | 20 |
| Pointed at a guide inline | 11 |
| Repeated the same judgment on both sides | ~9 |

The drift was present, not hypothetical: `description` had `500` and `1024` typed into the message as well as into constants; README length had `50` and `1024`; the anchor window had `20`. Severity existed only as punctuation. The JSON export carried `(problem, action)` strings, so a consumer could not group by kind without parsing the text.

## 2. What changed

- `finding_types.py` — `Spec` and `Finding`, 35 lines.
- Three domain data files: `findings_skill.py` (94 lines), `findings_docs.py` (129), `findings_scripts.py` (233).
- Facade `findings.py` (84): merge, import-time validation, `finding()`, `as_json()`, `prefixed()`.
- Checks return `Finding`; `render.py` owns the tier markers, `note`, and `ref`; JSON gains `code` and `severity`.
- 16 files changed, +804 / −325.
- A compatibility tuple path stayed while families migrated, then was deleted after the last module.

## 3. Before and after

```python
# before — threshold twice, tier by punctuation, procedure inline
problems.append(
    ("description too long (%d>1024)" % dlen, "cut to 1024; detail belongs in the body, not in description")
)

# after — the check passes facts, the catalog owns wording
problems.append(
    findings.finding("frontmatter.desc_too_long_hard", desc_len=dlen, limit=DESC_HARD_LIMIT)
)
```

## 4. What the migration surfaced

- **`ruff format` counted its input, not its output.** The finding said nine files would be reformatted when the diff held two. The fix counts `--- ` lines in `--diff`. The same code path also hid the finding entirely when a sibling file failed to parse (exit 2); it now reports the diff whenever one exists.
- **`lint.ps_parse_error` was unreachable.** Probes showed `Invoke-Formatter` returns malformed input unchanged — `if (`, an unterminated string, `}` — without throwing, so the catch branch could never fire. The code and its wrong instruction ("fix the parse error first") were deleted. A formatter failure now degrades to a note, because the only remaining cause is the tool failing to read the file — an environment problem, not a script defect.
- **Two literal numbers survived the first pass.** "about 200 lines" and "eight genres" stayed in templates after the bulk conversion; both mirrored a rule defined elsewhere. They surfaced only when the rule "no numbers in templates" was written down and checked. Both were reworded to point at the rule.
- **The code count changed once, late.** 68 codes were created; deleting the unreachable PowerShell code left 67. That is the only count change in the migration, and it happened after the coverage check proved nothing produced it.

## 5. Evidence

- Fixtures: 67 of 67 catalog codes exercised. The coverage script asserts `set(CATALOG) - seen == empty` against the real CLI's `--json` output over a tree of deliberately broken skills.
- Full library: 48 self-built skills, exit 0, 71 findings, 15 flagged. Per-skill metrics, states, and finding counts are identical to the pre-change export; only wording changed.
- Self-audit: no orphan module; `ruff format --check` and `ruff check` clean.
- Commits: `42b746c` (catalog), `f5f2af7` and `134cb42` (guides).
- Corroborated on 2026-11-22: this repository's own gate ran the same shape — 71 call sites that built a sentence became 0, 67 codes, and a coverage test that fails when a code has no fixture (`scripts/findings.ts`, `scripts/zz-coverage.test.ts`).

## 6. What I would do differently

- **Write the template rules before converting**, not while converting. The two number leaks survived because "no threshold literals" stayed an implicit expectation until the rule was written for the guide.
- **A fixture per code from the start.** The unreachable PowerShell code was found by the coverage assertion at the end; writing the fixture when the code was created would have been cheaper.
- **Expect the compatibility layer to hide mismatches.** The tuple path was useful, but keeping it one commit longer than necessary would have let a half-converted record reach the JSON exporter; delete it as soon as the last producer is converted.
- **Do not split the catalog further by line count alone.** The 233-line scripts domain is the next candidate for a boundary, but the split should follow the report's grouping — `scripts`, `py`, `comment`, `lint` — not a line target.

## 7. Pointers

- Findings rules: [../../norm/code/findings.md](../../norm/code/findings.md)
- General method: [../../norm/code/messages.md](../../norm/code/messages.md)
