/**
 * Tests for the work-package checks: the ledger and the board as a handoff card.
 */

import { afterEach, describe, expect, test } from 'bun:test'

import { createContext } from './check-context.ts'
import { boardDashboard, packages } from './package-checks.ts'
import { cleanupFixtures, codes, fixture } from './test-fixtures.ts'

afterEach(cleanupFixtures)
describe('packages', () => {
  const boardWithItem =
    '# Board\n\n| Item | Title | Status |\n| --- | --- | --- |\n| [W01](items/W01.md) | One | todo |\n'

  test('an open package carries three ledger files and nothing else', () => {
    const findings = packages(
      createContext(
        fixture({
          'work-packages/x/spec.md': '# S\n',
          'work-packages/x/plan.md': '# P\n',
          'work-packages/x/board.md': '# Board\n',
          'work-packages/x/stray.md': '# X\n',
        }),
      ),
    )
    expect(codes(findings)).toEqual(['package.file_unexpected'])
  })

  test('an open package without a board is a finding', () => {
    const findings = packages(
      createContext(
        fixture({
          'work-packages/x/spec.md': '# S\n',
          'work-packages/x/plan.md': '# P\n',
        }),
      ),
    )
    expect(codes(findings)).toEqual(['package.file_missing'])
  })

  test('an archived package needs its summary', () => {
    const findings = packages(
      createContext(
        fixture({
          'work-packages/archive/y/spec.md': '# S\n',
          'work-packages/archive/y/plan.md': '# P\n',
          'work-packages/archive/y/todo.md': '# T\n',
        }),
      ),
    )
    expect(codes(findings)).toEqual(['package.summary_missing'])
  })

  test('an archived package may keep the pre-board shape', () => {
    const findings = packages(
      createContext(
        fixture({
          'work-packages/archive/y/spec.md': '# S\n',
          'work-packages/archive/y/plan.md': '# P\n',
          'work-packages/archive/y/todo.md': '# T\n',
          'work-packages/archive/y/summary.md': '# Summary\n',
        }),
      ),
    )
    expect(codes(findings)).toEqual([])
  })

  test('evidence has to be named in the summary', () => {
    const findings = packages(
      createContext(
        fixture({
          'work-packages/x/spec.md': '# S\n',
          'work-packages/x/plan.md': '# P\n',
          'work-packages/x/board.md': '# Board\n',
          'work-packages/x/summary.md': '# Summary\n',
          'work-packages/x/audits/report.md': '# Audit\n',
        }),
      ),
    )
    expect(codes(findings)).toEqual(['package.evidence_unnamed'])
  })

  test('items/ is not evidence and needs no summary row', () => {
    const findings = packages(
      createContext(
        fixture({
          'work-packages/x/spec.md': '# S\n',
          'work-packages/x/plan.md': '# P\n',
          'work-packages/x/board.md': boardWithItem,
          'work-packages/x/summary.md': '# Summary\n',
          'work-packages/x/items/W01.md': '# W01 — One\n\n**Depends on**: none\n',
        }),
      ),
    )
    expect(codes(findings)).toEqual([])
  })

  test('a dated summary answers the reader questions', () => {
    const findings = packages(
      createContext(
        fixture({
          'work-packages/x/spec.md': '# S\n',
          'work-packages/x/plan.md': '# P\n',
          'work-packages/x/board.md': '# Board\n',
          'work-packages/x/summary.md': `# Summary

**Date:** 2026-11-21

**Acceptance:** met — all criteria answered

**Gate:** \`bun run gate\` — 2026-11-21, PASS

**Criteria:**

- one criterion — \`bun run gate\`

## Outcome

None.

## Residuals

None.

## Compromises

None.

## Verification

- Survivors: none
- Reproduce: none

Evidence: none
`,
        }),
      ),
    )
    expect(codes(findings)).toEqual([])
  })

  test('a dated summary names every missing part', () => {
    const findings = packages(
      createContext(
        fixture({
          'work-packages/x/spec.md': '# S\n',
          'work-packages/x/plan.md': '# P\n',
          'work-packages/x/board.md': '# Board\n',
          'work-packages/x/summary.md':
            '# Summary\n\n**Date:** 2026-11-21\n\n**Acceptance:** met — ok\n',
        }),
      ),
    )
    expect(codes(findings)).toEqual([
      'package.summary_part',
      'package.summary_part',
      'package.summary_part',
      'package.summary_part',
      'package.summary_part',
      'package.summary_part',
      'package.summary_part',
    ])
  })

  test('a summary without Date keeps its pre-change shape', () => {
    const findings = packages(
      createContext(
        fixture({
          'work-packages/x/spec.md': '# S\n',
          'work-packages/x/plan.md': '# P\n',
          'work-packages/x/board.md': '# Board\n',
          'work-packages/x/summary.md': '# Summary\n\n## Done\n\nOld shape.\n',
        }),
      ),
    )
    expect(codes(findings)).toEqual([])
  })

  test('an item file must be linked from the board', () => {
    const findings = packages(
      createContext(
        fixture({
          'work-packages/x/spec.md': '# S\n',
          'work-packages/x/plan.md': '# P\n',
          'work-packages/x/board.md': '# Board\n',
          'work-packages/x/items/W01.md': '# W01 — One\n',
        }),
      ),
    )
    expect(codes(findings)).toEqual(['package.item_unlinked'])
  })

  test('a board link without a file is a finding', () => {
    const findings = packages(
      createContext(
        fixture({
          'work-packages/x/spec.md': '# S\n',
          'work-packages/x/plan.md': '# P\n',
          'work-packages/x/board.md': boardWithItem,
        }),
      ),
    )
    expect(codes(findings)).toEqual(['package.item_missing'])
  })

  test('an item heading must start with its ID', () => {
    const findings = packages(
      createContext(
        fixture({
          'work-packages/x/spec.md': '# S\n',
          'work-packages/x/plan.md': '# P\n',
          'work-packages/x/board.md': boardWithItem,
          'work-packages/x/items/W01.md': '# One\n',
        }),
      ),
    )
    expect(codes(findings)).toEqual(['package.item_heading'])
  })

  test('items/ holds only markdown item files', () => {
    const findings = packages(
      createContext(
        fixture({
          'work-packages/x/spec.md': '# S\n',
          'work-packages/x/plan.md': '# P\n',
          'work-packages/x/board.md': boardWithItem,
          'work-packages/x/items/W01.md': '# W01 — One\n',
          'work-packages/x/items/notes.txt': 'x\n',
        }),
      ),
    )
    expect(codes(findings)).toEqual(['package.item_entry'])
  })
})

