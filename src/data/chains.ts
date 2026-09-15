export type ChainType =
| "EVM"
| "SOLANA"
| "MOVE"
| "COSMOS"
| "ZK"
| "OTHER"

export type Chain = {
id: string
name: string
type: ChainType
ecosystem: string
explorer?: string
website?: string
enabled: boolean
}

export const chains: Chain[] = [
// EVM
{
id: "ethereum",
name: "Ethereum",
type: "EVM",
ecosystem: "Ethereum",
explorer: "https://etherscan.io",
website: "https://ethereum.org",
enabled: true,
},
{
id: "base",
name: "Base",
type: "EVM",
ecosystem: "Ethereum",
explorer: "https://basescan.org",
website: "https://base.org",
enabled: true,
},
{
id: "arbitrum",
name: "Arbitrum",
type: "EVM",
ecosystem: "Ethereum",
explorer: "https://arbiscan.io",
website: "https://arbitrum.io",
enabled: true,
},
{
id: "optimism",
name: "Optimism",
type: "EVM",
ecosystem: "Ethereum",
explorer: "https://optimistic.etherscan.io",
website: "https://optimism.io",
enabled: true,
},
{
id: "polygon",
name: "Polygon",
type: "EVM",
ecosystem: "Ethereum",
explorer: "https://polygonscan.com",
website: "https://polygon.technology",
enabled: true,
},
{
id: "bnb-chain",
name: "BNB Chain",
type: "EVM",
ecosystem: "BNB",
explorer: "https://bscscan.com",
website: "https://www.bnbchain.org",
enabled: true,
},
{
id: "avalanche",
name: "Avalanche",
type: "EVM",
ecosystem: "Avalanche",
explorer: "https://snowtrace.io",
website: "https://www.avax.network",
enabled: true,
},
{
id: "linea",
name: "Linea",
type: "EVM",
ecosystem: "Ethereum",
explorer: "https://lineascan.build",
website: "https://linea.build",
enabled: true,
},
{
id: "scroll",
name: "Scroll",
type: "EVM",
ecosystem: "Ethereum",
explorer: "https://scrollscan.com",
website: "https://scroll.io",
enabled: true,
},
{
id: "zksync",
name: "zkSync",
type: "ZK",
ecosystem: "Ethereum",
explorer: "https://explorer.zksync.io",
website: "https://zksync.io",
enabled: true,
},
{
id: "mantle",
name: "Mantle",
type: "EVM",
ecosystem: "Ethereum",
explorer: "https://mantlescan.xyz",
website: "https://www.mantle.xyz",
enabled: true,
},
{
id: "blast",
name: "Blast",
type: "EVM",
ecosystem: "Ethereum",
explorer: "https://blastscan.io",
website: "https://blast.io",
enabled: true,
},
{
id: "berachain",
name: "Berachain",
type: "EVM",
ecosystem: "Ethereum",
explorer: "https://berascan.com",
website: "https://www.berachain.com",
enabled: true,
},
{
id: "monad",
name: "Monad",
type: "EVM",
ecosystem: "Ethereum",
explorer: "https://monadscan.com",
website: "https://monad.xyz",
enabled: true,
},
{
id: "sei",
name: "Sei",
type: "EVM",
ecosystem: "Sei",
explorer: "https://seitrace.com",
website: "https://www.sei.io",
enabled: true,
},

// Solana
{
id: "solana",
name: "Solana",
type: "SOLANA",
ecosystem: "Solana",
explorer: "https://explorer.solana.com",
website: "https://solana.com",
enabled: true,
},

// Move ecosystems
{
id: "sui",
name: "Sui",
type: "MOVE",
ecosystem: "Sui",
explorer: "https://suiscan.xyz",
website: "https://sui.io",
enabled: true,
},
{
id: "aptos",
name: "Aptos",
type: "MOVE",
ecosystem: "Aptos",
explorer: "https://explorer.aptoslabs.com",
website: "https://aptosfoundation.org",
enabled: true,
},

// Other major ecosystems
{
id: "near",
name: "NEAR",
type: "OTHER",
ecosystem: "NEAR",
explorer: "https://nearblocks.io",
website: "https://near.org",
enabled: true,
},
{
id: "ton",
name: "TON",
type: "OTHER",
ecosystem: "TON",
explorer: "https://tonscan.org",
website: "https://ton.org",
enabled: true,
},
{
id: "starknet",
name: "Starknet",
type: "ZK",
ecosystem: "Ethereum",
explorer: "https://starkscan.co",
website: "https://www.starknet.io",
enabled: true,
},
{
id: "cosmos",
name: "Cosmos",
type: "COSMOS",
ecosystem: "Cosmos",
explorer: "https://www.mintscan.io",
website: "https://cosmos.network",
enabled: true,
},
{
id: "osmosis",
name: "Osmosis",
type: "COSMOS",
ecosystem: "Cosmos",
explorer: "https://www.mintscan.io/osmosis",
website: "https://osmosis.zone",
enabled: true,
},
{
id: "injective",
name: "Injective",
type: "COSMOS",
ecosystem: "Cosmos",
explorer: "https://explorer.injective.network",
website: "https://injective.com",
enabled: true,
},
{
id: "cardano",
name: "Cardano",
type: "OTHER",
ecosystem: "Cardano",
explorer: "https://cardanoscan.io",
website: "https://cardano.org",
enabled: true,
},
{
id: "hedera",
name: "Hedera",
type: "OTHER",
ecosystem: "Hedera",
explorer: "https://hashscan.io",
website: "https://hedera.com",
enabled: true,
},
{
id: "algorand",
name: "Algorand",
type: "OTHER",
ecosystem: "Algorand",
explorer: "https://allo.info",
website: "https://algorand.com",
enabled: true,
},
]

export const enabledChains = chains.filter((chain) => chain.enabled)

export const chainMap = Object.fromEntries(
chains.map((chain) => [chain.id, chain]),
) as Record<string, Chain>
