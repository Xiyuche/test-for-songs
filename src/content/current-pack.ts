import packSource from '../../content/hitorie.yaml?raw'
import { parseContentPack } from './schema'

export const currentContentPack = parseContentPack(packSource, 'content/hitorie.yaml')
