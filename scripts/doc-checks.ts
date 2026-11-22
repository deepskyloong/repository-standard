/**
 * The generic document checks: one function per rule, each a pure function of a `Context`
 * and each returning findings instead of writing into shared state. The caller decides
 * what a finding becomes — a line on stdout here, an expectation in a test elsewhere.
 *
 * The work-package checks live in `package-checks.ts`; the repository read model in
 * `check-context.ts`. A check never reads a file twice: `Context` parses once and caches,
 * which is why the Python original's five reads per markdown file are now one.
 */

import { spawnSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import {
  BACKLOG_STATUSES,
  budgetFor,
  CJK,
  CODE_SPAN,
  COUNT_NOUN,
  DOC_ROLE_PATHS,
  entryLimit,
  GENERATED_DIRS,
  INDEX_PAGES,
  LINK,
  matchesFully,
  MOVED_MARKER,
  namingPattern,
  pyRepr,
  pyStrip,
  ROLE_NAMES,
  SKIP_PARTS,
  splitCells,
  splitLines,
  TABLE_DELIMITER,
  TABLE_ROW,
  tableEntries,
  volume,
} from './docs-model.ts'

import { finding, type Finding } from './findings.ts'

import type { Context } from './check-context.ts'
import { boardDashboard, packages } from './package-checks.ts'

const MARKER = /\b(TODO|TBD|FIXME)\b/
const BACKLOG_INDEXES = new Set([
  'docs/backlog/README.md',
  'template/first-use/docs/backlog/README.md',
])

/** The last path segment. */
function baseName(key: string): string {
  return key.slice(key.lastIndexOf('/') + 1)
}

export function requiredFiles(context: Context): Finding[] {
  const findings: Finding[] = []
  for (const name of ['README.md', 'AGENTS.md', 'GLOSSARY.md', 'docs/workflow.md']) {
    if (!context.exists(name)) {
      findings.push(finding('docs.required_file', { path: name }))
    }
  }
  for (const page of [
    'docs/norm/README.md',
    'docs/norm/foundations.md',
    'docs/norm/roles.md',
    'docs/norm/repository-readme.md',
    'docs/norm/flow.md',
    'docs/norm/rules.md',
    'docs/norm/overlays.md',
    'docs/norm/committing.md',
  ]) {
    if (!context.exists(page)) {
      findings.push(finding('docs.required_norm_page', { path: page }))
    }
  }
  return findings
}

/** Every directory that holds markdown carries a README. */
export function roleCoverage(context: Context): Finding[] {
  const findings: Finding[] = []
  for (const base of ['docs', 'template']) {
    if (!context.exists(base)) {
      findings.push(finding('docs.missing_directory', { path: `${base}/` }))
      continue
    }
    for (const directory of context.directories.filter(key => key.startsWith(`${base}/`))) {
      const pages = context
        .readDir(directory)
        .filter(entry => entry.isFile && entry.name.endsWith('.md'))
        .map(entry => `${directory}/${entry.name}`)
      if (pages.length === 0) {
        continue
      }
      if (!context.exists(`${directory}/README.md`)) {
        findings.push(finding('docs.missing_readme', { path: `${directory}/README.md` }))
      }
    }
  }
  return findings
}

export function emptyDirectories(context: Context): Finding[] {
  const findings: Finding[] = []
  for (const directory of context.directories) {
    const parts = directory.split('/')
    if (parts.includes('.git') || parts.includes('__pycache__')) {
      continue
    }
    if (context.readDir(directory).length === 0) {
      findings.push(finding('docs.empty_directory', { path: `${directory}/` }))
    }
  }
  return findings
}

export function english(context: Context): Finding[] {
  const findings: Finding[] = []
  for (const key of context.files) {
    if (CJK.test(context.readText(key))) {
      findings.push(finding('docs.cjk_text', { path: key }))
    }
  }
  return findings
}

export function links(context: Context): Finding[] {
  const findings: Finding[] = []
  for (const key of context.files) {
    for (const match of context.readText(key).matchAll(LINK)) {
      const target = match[1]
      if (target.startsWith('http://') || target.startsWith('https://')) {
        continue
      }
      if (target.startsWith('mailto:') || target.startsWith('#')) {
        continue
      }
      const bare = pyStrip(target.split('#')[0])
      if (!bare) {
        continue
      }
      const targetPath = path.resolve(context.root, path.dirname(key), bare)
      if (!fs.existsSync(targetPath)) {
        findings.push(finding('docs.broken_link', { path: key, target }))
      }
    }
  }
  return findings
}

export function budgets(context: Context): Finding[] {
  const findings: Finding[] = []
  for (const key of context.files) {
    const limits = budgetFor(key, baseName(key))
    if (!limits) {
      continue
    }
    const [soft, hard] = limits
    const measured = volume(context.readText(key))
    if (measured > hard) {
      findings.push(finding('budget.volume_hard', { path: key, measured, limit: hard }))
    } else if (measured > soft) {
      findings.push(finding('budget.volume_soft', { path: key, measured, limit: soft }))
    }
  }
  return findings
}

export function entries(context: Context): Finding[] {
  const findings: Finding[] = []
  for (const key of context.files) {
    const limit = entryLimit(key)
    if (limit === null) {
      continue
    }
    const measured = tableEntries(context.readText(key))
    if (measured > limit) {
      findings.push(finding('budget.entry_limit', { path: key, measured, limit }))
    }
  }
  return findings
}

export function markers(context: Context): Finding[] {
  const findings: Finding[] = []
  for (const key of context.files) {
    if (MARKER.test(context.readText(key))) {
      findings.push(finding('docs.unfinished_marker', { path: key }))
    }
  }
  return findings
}

/** Indexes and structure pages carry no totals: a count is a number that goes stale. */
export function indexAutonomy(context: Context): Finding[] {
  const findings: Finding[] = []
  for (const key of INDEX_PAGES) {
    if (!context.exists(key)) {
      continue
    }
    for (const match of context.readText(key).matchAll(COUNT_NOUN)) {
      findings.push(finding('docs.index_count', { path: key, token: pyRepr(match[0]) }))
    }
  }
  return findings
}

export function naming(context: Context): Finding[] {
  const findings: Finding[] = []
  for (const key of context.files) {
    const name = baseName(key)
    if (ROLE_NAMES.has(name)) {
      continue
    }
    if (!namingPattern(key).test(name)) {
      findings.push(finding('docs.name_role', { path: key }))
    }
  }
  return findings
}

export function rolePaths(context: Context): Finding[] {
  const findings: Finding[] = []
  for (const key of context.files) {
    if (!key.startsWith('docs/')) {
      continue
    }
    if (!DOC_ROLE_PATHS.some(pattern => pattern.test(key))) {
      findings.push(finding('docs.role_path', { path: key }))
    }
  }
  return findings
}

/**
 * A forwarding stub is not admitted (ADR-0028).
 *
 * The moved path belongs in `docs/adapters.md`; a file left at the old path reads as
 * content in every listing and cannot carry the successor's provenance.
 */
export function movedStubs(context: Context): Finding[] {
  const findings: Finding[] = []
  for (const key of context.files) {
    const title = splitLines(context.readText(key))[0]
    if (title && pyStrip(title).endsWith(MOVED_MARKER)) {
      findings.push(finding('docs.forwarding_stub', { path: key }))
    }
  }
  return findings
}

/**
 * An explainer ends each section at the page that owns its fact.
 *
 * A section with no link states something nobody owns, which is how a teaching page turns
 * into a second home (`docs/norm/roles.md`, the explainer row). The front matter and the
 * first section are exempt: the first says why the page exists, not a fact.
 */
export function explainerSections(context: Context): Finding[] {
  const findings: Finding[] = []
  for (const key of context.files) {
    if (!key.startsWith('docs/knowledge/explainers/') || baseName(key) === 'README.md') {
      continue
    }
    const sections = context.readText(key).split('\n## ').slice(2)
    for (const section of sections) {
      const heading = section.split('\n')[0].trim()
      if (!/\[[^\]]*\]\([^)]+\)/.test(section)) {
        findings.push(finding('docs.explainer_section', { path: key, heading }))
      }
    }
  }
  return findings
}

