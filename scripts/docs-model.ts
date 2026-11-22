/**
 * The pure half of the gate: text measurement, budgets, and the patterns that decide
 * whether a path is a legal document. No filesystem, no process, no output — every
 * function here is a candidate for a direct test.
 *
 * The Python original measured text with `str.splitlines()`, `str.strip()`, and Unicode
 * `\s`/`\b`. Those helpers reproduce the same character sets so a volume number does not
 * move because the checker changed language. Python's `\b` and `\d` stay Unicode-aware
 * and JavaScript's are ASCII; R8 keeps repository markdown free of CJK, and a non-CJK
 * non-ASCII file would be the first place to look if a count finding ever moves.
 */

/** Python's `str.isspace()` set, minus the `\ufeff` that only JavaScript strips. */
const PY_WS =
  ' \\t\\n\\r\\v\\f\\x1c-\\x1f\\x85\\xa0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000'
const PY_STRIP = new RegExp(`^[${PY_WS}]+|[${PY_WS}]+$`, 'g')
const PY_SPACE = new RegExp(`[${PY_WS}]`, 'g')

/** Python's `str.splitlines()` boundaries. */
const LINE_BREAK = /\r\n|\r|\n|\v|\f|\x1c|\x1d|\x1e|\x85|\u2028|\u2029/
const LINE_BREAK_AT_END = /(?:\r\n|\r|\n|\v|\f|\x1c|\x1d|\x1e|\x85|\u2028|\u2029)$/

