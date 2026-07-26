/**
 * Frontend app config (no .env).
 * Auto-picks local vs production from the browser hostname.
 * Override with `forcedMode` if you need to lock one environment.
 */
const forcedMode = null // null | 'local' | 'production'

const presets = {
  local: {
    appName: 'Uniquworld',
    appUrl: 'http://localhost:5173',
    apiUrl: 'http://localhost:5000/api/v1',
    adminApiKey: 'uniquworld-admin-dev-key',
  },
  production: {
    appName: 'Uniquworld',
    appUrl: 'https://uniquworld.com',
    apiUrl: 'https://uniquworld-server.onrender.com/api/v1',
    adminApiKey: 'uniquworld-admin-dev-key',
  },
}

function resolveMode() {
  if (forcedMode === 'local' || forcedMode === 'production') return forcedMode
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host === 'localhost' || host === '127.0.0.1') return 'local'
  }
  return 'production'
}

const mode = resolveMode()

export const appConfig = {
  mode,
  ...presets[mode],
  presets,
}

export default appConfig
