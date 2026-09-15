import type {
  IngestionResult,
  IngestionSource,
} from '../types'

type DexProfile = {
  url?: string
  chainId?: string
  tokenAddress?: string
  description?: string
  links?: {
    type?: string
    label?: string
    url?: string
  }[]
}

type DexSocial = {
  platform?: string
  handle?: string
}

type DexPair = {
  chainId?: string
  dexId?: string
  url?: string
  pairAddress?: string

  baseToken?: {
    address?: string
    name?: string
    symbol?: string
  }

  quoteToken?: {
    address?: string
    name?: string
    symbol?: string
  }

  liquidity?: {
    usd?: number
  }

  marketCap?: number
  fdv?: number
  pairCreatedAt?: number

  info?: {
    websites?: {
      url?: string
    }[]

    socials?: DexSocial[]
  }
}

type TokenPairsResponse = {
  pairs?: DexPair[]
}

const API = 'https://api.dexscreener.com'

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      `DexScreener ${response.status}`,
    )
  }

  return response.json() as Promise<T>
}

async function getProfiles(
  endpoint: string,
) {
  const data =
    await getJson<DexProfile[]>(endpoint)

  return Array.isArray(data)
    ? data
    : []
}

function firstLink(
  links:
    | DexProfile['links']
    | undefined,
  type: string,
) {
  return links?.find(
    (link) =>
      link.type
        ?.toLowerCase()
        .includes(type) ||
      link.label
        ?.toLowerCase()
        .includes(type),
  )?.url
}

function socialUrl(
  socials: DexSocial[] | undefined,
  platform: string,
) {
  const item = socials?.find(
    (social) =>
      social.platform
        ?.toLowerCase() === platform,
  )

  if (!item?.handle) {
    return undefined
  }

  if (item.handle.startsWith('http')) {
    return item.handle
  }

  return `https://x.com/${item.handle.replace(/^@/, '')}`
}

async function fetchTokenPairs(
  chainId: string,
  addresses: string[],
) {
  const unique = [
    ...new Set(addresses),
  ]

  if (!unique.length) {
    return []
  }

  const batches: string[][] = []

  for (
    let i = 0;
    i < unique.length;
    i += 30
  ) {
    batches.push(
      unique.slice(i, i + 30),
    )
  }

  const results: DexPair[] = []

  for (const batch of batches) {
    try {
      const url =
        `${API}/tokens/v1/${chainId}/` +
        batch.join(',')

      const data =
        await getJson<DexPair[]>(url)

      if (Array.isArray(data)) {
        results.push(...data)
      }
    } catch (error) {
      console.error(
        `[SCOUT] DexScreener batch failed: ${chainId}`,
        error,
      )
    }
  }

  return results
}

const source: IngestionSource<unknown> = {
  name: 'dexscreener',

  async fetch(): Promise<
    IngestionResult<unknown>
  > {
    const [
      latest,
      recent,
    ] = await Promise.all([
      getProfiles(
        `${API}/token-profiles/latest/v1`,
      ),
      getProfiles(
        `${API}/token-profiles/recent-updates/v1`,
      ),
    ])

    const profileMap =
      new Map<string, DexProfile>()

    for (
      const profile of [
        ...latest,
        ...recent,
      ]
    ) {
      if (
        !profile.chainId ||
        !profile.tokenAddress
      ) {
        continue
      }

      const key =
        `${profile.chainId}:` +
        `${profile.tokenAddress}`

      profileMap.set(key, profile)
    }

    const profiles = [
      ...profileMap.values(),
    ]

    console.log(
      `[SCOUT] dexscreener profiles: ${profiles.length}`,
    )

    const byChain =
      new Map<string, DexProfile[]>()

    for (const profile of profiles) {
      const existing =
        byChain.get(profile.chainId!)

      if (existing) {
        existing.push(profile)
      } else {
        byChain.set(
          profile.chainId!,
          [profile],
        )
      }
    }

    const pairResults =
      await Promise.all(
        [...byChain.entries()].map(
          async ([chainId, items]) => {
            const pairs =
              await fetchTokenPairs(
                chainId,
                items
                  .map(
                    (item) =>
                      item.tokenAddress!,
                  ),
              )

            return {
              chainId,
              pairs,
            }
          },
        ),
      )

    const pairMap =
      new Map<string, DexPair[]>()

    for (const result of pairResults) {
      for (const pair of result.pairs) {
        const address =
          pair.baseToken?.address

        if (!address) continue

        const key =
          `${result.chainId}:${address}`

        const existing =
          pairMap.get(key)

        if (existing) {
          existing.push(pair)
        } else {
          pairMap.set(key, [pair])
        }
      }
    }

    const results: Record<
      string,
      unknown
    >[] = []

    for (const profile of profiles) {
      const key =
        `${profile.chainId}:` +
        `${profile.tokenAddress}`

      const pairs =
        pairMap.get(key) || []

      const pair = [...pairs]
        .filter(
          (item) =>
            item.baseToken?.address,
        )
        .sort(
          (a, b) =>
            (b.liquidity?.usd ?? 0) -
            (a.liquidity?.usd ?? 0),
        )[0]

      if (
        !pair?.baseToken?.name
      ) {
        continue
      }

      const website =
        pair.info?.websites?.[0]?.url ||
        firstLink(
          profile.links,
          'website',
        )

      const x =
        socialUrl(
          pair.info?.socials,
          'twitter',
        ) ||
        socialUrl(
          pair.info?.socials,
          'x',
        ) ||
        firstLink(
          profile.links,
          'twitter',
        ) ||
        firstLink(
          profile.links,
          'x',
        )

      results.push({
        id:
          `${profile.chainId}:` +
          `${profile.tokenAddress}`,

        name:
          pair.baseToken.name,

        symbol:
          pair.baseToken.symbol ||
          '',

        chain:
          profile.chainId,

        category:
          'MEME',

        description:
          profile.description || '',

        website:
          website || '',

        x,

        createdAt:
          pair.pairCreatedAt
            ? new Date(
                pair.pairCreatedAt,
              ).toISOString()
            : undefined,

        updatedAt:
          new Date().toISOString(),

        liquidityUsd:
          pair.liquidity?.usd ?? 0,

        marketCap:
          pair.marketCap ??
          pair.fdv ??
          0,

        tokenAddress:
          profile.tokenAddress,

        pairAddress:
          pair.pairAddress,

        dexUrl:
          pair.url ||
          profile.url,

        dexId:
          pair.dexId || '',
      })
    }

    return {
      source: 'dexscreener',
      fetchedAt:
        new Date().toISOString(),
      items: results,
    }
  },
}

export default source
