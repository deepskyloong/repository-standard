/**
 * A repository, read once. Every check takes this view; repository reads happen only here.
 */

import * as fs from 'node:fs'
import * as path from 'node:path'

import { SKIP_PARTS } from './docs-model.ts'

export interface DirEntry {
  name: string
  isFile: boolean
  isDirectory: boolean
}

export interface Context {
  root: string
  /** Markdown keys outside the skipped parts, repository-relative, posix, sorted. */
  files: string[]
  /** Every directory key outside the skipped parts, repository-relative, posix, sorted. */
  directories: string[]
  absolute(key: string): string
  exists(key: string): boolean
  isFile(key: string): boolean
  readText(key: string): string
  readDir(key: string): DirEntry[]
}

export function createContext(root: string): Context {
  const absolute = (key: string): string => path.resolve(root, key)
  const toKey = (target: string): string => path.relative(root, target).split(path.sep).join('/')

  const files: string[] = []
  const directories: string[] = []
  const walk = (directory: string): void => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory() && SKIP_PARTS.has(entry.name)) {
        continue
      }
      const child = path.join(directory, entry.name)
      if (entry.isDirectory()) {
        directories.push(toKey(child))
        walk(child)
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(toKey(child))
      }
    }
  }
  walk(root)

  const byKey = (left: string, right: string): number => (left < right ? -1 : left > right ? 1 : 0)
  files.sort(byKey)
  directories.sort(byKey)

  const texts = new Map<string, string>()
  const listings = new Map<string, DirEntry[]>()

  return {
    root,
    files,
    directories,
    absolute,
    exists: key => fs.existsSync(absolute(key)),
    isFile: key => fs.statSync(absolute(key), { throwIfNoEntry: false })?.isFile() === true,
    readText: key => {
      const cached = texts.get(key)
      if (cached !== undefined) {
        return cached
      }
      const text = fs.readFileSync(absolute(key), 'utf8')
      texts.set(key, text)
      return text
    },
    readDir: key => {
      const cached = listings.get(key)
      if (cached !== undefined) {
        return cached
      }
      const entries = fs
        .readdirSync(absolute(key), { withFileTypes: true })
        .map(entry => ({
          name: entry.name,
          isFile: entry.isFile(),
          isDirectory: entry.isDirectory(),
        }))
        .sort((left, right) => byKey(left.name, right.name))
      listings.set(key, entries)
      return entries
    },
  }
}