/**
 * A table row carries one space per cell; column padding is a finding.
 *
 * Padding is a formatting decision that hides the changed row in a diff and hands every
 * untouched row to the reformat commit in `git blame` (`docs/norm/rules.md`, R12). A cell
 * count that differs from the header is also reported: the formatter skips such a table,
 * and the default printer would pad it again.
 */
export function tables(context: Context): Finding[] {
  const findings: Finding[] = []
  for (const key of context.files) {
    let inFence = false
    let columns: number | null = null
    splitLines(context.readText(key)).forEach((line, index) => {
      const number = index + 1
      const stripped = pyStrip(line)
      if (stripped.startsWith('```') || stripped.startsWith('~~~')) {
        inFence = !inFence
        columns = null
        return
      }
      if (inFence) {
        return
      }
      if (!TABLE_ROW.test(stripped)) {
        columns = null
        return
      }
      const cells = splitCells(stripped)
      if (columns === null) {
        columns = cells.length
      } else if (cells.length !== columns) {
        findings.push(
          finding('table.cell_count', { path: key, line: number, cells: cells.length, columns }),
        )
      }
      for (const cell of cells) {
        const content = pyStrip(cell)
        if (content === '') {
          continue
        }
        if (cell !== ` ${content} `) {
          findings.push(finding('table.padding', { path: key, line: number }))
        }
        if (content.replace(CODE_SPAN, 'x').includes('  ')) {
          findings.push(finding('table.run_of_spaces', { path: key, line: number }))
        }
      }
    })
  }
  return findings
}

