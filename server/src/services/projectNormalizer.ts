export type RawProject = {
  id?: string
  name?: string
  symbol?: string
  chain?: string
  category?: string
  description?: string
  website?: string
  x?: string
  github?: string
  discord?: string
  telegram?: string
  docs?: string

  createdAt?: string
  updatedAt?: string

  liquidityUsd?: number
  marketCap?: number

  tokenAddress?: string
  pairAddress?: string
  dexUrl?: string
  dexId?: string
}

export type ScoutProject = {
  id: string
  name: string
  symbol: string
  chain: string
  category: string
  description: string
  website: string

  x?: string
  github?: string
  discord?: string
  telegram?: string
  docs?: string

  tokenAddress?: string
  pairAddress?: string
  dexUrl?: string
  dexId?: string

  liquidityUsd?: number
  marketCap?: number

  createdAt?: string
  firstSeenAt: string
  lastSeenAt: string

  detectedAt: string
  source: string

  score: number
  signal: string
  signalType: 'EARLY' | 'ACTIVE' | 'BUILDING'
  evidence: string[]
}

function clean(value?: string) {
  return value?.trim() || ''
}

function ageInHours(date?: string) {
  if (!date) return 999999

  const time = new Date(date).getTime()

  if (Number.isNaN(time)) return 999999

  return Math.max(
    0,
    (Date.now() - time) / 3_600_000,
  )
}

function hasContact(raw: RawProject) {
  return Boolean(
    clean(raw.website) ||
    clean(raw.x) ||
    clean(raw.telegram),
  )
}

function scoreProject(raw: RawProject) {
  let score = 35
  const evidence: string[] = []
  const age = ageInHours(raw.createdAt)

  if (age <= 1) {
    score += 50
    evidence.push('Pair launched within 1 hour')
  } else if (age <= 6) {
    score += 40
    evidence.push('Pair launched within 6 hours')
  } else if (age <= 24) {
    score += 32
    evidence.push('Pair launched today')
  } else if (age <= 72) {
    score += 22
    evidence.push('Pair launched recently')
  } else if (age <= 168) {
    score += 10
    evidence.push('Pair launched this week')
  }

  const liquidity = raw.liquidityUsd ?? 0

  if (
    liquidity >= 10_000 &&
    liquidity <= 500_000
  ) {
    score += 10
    evidence.push('Early-stage liquidity')
  }

  if (raw.website) {
    score += 5
    evidence.push('Website found')
  }

  if (raw.x) {
    score += 5
    evidence.push('X account found')
  }

  if (raw.telegram) {
    score += 5
    evidence.push('Telegram found')
  }

  return {
    score: Math.min(100, score),
    evidence,
  }
}

export function normalizeProject(
  raw: RawProject,
  source: string,
): ScoutProject | null {
  const name = clean(raw.name)
  const tokenAddress = clean(raw.tokenAddress)

  if (!name) return null
  if (!tokenAddress) return null

  // At least ONE public contact is required.
  if (!hasContact(raw)) return null

  const result = scoreProject(raw)

  if (result.score < 45) return null

  const now = new Date().toISOString()

  const signalType =
    result.score >= 75
      ? 'EARLY'
      : result.score >= 55
        ? 'BUILDING'
        : 'ACTIVE'

  const signal =
    result.score >= 75
      ? 'Strong early signal'
      : result.score >= 55
        ? 'Building now'
        : 'Recent activity'

  return {
    id:
      raw.id ||
      `${raw.chain}:${tokenAddress}`,

    name,
    symbol: clean(raw.symbol),

    chain:
      clean(raw.chain).toUpperCase() ||
      'UNKNOWN',

    category:
      clean(raw.category).toUpperCase() ||
      'MEME',

    description:
      clean(raw.description),

    website:
      clean(raw.website),

    x:
      clean(raw.x) || undefined,

    github:
      clean(raw.github) || undefined,

    discord:
      clean(raw.discord) || undefined,

    telegram:
      clean(raw.telegram) || undefined,

    docs:
      clean(raw.docs) || undefined,

    tokenAddress,

    pairAddress:
      clean(raw.pairAddress) ||
      undefined,

    dexUrl:
      clean(raw.dexUrl) ||
      undefined,

    dexId:
      clean(raw.dexId) ||
      undefined,

    liquidityUsd:
      raw.liquidityUsd,

    marketCap:
      raw.marketCap,

    createdAt:
      raw.createdAt,

    firstSeenAt: now,
    lastSeenAt: now,
    detectedAt: now,

    source,

    score:
      result.score,

    signal,
    signalType,

    evidence:
      result.evidence,
  }
}