describe('boardDashboard', () => {
  const validBoard = `# Board

## Current state

- Updated: 2026-11-20
- Status: open
- Phase: P1 — work
- Gate: all green (2026-11-20); per-repository detail below
- Next: W02 — start
- Last done: W01 — done (abc1234)
- Blocked: none
- Open decisions: none

## Repositories

| Repository | Branch | Gate command | Last result |
| --- | --- | --- | --- |
| standard | \`main\` | \`bun run gate\` | PASS (2026-11-20) |

## Work items

| Item | Title | Status |
| --- | --- | --- |
| [W01](items/W01.md) | One | done |
| [W02](items/W02.md) | Two | todo |
`

  function packageWithBoard(board: string, extra: Record<string, string> = {}): string {
    return fixture({
      'work-packages/x/spec.md': '# S\n',
      'work-packages/x/plan.md': '# P\n',
      'work-packages/x/board.md': board,
      'work-packages/x/items/W01.md': '# W01 — One\n\n**Evidence**: abc\n',
      'work-packages/x/items/W02.md': '# W02 — Two\n',
      ...extra,
    })
  }

  test('a consistent handoff card is silent', () => {
    const findings = boardDashboard(createContext(packageWithBoard(validBoard)))
    expect(codes(findings)).toEqual([])
  })

  test('Next and Last done stay adjacent', () => {
    const board = validBoard.replace(
      '- Last done: W01 — done (abc1234)\n- Blocked: none',
      '- Blocked: none\n- Last done: W01 — done (abc1234)',
    )
    const findings = boardDashboard(createContext(packageWithBoard(board)))
    expect(codes(findings)).toContain('board.field_order')
  })

  test('an empty field is a finding', () => {
    const board = validBoard.replace(
      '- Gate: all green (2026-11-20); per-repository detail below',
      '- Gate:',
    )
    const findings = boardDashboard(createContext(packageWithBoard(board)))
    expect(codes(findings)).toContain('board.field_empty')
  })

  test('a Repositories row needs every cell', () => {
    const board = validBoard.replace(
      '| standard | `main` | `bun run gate` | PASS (2026-11-20) |',
      '| standard | `main` | `bun run gate` |  |',
    )
    const findings = boardDashboard(createContext(packageWithBoard(board)))
    expect(codes(findings)).toContain('board.repositories_cell_empty')
  })

  test('Next names one item', () => {
    const board = validBoard.replace('- Next: W02 — start', '- Next: W02 — start; W03 — then')
    const findings = boardDashboard(createContext(packageWithBoard(board)))
    expect(codes(findings)).toContain('board.next_multiple')
  })

  test('Last done names one item', () => {
    const board = validBoard.replace(
      '- Last done: W01 — done (abc1234)',
      '- Last done: W01 — done (abc1234); W02 closed',
    )
    const findings = boardDashboard(createContext(packageWithBoard(board)))
    expect(codes(findings)).toContain('board.lastdone_multiple')
  })

  test('Next points at a todo or doing item, not a done one', () => {
    const board = validBoard.replace('- Next: W02 — start', '- Next: W01 — finish')
    const findings = boardDashboard(createContext(packageWithBoard(board)))
    expect(codes(findings)).toContain('board.next_wrong_status')
  })

  test('Next none is wrong while an item is todo', () => {
    const board = validBoard.replace('- Next: W02 — start', '- Next: none')
    const findings = boardDashboard(createContext(packageWithBoard(board)))
    expect(codes(findings)).toContain('board.next_none_with_work')
  })

  test('Next closeout is wrong while work remains', () => {
    const board = validBoard.replace('- Next: W02 — start', '- Next: closeout — write summary')
    const findings = boardDashboard(createContext(packageWithBoard(board)))
    expect(codes(findings)).toContain('board.next_closeout_with_work')
  })

  test('Blocked none is wrong while an item is blocked', () => {
    const board = validBoard
      .replace('- Next: W02 — start', '- Next: none')
      .replace('| [W02](items/W02.md) | Two | todo |', '| [W02](items/W02.md) | Two | blocked |')
    const findings = boardDashboard(createContext(packageWithBoard(board)))
    expect(codes(findings)).toContain('board.blocked_none_with_blocked')
  })

  test('Blocked must name every blocked row', () => {
    const board = validBoard
      .replace('- Next: W02 — start', '- Next: none')
      .replace('- Blocked: none', '- Blocked: W01 (done)')
      .replace('| [W02](items/W02.md) | Two | todo |', '| [W02](items/W02.md) | Two | blocked |')
    const findings = boardDashboard(createContext(packageWithBoard(board)))
    expect(codes(findings)).toContain('board.blocked_omitted')
  })

  test('Blocked may not name a non-blocked item', () => {
    const board = validBoard.replace('- Blocked: none', '- Blocked: W02 (waiting)')
    const findings = boardDashboard(createContext(packageWithBoard(board)))
    expect(codes(findings)).toContain('board.blocked_wrong_status')
  })

  test('Blocked clauses carry a reason', () => {
    const board = validBoard
      .replace('- Next: W02 — start', '- Next: none')
      .replace('- Blocked: none', '- Blocked: W02')
      .replace('| [W02](items/W02.md) | Two | todo |', '| [W02](items/W02.md) | Two | blocked |')
    const findings = boardDashboard(createContext(packageWithBoard(board)))
    expect(codes(findings)).toContain('board.blocked_no_reason')
  })

  test('Last done points at a done item', () => {
    const board = validBoard.replace('- Last done: W01 — done (abc1234)', '- Last done: W02 — done')
    const findings = boardDashboard(createContext(packageWithBoard(board)))
    expect(codes(findings)).toContain('board.lastdone_wrong_status')
  })

  test('Status follows the package location', () => {
    const board = validBoard.replace('- Status: open', '- Status: closed')
    const findings = boardDashboard(createContext(packageWithBoard(board)))
    expect(codes(findings)).toContain('board.open_says_closed')
  })

  test('a dropped item carries a Disposition', () => {
    const board = validBoard
      .replace('- Next: W02 — start', '- Next: none')
      .replace('| [W02](items/W02.md) | Two | todo |', '| [W02](items/W02.md) | Two | dropped |')
    const findings = boardDashboard(createContext(packageWithBoard(board)))
    expect(codes(findings)).toContain('board.dropped_disposition')
  })

  test('a board without the Repositories table is a finding', () => {
    const board = validBoard.replace(
      /\n## Repositories\n\n[\s\S]*?\n## Work items/,
      '\n## Work items',
    )
    const findings = boardDashboard(createContext(packageWithBoard(board)))
    expect(codes(findings)).toContain('board.repositories_missing')
  })

  test('a malformed field set is reported field by field', () => {
    const board = validBoard
      .replace('- Status: open', '- Status: pending')
      .replace('- Updated: 2026-11-20', '- Updated: 20-11-2026')
      .replace('- Phase: P1 — work', '- Phase: work')
      .replace('- Next: W02 — start', '- Next: later')
      .replace('- Blocked: none', '- Blocked: W09 (missing)')
      .replace('- Last done: W01 — done (abc1234)', '- Last done: W09 — done')
      .replace('- Open decisions: none\n', '')
    const findings = boardDashboard(createContext(packageWithBoard(board)))
    const seen = codes(findings)
    for (const code of [
      'board.field_missing',
      'board.status_value',
      'board.updated_format',
      'board.phase_format',
      'board.next_kind',
      'board.blocked_missing_item',
      'board.lastdone_missing_item',
    ]) {
      expect(seen).toContain(code)
    }
  })

  test('the Repositories table keeps its header, its rows, and their width', () => {
    const header = validBoard.replace(
      '| Repository | Branch | Gate command | Last result |',
      '| Repo | Branch | Gate | Result |',
    )
    const headerCodes = codes(boardDashboard(createContext(packageWithBoard(header))))
    expect(headerCodes).toContain('board.repositories_header')
    const empty = validBoard.replace(
      '| standard | `main` | `bun run gate` | PASS (2026-11-20) |\n',
      '',
    )
    const emptyCodes = codes(boardDashboard(createContext(packageWithBoard(empty))))
    expect(emptyCodes).toContain('board.repositories_empty')
    const narrow = validBoard.replace(
      '| standard | `main` | `bun run gate` | PASS (2026-11-20) |',
      '| standard | `main` | `bun run gate` |',
    )
    const narrowCodes = codes(boardDashboard(createContext(packageWithBoard(narrow))))
    expect(narrowCodes).toContain('board.repositories_cells')
  })

  test('a status outside the five is a finding', () => {
    const board = validBoard.replace(
      '| [W02](items/W02.md) | Two | todo |',
      '| [W02](items/W02.md) | Two | paused |',
    )
    const seen = codes(boardDashboard(createContext(packageWithBoard(board))))
    expect(seen).toContain('board.item_status')
  })

  test('Next and Last done name a known item or none', () => {
    const board = validBoard
      .replace('- Next: W02 — start', '- Next: W09 — start')
      .replace('- Last done: W01 — done (abc1234)', '- Last done: later')
    const seen = codes(boardDashboard(createContext(packageWithBoard(board))))
    expect(seen).toContain('board.next_missing_item')
    expect(seen).toContain('board.lastdone_kind')
  })

  test('Last done none is wrong while an item is done', () => {
    const board = validBoard.replace('- Last done: W01 — done (abc1234)', '- Last done: none')
    const seen = codes(boardDashboard(createContext(packageWithBoard(board))))
    expect(seen).toContain('board.lastdone_none_with_done')
  })

  test('an archived package that says open is a finding', () => {
    const board = validBoard
    const findings = boardDashboard(
      createContext(fixture({ 'work-packages/archive/y/board.md': board })),
    )
    expect(codes(findings)).toContain('board.archived_says_open')
  })
})
