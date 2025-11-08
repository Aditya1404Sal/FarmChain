import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ============ AUTH ENDPOINTS ============
export const authAPI = {
  register: (data) => api.post('/auth/register', {
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role,
    phone: data.phone,
    location: data.location,
    walletAddress: data.walletAddress
  }),
  
  login: (email, password) => api.post('/auth/login', { email, password }),
  
  getProfile: () => api.get('/auth/profile'),
  
  updateProfile: (data) => api.put('/auth/profile', data),
  
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  
  logout: () => api.post('/auth/logout')
}

// ============ BATCH ENDPOINTS ============
export const batchAPI = {
  create: (data) => api.post('/batches', {
    cropType: data.cropType,
    quantity: parseFloat(data.quantity),
    unit: data.unit || 'kg',
    harvestDate: data.harvestDate,
    qualityGrade: data.qualityGrade,
    location: data.location,
    pesticideUsed: data.pesticideUsed || false,
    organicCertified: data.organicCertified || false
  }),
  
  list: (params) => api.get('/batches', { params }),
  
  getById: (id) => api.get(`/batches/${id}`),
  
  update: (id, data) => api.put(`/batches/${id}`, data),
  
  delete: (id) => api.delete(`/batches/${id}`),
  
  verify: (id) => api.post(`/batches/${id}/verify`)
}

// ============ TRANSACTION ENDPOINTS ============
export const transactionAPI = {
  create: (data) => api.post('/transactions', {
    batchId: data.batchId,
    toUserId: data.toUserId,
    transactionType: data.transactionType,
    location: data.location,
    temperature: data.temperature,
    humidity: data.humidity,
    notes: data.notes
  }),
  
  list: (params) => api.get('/transactions', { params }),
  
  getById: (id) => api.get(`/transactions/${id}`),
  
  getBatchTransactions: (batchId) => api.get(`/transactions/batch/${batchId}`)
}

// ============ QUALITY REPORT ENDPOINTS ============
export const qualityReportAPI = {
  create: (data) => api.post('/reports', {
    batchId: data.batchId,
    inspectionDate: data.inspectionDate,
    pesticideUsed: data.pesticideUsed,
    organicCertified: data.organicCertified,
    grade: data.grade,
    remarks: data.remarks,
    reportUrl: data.reportUrl
  }),
  
  getBatchReports: (batchId) => api.get(`/reports/batch/${batchId}`),
  
  update: (id, data) => api.put(`/reports/${id}`, data),
  
  delete: (id) => api.delete(`/reports/${id}`)
}

// ============ BLOCKCHAIN ENDPOINTS ============
export const blockchainAPI = {
  verifyBatch: (batchId) => api.get(`/blockchain/verify/${batchId}`),
  
  getBatchHistory: (batchId) => api.get(`/blockchain/history/${batchId}`),
  
  syncToBlockchain: (batchIds) => api.post('/blockchain/sync', { batchIds }),
  
  getGasPrice: () => api.get('/blockchain/gas-price')
}

// ============ ANALYTICS ENDPOINTS ============
export const analyticsAPI = {
  getOverview: (params) => api.get('/analytics/overview', { params }),
  
  getFarmerMetrics: (params) => api.get('/analytics/farmers', { params }),
  
  getSupplyChainMetrics: (params) => api.get('/analytics/supply-chain', { params }),
  
  getQualityTrends: (params) => api.get('/analytics/quality-trends', { params }),
  
  exportReport: (params) => api.get('/analytics/reports/export', { params })
}

// ============ USER ENDPOINTS ============
export const userAPI = {
  list: (params) => api.get('/users', { params }),
  
  getById: (id) => api.get(`/users/${id}`),
  
  update: (id, data) => api.put(`/users/${id}`, data),
  
  delete: (id) => api.delete(`/users/${id}`),
  
  activate: (id) => api.post(`/users/${id}/activate`),
  
  deactivate: (id) => api.post(`/users/${id}/deactivate`)
}

export default api
