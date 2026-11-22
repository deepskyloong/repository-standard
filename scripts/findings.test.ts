/**
 * The finding catalog's own tests: the shape a check may rely on, and the rules the
 * import-time validation enforces. A check test proves a rule fires; this file proves a
 * catalog that would misrender cannot load.
 */

import { describe, expect, test } from 'bun:test'

import { CATALOG, CODES, finding, format, placeholders, problems } from './findings.ts'

describe('catalog', () => {
  test('every code names a domain and carries a level', () => {
    expect(CODES.length).toBeGreaterThan(0)
    for (const code of CODES) {
      expect(code).toMatch(/^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+$/)
      expect(['fail', 'warn']).toContain(CATALOG[code].level)
    }
  })

  test('one code formats from its own params', () => {
    expect(finding('docs.required_file', { path: 'AGENTS.md' }).message).toBe(
      'AGENTS.md: missing required file',
    )
  })

  test('the soft budget is the only warn', () => {
    const warns = CODES.filter(code => CATALOG[code].level === 'warn')
    expect(warns).toEqual(['budget.volume_soft'])
  })
})

describe('problems', () => {
  test('a code without a domain is reported', () => {
    expect(problems({ BadCode: { level: 'fail', template: 'x' } })).toContain(
      'BadCode: a code names a domain',
    )
  })

  test('a level outside the two is reported', () => {
    expect(problems({ 'docs.x': { level: 'error', template: 'x' } })).toContain(
      'docs.x: level error is not fail or warn',
    )
  })

  test('a template that cannot format is reported', () => {
    expect(problems({ 'docs.x': { level: 'fail', template: 'x {}' } })[0]).toContain(
      'docs.x: template does not format',
    )
  })

  test('an unbalanced brace is reported', () => {
    expect(problems({ 'docs.x': { level: 'fail', template: 'x {path' } })[0]).toContain(
      'docs.x: template has a placeholder it did not declare',
    )
  })
})

describe('placeholders', () => {
  test('attribute and index access read the base name', () => {
    expect(placeholders('{a} {b.attr} {c[0]}')).toEqual(['a', 'b', 'c'])
  })

  test('a format spec is not a second placeholder', () => {
    expect(placeholders('{count:>4}')).toEqual(['count'])
  })
})

describe('format', () => {
  test('a missing param throws instead of rendering a brace', () => {
    expect(() => format('{path}: missing', {})).toThrow('missing param: path')
  })
})
