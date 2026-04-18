import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parseContentPack } from '../src/content/schema'

const defaultPackPath = fileURLToPath(new URL('../content/hitorie.yaml', import.meta.url))

export const loadLocalContentPack = (packPath = defaultPackPath) => {
  const source = readFileSync(packPath, 'utf8')
  return parseContentPack(source, packPath)
}
