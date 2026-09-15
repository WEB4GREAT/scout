export type Project = {
  id: string
  name: string
  symbol: string
  chain: string
  category: string
  description: string
  signal: string
  signalType: 'EARLY' | 'ACTIVE' | 'BUILDING'
  score: number
  detected: string
  website: string
  x: string
  github?: string
  discord?: string
  telegram?: string
  docs?: string
}

export const projects: Project[] = [
  {
    id: 'basepaint',
    name: 'BasePaint',
    symbol: 'BP',
    chain: 'BASE',
    category: 'MEME',
    description:
      'Collaborative onchain pixel art project built around community creation.',
    signal: 'Consumer project',
    signalType: 'ACTIVE',
    score: 92,
    detected: '12m',
    website: 'https://basepaint.xyz',
    x: 'https://x.com/basepaint',
  },
  {
    id: 'b3',
    name: 'B3',
    symbol: 'B3',
    chain: 'BASE',
    category: 'GAMING',
    description:
      'Base ecosystem gaming network focused on bringing games onchain.',
    signal: 'Ecosystem activity',
    signalType: 'BUILDING',
    score: 89,
    detected: '18m',
    website: 'https://b3.fun',
    x: 'https://x.com/b3dotfun',
  },
  {
    id: '0x',
    name: '0x',
    symbol: '0X',
    chain: 'MULTI',
    category: 'INFRA',
    description:
      'Open infrastructure for developers building onchain exchange and value-transfer products.',
    signal: 'Developer ecosystem',
    signalType: 'ACTIVE',
    score: 87,
    detected: '23m',
    website: 'https://0x.org',
    x: 'https://x.com/0xProject',
    github: 'https://github.com/0xProject',
    docs: 'https://docs.0x.org',
  },
  {
    id: 'aerodrome',
    name: 'Aerodrome',
    symbol: 'AERO',
    chain: 'BASE',
    category: 'DEFI',
    description:
      'Trading and liquidity infrastructure serving the Base ecosystem.',
    signal: 'Protocol ecosystem',
    signalType: 'ACTIVE',
    score: 84,
    detected: '31m',
    website: 'https://aerodrome.finance',
    x: 'https://x.com/AerodromeFi',
    github: 'https://github.com/aerodrome-finance',
    discord: 'https://discord.gg/aerodrome',
  },
  {
    id: 'across',
    name: 'Across',
    symbol: 'ACX',
    chain: 'MULTI',
    category: 'INFRA',
    description:
      'Crosschain infrastructure connecting assets and applications across networks.',
    signal: 'Builder ecosystem',
    signalType: 'BUILDING',
    score: 81,
    detected: '44m',
    website: 'https://across.to',
    x: 'https://x.com/AcrossProtocol',
    github: 'https://github.com/across-protocol',
    docs: 'https://docs.across.to',
  },
]
