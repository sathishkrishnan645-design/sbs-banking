import axios from 'axios'
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081', timeout: 10000 })
api.interceptors.request.use((config) => {
  const token = window.__sbs_token__
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
api.interceptors.response.use(res => res, err => {
  if (err.response?.status === 401) window.location.href = '/login'
  return Promise.reject(err)
})
export default api