/**
 * The backlog index carries one of four statuses, and a typo is a finding.
 *
 * Status is the only column a reader filters the queue by, and it lives in the index
 * rather than in the item file (`docs/norm/roles.md`, "Backlog index"), so a misspelled
 * state has no second copy to correct it.
 */
export function backlogStatus(context: Context): Finding[] {
  const findings: Finding[] = []
  for (const key of context.files) {
    if (!BACKLOG_INDEXES.has(key)) {
      continue
    }
    let header: string[] | null = null
    splitLines(context.readText(key)).forEach((line, index) => {
      const number = index + 1
      const stripped = pyStrip(line)
      if (!TABLE_ROW.test(stripped)) {
        header = null
        return
      }
      const cells = splitCells(stripped)
      if (header === null) {
        header = cells
        return
      }
      if (matchesFully(TABLE_DELIMITER, stripped)) {
        return
      }
      const status = cells.length > 2 ? pyStrip(cells[2]) : ''
      if (!BACKLOG_STATUSES.has(status)) {
        findings.push(
          finding('backlog.status', { path: key, line: number, status: pyRepr(status) }),
        )
      }
    })
  }
  return findings
}

export function generated(context: Context): Finding[] {
  const findings: Finding[] = []
  for (const key of context.files) {
    const lines = splitLines(context.readText(key))
    if (lines.length > 0 && lines[0].startsWith('generated by')) {
      if (lines.length < 2 || pyStrip(lines[1]) !== '') {
        findings.push(finding('docs.generated_header', { path: key }))
      }
    }
  }
  for (const name of GENERATED_DIRS) {
    if (!context.exists(name)) {
      continue
    }
    for (const key of context.files.filter(item => item.startsWith(`${name}/`))) {
      const lines = splitLines(context.readText(key))
      if (lines.length === 0 || !lines[0].startsWith('generated by')) {
        findings.push(finding('docs.generated_file', { path: key }))
      }
    }
  }
  return findings
}

export interface RunResult {
  status: number | null
  stdout: string
  stderr: string
  error?: { message: string }
}

export type Runner = (command: string, args: string[], env: Record<string, string>) => RunResult

export interface ProseOptions {
  /** Defaults to `MD_TOOLS_PROJECT`. A test passes a value to skip the environment. */
  project?: string
  /** Defaults to a real `uv` process; a test passes a fake to cover the exit codes. */
  run?: Runner
}

export interface RunOptions extends ProseOptions {
  /**
   * Leave the prose stage out. Only CI passes this, because `md-tools` lives outside
   * this repository; the flag is explicit in the workflow so the omission is visible
   * where it happens, and the pass line names it (ADR-0025).
   */
  skipProse?: boolean
}

