/**
 * The finding catalog (`docs/norm/code/messages.md`): one code to one sentence.
 *
 * A check never builds a sentence. It names a code and passes the facts as params;
 * `finding()` renders the one template the catalog holds. The shape is `location:
 * problem` for anything that has a location, so a finding is a line an editor can
 * follow, and a report a consumer can group without parsing English.
 *
 * Validation runs at import: a code that names no domain, a level outside the two,
 * and a template whose placeholders and declared params disagree throw before any
 * check runs.
 */

export type Level = 'fail' | 'warn'

export interface Spec {
  level: Level
  template: string
}

export type Params = Record<string, string | number>

/** One entry per fact a check can report. A code is an API: never reuse or rename one. */
const SPECS = {
  'docs.required_file': { level: 'fail', template: '{path}: missing required file' },
  'docs.required_norm_page': { level: 'fail', template: '{path}: missing norm page' },
  'docs.missing_directory': { level: 'fail', template: '{path}: directory missing' },
  'docs.missing_readme': { level: 'fail', template: '{path}: missing README' },
  'docs.empty_directory': { level: 'fail', template: '{path}: empty directory' },
  'docs.cjk_text': { level: 'fail', template: '{path}: CJK text' },
  'docs.broken_link': { level: 'fail', template: '{path}: broken link: {target}' },
  'docs.unfinished_marker': { level: 'fail', template: '{path}: unfinished marker' },
  'docs.index_count': {
    level: 'fail',
    template: '{path}: count in an index or structure page: {token}',
  },
  'docs.name_role': { level: 'fail', template: '{path}: file name does not match its role' },
  'docs.role_path': { level: 'fail', template: '{path}: does not map to a declared role' },
  'docs.forwarding_stub': {
    level: 'fail',
    template:
      '{path}: forwarding stub not admitted — delete it and register the moved path in docs/adapters.md',
  },
  'docs.explainer_section': {
    level: 'fail',
    template: '{path}: section links nothing: ## {heading}',
  },
  'docs.generated_header': {
    level: 'fail',
    template: '{path}: generated header needs a blank second line',
  },
  'docs.generated_file': { level: 'fail', template: '{path}: generated file lacks its header' },

  'budget.volume_hard': {
    level: 'fail',
    template: '{path}: volume {measured} exceeds {limit} (hard)',
  },
  'budget.volume_soft': {
    level: 'warn',
    template: '{path}: volume {measured} exceeds {limit} (soft)',
  },
  'budget.entry_limit': { level: 'fail', template: '{path}: entries {measured} exceed {limit}' },
  'budget.routing_rows': {
    level: 'fail',
    template: '{path}: routing table {measured} rows exceed {limit}',
  },
  'budget.routing_heading': {
    level: 'fail',
    template: '{path}: routing section not found: {heading}',
  },

  'table.cell_count': {
    level: 'fail',
    template: '{path}:{line}: {cells} cells, header has {columns}; escape a literal pipe as \\|',
  },
  'table.padding': {
    level: 'fail',
    template: '{path}:{line}: table cell is column-aligned; one space on each side',
  },
  'table.run_of_spaces': {
    level: 'fail',
    template: '{path}:{line}: table cell has a run of spaces',
  },

  'backlog.status': { level: 'fail', template: '{path}:{line}: unknown backlog status: {status}' },

  'prose.project_unset': {
    level: 'fail',
    template: 'prose: MD_TOOLS_PROJECT is not set to the python-toolkit checkout',
  },
  'prose.run_error': { level: 'fail', template: 'prose: md-reflow could not run: {detail}' },
  'prose.exit_code': { level: 'fail', template: 'prose: md-reflow failed (exit {code}): {detail}' },
  'prose.hard_wrapped': {
    level: 'fail',
    template: '{path}: prose is hard-wrapped — {blocks} block(s), run md-reflow --apply',
  },
  'prose.unreadable': {
    level: 'fail',
    template: 'prose: {files} file(s) could not be read (mixed line endings)',
  },

  'package.file_missing': { level: 'fail', template: '{path}: missing package file' },
  'package.summary_missing': { level: 'fail', template: '{path}: missing package summary' },
  'package.file_unexpected': { level: 'fail', template: '{path}: unexpected package file' },
  'package.summary_part': { level: 'fail', template: '{path}: missing {part}' },
  'package.evidence_unnamed': {
    level: 'fail',
    template: '{path}: evidence directory not named in the summary',
  },
  'package.item_entry': { level: 'fail', template: '{path}: unexpected entry in package items' },
  'package.item_heading': {
    level: 'fail',
    template: '{path}: item heading does not start with its ID',
  },
  'package.item_unlinked': { level: 'fail', template: '{path}: item not linked from the board' },
  'package.item_missing': { level: 'fail', template: '{path}: board links a missing item' },

  'board.field_missing': { level: 'fail', template: '{path}: field missing: {field}' },
  'board.field_empty': { level: 'fail', template: '{path}: field is empty: {field}' },
  'board.field_order': { level: 'fail', template: '{path}: fields are out of order' },
  'board.status_value': { level: 'fail', template: '{path}: Status must be open or closed' },
  'board.open_says_closed': { level: 'fail', template: '{path}: open package says closed' },
  'board.archived_says_open': { level: 'fail', template: '{path}: archived package says open' },
  'board.archived_open_item': {
    level: 'fail',
    template: '{path}: archived package has an open item: {item} ({status})',
  },
  'board.archived_field_active': {
    level: 'fail',
    template: '{path}: archived package {field} must be none',
  },
  'board.updated_format': { level: 'fail', template: '{path}: Updated is not YYYY-MM-DD' },
  'board.phase_format': { level: 'fail', template: '{path}: Phase is not P<n> — focus' },
  'board.repositories_missing': { level: 'fail', template: '{path}: no Repositories table' },
  'board.repositories_header': {
    level: 'fail',
    template: '{path}: Repositories header is not Repository | Branch | Gate command | Last result',
  },
  'board.repositories_empty': { level: 'fail', template: '{path}: Repositories table has no rows' },
  'board.repositories_cells': {
    level: 'fail',
    template: '{path}: Repositories row has {cells} cells',
  },
  'board.repositories_cell_empty': {
    level: 'fail',
    template: '{path}: Repositories row has an empty cell',
  },
  'board.item_status': { level: 'fail', template: '{path}: status is unknown: {status}: {item}' },
  'board.dropped_disposition': {
    level: 'fail',
    template: '{path}: dropped item has no Disposition',
  },
  'board.next_multiple': { level: 'fail', template: '{path}: Next names more than one item' },
  'board.next_none_with_work': {
    level: 'fail',
    template: '{path}: Next is none but an item is todo/doing',
  },
  'board.next_closeout_with_work': {
    level: 'fail',
    template: '{path}: Next is closeout but work remains',
  },
  'board.next_kind': {
    level: 'fail',
    template: '{path}: Next is not an item, closeout, or none',
  },
  'board.next_missing_item': {
    level: 'fail',
    template: '{path}: Next points at a missing item: {item}',
  },
  'board.next_wrong_status': {
    level: 'fail',
    template: '{path}: Next points at a {status} item: {item}',
  },
  'board.blocked_none_with_blocked': {
    level: 'fail',
    template: '{path}: Blocked is none but an item is blocked',
  },
  'board.blocked_no_reason': { level: 'fail', template: '{path}: Blocked has no reason: {item}' },
  'board.blocked_missing_item': {
    level: 'fail',
    template: '{path}: Blocked names a missing item: {item}',
  },
  'board.blocked_wrong_status': {
    level: 'fail',
    template: '{path}: Blocked names a {status} item: {item}',
  },
  'board.blocked_omitted': {
    level: 'fail',
    template: '{path}: Blocked omits a blocked item: {item}',
  },
  'board.lastdone_multiple': {
    level: 'fail',
    template: '{path}: Last done names more than one item',
  },
  'board.lastdone_none_with_done': {
    level: 'fail',
    template: '{path}: Last done is none but an item is done',
  },
  'board.lastdone_kind': { level: 'fail', template: '{path}: Last done is not an item or none' },
  'board.lastdone_missing_item': {
    level: 'fail',
    template: '{path}: Last done points at a missing item: {item}',
  },
  'board.lastdone_wrong_status': {
    level: 'fail',
    template: '{path}: Last done points at a {status} item: {item}',
  },
} as const satisfies Record<string, Spec>

