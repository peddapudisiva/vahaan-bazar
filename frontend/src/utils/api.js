import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || '/'

export const api = axios.create({
  baseURL,
  timeout: 10000,
})

// Attach Authorization header if token is present
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('vb_token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch {}
  return config
})

export async function getBikes(params) {
  const { data } = await api.get('/api/bikes', { params })
  return data
}

// Used bikes marketplace
export async function getUsed(params) {
  const { data } = await api.get('/api/used', { params })
  return data
}

export async function getMyUsed() {
  const { data } = await api.get('/api/used/mine')
  return data
}

export async function getUsedDetailPublic(id) {
  const { data } = await api.get(`/api/used-public/${id}`)
  return data
}

export async function getUsedDetail(id) {
  const { data } = await api.get(`/api/used/${id}`)
  return data
}

export async function createUsed(payload) {
  const { data } = await api.post('/api/used', payload)
  return data
}

export async function updateUsed(id, payload) {
  const { data } = await api.put(`/api/used/${id}`, payload)
  return data
}

export async function deleteUsed(id) {
  const { data } = await api.delete(`/api/used/${id}`)
  return data
}

export async function approveUsed(id) {
  const { data } = await api.post(`/api/used/${id}/approve`)
  return data
}

export async function markUsedSold(id) {
  const { data } = await api.post(`/api/used/${id}/sold`)
  return data
}

// Used orders (buy/reserve)
export async function createUsedOrder(payload) {
  const { data } = await api.post('/api/used-orders', payload)
  return data
}

export async function getMyUsedOrders() {
  const { data } = await api.get('/api/used-orders/mine')
  return data
}

export async function dealerListUsedOrders() {
  const { data } = await api.get('/api/used-orders/dealer')
  return data
}

export async function updateUsedOrderStatus(id, status) {
  const { data } = await api.post(`/api/used-orders/${id}/status`, { status })
  return data
}

export async function getBike(id) {
  const { data } = await api.get(`/api/bikes/${id}`)
  return data
}

export async function createBooking(payload) {
  const { data } = await api.post('/api/bookings', payload)
  return data
}

export async function getShowrooms(params) {
  const { data } = await api.get('/api/showrooms', { params })
  return data
}

export async function getLaunches(params) {
  const { data } = await api.get('/api/launches', { params })
  return data
}

// Auth
export async function register(payload) {
  const { data } = await api.post('/api/auth/register', payload)
  return data
}

export async function login(payload) {
  const { data } = await api.post('/api/auth/login', payload)
  return data
}

export async function me() {
  const { data } = await api.get('/api/auth/me')
  return data
}

// Reviews
export async function getReviews(bikeId) {
  const { data } = await api.get(`/api/bikes/${bikeId}/reviews`)
  return data
}

export async function postReview(bikeId, payload) {
  const { data } = await api.post(`/api/bikes/${bikeId}/reviews`, payload)
  return data
}

export async function deleteReview(reviewId) {
  const { data } = await api.delete(`/api/reviews/${reviewId}`)
  return data
}

// Price Alerts
export async function getAlerts() {
  const { data } = await api.get('/api/alerts')
  return data
}

export async function createAlert(payload) {
  const { data } = await api.post('/api/alerts', payload)
  return data
}

export async function deleteAlert(id) {
  const { data } = await api.delete(`/api/alerts/${id}`)
  return data
}

// Recommendations
export async function getRecommendations(bikeId) {
  const { data } = await api.get(`/api/bikes/${bikeId}/recommendations`)
  return data
}

export async function getTrending() {
  const { data } = await api.get('/api/recommendations/trending')
  return data
}

// Dealer endpoints (auth: dealer/admin)
export async function dealerListBookings() {
  const { data } = await api.get('/api/dealer/bookings')
  return data
}

export async function dealerCreateBike(payload) {
  const { data } = await api.post('/api/dealer/bikes', payload)
  return data
}

export async function dealerUpdateBike(id, payload) {
  const { data } = await api.put(`/api/dealer/bikes/${id}`, payload)
  return data
}

export async function dealerDeleteBike(id) {
  const { data } = await api.delete(`/api/dealer/bikes/${id}`)
  return data
}

export async function dealerCreateLaunch(payload) {
  const { data } = await api.post('/api/dealer/launches', payload)
  return data
}

export async function dealerUpdateLaunch(id, payload) {
  const { data } = await api.put(`/api/dealer/launches/${id}`, payload)
  return data
}

export async function dealerDeleteLaunch(id) {
  const { data } = await api.delete(`/api/dealer/launches/${id}`)
  return data
}
