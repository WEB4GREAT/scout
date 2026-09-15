import { getSources } from '../ingestion/registry'

import {
  normalizeProject,
  type RawProject,
  type ScoutProject,
} from './projectNormalizer'

import {
  replaceProjects,
  beginRefresh,
  finishRefresh,
} from '../db/projectStore'

export async function runIngestion() {
  beginRefresh()

  const allProjects: ScoutProject[] = []
  const successfulSources: string[] = []

  try {
    const sources = getSources()

    const results =
      await Promise.allSettled(
        sources.map(
          async (source) => {
            const result =
              await source.fetch()

            return {
              source,
              result,
            }
          },
        ),
      )

    for (
      const result of results
    ) {
      if (
        result.status ===
        'rejected'
      ) {
        console.error(
          '[SCOUT] ingestion source failed',
          result.reason,
        )

        continue
      }

      const {
        source,
        result: ingestionResult,
      } = result.value

      let accepted = 0

      for (
        const raw of
          ingestionResult.items as RawProject[]
      ) {
        const normalized =
          normalizeProject(
            raw,
            ingestionResult.source,
          )

        if (!normalized) {
          continue
        }

        allProjects.push(
          normalized,
        )

        accepted++
      }

      successfulSources.push(
        source.name,
      )

      console.log(
        `[SCOUT] ${source.name}: ` +
        `fetched ${ingestionResult.items.length}, ` +
        `accepted ${accepted}`,
      )
    }

    /*
     * Never wipe the current feed because
     * a refresh returned nothing.
     */
    if (allProjects.length > 0) {
      replaceProjects(
        allProjects,
      )
    }

    finishRefresh()

    return {
      ingested:
        allProjects.length,

      sources:
        successfulSources,
    }
  } catch (error) {
    console.error(
      '[SCOUT] ingestion error',
      error,
    )

    finishRefresh(
      error instanceof Error
        ? error.message
        : 'Unknown ingestion error',
    )

    throw error
  }
}