export type FindingCode = keyof typeof SPECS

export const CATALOG: Readonly<Record<FindingCode, Spec>> = SPECS

export const CODES: FindingCode[] = Object.keys(SPECS) as FindingCode[]

export interface Finding {
  level: Level
  code: FindingCode
  params: Params
  message: string
}

const PLACEHOLDER = /\{([^{}]*)\}/g
const NAMESPACED = /^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+$/

/** Placeholder names a template reads, ignoring format specs and attribute access. */
export function placeholders(template: string): string[] {
  const names = new Set<string>()
  for (const match of template.matchAll(PLACEHOLDER)) {
    const base = match[1].split(/[.:[]/, 1)[0]
    if (base) {
      names.add(base)
    }
  }
  return [...names].sort()
}

/**
 * Every way a catalog breaks its own contract. At import this throws; a test feeds
 * a broken catalog to prove each clause fires.
 */
export function problems(specs: Record<string, { level: string; template: string }>): string[] {
  const found: string[] = []
  for (const [code, spec] of Object.entries(specs)) {
    if (!NAMESPACED.test(code)) {
      found.push(`${code}: a code names a domain`)
    }
    if (spec.level !== 'fail' && spec.level !== 'warn') {
      found.push(`${code}: level ${spec.level} is not fail or warn`)
    }
    const names = new Set(placeholders(spec.template))
    const dummy: Params = {}
    for (const name of names) {
      dummy[name] = 'x'
    }
    try {
      if (format(spec.template, dummy).includes('{')) {
        found.push(`${code}: template has a placeholder it did not declare`)
      }
    } catch (error) {
      found.push(`${code}: template does not format: ${(error as Error).message}`)
    }
  }
  return found
}

/** The one place a template becomes a sentence. */
export function format(template: string, params: Params): string {
  return template.replace(PLACEHOLDER, (_match, name: string) => {
    const value = params[name.split(/[.:[]/, 1)[0]]
    if (value === undefined) {
      throw new Error(`missing param: ${name}`)
    }
    return String(value)
  })
}

const seen = new Set<FindingCode>()

/** Codes constructed since the process started; the coverage test reads this. */
export function seenCodes(): FindingCode[] {
  return [...seen]
}

export function finding(code: FindingCode, params: Params = {}): Finding {
  const spec: Spec = SPECS[code]
  seen.add(code)
  return { level: spec.level, code, params, message: format(spec.template, params) }
}

const broken = problems(SPECS)
if (broken.length > 0) {
  throw new Error(`finding catalog is invalid:\n${broken.join('\n')}`)
}
