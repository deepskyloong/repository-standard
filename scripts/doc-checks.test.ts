/**
 * Tests for the generic checks. Each case builds the smallest repository the rule can
 * be violated in, so a rule that stops firing shows up as a failing expectation instead
 * of a quiet green gate.
 */

import { afterEach, describe, expect, test } from 'bun:test'
import * as fs from 'node:fs'
import * as path from 'node:path'

import { createContext } from './check-context.ts'
import {
  backlogStatus,
  budgets,
  emptyDirectories,
  english,
  entries,
  explainerSections,
  generated,
  indexAutonomy,
  links,
  markers,
  movedStubs,
  naming,
  prose,
  requiredFiles,
  roleCoverage,
  rolePaths,
  routingRows,
  runChecks,
  tables,
  type Runner,
} from './doc-checks.ts'
import { cleanupFixtures, codes, fixture } from './test-fixtures.ts'

afterEach(cleanupFixtures)
describe('requiredFiles', () => {
  test('names the file that is missing', () => {
    const findings = requiredFiles(createContext(fixture({ 'README.md': '# R\n' })))
    expect(codes(findings)).toContain('docs.required_file')
    expect(codes(findings)).toContain('docs.required_norm_page')
  })

  test('a complete set is silent', () => {
    const findings = requiredFiles(
      createContext(
        fixture({
          'README.md': '# R\n',
          'AGENTS.md': '# A\n',
          'GLOSSARY.md': '# G\n',
          'docs/workflow.md': '# W\n',
          ...Object.fromEntries(
            [
              'docs/norm/README.md',
              'docs/norm/foundations.md',
              'docs/norm/roles.md',
              'docs/norm/repository-readme.md',
              'docs/norm/flow.md',
              'docs/norm/rules.md',
              'docs/norm/overlays.md',
              'docs/norm/committing.md',
            ].map(page => [page, '# P\n']),
          ),
        }),
      ),
    )
    expect(findings).toEqual([])
  })
})

describe('roleCoverage', () => {
  test('a directory of pages without a README is a finding', () => {
    const findings = roleCoverage(createContext(fixture({ 'docs/norm/roles.md': '# Roles\n' })))
    expect(codes(findings)).toEqual(['docs.missing_readme', 'docs.missing_directory'])
  })

  test('a directory of pages without a README stays a finding', () => {
    const findings = roleCoverage(
      createContext(
        fixture({
          'docs/legacy/a.md': '# A\n',
          'docs/legacy/b.md': '# B\n',
          'template/README.md': '# T\n',
        }),
      ),
    )
    expect(codes(findings)).toEqual(['docs.missing_readme'])
  })
})

describe('emptyDirectories', () => {
  test('an empty directory is a finding', () => {
    const findings = emptyDirectories(createContext(fixture({ 'docs/empty/': '' })))
    expect(codes(findings)).toEqual(['docs.empty_directory'])
  })
})

describe('english', () => {
  test('CJK anywhere in a page is a finding', () => {
    const findings = english(createContext(fixture({ 'docs/a.md': 'a sentence 中文 here\n' })))
    expect(codes(findings)).toEqual(['docs.cjk_text'])
  })

  test('full-width punctuation counts as CJK', () => {
    const findings = english(createContext(fixture({ 'docs/a.md': 'stop。\n' })))
    expect(codes(findings)).toEqual(['docs.cjk_text'])
  })
})

describe('links', () => {
  test('a missing target is a finding, an external link is not', () => {
    const findings = links(
      createContext(
        fixture({
          'docs/a.md': '[gone](missing.md) [web](https://example.com) [here](#top)\n',
          'docs/b.md': '[peer](b.md)\n',
        }),
      ),
    )
    expect(codes(findings)).toEqual(['docs.broken_link'])
  })
})

describe('budgets', () => {
  test('above the hard line fails and above the soft line warns', () => {
    const hard = budgets(createContext(fixture({ 'AGENTS.md': 'x'.repeat(32_001) })))
    expect(codes(hard)).toEqual(['budget.volume_hard'])

    const soft = budgets(createContext(fixture({ 'AGENTS.md': 'x'.repeat(20_001) })))
    expect(codes(soft)).toEqual(['budget.volume_soft'])
  })

  test('a file under the soft line is silent', () => {
    expect(budgets(createContext(fixture({ 'AGENTS.md': 'x'.repeat(1_000) })))).toEqual([])
  })
})

