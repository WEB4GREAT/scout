import type { ScoutProject } from '../services/projectNormalizer'

const MAX_PROJECTS = Number.MAX_SAFE_INTEGER
const MAX_AGE_HOURS = 168
const STALE_HOURS = 24

let projects = new Map<
  string,
  ScoutProject
>()

let refreshStartedAt:
  | string
  | undefined

let refreshCompletedAt:
  | string
  | undefined

let refreshError:
  | string
  | undefined

let refreshing = false

export function beginRefresh() {
  refreshing = true
  refreshStartedAt =
    new Date().toISOString()
  refreshError = undefined
}

export function finishRefresh(
  error?: string,
) {
  refreshing = false
  refreshCompletedAt =
    new Date().toISOString()

  if (error) {
    refreshError = error
  }
}

export function replaceProjects(
  items: ScoutProject[],
) {
  const now =
    new Date().toISOString()

  const incoming =
    new Map<string, ScoutProject>()

  for (const item of items) {
    const existing =
      projects.get(item.id)

    incoming.set(item.id, {
      ...item,

      firstSeenAt:
        existing?.firstSeenAt ??
        item.firstSeenAt ??
        now,

      lastSeenAt: now,

      detectedAt:
        existing?.detectedAt ??
        item.detectedAt ??
        now,
    })
  }

  /*
   * Keep existing projects that are
   * still young enough to remain useful.
   */
  for (const existing of projects.values()) {
    if (incoming.has(existing.id)) {
      continue
    }

    const createdTime =
      existing.createdAt
        ? new Date(
            existing.createdAt,
          ).getTime()
        : NaN

    const lastSeenTime =
      new Date(
        existing.lastSeenAt,
      ).getTime()

    const ageHours =
      Number.isNaN(createdTime)
        ? (
            Date.now() -
            lastSeenTime
          ) / 3_600_000
        : (
            Date.now() -
            createdTime
          ) / 3_600_000

    if (
      ageHours <= MAX_AGE_HOURS
    ) {
      incoming.set(
        existing.id,
        existing,
      )
    }
  }

  /*
   * Rank:
   * 1. newest actual creation
   * 2. newest detection
   * 3. highest score
   */
  const sorted =
    [...incoming.values()]
      .filter((project) => {
        const lastSeenAge =
          (
            Date.now() -
            new Date(
              project.lastSeenAt,
            ).getTime()
          ) / 3_600_000

        return (
          lastSeenAge <= STALE_HOURS ||
          project.score >= 75
        )
      })
      .sort((a, b) => {
        const aCreated =
          a.createdAt
            ? new Date(
                a.createdAt,
              ).getTime()
            : 0

        const bCreated =
          b.createdAt
            ? new Date(
                b.createdAt,
              ).getTime()
            : 0

        if (
          bCreated !== aCreated
        ) {
          return (
            bCreated - aCreated
          )
        }

        if (
          b.score !== a.score
        ) {
          return (
            b.score - a.score
          )
        }

        return (
          new Date(
            b.lastSeenAt,
          ).getTime() -
          new Date(
            a.lastSeenAt,
          ).getTime()
        )
      })
      .slice(0, MAX_PROJECTS)

  projects =
    new Map(
      sorted.map((item) => [
        item.id,
        item,
      ]),
    )
}

export function getProjects() {
  return [...projects.values()]
}

export function getProjectCount() {
  return projects.size
}

export function getRefreshStatus() {
  return {
    refreshing,
    refreshStartedAt,
    refreshCompletedAt,
    refreshError,
    projectCount: projects.size,
  }
}
