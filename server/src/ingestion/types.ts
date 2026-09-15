export type IngestionResult<T> = {
  source: string
  fetchedAt: string
  items: T[]
}

export interface IngestionSource<T> {
  name: string
  fetch(): Promise<IngestionResult<T>>
}
