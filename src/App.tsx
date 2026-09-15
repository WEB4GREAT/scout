import { useEffect, useMemo, useRef, useState } from 'react'
import {
  FiActivity,
  FiArrowUpRight,
  FiBookmark,
  FiCheck,
  FiClock,
  FiCompass,
  FiExternalLink,
  FiGlobe,
  FiLayers,
  FiRefreshCw,
  FiSearch,
  FiRadio,
  FiStar,
  FiTarget,
  FiTrendingUp,
  FiTwitter,
  FiZap,
} from 'react-icons/fi'
import './App.css'

type View = 'radar' | 'new' | 'signals' | 'saved' | 'sources'

type Project = {
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
  detectedAt: string
  source: string
  signal?: string
  signalType?: string
  score?: number
  detected?: string
}

const API_URL =
  import.meta.env.VITE_SCOUT_API_URL || 'http://localhost:3001'

const categories = [
  'ALL',
  'MEME',
  'DEFI',
  'INFRA',
  'AI',
  'GAMING',
  'SOCIAL',
  'PAYMENTS',
  'TOOLS',
  'RWA',
  'OTHER',
]

const categoryIcon: Record<string, typeof FiLayers> = {
  MEME: FiZap,
  DEFI: FiTrendingUp,
  INFRA: FiLayers,
  AI: FiActivity,
  GAMING: FiTarget,
  SOCIAL: FiCompass,
  PAYMENTS: FiArrowUpRight,
  TOOLS: FiLayers,
  RWA: FiStar,
  OTHER: FiRadio,
}

function getCategory(value = '') {
  const v = value.toLowerCase()

  if (v.includes('meme')) return 'MEME'
  if (v.includes('defi') || v.includes('finance') || v.includes('dex'))
    return 'DEFI'
  if (
    v.includes('infra') ||
    v.includes('infrastructure') ||
    v.includes('protocol')
  )
    return 'INFRA'
  if (v.includes('ai') || v.includes('artificial')) return 'AI'
  if (v.includes('game') || v.includes('gaming')) return 'GAMING'
  if (v.includes('social')) return 'SOCIAL'
  if (v.includes('payment')) return 'PAYMENTS'
  if (v.includes('tool') || v.includes('developer')) return 'TOOLS'
  if (v.includes('rwa') || v.includes('real world')) return 'RWA'

  return 'OTHER'
}

function getSignal(project: Project) {
  const signal = `${project.signal ?? ''} ${project.signalType ?? ''}`.toLowerCase()

  if (
    signal.includes('early') ||
    signal.includes('new') ||
    signal.includes('fresh')
  )
    return 'JUST LANDED'

  if (
    signal.includes('active') ||
    signal.includes('hot') ||
    signal.includes('heat')
  )
    return 'HEATING UP'

  if (
    signal.includes('building') ||
    signal.includes('build')
  )
    return 'BUILDING'

  const score = project.score ?? 0

  if (score >= 80) return 'STRONG SIGNAL'
  if (score >= 60) return 'WATCH'
  return 'EARLY'
}

function getSignalTone(label: string) {
  if (label === 'JUST LANDED') return 'fresh'
  if (label === 'HEATING UP') return 'hot'
  if (label === 'STRONG SIGNAL') return 'strong'
  if (label === 'BUILDING') return 'building'
  return 'watch'
}

function timeAgo(date?: string) {
  if (!date) return 'recently'

  const time = new Date(date).getTime()

  if (Number.isNaN(time)) return 'recently'

  const seconds = Math.max(0, Math.floor((Date.now() - time) / 1000))

  if (seconds < 60) return `${seconds}s ago`

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)

  if (days < 7) return `${days}d ago`

  return `${Math.floor(days / 7)}w ago`
}

function isFresh(date?: string) {
  if (!date) return false

  const age = Date.now() - new Date(date).getTime()

  return age >= 0 && age < 24 * 60 * 60 * 1000
}

