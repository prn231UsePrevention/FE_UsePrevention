import axios from 'axios'

const API_BASE_URL = '/api' // Thay đổi URL API thực tế

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
      console.log('Sending course data to backend:', courseData)
      const response = await apiClient.post('/Course', courseData)
      console.log('Backend response:', response.data)
      
      // Handle different response formats from backend
      let courseId
      if (typeof response.data === 'number') {
        // Backend returns only the course ID
        courseId = response.data
        console.log('Received course ID:', courseId)
      } else if (response.data && response.data.id) {
        // Backend returns full course object
        console.log('Received full course object:', response.data)
        return response.data
      } else {
        // Unexpected response format
        console.error('Unexpected response format:', response.data)
        throw new Error('Unexpected response format from server')
      }
      
      // Fetch the full course details if we only got the ID
      console.log('Fetching course details for ID:', courseId)
      const courseDetails = await this.getCourseById(courseId)
      console.log('Fetched course details:', courseDetails)
      return courseDetails
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
  },

  async addModule(courseId, moduleData) {
    try {
      const response = await apiClient.post(`/Course/${courseId}/module`, moduleData)
      return response.data
    } catch (error) {
      console.error('Error adding module:', error)
      throw error
    }
  },

  async addLesson(moduleId, lessonData) {
    try {
      const response = await apiClient.post(`/Course/module/${moduleId}/lesson`, lessonData)
      return response.data
    } catch (error) {
      console.error('Error adding lesson:', error)
      throw error
    }
  },

  // Cập nhật module
  async updateModule(moduleId, moduleData) {
    try {
      const response = await apiClient.put(`/Course/module/${moduleId}`, moduleData)
      return response.data
    } catch (error) {
      console.error('Error updating module:', error)
      throw error
    }
  },

  // Cập nhật lesson
  async updateLesson(lessonId, lessonData) {
    try {
      const response = await apiClient.put(`/Course/lesson/${lessonId}`, lessonData)
      return response.data
    } catch (error) {
      console.error('Error updating lesson:', error)
      throw error
    }
  },

  // Xóa module
  async deleteModule(moduleId) {
    try {
      const response = await apiClient.delete(`/Course/module/${moduleId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting module:', error)
      throw error
    }
  },

  // Xóa lesson
  async deleteLesson(lessonId) {
    try {
      const response = await apiClient.delete(`/Course/lesson/${lessonId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting lesson:', error)
      throw error
    }
  },


}

export default courseService
