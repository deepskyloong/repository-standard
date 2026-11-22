/**
 * The work-package checks: the ledger shape and the board as a handoff card.
 * ADR-0021, ADR-0029, ADR-0030, and ADR-0036 define the package and its summary.
 */

import type { Context } from './check-context.ts'
import {
  matchesFully,
  pyRepr,
  pyStrip,
  splitCells,
  splitLines,
  TABLE_DELIMITER,
  TABLE_ROW,
} from './docs-model.ts'
import { finding, type Finding } from './findings.ts'

/** Every live and archived package, with archived as the flag. */
function packageDirs(context: Context): Array<{ key: string; archived: boolean }> {
  if (!context.exists('work-packages')) {
    return []
  }
  const live = context
    .readDir('work-packages')
    .filter(entry => entry.isDirectory && entry.name !== 'archive')
    .map(entry => ({ key: `work-packages/${entry.name}`, archived: false }))
  const archived = context.exists('work-packages/archive')
    ? context
        .readDir('work-packages/archive')
        .filter(entry => entry.isDirectory)
        .map(entry => ({ key: `work-packages/archive/${entry.name}`, archived: true }))
    : []
  return [...live, ...archived]
}

/**
 * A package carries its ledger files, one file per work item, and names the evidence
 * directories it owns.
 *
 * ADR-0021 and ADR-0029: four ledger files by closeout — spec, plan, board, summary —
 * and one `items/<ID>.md` per work item. `summary.md` is written at closeout, so it is
 * required only in the archive. `items/` is reserved, not evidence: it is never named in
 * the summary and archives with the package. Archived packages written before ADR-0029
 * keep `todo.md` and their item blocks; an open package uses `board.md`.
 */
export function packages(context: Context): Finding[] {
  const findings: Finding[] = []
  for (const { key, archived } of packageDirs(context)) {
    const board = `${key}/board.md`
    const ledger = new Set(
      archived
        ? ['spec.md', 'plan.md', 'board.md', 'todo.md', 'summary.md']
        : ['spec.md', 'plan.md', 'board.md', 'summary.md'],
    )
    for (const name of ['spec.md', 'plan.md']) {
      if (!context.isFile(`${key}/${name}`)) {
        findings.push(finding('package.file_missing', { path: `${key}/${name}` }))
      }
    }
    if (archived) {
      if (!context.isFile(`${key}/summary.md`)) {
        findings.push(finding('package.summary_missing', { path: `${key}/summary.md` }))
      }
      if (!context.isFile(board) && !context.isFile(`${key}/todo.md`)) {
        findings.push(finding('package.file_missing', { path: board }))
      }
    } else if (!context.isFile(board)) {
      findings.push(finding('package.file_missing', { path: board }))
    }
    for (const child of context.readDir(key)) {
      if (child.isFile && !ledger.has(child.name)) {
        findings.push(finding('package.file_unexpected', { path: `${key}/${child.name}` }))
      }
    }
    const summary = `${key}/summary.md`
    if (context.isFile(summary)) {
      const text = context.readText(summary)
      for (const part of summaryShape(text)) {
        findings.push(finding('package.summary_part', { path: summary, part }))
      }
      for (const child of context.readDir(key)) {
        if (child.isDirectory && child.name !== 'items' && !text.includes(child.name)) {
          findings.push(finding('package.evidence_unnamed', { path: `${key}/${child.name}/` }))
        }
      }
    }
    findings.push(...packageItems(context, key, context.isFile(board)))
  }
  return findings
}

const SUMMARY_SECTIONS = ['Outcome', 'Residuals', 'Compromises', 'Verification'] as const

/**
 * ADR-0036: a summary that carries `Date:` uses the closeout shape. A summary
 * without it is a frozen record written before the change and keeps its shape.
 */
