# Messages

A message a human reads — a finding, a CLI error, an API error body, a log event — is a projection of state, not part of it. The decision layer knows the facts; this page fixes how a record carries them and what a catalog may not do.

## When it applies

Adopt a catalog when at least one of these holds:

- more than roughly ten messages, or messages that carry several facts each;
- a threshold that gets tuned, or wording that has gone stale once already;
- a second consumer: JSON, a UI, a model-written report, a translation;
- codes that tooling should group, suppress, link, or count.

Do not adopt it for a one-off script, a handful of test assertions, or output nobody but the author reads. A dict that needs a framework to justify itself is in the wrong program.

## Four concerns

| Concern | Owns | Must not |
| --- | --- | --- |
| Decision | Whether it fires, which facts, the kind and severity | Compose a sentence |
| Wording | A stable code to a template, fields, one action, a qualifier, a reference | Read state, files, or the environment; decide whether to fire |
| Rendering | Labels, punctuation, spacing, escaping, ordering, channel format | Decide what is true |
| Narration | Grouping, priority, context, explanation | Rewrite a fact, soften a mandatory message, promote an optional one |

Dependencies point one way: decision → (code, params) → catalog → renderer → narrator. The catalog does not import the decision layer, and the renderer does not import a check. If an arrow points back, wording can change behavior, which is the thing this shape exists to prevent. A small program may keep wording and rendering in one module; keep them separate in concept. A large one may split the catalog by domain, but there is one catalog per program, not one per module.

## The record

| Field | Required | Holds | Test |
| --- | --- | --- | --- |
| `code` | always | A stable identity, `domain.check` with an optional tier | Can a consumer group, suppress, or document it without reading the text? |
| `params` | always | The facts the decision layer knows | Is every value the sentence needs present, and nothing else? |
| `template` | always | Wording with placeholders | Does it format from `params` alone? |
| `kind` or `severity` | when the consumer sorts, routes, or labels on it | A machine enum, not an adjective | Is the label rendered rather than stored? |
| `action` | when the reader must do something | One imperative next step | Can it be executed without choosing between two instructions? |
| `qualifier` | when ignoring is legitimate | The condition under which the message may be kept as is | Does it change act or keep? If not, delete it |
| `ref` | when the procedure is longer than one step | A section name or a docs path | Is it a pointer, not a second explanation? |
| `headline` | when messages are grouped | A short name with no facts | Would it survive a threshold change untouched? |

The same record serves every channel; only the field names change:

| Field | Finding | CLI error | API error body | Log event |
| --- | --- | --- | --- | --- |
| identity | `readme.dead_ref` | an error id and an exit code | `error.code` | an event name |
| facts | `{path}` | path, line, input | `details` | structured fields |
| severity | `hard` / `soft` | fatal / warning / info | 4xx / 5xx | level |
| action | "add the file or drop the reference" | `--help` or a fix hint | `remediation` | a runbook link |
| qualifier | "kept if self-contained" | "safe to ignore when ..." | `retryable` | a sampling note |
| ref | a guide section | a docs URL | a docs URL | a dashboard link |

## Invariants

Facts:

1. **The decision layer returns data, not strings.** It stays usable with no output layer attached — tests, JSON, another UI; printing is the boundary's job. An exception carries a code and params too; the boundary renders it, the thrower does not.
2. **A value the logic knows is a parameter, never typed into the template.** A duplicated constant is a statement that will eventually be false.
3. **Severity is an enum, and its label belongs to the renderer.** A dash, a word, a prefix, and a color are presentation, not data.

Wording:

4. **One message, one action.** Two remedies mean the check has not decided; split the code or pick one.
5. **A qualifier and a rationale are separate from the fact.** A qualifier buried in a sentence cannot be honored by a consumer that sees only fields.
6. **A template holds no logic** — no conditionals, no plural hacks, no date formatting. If the wording branches, it is two codes.
7. **One language and one tone per catalog.** Translate the catalog, not each call site; the renderer does not translate.
8. **The renderer owns punctuation, spacing, escaping, ordering, and color.** A template carries content, not layout; no trailing space and no bullet character in data.

Consumers:

9. **Never parse message text.** Branch on the code; a wording change must not be able to break control flow.
10. **A code is an API.** Namespaced, stable, greppable, never built from a runtime value — `"readme." + kind` cannot be found — and never reused for a different fact. Renaming or removing one is a breaking change; the commit that does it says so, and the consumer is updated in the same change. Field names are API too: a consumer reads `params` keys and record fields, so renaming one breaks the same way.
11. **The narrator may add context, never contradict the record.** No softening a mandatory message, no promoting an optional one, no restating the threshold rationale in different words.
12. **A message nobody can act on is a log line**, not a finding or an error. Do not give it a code for symmetry; send it to the log with structured fields and no action.

