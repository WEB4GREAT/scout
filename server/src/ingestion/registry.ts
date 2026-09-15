import type { IngestionSource } from './types'
import dexScreenerSource from './sources/dexScreenerSource'

const sources: IngestionSource<unknown>[] = [
  dexScreenerSource,
]

export function registerSource(
  source: IngestionSource<unknown>,
) {
  sources.push(source)
}

export function getSources() {
  return sources
}