function summaryShape(text: string): string[] {
  const date = text.match(/^\*{0,2}Date:\*{0,2} (.+)$/m)
  if (!date) {
    return []
  }
  const missing: string[] = []
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date[1].trim())) {
    missing.push('Date (YYYY-MM-DD)')
  }
  if (!/^\*{0,2}Acceptance:\*{0,2} (met|not met) — /m.test(text)) {
    missing.push('Acceptance:')
  }
  if (!/^\*{0,2}Gate:\*{0,2} /m.test(text)) {
    missing.push('Gate:')
  }
  if (!/^\*{0,2}Criteria:\*{0,2}$/m.test(text)) {
    missing.push('Criteria:')
  }
  for (const section of SUMMARY_SECTIONS) {
    if (!new RegExp(`^## ${section}$`, 'm').test(text)) {
      missing.push(`## ${section}`)
    }
  }
  if (!/^\*{0,2}Evidence:\*{0,2} /m.test(text)) {
    missing.push('Evidence:')
  }
  return missing
}

/** Every item file starts with its ID, and the board links exactly the files that exist. */
function packageItems(context: Context, key: string, hasBoard: boolean): Finding[] {
  const directory = `${key}/items`
  const findings: Finding[] = []
  const names: string[] = []
  if (context.exists(directory)) {
    for (const child of context.readDir(directory)) {
      if (!child.isFile || !child.name.endsWith('.md')) {
        findings.push(finding('package.item_entry', { path: `${directory}/${child.name}` }))
        continue
      }
      names.push(child.name)
      const id = child.name.slice(0, -3)
      if (!context.readText(`${directory}/${child.name}`).startsWith(`# ${id} — `)) {
        findings.push(finding('package.item_heading', { path: `${directory}/${child.name}` }))
      }
    }
  }
  if (!hasBoard) {
    return findings
  }
  const links = new Set<string>()
  for (const match of context.readText(`${key}/board.md`).matchAll(/\]\(items\/([^)]+\.md)\)/g)) {
    links.add(match[1])
  }
  for (const name of names) {
    if (!links.has(name)) {
      findings.push(finding('package.item_unlinked', { path: `${directory}/${name}` }))
    }
  }
  for (const link of links) {
    if (!names.includes(link)) {
      findings.push(finding('package.item_missing', { path: `${key}/items/${link}` }))
    }
  }
  return findings
}

const BOARD_FIELDS = [
  'Updated',
  'Status',
  'Phase',
  'Gate',
  'Next',
  'Last done',
  'Blocked',
  'Open decisions',
] as const

const BOARD_STATUSES = new Set(['todo', 'doing', 'blocked', 'done', 'dropped'])
const REPOSITORY_HEADER = ['Repository', 'Branch', 'Gate command', 'Last result']
const ITEM_ID = /W\d{2}[a-z]*(?:-[ivx]+)?/

/** Every work-item ID named in a value. */
function itemIds(value: string): string[] {
  return [...value.matchAll(new RegExp(ITEM_ID.source, 'g'))].map(match => match[0])
}

/** The `- Field: value` lines of `## Current state`, stopping at the next heading. */
function dashboardFields(text: string): Map<string, string> {
  const fields = new Map<string, string>()
  let inState = false
  for (const line of splitLines(text)) {
    const stripped = pyStrip(line)
    if (stripped === '## Current state') {
      inState = true
      continue
    }
    if (inState && stripped.startsWith('## ')) {
      break
    }
    if (!inState || !stripped.startsWith('- ')) {
      continue
    }
    const match = stripped.slice(2).match(/^([A-Za-z][A-Za-z ]*):\s*(.*)$/)
    if (match) {
      fields.set(match[1], pyStrip(match[2]))
    }
  }
  return fields
}

interface BoardItem {
  id: string
  file: string
  status: string
}

/** The index rows: one linked item per row, with its status. */
function indexItems(text: string): BoardItem[] {
  const items: BoardItem[] = []
  for (const line of splitLines(text)) {
    const stripped = pyStrip(line)
    if (!TABLE_ROW.test(stripped) || matchesFully(TABLE_DELIMITER, stripped)) {
      continue
    }
    const cells = splitCells(stripped).map(cell => pyStrip(cell))
    if (cells.length < 3 || !cells[0].startsWith('[')) {
      continue
    }
    const match = cells[0].match(/\[([^\]]+)\]\(items\/([^)]+\.md)\)/)
    if (match) {
      items.push({ id: match[1], file: match[2], status: cells[2] })
    }
  }
  return items
}

