import axios from 'axios'

const API_BASE_URL = 'https://localhost:7233'

// Tạo instance axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor để thêm token vào header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor để xử lý lỗi chung
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data)
      
      if (error.response.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    } else if (error.request) {
      console.error('Network Error:', error.request)
    } else {
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export const ratingService = {
  // Thêm đánh giá cho khóa học
  async addRating(courseId, ratingData) {
    try {
      const response = await apiClient.post(`/ratings?courseId=${courseId}`, ratingData)
      return response.data
    } catch (error) {
      console.error('Error adding rating:', error)
      throw error
    }
  }
}

export default ratingService 