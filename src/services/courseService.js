import axios from 'axios'

const API_BASE_URL = 'https://localhost:7233/api' // Thay đổi URL API thực tế

// Tạo instance axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 giây timeout
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
      // Server trả về response với status code lỗi
      console.error('API Error:', error.response.status, error.response.data)
      
      // Xử lý lỗi 401 (Unauthorized)
      if (error.response.status === 401) {
        localStorage.removeItem('token')
        // Có thể redirect về trang login ở đây
        window.location.href = '/login'
      }
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      console.error('Network Error:', error.request)
    } else {
      // Lỗi khác
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export const courseService = {
  // Lấy danh sách tất cả khóa học
  async getAllCourses() {
    try {
      const response = await apiClient.get('/Course')
      return response.data
    } catch (error) {
      console.error('Error fetching courses:', error)
      throw error
    }
  },

  // Lấy khóa học theo ID
  async getCourseById(id) {
    try {
      const response = await apiClient.get(`/Course/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching course:', error)
      throw error
    }
  },

  // Tạo khóa học mới
  async createCourse(courseData) {
    try {
      const response = await apiClient.post('/Course', courseData)
      return response.data
    } catch (error) {
      console.error('Error creating course:', error)
      throw error
    }
  },

  // Cập nhật khóa học
  async updateCourse(id, courseData) {
    try {
      const response = await apiClient.put(`/Course/${id}`, courseData)
      return response.data
    } catch (error) {
      console.error('Error updating course:', error)
      throw error
    }
  },

  // Xóa khóa học
  async deleteCourse(id) {
    try {
      const response = await apiClient.delete(`/Course/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting course:', error)
      throw error
    }
  },

  // Tìm kiếm khóa học theo tiêu chí
  async searchCourses(filters) {
    try {
      const response = await apiClient.get('/Course/search', { params: filters })
      return response.data
    } catch (error) {
      console.error('Error searching courses:', error)
      throw error
    }
  },

  // Lấy khóa học theo độ tuổi/đối tượng
  async getCoursesByTargetAudience(targetAudience) {
    try {
      const response = await apiClient.get(`/Course/target-audience/${targetAudience}`)
      return response.data
    } catch (error) {
      console.error('Error fetching courses by target audience:', error)
      throw error
    }
  },

  // Đăng ký khóa học
  async registerCourse(courseId, userId) {
    try {
      const response = await apiClient.post(`/Course/${courseId}/register`, { userId })
      return response.data
    } catch (error) {
      console.error('Error registering course:', error)
      throw error
    }
  },

  // Hủy đăng ký khóa học
  async unregisterCourse(courseId, userId) {
    try {
      const response = await apiClient.delete(`/Course/${courseId}/register/${userId}`)
      return response.data
    } catch (error) {
      console.error('Error unregistering course:', error)
      throw error
    }
  },

  // Lấy danh sách khóa học đã đăng ký của user
  async getUserRegisteredCourses(userId) {
    try {
      const response = await apiClient.get(`/Users/${userId}/registered-courses`)
      return response.data
    } catch (error) {
      console.error('Error fetching user registered courses:', error)
      throw error
    }
  }
}

export default courseService 