interface RepositoryTable {
  header: string[]
  rows: string[][]
}

/** The `## Repositories` table, or null when the section has none. */
function repositoryTable(text: string): RepositoryTable | null {
  let inSection = false
  let header: string[] | null = null
  const rows: string[][] = []
  for (const line of splitLines(text)) {
    const stripped = pyStrip(line)
    if (stripped === '## Repositories') {
      inSection = true
      continue
    }
    if (inSection && stripped.startsWith('## ')) {
      break
    }
    if (!inSection || !TABLE_ROW.test(stripped) || matchesFully(TABLE_DELIMITER, stripped)) {
      continue
    }
    const cells = splitCells(stripped).map(cell => pyStrip(cell))
    if (header === null) {
      header = cells
    } else {
      rows.push(cells)
    }
  }
  return header === null ? null : { header, rows }
}

interface BlockedClause {
  id: string
  hasReason: boolean
}

/** The clauses of a `Blocked` line: a leading item ID and whether a parenthesized reason follows. */
function blockedClauses(value: string): BlockedClause[] {
  const clauses: BlockedClause[] = []
  for (const clause of value.split(';')) {
    const trimmed = clause.trim()
    const match = trimmed.match(ITEM_ID)
    if (!match || match.index !== 0) {
      continue
    }
    const after = trimmed.slice(match[0].length).trimStart()
    clauses.push({ id: match[0], hasReason: after.startsWith('(') })
  }
  return clauses
}

/**
 * The board is a handoff card, not a report (`docs/norm/flow.md`).
 *
 * A projection check: the fields keep their reading order, `Next` must point at a
 * doing or todo item (or closeout/none), `Blocked` must name exactly the blocked rows,
 * and `Last done` must be a done item. Counts and prose are not recomputed; the index
 * is the only list.
 */
