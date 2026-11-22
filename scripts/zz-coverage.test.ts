/**
 * The coverage assertion the catalog promises: every code is reachable from a fixture.
 *
 * `seen` fills as the check suites run; bun runs the files of one `bun test` invocation
 * in one process, and this file sorts after them.
 */

import { expect, test } from 'bun:test'

import { CODES, seenCodes } from './findings.ts'

test('every code has a fixture', () => {
  const seen = seenCodes()
  const unseen = CODES.filter(code => !seen.includes(code))
  expect(unseen).toEqual([])
})