const runProcess: Runner = (command, args, env) => {
  const completed = spawnSync(command, args, { encoding: 'utf8', env })
  return {
    status: completed.status,
    stdout: typeof completed.stdout === 'string' ? completed.stdout : '',
    stderr: typeof completed.stderr === 'string' ? completed.stderr : '',
    error: completed.error ?? undefined,
  }
}

/**
 * Every paragraph is one line. The rule lives in `md-tools`; this stage calls it.
 *
 * The project root comes from `MD_TOOLS_PROJECT` because a machine-local path does not
 * belong in a file. A missing project, a code outside 0/1/2, or a report that did not get
 * written is a failure, never a skip: a prose check that passes because the tool was
 * absent is the failure this stage exists to catch (`docs/norm/rules.md`, the prose bullet
 * under "Naming and citation").
 */
export function prose(context: Context, options: ProseOptions = {}): Finding[] {
  const project = pyStrip(options.project ?? process.env.MD_TOOLS_PROJECT ?? '')
  if (!project) {
    return [finding('prose.project_unset')]
  }
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'check-'))
  try {
    const listing = path.join(directory, 'files.txt')
    const report = path.join(directory, 'report.json')
    fs.writeFileSync(
      listing,
      `${context.files.map(key => context.absolute(key)).join('\n')}\n`,
      'utf8',
    )
    const args = [
      'run',
      '--project',
      project,
      '--package',
      'md-tools',
      'md-reflow',
      '--check',
      '--quiet',
      '--list-file',
      listing,
      '--json',
      report,
    ]
    const environment: Record<string, string> = {}
    for (const [name, value] of Object.entries(process.env)) {
      if (name === 'VIRTUAL_ENV' || name === 'PYTHONHOME' || value === undefined) {
        continue
      }
      environment[name] = value
    }
    const completed = (options.run ?? runProcess)('uv', args, environment)
    if (completed.error) {
      return [finding('prose.run_error', { detail: completed.error.message })]
    }
    const code = completed.status ?? -1
    if (![0, 1, 2].includes(code) || !fs.existsSync(report)) {
      const detail = splitLines(pyStrip(completed.stderr || completed.stdout || ''))
      const tail = detail.length > 0 ? detail[detail.length - 1] : 'no output'
      return [finding('prose.exit_code', { code, detail: tail })]
    }
    const findings: Finding[] = []
    const payload = JSON.parse(fs.readFileSync(report, 'utf8')) as {
      files?: unknown
      files_skipped?: unknown
    }
    const rows = Array.isArray(payload.files) ? payload.files : []
    for (const row of rows) {
      const name = String((row as { path: unknown }).path)
      const relativePath = path.relative(context.root, path.resolve(name))
      const key =
        relativePath.startsWith('..') || path.isAbsolute(relativePath)
          ? name.split(path.sep).join('/')
          : relativePath.split(path.sep).join('/')
      const blocks = (row as { blocks: unknown }).blocks
      findings.push(finding('prose.hard_wrapped', { path: key, blocks: String(blocks) }))
    }
    const skipped = Number(payload.files_skipped ?? 0)
    if (skipped) {
      findings.push(finding('prose.unreadable', { files: skipped }))
    }
    return findings
  } finally {
    fs.rmSync(directory, { recursive: true, force: true })
  }
}

/** Run every check in the order `docs/norm/rules.md` lists them. */
export function runChecks(context: Context, options: RunOptions = {}): Finding[] {
  return [
    ...requiredFiles(context),
    ...packages(context),
    ...boardDashboard(context),
    ...roleCoverage(context),
    ...emptyDirectories(context),
    ...english(context),
    ...links(context),
    ...budgets(context),
    ...entries(context),
    ...markers(context),
    ...indexAutonomy(context),
    ...naming(context),
    ...rolePaths(context),
    ...movedStubs(context),
    ...explainerSections(context),
    ...tables(context),
    ...backlogStatus(context),
    ...generated(context),
    ...(options.skipProse ? [] : prose(context, options)),
  ]
}