describe('entries', () => {
  test('one row over the limit is a finding', () => {
    const rows = ['| A |', '| --- |', ...Array.from({ length: 41 }, () => '| row |')]
    const findings = entries(createContext(fixture({ 'docs/README.md': `${rows.join('\n')}\n` })))
    expect(codes(findings)).toEqual(['budget.entry_limit'])
  })
})

describe('routingRows', () => {
  const routing = (rows: number): string =>
    [
      '## Which file answers which question',
      '',
      '| Task | Read |',
      '| --- | --- |',
      ...Array.from({ length: rows }, () => '| x | y |'),
    ].join('\n')

  test('counts the routing table, not the tables beside it', () => {
    const text = [
      '# A',
      '',
      routing(13),
      '',
      '## Change surface',
      '',
      '| Change | Also update |',
      '| --- | --- |',
      ...Array.from({ length: 12 }, () => '| a | b |'),
      '',
    ].join('\n')
    const findings = routingRows(createContext(fixture({ 'AGENTS.md': text })))
    expect(codes(findings)).toEqual(['budget.routing_rows'])
  })

  test('twelve rows are inside the limit', () => {
    const findings = routingRows(createContext(fixture({ 'AGENTS.md': routing(12) })))
    expect(findings).toEqual([])
  })

  test('a missing heading is a finding, not a silent pass', () => {
    const findings = routingRows(createContext(fixture({ 'AGENTS.md': '# A\n' })))
    expect(codes(findings)).toEqual(['budget.routing_heading'])
  })
})

describe('markers', () => {
  test('a marker survives as a finding', () => {
    const findings = markers(createContext(fixture({ 'docs/a.md': 'TODO: finish\n' })))
    expect(codes(findings)).toEqual(['docs.unfinished_marker'])
  })
})

describe('indexAutonomy', () => {
  test('a total in an index is a finding', () => {
    const findings = indexAutonomy(
      createContext(fixture({ 'docs/README.md': '14 pages live here.\n' })),
    )
    expect(codes(findings)).toEqual(['docs.index_count'])
  })
})

describe('naming', () => {
  test('a name outside its role pattern is a finding', () => {
    const findings = naming(createContext(fixture({ 'docs/norm/Roles_File.md': '# R\n' })))
    expect(codes(findings)).toEqual(['docs.name_role'])
  })

  test('a retired stub name is not exempt', () => {
    const findings = naming(
      createContext(fixture({ 'docs/Notes.md': '# Old — moved\n\n[New](new.md)\n' })),
    )
    expect(codes(findings)).toEqual(['docs.name_role'])
  })
})

describe('rolePaths', () => {
  test('a docs page outside the role map is a finding', () => {
    const findings = rolePaths(createContext(fixture({ 'docs/unknown.md': '# U\n' })))
    expect(codes(findings)).toEqual(['docs.role_path'])
  })

  test('an admitted page passes', () => {
    expect(rolePaths(createContext(fixture({ 'docs/charter.md': '# C\n' })))).toEqual([])
  })

  test('the suite-track map is an admitted page', () => {
    expect(rolePaths(createContext(fixture({ 'docs/suite-tracks.md': '# S\n' })))).toEqual([])
  })
})

describe('movedStubs', () => {
  test('a file left at a moved path is a finding', () => {
    const findings = movedStubs(
      createContext(fixture({ 'docs/old.md': '# Old — moved\n\n[New](new.md)\n' })),
    )
    expect(codes(findings)).toEqual(['docs.forwarding_stub'])
  })

  test('a live page is not a stub', () => {
    expect(
      movedStubs(createContext(fixture({ 'docs/live.md': '# Live\n\n[New](new.md)\n' }))),
    ).toEqual([])
  })
})

describe('tables', () => {
  test('column padding is a finding', () => {
    const findings = tables(createContext(fixture({ 'docs/a.md': '| a  | b |\n| --- | --- |\n' })))
    expect(codes(findings)[0]).toBe('table.padding')
  })

  test('a cell count that differs from the header is a finding', () => {
    const findings = tables(createContext(fixture({ 'docs/a.md': '| a | b |\n| one |\n' })))
    expect(codes(findings)[0]).toBe('table.cell_count')
  })

  test('a run of spaces outside a code span is a finding', () => {
    const findings = tables(
      createContext(fixture({ 'docs/a.md': '| a  b | c |\n| --- | --- |\n' })),
    )
    expect(codes(findings)).toEqual(['table.run_of_spaces'])
  })

  test('a table inside a fence is left alone', () => {
    const findings = tables(createContext(fixture({ 'docs/a.md': '```\n| a  | b |\n```\n' })))
    expect(findings).toEqual([])
  })
})