function App() {
  const [projects, setProjects] = useState<Project[]>([])
  const [query, setQuery] = useState('')
  const [view, setView] = useState<View>('radar')
  const [chain, setChain] = useState('ALL')
  const [category, setCategory] = useState('ALL')
  const [saved, setSaved] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('scout:saved') || '[]')
    } catch {
      return []
    }
  })

  const [status, setStatus] = useState<'loading' | 'live' | 'error'>('loading')
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    localStorage.setItem('scout:saved', JSON.stringify(saved))
  }, [saved])

  async function loadProjects() {
    setRefreshing(true)

    const controller = new AbortController()

    const timeout = window.setTimeout(() => {
      controller.abort()
    }, 8000)

    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error('Scout API unavailable')
      }

      const result = await response.json()

      setProjects(result.data ?? [])
      setStatus('live')
      setLastSync(new Date())
    } catch (error) {
      console.error('Failed to load SCOUT projects:', error)
      setStatus('error')
    } finally {
      window.clearTimeout(timeout)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadProjects()

    const interval = window.setInterval(loadProjects, 30000)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement

      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === 'k'
      ) {
        event.preventDefault()
        searchRef.current?.focus()
      }

      if (
        event.key === '/' &&
        target.tagName !== 'INPUT' &&
        target.tagName !== 'TEXTAREA'
      ) {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKey)

    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const chains = useMemo(() => {
    const values = projects
      .map((project) => project.chain?.toUpperCase())
      .filter(Boolean)

    return ['ALL', ...Array.from(new Set(values))]
  }, [projects])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    let result = projects.filter((project) => {
      const matchesQuery =
        !q ||
        project.name?.toLowerCase().includes(q) ||
        project.symbol?.toLowerCase().includes(q) ||
        project.description?.toLowerCase().includes(q) ||
        project.chain?.toLowerCase().includes(q)

      const matchesChain =
        chain === 'ALL' ||
        project.chain?.toUpperCase() === chain

      const matchesCategory =
        category === 'ALL' ||
        getCategory(project.category) === category

      const matchesSaved =
        view !== 'saved' || saved.includes(project.id)

      return (
        matchesQuery &&
        matchesChain &&
        matchesCategory &&
        matchesSaved
      )
    })

    if (view === 'new') {
      result = [...result].sort(
        (a, b) =>
          new Date(b.detectedAt || 0).getTime() -
          new Date(a.detectedAt || 0).getTime(),
      )
    }

    if (view === 'signals') {
      result = [...result].sort(
        (a, b) => (b.score ?? 0) - (a.score ?? 0),
      )
    }

    return result
  }, [projects, query, chain, category, view, saved])

  const newCount = projects.filter((project) =>
    isFresh(project.detectedAt),
  ).length

  const averageScore = projects.length
    ? Math.round(
        projects.reduce(
          (sum, project) => sum + (project.score ?? 0),
          0,
        ) / projects.length,
      )
    : 0

  const toggleSaved = (id: string) => {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
  }

  const resetFilters = () => {
    setQuery('')
    setChain('ALL')
    setCategory('ALL')
  }

  const pageMeta: Record<
    View,
    { title: string; description: string }
  > = {
    radar: {
      title: 'See what’s forming.',
      description:
        'SCOUT watches the public surface for early signals before they become obvious.',
    },
    new: {
      title: 'Fresh on the radar.',
      description:
        'The newest discoveries, ordered by when SCOUT detected them.',
    },
    signals: {
      title: 'Follow the signal.',
      description:
        'Projects ranked by the strength of their current discovery signals.',
    },
    saved: {
      title: 'Your watchlist.',
      description:
        'Keep the projects worth checking again in one place.',
    },
    sources: {
      title: 'Where it comes from.',
      description:
        'A transparent view of the discovery sources feeding SCOUT.',
    },
  }

  const meta = pageMeta[view]

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="brand"
          onClick={() => setView('radar')}
          aria-label="SCOUT Radar"
        >
          <span className="brand-mark">
            <span />
            <span />
            <span />
          </span>

          <span className="brand-name">SCOUT</span>
        </button>

        <div className="top-status">
          <span className={`status-dot ${status}`} />
          <span>
            {status === 'live'
              ? 'LIVE FEED'
              : status === 'loading'
                ? 'SYNCING'
                : 'OFFLINE'}
          </span>

          {lastSync && (
            <span className="sync-time">
              {timeAgo(lastSync.toISOString())}
            </span>
          )}
        </div>

        <button
          className={`refresh-button ${refreshing ? 'spinning' : ''}`}
          onClick={loadProjects}
          title="Refresh radar"
        >
          <FiRefreshCw />
        </button>
      </header>

      <main className="main-content">
        <section className="hero">
          <div className="eyebrow">
            <span className="eyebrow-line" />
            <span>WEB3 DISCOVERY ENGINE</span>
          </div>

          <h1>{meta.title}</h1>

          <p className="hero-description">
            {meta.description}
          </p>

          <div className="search-zone">
            <FiSearch />

            <input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search projects, tokens, chains..."
              spellCheck={false}
            />

            <kbd>⌘ K</kbd>
          </div>

          <div className="quick-stats">
            <div>
              <span className="stat-value">{projects.length}</span>
              <span className="stat-label">TRACKED</span>
            </div>

            <div>
              <span className="stat-value fresh-number">
                {newCount}
              </span>
              <span className="stat-label">NEW 24H</span>
            </div>

            <div>
              <span className="stat-value">{averageScore}</span>
              <span className="stat-label">AVG SIGNAL</span>
            </div>

            <div>
              <span className="stat-value">{saved.length}</span>
              <span className="stat-label">SAVED</span>
            </div>
          </div>
        </section>

        {view !== 'sources' && (
          <>
            <section className="filter-area">
              <div className="filter-header">
                <span>TYPE</span>

                <button
                  className="reset-button"
                  onClick={resetFilters}
                >
                  RESET
                </button>
              </div>

              <div className="chips">
                {categories.map((item) => {
                  const Icon =
                    categoryIcon[item] || FiLayers

                  return (
                    <button
                      key={item}
                      className={`chip ${
                        category === item ? 'active' : ''
                      }`}
                      onClick={() => setCategory(item)}
                    >
                      <Icon />
                      {item}
                    </button>
                  )
                })}
              </div>

              <div className="filter-header chain-header">
                <span>CHAIN</span>
              </div>

              <div className="chips chain-chips">
                {chains.map((item) => (
                  <button
                    key={item}
                    className={`chip chain-chip ${
                      chain === item ? 'active' : ''
                    }`}
                    onClick={() => setChain(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </section>

            <section className="feed-section">
              <div className="section-heading">
                <div>
                  <span className="section-kicker">
                    {view === 'signals'
                      ? 'SIGNAL BOARD'
                      : view === 'new'
                        ? 'LATEST DISCOVERIES'
                        : view === 'saved'
                          ? 'YOUR LIST'
                          : 'RADAR'}
                  </span>

                  <h2>
                    {filtered.length}{' '}
                    {filtered.length === 1
                      ? 'project'
                      : 'projects'}
                  </h2>
                </div>

                <div className="live-indicator">
                  <span />
                  updating automatically
                </div>
              </div>

              {status === 'error' && (
                <div className="error-banner">
                  <div>
                    <strong>Scout API is currently unavailable.</strong>
                    <span>
                      Check the server and try the radar again.
                    </span>
                  </div>

                  <button onClick={loadProjects}>
                    RETRY
                  </button>
                </div>
              )}

              {filtered.length > 0 ? (
                <div className="project-list">
                  {filtered.map((project, index) => (
                    <ProjectRow
                      key={project.id}
                      project={project}
                      index={index}
                      saved={saved.includes(project.id)}
                      onSave={() => toggleSaved(project.id)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  view={view}
                  onReset={resetFilters}
                  onRefresh={loadProjects}
                />
              )}
            </section>
          </>
        )}

        {view === 'sources' && (
          <SourcesView projects={projects} />
        )}
      </main>

      <nav className="bottom-dock">
        <DockItem
          icon={FiRadio}
          label="RADAR"
          active={view === 'radar'}
          onClick={() => setView('radar')}
        />

        <DockItem
          icon={FiZap}
          label="NEW"
          badge={newCount}
          active={view === 'new'}
          onClick={() => setView('new')}
        />

        <DockItem
          icon={FiTrendingUp}
          label="SIGNALS"
          active={view === 'signals'}
          onClick={() => setView('signals')}
        />

        <DockItem
          icon={FiBookmark}
          label="SAVED"
          badge={saved.length}
          active={view === 'saved'}
          onClick={() => setView('saved')}
        />

        <DockItem
          icon={FiLayers}
          label="SOURCES"
          active={view === 'sources'}
          onClick={() => setView('sources')}
        />
      </nav>
    </div>
  )
}

function ProjectRow({
  project,
  index,
  saved,
  onSave,
}: {
  project: Project
  index: number
  saved: boolean
  onSave: () => void
}) {
  const category = getCategory(project.category)
  const signal = getSignal(project)
  const signalTone = getSignalTone(signal)
  const score = Math.min(100, Math.max(0, project.score ?? 0))
  const fresh = isFresh(project.detectedAt)

  const socials = [
    project.x,
    project.website,
    project.discord,
    project.telegram,
    project.docs,
  ].filter(Boolean).length

  return (
    <article className="project-row">
      <div className="project-number">
        {(index + 1).toString().padStart(2, '0')}
      </div>

      <div className="project-main">
        <div className="project-title-line">
          <div className="project-symbol">
            {project.symbol?.slice(0, 4) || '?'}
          </div>

          <div>
            <div className="project-name-line">
              <h3>{project.name}</h3>

              {fresh && (
                <span className="fresh-tag">
                  <span />
                  FRESH
                </span>
              )}
            </div>

            <div className="project-meta">
              <span>${project.symbol}</span>
              <i>·</i>
              <span>{project.chain || 'UNKNOWN'}</span>
              <i>·</i>
              <span>{category}</span>
            </div>
          </div>
        </div>

        <p className="project-description">
          {project.description || 'No description available yet.'}
        </p>

        <div className="project-bottom">
          <div className="signal-pill">
            <span className={`signal-dot ${signalTone}`} />
            {signal}
          </div>

          <span className="project-time">
            <FiClock />
            {timeAgo(project.detectedAt)}
          </span>

          <span className="contact-count">
            <FiGlobe />
            {socials} public routes
          </span>
        </div>
      </div>

      <div className="project-score">
        <span className="score-label">SIGNAL</span>

        <strong>{score}</strong>

        <div className="score-track">
          <span style={{ width: `${score}%` }} />
        </div>
      </div>

      <div className="project-actions">
        {project.x && (
          <a
            href={project.x}
            target="_blank"
            rel="noreferrer"
            title="Open X"
          >
            <FiTwitter />
          </a>
        )}

        {project.website && (
          <a
            href={project.website}
            target="_blank"
            rel="noreferrer"
            title="Open website"
          >
            <FiExternalLink />
          </a>
        )}

        <button
          className={saved ? 'saved' : ''}
          onClick={onSave}
          title={saved ? 'Remove from saved' : 'Save project'}
        >
          {saved ? <FiCheck /> : <FiBookmark />}
        </button>
      </div>
    </article>
  )
}

function DockItem({
  icon: Icon,
  label,
  active,
  badge,
  onClick,
}: {
  icon: typeof FiRadio
  label: string
  active: boolean
  badge?: number
  onClick: () => void
}) {
  return (
    <button
      className={`dock-item ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      <span className="dock-icon">
        <Icon />
        {badge !== undefined && badge > 0 && (
          <b>{badge > 99 ? '99+' : badge}</b>
        )}
      </span>

      <span>{label}</span>
    </button>
  )
}

function EmptyState({
  view,
  onReset,
  onRefresh,
}: {
  view: View
  onReset: () => void
  onRefresh: () => void
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <FiCompass />
      </div>

      <span>NOTHING ON THIS RADAR</span>

      <h3>
        {view === 'saved'
          ? 'Your watchlist is empty.'
          : 'No matching discoveries.'}
      </h3>

      <p>
        Try another category, chain, or search term.
      </p>

      <div className="empty-actions">
        <button onClick={onReset}>CLEAR FILTERS</button>
        <button onClick={onRefresh}>REFRESH RADAR</button>
      </div>
    </div>
  )
}

function SourcesView({
  projects,
}: {
  projects: Project[]
}) {
  const sourceMap = useMemo(() => {
    const map = new Map<string, number>()

    projects.forEach((project) => {
      const source = project.source || 'Unknown'

      map.set(source, (map.get(source) || 0) + 1)
    })

    return Array.from(map.entries()).sort(
      (a, b) => b[1] - a[1],
    )
  }, [projects])

  return (
    <section className="sources-section">
      <div className="sources-hero">
        <div className="source-orbit">
          <FiRadio />
        </div>

        <div>
          <span className="section-kicker">
            DISCOVERY INFRASTRUCTURE
          </span>

          <h2>Follow the trail.</h2>

          <p>
            Every project in SCOUT comes through an ingestion
            source, then gets normalized before appearing on
            the radar.
          </p>
        </div>
      </div>

      <div className="source-grid">
        {sourceMap.length > 0 ? (
          sourceMap.map(([source, count], index) => (
            <div className="source-card" key={source}>
              <div className="source-card-top">
                <span>
                  {String(index + 1).padStart(2, '0')}
                </span>

                <FiActivity />
              </div>

              <h3>{source}</h3>

              <div className="source-count">
                {count}
                <span>discoveries</span>
              </div>

              <div className="source-bar">
                <span
                  style={{
                    width: `${Math.max(
                      8,
                      Math.min(
                        100,
                        (count /
                          Math.max(
                            sourceMap[0]?.[1] || 1,
                            1,
                          )) *
                          100,
                      ),
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state source-empty">
            <div className="empty-icon">
              <FiRadio />
            </div>

            <span>WAITING FOR SIGNAL</span>

            <h3>No source data yet.</h3>

            <p>
              Once SCOUT receives discoveries, the source
              map will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default App