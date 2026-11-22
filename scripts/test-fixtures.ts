/**
 * Fixtures for the check suites. Each case builds the smallest repository a rule can be
 * violated in; every fixture is removed after the case.
 */

import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

const roots: string[] = []

/** A key ending in `/` creates a directory, so an empty one can be seeded. */
export function fixture(files: Record<string, string>): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'doc-check-'))
  roots.push(root)
  for (const [key, text] of Object.entries(files)) {
    const target = path.join(root, ...key.split('/'))
    fs.mkdirSync(path.dirname(target), { recursive: true })
    if (key.endsWith('/')) {
      fs.mkdirSync(target, { recursive: true })
    } else {
      fs.writeFileSync(target, text, 'utf8')
    }
  }
  return root
}

export function codes(findings: Array<{ code: string }>): string[] {
  return findings.map(finding => finding.code)
}

export function cleanupFixtures(): void {
  for (const root of roots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true })
  }
}
