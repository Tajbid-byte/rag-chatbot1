import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'An error occurred'
    return Promise.reject(new Error(message))
  }
)

export const documentAPI = {
  upload: async (file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/api/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => onProgress?.(Math.round((e.loaded * 100) / e.total))
    })
    return response.data
  },
  list: async () => (await api.get('/api/documents/list')).data,
  clear: async () => (await api.delete('/api/documents/clear')).data
}

export const chatAPI = {
  sendMessage: async (message, sessionId) => {
    const response = await api.post('/api/chat/message', { message, session_id: sessionId })
    return response.data
  },
  clearHistory: async (sessionId) => (await api.delete(`/api/chat/history/${sessionId}`)).data,
  getStatus: async () => (await api.get('/api/chat/status')).data
}

export default api
