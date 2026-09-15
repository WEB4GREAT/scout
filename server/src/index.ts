import express from 'express'
import cors from 'cors'

import {
  getProjects,
  getRefreshStatus,
} from './db/projectStore'

import {
  runIngestion,
} from './services/ingestionService'

const app = express()

const PORT = 3001
const REFRESH_INTERVAL = 60_000

let refreshInFlight = false

app.use(cors())
app.use(express.json())

app.get(
  '/api/health',
  (_req, res) => {
    res.json({
      ok: true,
      service: 'scout-api',
      timestamp:
        new Date().toISOString(),
      ...getRefreshStatus(),
    })
  },
)

app.get(
  '/api/projects',
  (_req, res) => {
    const projects =
      getProjects()

    res.json({
      ok: true,

      data: projects,

      count:
        projects.length,

      refresh:
        getRefreshStatus(),
    })
  },
)

app.post(
  '/api/ingest',
  async (_req, res) => {
    if (refreshInFlight) {
      res.json({
        ok: true,
        status:
          'already_refreshing',

        data:
          getProjects(),

        count:
          getProjects().length,

        refresh:
          getRefreshStatus(),
      })

      return
    }

    refreshInFlight = true

    try {
      const result =
        await runIngestion()

      res.json({
        ok: true,
        ...result,

        data:
          getProjects(),

        count:
          getProjects().length,

        refresh:
          getRefreshStatus(),
      })
    } catch (error) {
      console.error(
        '[SCOUT] manual refresh failed',
        error,
      )

      res.status(500).json({
        ok: false,

        error:
          'Refresh failed',

        data:
          getProjects(),

        count:
          getProjects().length,

        refresh:
          getRefreshStatus(),
      })
    } finally {
      refreshInFlight = false
    }
  },
)

async function refreshScout() {
  if (refreshInFlight) {
    return
  }

  refreshInFlight = true

  console.log(
    '[SCOUT] refreshing project intelligence...',
  )

  try {
    const result =
      await runIngestion()

    console.log(
      '[SCOUT] refresh complete',
      result,
    )
  } catch (error) {
    console.error(
      '[SCOUT] refresh failed',
      error,
    )
  } finally {
    refreshInFlight = false
  }
}

app.listen(
  PORT,
  '0.0.0.0',
  () => {
    console.log(
      `SCOUT API running on http://localhost:${PORT}`,
    )

    console.log(
      '[SCOUT] automatic refresh: every 60 seconds',
    )

    void refreshScout()
  },
)

setInterval(
  () => {
    void refreshScout()
  },
  REFRESH_INTERVAL,
)