describe('backlogStatus', () => {
  test('a status outside the four is a finding', () => {
    const text = '| # | Item | Status |\n| --- | --- | --- |\n| B-0001 | x | doing |\n'
    const findings = backlogStatus(createContext(fixture({ 'docs/backlog/README.md': text })))
    expect(codes(findings)).toEqual(['backlog.status'])
  })

  test('a spelled status passes', () => {
    const text = '| # | Item | Status |\n| --- | --- | --- |\n| B-0001 | x | paused |\n'
    expect(backlogStatus(createContext(fixture({ 'docs/backlog/README.md': text })))).toEqual([])
  })
})

describe('generated', () => {
  test('a generated header needs a blank line after it', () => {
    const findings = generated(
      createContext(fixture({ 'dist/index.md': 'generated by x — do not edit\nbody\n' })),
    )
    expect(codes(findings)).toEqual(['docs.generated_header'])
  })

  test('a file inside a generated path needs the header', () => {
    const findings = generated(createContext(fixture({ 'dist/index.md': '# Hand written\n' })))
    expect(codes(findings)).toEqual(['docs.generated_file'])
  })
})

describe('prose', () => {
  const root = (): string => fixture({ 'docs/norm/roles.md': '# Roles\n' })

  test('an unset project is a failure, not a skip', () => {
    expect(codes(prose(createContext(root()), { project: '' }))).toEqual(['prose.project_unset'])
  })

  test('a process that cannot start is a failure', () => {
    const run: Runner = () => ({
      status: null,
      stdout: '',
      stderr: '',
      error: { message: 'spawn uv ENOENT' },
    })
    expect(codes(prose(createContext(root()), { project: 'p', run }))).toEqual(['prose.run_error'])
  })

  test('an exit code outside 0/1/2 is a failure', () => {
    const run: Runner = () => ({ status: 7, stdout: '', stderr: 'boom\nsecond line' })
    expect(codes(prose(createContext(root()), { project: 'p', run }))).toEqual(['prose.exit_code'])
  })

  test('the report names the wrapped file and the unreadable count', () => {
    const directory = root()
    const run: Runner = (_command, args) => {
      const report = args[args.indexOf('--json') + 1]
      fs.writeFileSync(
        report,
        JSON.stringify({
          files: [{ path: path.join(directory, 'docs', 'norm', 'roles.md'), blocks: 3 }],
          files_skipped: 2,
        }),
      )
      return { status: 1, stdout: '', stderr: '' }
    }
    expect(codes(prose(createContext(directory), { project: 'p', run }))).toEqual([
      'prose.hard_wrapped',
      'prose.unreadable',
    ])
  })
})

describe('runChecks', () => {
  const missingProject = 'prose.project_unset'

  test('runs the prose stage by default', () => {
    const context = createContext(fixture({ 'docs/norm/roles.md': '# Roles\n' }))
    expect(codes(runChecks(context, { project: '' }))).toContain(missingProject)
  })

  test('leaves it out only when the caller asks', () => {
    const context = createContext(fixture({ 'docs/norm/roles.md': '# Roles\n' }))
    expect(codes(runChecks(context, { project: '', skipProse: true }))).not.toContain(
      missingProject,
    )
  })
})

describe('explainerSections', () => {
  test('a section that links nothing is a finding, and the first section is exempt', () => {
    const root = fixture({
      'docs/knowledge/explainers/tour.md':
        '# Tour\n\n| | |\n|---|---|\n| Role | explainer |\n\n## Why read this\n\nNo link here.\n\n## The first stage\n\nThe fact lives in the page that owns it.\n',
    })
    expect(codes(explainerSections(createContext(root)))).toEqual(['docs.explainer_section'])
  })

  test('a section that ends at its owner passes, and a guide is not held to the rule', () => {
    const root = fixture({
      'docs/knowledge/explainers/tour.md':
        '# Tour\n\n## Why read this\n\nNo link here.\n\n## The first stage\n\nSee [architecture](../../architecture/system.md).\n',
      'docs/knowledge/guides/method.md': '# Method\n\n## Steps\n\nNo link here.\n',
    })
    expect(codes(explainerSections(createContext(root)))).toEqual([])
  })
})