## The catalog

The catalog is a table of records — no base class, no registry, no config file. An entry holds the severity, a headline, a template, one action, an optional qualifier, and an optional reference. One function turns `(code, params)` into the record: it looks up the entry, formats the template from params, and returns the record. It never writes to a stream, a file, or a buffer.

Rules for the data module:

- **A code names the domain and the check**, not the current value, the count, the line number, or an implementation detail.
- **A tier suffix only** when the same fact has two tiers; otherwise one code.
- **Do not encode a CLI flag or a scope in the code** unless it is one-to-one: the grouping axis and the invocation axis are different things.
- **Split the catalog by domain** — never by output format or by caller — when the file crosses its own size limit, then merge behind a facade. The facade is the only import a check needs.
- **No I/O and no import from the decision layer.** The catalog is data plus one formatter.

Guards:

- **At import:** unique codes across the parts, known severities, every template formats with dummy params, required fields non-empty. A merge silently keeps the last duplicate; a length check makes the collision loud.
- **At call sites:** the parameter names match the template's placeholders. A formatter ignores extras and fails only on a missing one, which in a rare branch is a crash in production; a short walk over the emit calls catches it without running them.
- **At the renderer:** a snapshot of the rendered output, so a punctuation or ordering change is reviewed rather than discovered.

Each overlay states the language form in its C6 and ships the stage that holds it: `tools/check_messages.py` and `tools/check-messages.ts` fail a code that names no domain, a template whose placeholders and params disagree, two codes sharing one wording, a number typed outside a placeholder, and a code a merge overwrote (`PARTS`). A wording that legitimately carries a number is listed under `exempt`. The repository declares where the catalog lives; one that declares none passes, so a fresh copy stays green.

## Migration

1. **Inventory before editing.** List every string that reaches a human; tag each element as fact, judgment, instruction, rationale, or pointer. Count the ones that duplicate a value; that ratio says whether a catalog is worth its cost.
2. **Freeze the structured output first.** If the program already has JSON or machine output, that is the behavior to keep. If it does not, record which branch emits what for a fixed input set — identity and count per scenario, not the rendered wording.
3. **Define the smallest schema** that covers the inventory. Start with code, severity, params, template, and action; add qualifier and ref only where they already exist as content.
4. **Convert one producer family**, keeping the old string path working so unconverted modules keep their output.
5. **Compare records, not text:** same codes, same counts, same severity distribution. Wording is expected to change; a count change means a check moved. Convert the rest, delete the compatibility layer, and land the rendering rules in the same change.

## Verification

- **A fixture per code.** Run the real entry point over deliberately broken input; assert coverage mechanically — the set of catalog codes minus the codes seen must be empty.
- **A metamorphic test for duplicated values.** Move the threshold constant and assert the rendered message moves with it. This is the only test that catches a number typed into prose after the fact.
- **No digits in a template** except identifiers; a search over the catalog files justifies every hit.
- **One record, two surfaces.** Human and JSON output derive from the same record, so they cannot disagree.
- **Unreachable wording is dead.** A code no fixture can trigger is either dead or untested; delete it or write the fixture. Unverified text drifts.

## Pitfalls

| Symptom | Cause | Fix |
| --- | --- | --- |
| A message keeps an old number after a retune | A literal typed into the template | Pass the constant as a parameter |
| A soft message reads like an order | A template verb hardens what severity softens | Keep the template factual; render the label |
| Every message repeats the same explanation | Doctrine copied into the template | Move it to the guide and keep `ref` |
| The consumer sees the fact but not the qualifier | The qualifier folded into the sentence | Give it a field |
| Grouping or suppression is impossible | Only prose exists, no code | Add a stable code; never parse text |
| A code never appears in a fixture | A dead branch or a missing fixture | Delete the code or write the fixture |
| Two different facts share a code | The code names the surface, not the check | One code per fact or tier |
| A new code silently replaces an old one | A merge with a duplicate key | A length guard at import |
| Translating requires editing checks | The wording lives at the call site | Move it into the catalog |
| A model rewrites a mandatory message as a suggestion | The narrator got raw state and no rules | Pass records and narrator rules |
