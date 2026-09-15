import { useMemo, useState } from 'react'
import {
FiActivity,
FiArrowUpRight,
FiBell,
FiBookmark,
FiCheck,
FiChevronDown,
FiClock,
FiCode,
FiCompass,
FiDatabase,
FiDisc,
FiExternalLink,
FiFilter,
FiGithub,
FiGlobe,
FiHash,
FiLayers,
FiSearch,
FiSend,
FiSettings,
FiStar,
FiTerminal,
FiTwitter,
FiUsers,
FiZap,
} from 'react-icons/fi'
import './App.css'

type Project = {
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

const projects: Project[] = [
{
id: 'basepaint',
name: 'BasePaint',
symbol: 'BP',
chain: 'BASE',
category: 'MEME',
description: 'Collaborative onchain pixel art project built around community creation.',
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
description: 'Base ecosystem gaming network focused on bringing games onchain.',
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
description: 'Open infrastructure for developers building onchain exchange and value-transfer products.',
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
description: 'Trading and liquidity infrastructure serving the Base ecosystem.',
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
description: 'Crosschain infrastructure connecting assets and applications across networks.',
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

const filters = [
'ALL',
'MEME',
'UTILITY',
'DEFI',
'INFRA',
'GAMING',
]

function ScoutMark() {
return (
<div className="scout-mark" aria-label="SCOUT">
<svg viewBox="0 0 42 42" fill="none">
<rect x="1" y="1" width="40" height="40" rx="11" />
<path d="M26.5 10.5C24.8 8.9 22.5 8 19.8 8C15.2 8 12 10.5 12 14.1C12 17.7 14.7 19.2 20.1 20.5C25.4 21.8 29 23.3 29 27.6C29 31.5 25.7 34 20.7 34C17.2 34 14.1 32.7 11.8 30.3" />
<path d="M6 21H2M40 21H36M21 6V2M21 40V36" />
</svg>
</div>
)
}

function App() {
const [activeFilter, setActiveFilter] = useState('ALL')
const [saved, setSaved] = useState<string[]>([])
const [query, setQuery] = useState('')

const filteredProjects = useMemo(() => {
return projects.filter((project) => {
const matchesFilter =
activeFilter === 'ALL' || project.category === activeFilter

const search = query.toLowerCase()

const matchesSearch =
!search ||
project.name.toLowerCase().includes(search) ||
project.chain.toLowerCase().includes(search) ||
project.category.toLowerCase().includes(search)

return matchesFilter && matchesSearch
})
}, [activeFilter, query])

const toggleSaved = (id: string) => {
setSaved((current) =>
current.includes(id)
? current.filter((item) => item !== id)
: [...current, id],
)
}

const openSocials = (project: Project) => {
window.open(project.x, '_blank', 'noopener,noreferrer')
}

return (
<div className="app-shell">

{/* SIDEBAR */}
<aside className="sidebar">
<div className="brand">
<ScoutMark />

<div>
<div className="brand-name">SCOUT</div>
<div className="brand-subtitle">
WEB3 PROJECT INTELLIGENCE
</div>
</div>
</div>

<div className="live-status">
<span />
LIVE MONITORING
</div>

<nav className="nav">
<div className="nav-heading">DISCOVER</div>

<button className="nav-item active">
<FiActivity />
<span>Live Radar</span>
<b>LIVE</b>
</button>

<button className="nav-item">
<FiCompass />
<span>Projects</span>
</button>

<button className="nav-item">
<FiUsers />
<span>Hiring Signals</span>
<b>12</b>
</button>

<button className="nav-item">
<FiLayers />
<span>Opportunities</span>
</button>

<div className="nav-heading section-space">
INTELLIGENCE
</div>

<button className="nav-item">
<FiDatabase />
<span>Funding</span>
</button>

<button className="nav-item">
<FiHash />
<span>Ecosystems</span>
</button>

<button className="nav-item">
<FiBookmark />
<span>Saved</span>
{saved.length > 0 && <b>{saved.length}</b>}
</button>

<button className="nav-item">
<FiBell />
<span>Alerts</span>
</button>
</nav>

<div className="sidebar-bottom">
<div className="jobber-panel">
<div className="jobber-header">
<span>JOBBER MODE</span>
<FiZap />
</div>

<p>
Find teams early. See their public channels.
Reach out before the opportunity becomes a listing.
</p>

<button>
Configure profile
<FiArrowUpRight />
</button>
</div>

<button className="nav-item">
<FiSettings />
<span>Settings</span>
</button>
</div>
</aside>

{/* MAIN */}
<main className="main">

{/* TOP BAR */}
<header className="topbar">

<div className="mobile-brand">
<ScoutMark />
<strong>SCOUT</strong>
</div>

<div className="search-box">
<FiSearch />
<input
value={query}
onChange={(e) => setQuery(e.target.value)}
placeholder="Search projects, chains, categories..."
/>
</div>

<div className="top-actions">
<button className="notification">
<FiBell />
<span />
</button>

<button className="profile">
<div>W</div>
<span>WEB4GREAT</span>
<FiChevronDown />
</button>
</div>
</header>

<section className="content">

{/* HEADER */}
<div className="page-header">
<div>
<div className="eyebrow">
<span className="live-dot" />
REAL-TIME PROJECT DISCOVERY
</div>

<h1>Live Radar</h1>

<p>
Discover projects early. Find the people behind them.
</p>
</div>

<button className="filter-button">
<FiFilter />
Filters
<span>3</span>
</button>
</div>

{/* STATS */}
<div className="stats-grid">

<div className="stat-card">
<div className="stat-icon">
<FiActivity />
</div>
<div>
<strong>128</strong>
<span>Projects tracked</span>
</div>
</div>

<div className="stat-card">
<div className="stat-icon">
<FiZap />
</div>
<div>
<strong>31</strong>
<span>Early signals</span>
</div>
</div>

<div className="stat-card">
<div className="stat-icon">
<FiUsers />
</div>
<div>
<strong>12</strong>
<span>Hiring signals</span>
</div>
</div>

<div className="stat-card">
<div className="stat-icon">
<FiClock />
</div>
<div>
<strong>4m</strong>
<span>Avg. detection</span>
</div>
</div>

</div>

{/* FILTER BAR */}
<div className="toolbar">

<div className="tabs">
{filters.map((filter) => (
<button
key={filter}
onClick={() => setActiveFilter(filter)}
className={
activeFilter === filter ? 'tab active-tab' : 'tab'
}
>
{filter}
</button>
))}
</div>

<button className="sort">
<FiClock />
Newest
<FiChevronDown />
</button>

</div>

{/* SECTION TITLE */}
<div className="section-title">
<div>
<span className="live-dot" />
LIVE PROJECTS
</div>

<span>{filteredProjects.length} tracked</span>
</div>

{/* PROJECTS */}
<div className="project-list">

{filteredProjects.map((project) => (
<article
className="project-card"
key={project.id}
>

<div className="project-body">

<div className="project-logo">
{project.symbol.slice(0, 1)}
</div>

<div className="project-content">

<div className="project-name-row">

<h2>{project.name}</h2>

<span className="symbol">
{project.symbol}
</span>

<span
className={`signal-badge ${project.signalType.toLowerCase()}`}
>
{project.signalType}
</span>

</div>

<div className="project-meta">

<span>{project.chain}</span>

<i>•</i>

<span>{project.category}</span>

<i>•</i>

<span>
<FiClock />
{project.detected} ago
</span>

</div>

<p className="description">
{project.description}
</p>

<div className="signal-row">

<span>
<FiZap />
{project.signal}
</span>

<span>
<FiGlobe />
Public project
</span>

</div>

</div>

<div className="score">

<span>EARLY SCORE</span>

<strong>{project.score}</strong>

<small>/100</small>

</div>

</div>

{/* PROJECT FOOTER */}
<div className="project-footer">

<div className="socials">

<a
href={project.website}
target="_blank"
rel="noreferrer"
title="Website"
>
<FiGlobe />
</a>

<a
href={project.x}
target="_blank"
rel="noreferrer"
title="X"
>
<FiTwitter />
</a>

{project.github && (
<a
href={project.github}
target="_blank"
rel="noreferrer"
title="GitHub"
>
<FiGithub />
</a>
)}

{project.discord && (
<a
href={project.discord}
target="_blank"
rel="noreferrer"
title="Discord"
>
<FiDisc />
</a>
)}

{project.telegram && (
<a
href={project.telegram}
target="_blank"
rel="noreferrer"
title="Telegram"
>
<FiSend />
</a>
)}

{project.docs && (
<a
href={project.docs}
target="_blank"
rel="noreferrer"
title="Docs"
>
<FiCode />
</a>
)}

</div>

<div className="card-actions">

<button
className={
saved.includes(project.id)
? 'save-button saved'
: 'save-button'
}
onClick={() => toggleSaved(project.id)}
>
{saved.includes(project.id) ? (
<FiCheck />
) : (
<FiStar />
)}
</button>

<button
className="contact-button"
onClick={() => openSocials(project)}
>
<FiSend />
Find team
</button>

<a
className="view-button"
href={project.website}
target="_blank"
rel="noreferrer"
>
Open project
<FiArrowUpRight />
</a>

</div>

</div>

</article>
))}

</div>

{filteredProjects.length === 0 && (
<div className="empty">
<FiSearch />
<strong>No projects found</strong>
<span>Try another search or category.</span>
</div>
)}

<div className="data-note">
<FiTerminal />

<span>
Public project intelligence • verified sources •
detection engine coming next
</span>

<button>
Methodology
<FiExternalLink />
</button>
</div>

</section>
</main>
</div>
)
}

export default App