export const TABLE_DELIMITER = new RegExp(`\\|[${PY_WS}:|-]+\\|`)
export const TABLE_ROW = /^\|.*\|$/
export const CODE_SPAN = /`[^`]*`/g
export const SKIP_PARTS = new Set(['.git', 'node_modules', '__pycache__'])
export const BACKLOG_STATUSES = new Set(['open', 'active', 'paused', 'closed'])
export const CJK =
  /[\u3000-\u303f\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff00-\uffef]/
export const LINK = /\[[^\]]*\]\(([^)]+)\)/g
/** The marker a forwarding stub carried before ADR-0028 retired the role. */
export const MOVED_MARKER = '— moved'
export const COUNT_NOUN =
  /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+(pages?|documents?|files?|entries|items|adrs?)\b/gi
export const ROLE_NAMES = new Set(['README.md', 'AGENTS.md', 'GLOSSARY.md', 'GLOSSARY-MAP.md'])
export const GENERATED_DIRS = ['dist']

export const INDEX_PAGES = [
  'docs/README.md',
  'docs/decisions/README.md',
  'docs/backlog/README.md',
  'template/README.md',
  'docs/structure.md',
  'template/core/docs/structure.md',
]

/** The paths a `docs/` page is admitted at. A role change edits this list. */
export const DOC_ROLE_PATHS = [
  'docs/README\\.md',
  'docs/(charter|structure|conventions|committing|workflow|status)\\.md',
  'docs/suite-tracks\\.md',
  'docs/adapters\\.md',
  'docs/norm/(README|[a-z0-9-]+)\\.md',
  'docs/norm/code/(README|[a-z0-9-]+)\\.md',
  'docs/decisions/(README|ADR-\\d{4}-[a-z0-9-]+)\\.md',
  'docs/backlog/(README|B-\\d{4}-[a-z0-9-]+)\\.md',
  'docs/contracts/(README|[a-z0-9-]+)\\.md',
  'docs/architecture/(README|[a-z0-9-]+)\\.md',
  'docs/operations/(README|[a-z0-9-]+)\\.md',
  'docs/toolchain/(README|[a-z0-9-]+)\\.md',
  'docs/knowledge/(README|(guides|cases|notes|explainers)/(README|[a-z0-9-]+))\\.md',
].map(source => new RegExp(`^(?:${source})$`))

/** Soft and hard volume lines, in non-whitespace characters. */
export const EXACT_BUDGETS = new Map<string, [number, number]>([
  ['AGENTS.md', [20_000, 32_000]],
  ['README.md', [10_000, 16_000]],
  ['GLOSSARY.md', [7_500, 12_000]],
  ['GLOSSARY-MAP.md', [2_500, 4_000]],
  ['docs/README.md', [6_000, 12_000]],
  ['docs/committing.md', [5_000, 8_000]],
  ['docs/norm/README.md', [6_000, 12_000]],
  ['docs/decisions/README.md', [6_000, 12_000]],
  ['docs/backlog/README.md', [8_000, 16_000]],
  ['template/README.md', [6_000, 12_000]],
  ['template/core/AGENTS.md', [20_000, 32_000]],
  ['template/core/README.md', [10_000, 16_000]],
  ['template/core/docs/committing.md', [5_000, 8_000]],
  ['template/first-use/docs/backlog/README.md', [8_000, 16_000]],
  ['template/overlays/README.md', [6_000, 12_000]],
])

/** Entry budgets, in table rows. */
export const ENTRY_LIMITS = new Map<string, number>([
  ['docs/README.md', 40],
  ['docs/decisions/README.md', 40],
  ['docs/backlog/README.md', 60],
  ['template/README.md', 40],
])

/** Python's `str.splitlines()`: every boundary splits, and a trailing break adds no empty line. */
export function splitLines(text: string): string[] {
  if (text === '') {
    return []
  }
  const lines = text.split(LINE_BREAK)
  if (LINE_BREAK_AT_END.test(text)) {
    lines.pop()
  }
  return lines
}

/** Python's `str.strip()`. */
export function pyStrip(value: string): string {
  return value.replace(PY_STRIP, '')
}

/** Python's `repr()` for the messages that quote a matched string. */
export function pyRepr(value: string): string {
  const quote = value.includes("'") && !value.includes('"') ? '"' : "'"
  const body = value
    .replace(/\\/g, '\\\\')
    .replace(new RegExp(quote, 'g'), `\\${quote}`)
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
  return `${quote}${body}${quote}`
}

/** Python's `fullmatch` on a single-line value. */
export function matchesFully(pattern: RegExp, value: string): boolean {
  const anchored = new RegExp(`^(?:${pattern.source})$`, pattern.flags.replace('g', ''))
  return anchored.test(value)
}

/**
 * Volume: non-whitespace characters, table delimiter rows excluded.
 *
 * A delimiter row is formatting, not content, so its width cannot spend a budget
 * (`docs/norm/rules.md`, "Budget units").
 */
export function volume(text: string): number {
  const lines = splitLines(text).filter(line => !matchesFully(TABLE_DELIMITER, line))
  return lines.join('\n').replace(PY_SPACE, '').length
}

/** Entries: table rows, header excluded. Measures scannability, not reading cost. */
export function tableEntries(text: string): number {
  const rows = splitLines(text)
    .filter(line => line.startsWith('|'))
    .filter(line => !matchesFully(TABLE_DELIMITER, line))
  return Math.max(rows.length - 1, 0)
}

/**
 * Entries in the table under one heading, or null when the heading or its table is absent.
 *
 * A file that holds several tables — a root `AGENTS.md` with a routing table, a change
 * surface, and a command table — cannot be measured by `tableEntries`, which counts every
 * table at once (`docs/norm/rules.md`, root `AGENTS.md`). A null is a finding, not a pass:
 * a renamed heading must not silently retire the rule.
 */
export function sectionTableEntries(text: string, heading: string): number | null {
  const lines = splitLines(text)
  const start = lines.indexOf(heading)
  if (start === -1) {
    return null
  }
  const rest = lines.slice(start + 1)
  const first = rest.findIndex(line => line.startsWith('|'))
  if (first === -1) {
    return null
  }
  let last = first
  while (last < rest.length && rest[last].startsWith('|')) {
    last += 1
  }
  const rows = rest.slice(first, last).filter(line => !matchesFully(TABLE_DELIMITER, line))
  return Math.max(rows.length - 1, 0)
}

/** Split a table row on unescaped pipes, keeping the padding. */
export function splitCells(row: string): string[] {
  const body = pyStrip(row).slice(1, -1)
  const cells: string[] = []
  let buffer = ''
  let escaped = false
  for (const char of body) {
    if (escaped) {
      buffer += char
      escaped = false
    } else if (char === '\\') {
      buffer += char
      escaped = true
    } else if (char === '|') {
      cells.push(buffer)
      buffer = ''
    } else {
      buffer += char
    }
  }
  cells.push(buffer)
  return cells
}

/**
 * The (soft, hard) volume budget for a markdown file, or null when it carries none.
 *
 * Soft is a judgment line: the gate warns. Hard is a failure line (`docs/norm/rules.md`,
 * R4a; ADR-0013).
 */
export function budgetFor(key: string, name: string): [number, number] | null {
  const exact = EXACT_BUDGETS.get(key)
  if (exact) {
    return exact
  }
  if (key.startsWith('work-packages/') && name === 'summary.md') {
    return [3_750, 6_000]
  }
  if (key.startsWith('docs/decisions/')) {
    return [7_500, 12_000]
  }
  if (key.startsWith('docs/backlog/')) {
    return [5_000, 8_000]
  }
  if (key.startsWith('docs/') && name === 'README.md' && key.split('/').length - 1 >= 2) {
    return [6_000, 12_000]
  }
  if (key.startsWith('docs/')) {
    return [10_000, 16_000]
  }
  if (key.startsWith('template/overlays/')) {
    return [10_000, 16_000]
  }
  if (key.startsWith('template/')) {
    if (name === 'README.md') {
      return [6_000, 12_000]
    }
    if (key.includes('/docs/backlog/')) {
      return [5_000, 8_000]
    }
    return [10_000, 16_000]
  }
  return null
}

/** The row limit for an index page, or null when the page is not an index. */
export function entryLimit(key: string): number | null {
  const exact = ENTRY_LIMITS.get(key)
  if (exact !== undefined) {
    return exact
  }
  if (key.endsWith('/README.md')) {
    if (key.startsWith('template/overlays/') && key !== 'template/overlays/README.md') {
      return null
    }
    return key.includes('/backlog/') ? 60 : 40
  }
  return null
}

/** The naming pattern a path's role hands it. */
export function namingPattern(key: string): RegExp {
  const route = `/${key}`
  if (route.includes('/docs/decisions/')) {
    return /^ADR-\d{4}-[a-z0-9-]+\.md$/
  }
  if (route.includes('/docs/backlog/')) {
    return /^B-\d{4}-[a-z0-9-]+\.md$/
  }
  if (route.includes('/items/')) {
    return /^W\d{2}[a-z]*(?:-[ivx]+)?\.md$/
  }
  return /^[a-z0-9][a-z0-9-]*\.md$/
}
