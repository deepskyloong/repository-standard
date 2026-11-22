/**
 * The message-catalog stage (`docs/norm/code/messages.md`): holds the shape of a catalog.
 *
 * Usage:
 *   bun tools/check-messages.ts
 *
 * The repository declares its catalog in `package.json`:
 *
 *   "messages": { "module": "src/messages.ts" }
 *
 * The module exports `SPECS`, a record from a code to `{ template, params }`,
 * and may export `PARTS`, the pieces it merged. Fails a code that does not name
 * a domain, a template whose placeholders and declared params differ, a
 * positional placeholder, two codes sharing one wording, a literal number
 * outside a placeholder, and a code a merge overwrote. A code whose wording
 * legitimately carries a number is listed under `messages.exempt`. A repository
 * that declares no catalog passes.
 *
 * Exit codes: 0 every catalog holds the shape; 1 at least one finding.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = join(import.meta.dir, '..')
const NAMESPACED = /^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+$/
const PLACEHOLDER = /\{([^{}]*)\}/g

type Spec = { template: string; params: readonly string[] }

function declaredModule(): string | null {
  const manifest = readFileSync(join(ROOT, 'package.json'), 'utf8')
  const section = (JSON.parse(manifest) as { messages?: { module?: unknown } }).messages
  const name = section?.module
  return typeof name === 'string' ? name : null
}

function declaredExempt(): Set<string> {
  const manifest = readFileSync(join(ROOT, 'package.json'), 'utf8')
  const section = (JSON.parse(manifest) as { messages?: { exempt?: unknown } }).messages
  const codes = section?.exempt
  return new Set(Array.isArray(codes) ? codes.filter(code => typeof code === 'string') : [])
}

function literalNumber(template: string): string | null {
  const withoutFields = template.replace(PLACEHOLDER, ' ')
  const match = withoutFields.match(/\S*\d\S*/)
  return match === null ? null : match[0]
}

function placeholders(template: string): { names: Set<string>; positional: string[] } {
  const names = new Set<string>()
  const positional: string[] = []
  for (const match of template.matchAll(PLACEHOLDER)) {
    const field = match[1]
    if (field === '') {
      positional.push('{}')
      continue
    }
    const base = field.split(/[.[]/, 1)[0]
    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(base)) names.add(base)
    else positional.push(`{${field}}`)
  }
  return { names, positional }
}

function findingsInCatalog(
  module: string,
  specs: Record<string, Spec>,
  exempt: Set<string>,
): string[] {
  const findings: string[] = []
  const wordings = new Map<string, string[]>()
  for (const [code, spec] of Object.entries(specs)) {
    if (!NAMESPACED.test(code)) {
      findings.push(
        `messages.unnamespaced: ${module}: ${JSON.stringify(code)} does not name a domain`,
      )
    }
    if (typeof spec?.template !== 'string' || !Array.isArray(spec?.params)) {
      findings.push(
        `messages.spec: ${module}: ${JSON.stringify(code)} needs a template string and a params array`,
      )
      continue
    }
    const { names, positional } = placeholders(spec.template)
    if (positional.length > 0) {
      findings.push(
        `messages.template: ${module}: ${JSON.stringify(code)} has positional placeholders: ${positional.join(', ')}`,
      )
    }
    const declared = new Set(spec.params)
    const missing = [...names].filter(name => !declared.has(name)).sort()
    const unused = [...declared].filter(name => !names.has(name)).sort()
    if (missing.length > 0 || unused.length > 0) {
      const detail = [
        missing.length > 0 ? `template reads ${missing.join(', ')}` : '',
        unused.length > 0 ? `params declares ${unused.join(', ')}` : '',
      ].filter(Boolean)
      findings.push(
        `messages.shape: ${module}: ${JSON.stringify(code)} placeholders and params differ: ${detail.join('; ')}`,
      )
    }
    const stripped = spec.template.replace(PLACEHOLDER, '')
    if (stripped.includes('{') || stripped.includes('}')) {
      findings.push(`messages.template: ${module}: ${JSON.stringify(code)} has an unbalanced brace`)
    }
    const wording = spec.template.replace(/\s+/g, ' ').trim()
    wordings.set(wording, [...(wordings.get(wording) ?? []), code])
    const fragment = literalNumber(spec.template)
    if (fragment !== null && !exempt.has(code)) {
      findings.push(
        `messages.digit: ${module}: ${JSON.stringify(code)} types ${JSON.stringify(fragment)} into its template`,
      )
    }
  }
  for (const [wording, codes] of wordings) {
    if (codes.length > 1) {
      findings.push(
        `messages.duplicate: ${module}: ${codes.join(', ')} share one wording: ${JSON.stringify(wording)}`,
      )
    }
  }
  return findings
}

async function main(): Promise<number> {
  const modulePath = declaredModule()
  if (modulePath === null) {
    console.log('check_messages: no catalog declared')
    return 0
  }
  let catalog: { SPECS?: Record<string, Spec>; PARTS?: Record<string, Spec>[] }
  try {
    catalog = (await import(pathToFileURL(join(ROOT, modulePath)).href)) as {
      SPECS?: Record<string, Spec>
      PARTS?: Record<string, Spec>[]
    }
  } catch (error) {
    console.log(`messages.unloadable: ${modulePath}: ${(error as Error).message}`)
    console.log('check_messages: 0 code(s), 1 finding(s)')
    return 1
  }
  if (catalog.SPECS === undefined || typeof catalog.SPECS !== 'object') {
    console.log(`messages.catalog: ${modulePath}: the module exports no SPECS record`)
    console.log('check_messages: 0 code(s), 1 finding(s)')
    return 1
  }
  const specs = catalog.SPECS
  const findings = findingsInCatalog(modulePath, specs, declaredExempt())
  if (Array.isArray(catalog.PARTS)) {
    const merged = catalog.PARTS.reduce((total, part) => total + Object.keys(part).length, 0)
    if (merged !== Object.keys(specs).length) {
      findings.unshift(
        `messages.collision: ${modulePath}: ${Object.keys(specs).length} codes survived a merge of ${merged}; a duplicate key was overwritten`,
      )
    }
  }
  for (const finding of findings) console.log(finding)
  console.log(`check_messages: ${Object.keys(specs).length} code(s), ${findings.length} finding(s)`)
  return findings.length > 0 ? 1 : 0
}

process.exit(await main())