export function boardDashboard(context: Context): Finding[] {
  const findings: Finding[] = []
  for (const { key, archived } of packageDirs(context)) {
    const board = `${key}/board.md`
    if (!context.isFile(board)) {
      continue
    }
    const text = context.readText(board)
    const fields = dashboardFields(text)
    for (const name of BOARD_FIELDS) {
      if (!fields.has(name)) {
        findings.push(finding('board.field_missing', { path: board, field: name }))
      } else if (fields.get(name) === '') {
        findings.push(finding('board.field_empty', { path: board, field: name }))
      }
    }
    const ordered = [...fields.keys()].filter(name =>
      (BOARD_FIELDS as readonly string[]).includes(name),
    )
    if (
      ordered.length === BOARD_FIELDS.length &&
      ordered.some((name, index) => name !== BOARD_FIELDS[index])
    ) {
      findings.push(finding('board.field_order', { path: board }))
    }

    const status = fields.get('Status') ?? ''
    if (status !== 'open' && status !== 'closed') {
      findings.push(finding('board.status_value', { path: board }))
    } else if (!archived && status !== 'open') {
      findings.push(finding('board.open_says_closed', { path: board }))
    } else if (archived && status !== 'closed') {
      findings.push(finding('board.archived_says_open', { path: board }))
    }

    const updated = fields.get('Updated') ?? ''
    if (!/^\d{4}-\d{2}-\d{2}$/.test(updated)) {
      findings.push(finding('board.updated_format', { path: board }))
    }

    const phase = fields.get('Phase') ?? ''
    if (!/^P\d+ — /.test(phase)) {
      findings.push(finding('board.phase_format', { path: board }))
    }

    const repositories = repositoryTable(text)
    if (repositories === null) {
      findings.push(finding('board.repositories_missing', { path: board }))
    } else {
      if (repositories.header.join('|') !== REPOSITORY_HEADER.join('|')) {
        findings.push(finding('board.repositories_header', { path: board }))
      }
      if (repositories.rows.length === 0) {
        findings.push(finding('board.repositories_empty', { path: board }))
      }
      for (const row of repositories.rows) {
        if (row.length !== REPOSITORY_HEADER.length) {
          findings.push(finding('board.repositories_cells', { path: board, cells: row.length }))
        } else if (row.some(cell => cell === '')) {
          findings.push(finding('board.repositories_cell_empty', { path: board }))
        }
      }
    }

    const items = indexItems(text)
    const byId = new Map(items.map(item => [item.id, item]))
    const blocked = new Set(items.filter(item => item.status === 'blocked').map(item => item.id))
    for (const item of items) {
      if (!BOARD_STATUSES.has(item.status)) {
        findings.push(
          finding('board.item_status', { path: board, status: pyRepr(item.status), item: item.id }),
        )
      }
      if (item.status === 'dropped') {
        const file = `${key}/items/${item.file}`
        if (!context.isFile(file) || !context.readText(file).includes('**Disposition**:')) {
          findings.push(finding('board.dropped_disposition', { path: file }))
        }
      }
    }

    const next = fields.get('Next') ?? ''
    const nextIds = itemIds(next)
    if (nextIds.length > 1) {
      findings.push(finding('board.next_multiple', { path: board }))
    }
    const nextKind = next.split(' — ')[0].trim()
    if (nextKind === 'none') {
      if (items.some(item => item.status === 'todo' || item.status === 'doing')) {
        findings.push(finding('board.next_none_with_work', { path: board }))
      }
    } else if (nextKind === 'closeout') {
      if (
        items.some(
          item => item.status === 'todo' || item.status === 'doing' || item.status === 'blocked',
        )
      ) {
        findings.push(finding('board.next_closeout_with_work', { path: board }))
      }
    } else {
      const id = next.match(ITEM_ID)?.[0]
      if (!id) {
        findings.push(finding('board.next_kind', { path: board }))
      } else {
        const item = byId.get(id)
        if (!item) {
          findings.push(finding('board.next_missing_item', { path: board, item: id }))
        } else if (item.status !== 'doing' && item.status !== 'todo') {
          findings.push(
            finding('board.next_wrong_status', { path: board, status: item.status, item: id }),
          )
        }
      }
    }

    const blockedLine = fields.get('Blocked') ?? ''
    if (blockedLine === 'none') {
      if (blocked.size > 0) {
        findings.push(finding('board.blocked_none_with_blocked', { path: board }))
      }
    } else {
      const clauses = blockedClauses(blockedLine)
      const named = new Set(clauses.map(clause => clause.id))
      for (const clause of clauses) {
        if (!clause.hasReason) {
          findings.push(finding('board.blocked_no_reason', { path: board, item: clause.id }))
        }
        const item = byId.get(clause.id)
        if (!item) {
          findings.push(finding('board.blocked_missing_item', { path: board, item: clause.id }))
        } else if (item.status !== 'blocked') {
          findings.push(
            finding('board.blocked_wrong_status', {
              path: board,
              status: item.status,
              item: clause.id,
            }),
          )
        }
      }
      for (const id of blocked) {
        if (!named.has(id)) {
          findings.push(finding('board.blocked_omitted', { path: board, item: id }))
        }
      }
    }

    const lastDone = fields.get('Last done') ?? ''
    const lastDoneIds = itemIds(lastDone)
    if (lastDoneIds.length > 1) {
      findings.push(finding('board.lastdone_multiple', { path: board }))
    }
    if (lastDone === 'none') {
      if (items.some(item => item.status === 'done')) {
        findings.push(finding('board.lastdone_none_with_done', { path: board }))
      }
    } else {
      const id = lastDone.match(ITEM_ID)?.[0]
      if (!id) {
        findings.push(finding('board.lastdone_kind', { path: board }))
      } else {
        const item = byId.get(id)
        if (!item) {
          findings.push(finding('board.lastdone_missing_item', { path: board, item: id }))
        } else if (item.status !== 'done') {
          findings.push(
            finding('board.lastdone_wrong_status', { path: board, status: item.status, item: id }),
          )
        }
      }
    }
  }
  return findings
}
