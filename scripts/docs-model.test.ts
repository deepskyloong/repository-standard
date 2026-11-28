/**
 * Tests for the measurement and budget layer. These are the numbers a volume finding
 * stands on, so each case pins a boundary rather than a sample.
 */

import { describe, expect, test } from 'bun:test'

import {
  budgetFor,
  entryLimit,
  namingPattern,
  pyRepr,
  sectionTableEntries,
  splitCells,
  splitLines,
  tableEntries,
  volume,
} from './docs-model.ts'

describe('splitLines', () => {
  test('a trailing break adds no empty line', () => {
    expect(splitLines('a\nb\n')).toEqual(['a', 'b'])
  })

  test('splits on every boundary Python recognizes', () => {
    expect(splitLines('a\r\nb\vc\fd\u2028e')).toEqual(['a', 'b', 'c', 'd', 'e'])
  })

  test('empty text has no lines', () => {
    expect(splitLines('')).toEqual([])
  })

  test('a lone break is one empty line', () => {
    expect(splitLines('\n')).toEqual([''])
  })
})

describe('volume', () => {
  test('counts non-whitespace characters and drops the delimiter row', () => {
    const text = '# T\n\n| a | b |\n| --- | --- |\n| 1 | 2 |\n'
    expect(volume(text)).toBe(12)
  })

  test('a wide delimiter row spends nothing', () => {
    const narrow = '| a |\n| --- |\n'
    const wide = '| a |\n| ------------------------- |\n'
    expect(volume(wide)).toBe(volume(narrow))
  })

  test('whitespace never counts, including a no-break space', () => {
    expect(volume('a\u00a0b')).toBe(2)
  })
})

describe('tableEntries', () => {
  test('counts rows and excludes the header and the delimiter', () => {
    expect(tableEntries('| A | B |\n| --- | --- |\n| 1 | 2 |\n| 3 | 4 |\n')).toBe(2)
  })

  test('a file with no table has no entries', () => {
    expect(tableEntries('# Title\n\nprose\n')).toBe(0)
  })
})

describe('sectionTableEntries', () => {
  const section = (rows: number): string =>
    [
      '## Routing table',
      '',
      '| Task | Read |',
      '| --- | --- |',
      ...Array.from({ length: rows }, () => '| x | y |'),
      '',
    ].join('\n')

  test('counts the table under the heading and ignores the one after it', () => {
    const text = `${section(12)}\n## Commands\n\n| Action | Command |\n| --- | --- |\n| a | b |\n`
    expect(sectionTableEntries(text, '## Routing table')).toBe(12)
  })

  test('a missing heading or a section without a table has no measurement', () => {
    expect(sectionTableEntries(section(3), '## Elsewhere')).toBeNull()
    expect(sectionTableEntries('## Routing table\n\nprose\n', '## Routing table')).toBeNull()
  })
})

describe('splitCells', () => {
  test('keeps padding and honours an escaped pipe', () => {
    expect(splitCells('| a \\| b | c |')).toEqual([' a \\| b ', ' c '])
  })

  test('a row with empty cells keeps them', () => {
    expect(splitCells('| a |  | c |')).toEqual([' a ', '  ', ' c '])
  })
})

describe('budgetFor', () => {
  test('an exact key wins', () => {
    expect(budgetFor('AGENTS.md', 'AGENTS.md')).toEqual([20_000, 32_000])
    expect(budgetFor('docs/norm/README.md', 'README.md')).toEqual([6_000, 12_000])
    expect(budgetFor('docs/norm/roles.md', 'roles.md')).toEqual([18_000, 24_000])
    expect(budgetFor('docs/decisions/README.md', 'README.md')).toEqual([8_000, 16_000])
  })

  test('a docs page takes the page budget', () => {
    expect(budgetFor('docs/norm/foundations.md', 'foundations.md')).toEqual([10_000, 16_000])
  })

  test('an ADR and a backlog item take their series budget', () => {
    expect(budgetFor('docs/decisions/ADR-0001-x.md', 'ADR-0001-x.md')).toEqual([7_500, 12_000])
    expect(budgetFor('docs/backlog/B-0001-x.md', 'B-0001-x.md')).toEqual([5_000, 8_000])
  })

  test('a work package summary takes its closeout budget', () => {
    expect(budgetFor('work-packages/x/summary.md', 'summary.md')).toEqual([3_750, 6_000])
  })

  test('package ledger files and item files carry no budget', () => {
    expect(budgetFor('work-packages/x/board.md', 'board.md')).toBeNull()
    expect(budgetFor('work-packages/x/items/W01.md', 'W01.md')).toBeNull()
  })

  test('an overlay guide is not an index', () => {
    expect(budgetFor('template/overlays/python/README.md', 'README.md')).toEqual([10_000, 16_000])
  })
})

describe('entryLimit', () => {
  test('the backlog and decisions indexes get 60 rows', () => {
    expect(entryLimit('docs/backlog/README.md')).toBe(60)
    expect(entryLimit('template/first-use/docs/backlog/README.md')).toBe(60)
    expect(entryLimit('docs/decisions/README.md')).toBe(60)
  })

  test('a directory README gets 40', () => {
    expect(entryLimit('docs/norm/README.md')).toBe(40)
  })

  test('an overlay README carries no row limit', () => {
    expect(entryLimit('template/overlays/python/README.md')).toBeNull()
  })

  test('a page that is not an index carries none', () => {
    expect(entryLimit('docs/norm/roles.md')).toBeNull()
  })
})

describe('namingPattern', () => {
  test('a record series owns its width', () => {
    expect(namingPattern('docs/decisions/ADR-0001-x.md').test('ADR-0001-x.md')).toBe(true)
    expect(namingPattern('docs/decisions/ADR-1-x.md').test('ADR-1-x.md')).toBe(false)
    expect(namingPattern('docs/backlog/B-0001-x.md').test('B-0002-y.md')).toBe(true)
  })

  test('an ordinary page is lowercase and hyphenated', () => {
    expect(namingPattern('docs/norm/roles.md').test('roles.md')).toBe(true)
    expect(namingPattern('docs/norm/roles.md').test('Roles_File.md')).toBe(false)
  })

  test('a work item file is named by its ID alone', () => {
    expect(namingPattern('work-packages/x/items/W01.md').test('W01.md')).toBe(true)
    expect(namingPattern('work-packages/x/items/W01.md').test('W04b-i.md')).toBe(true)
    expect(namingPattern('work-packages/x/items/W01.md').test('W07g.md')).toBe(true)
    expect(namingPattern('work-packages/x/items/W01.md').test('W07g-dispose.md')).toBe(false)
    expect(namingPattern('work-packages/x/items/W01.md').test('w07g.md')).toBe(false)
  })
})

describe('pyRepr', () => {
  test('quotes the way Python does', () => {
    expect(pyRepr('14 pages')).toBe("'14 pages'")
    expect(pyRepr("it's")).toBe('"it\'s"')
  })
})
