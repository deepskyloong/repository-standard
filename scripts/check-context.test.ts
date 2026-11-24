/**
 * Tests for the repository reader: what it admits, and what it never enters. Host tools
 * write their session folders inside the checkout, so the reader's skip is what keeps an
 * attachment from becoming a gate finding.
 */

import { afterEach, describe, expect, test } from 'bun:test'

import { createContext } from './check-context.ts'
import { cleanupFixtures, fixture } from './test-fixtures.ts'

afterEach(cleanupFixtures)

describe('createContext', () => {
  test('lists markdown under the root, sorted', () => {
    const root = fixture({ 'README.md': '# R', 'docs/b.md': 'b', 'docs/a.md': 'a' })
    const context = createContext(root)
    expect(context.files).toEqual(['README.md', 'docs/a.md', 'docs/b.md'])
    expect(context.directories).toEqual(['docs'])
  })

  test('never enters a skipped directory, at any depth', () => {
    const root = fixture({
      'README.md': '# R',
      '.zwork/attachments/sample.md': 'sample',
      '.zwork/admitting/': '',
      '.workbuddy/session/state.md': 'state',
      'node_modules/pkg/README.md': 'pkg',
      '.git/HEAD': 'ref',
      'docs/__pycache__/c.md': 'c',
    })
    const context = createContext(root)
    expect(context.files).toEqual(['README.md'])
    expect(context.directories).toEqual(['docs'])
  })
})
