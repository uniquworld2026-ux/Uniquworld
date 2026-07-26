import axios from 'axios'
import { appConfig } from '@/config/appConfig'

const ACCESS_KEY = 'uw_access_token'
const REFRESH_KEY = 'uw_refresh_token'

export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set(tokens) {
    if (tokens?.accessToken) localStorage.setItem(ACCESS_KEY, tokens.accessToken)
    if (tokens?.refreshToken) localStorage.setItem(REFRESH_KEY, tokens.refreshToken)
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
    // legacy key cleanup
    localStorage.removeItem('hm_access_token')
  },
}

export const api = axios.create({
  baseURL: appConfig.apiUrl,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let refreshing = null

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status !== 401 || original?._retry) {
      return Promise.reject(error)
    }

    const refreshToken = tokenStore.getRefresh()
    if (!refreshToken) {
      tokenStore.clear()
      return Promise.reject(error)
    }

    original._retry = true
    try {
      refreshing =
        refreshing ||
        axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken }).then((res) => {
          const tokens = res.data?.data?.tokens || res.data?.data
          tokenStore.set({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken || refreshToken,
          })
          return tokens.accessToken
        })
      const accessToken = await refreshing
      refreshing = null
      original.headers.Authorization = `Bearer ${accessToken}`
      return api(original)
    } catch (refreshError) {
      refreshing = null
      tokenStore.clear()
      return Promise.reject(refreshError)
    }
  },
)

export function getErrorMessage(error, fallback = 'Something went wrong') {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.errors?.[0]?.message ||
    error?.message ||
    fallback
  )
}
