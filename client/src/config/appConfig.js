/**
 * Frontend app config (no .env required).
 * Switch `mode` or override values for local vs production.
 */
const mode = 'local' // 'local' | 'production'

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
    apiUrl: 'https://uniquworld.onrender.com/api/v1',
    adminApiKey: 'uniquworld-admin-dev-key',
  },
}

export const appConfig = {
  mode,
  ...presets[mode],
}

export default appConfig
