import axios from 'axios'
import { appConfig } from '@/config/appConfig'

export const api = axios.create({
  baseURL: appConfig.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized error handling will expand in later modules
    return Promise.reject(error)
  },
)
