import { defineStore } from 'pinia'
import courseService from '@/services/courseService'

export const useCoursesStore = defineStore('courses', {
  state: () => ({
    courses: [],
    currentCourse: null,
    loading: false,
    error: null,
    filters: {
      name: '',
      targetAudience: '',
      startDate: '',
      endDate: ''
    },
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    }
  }),

  getters: {
    // Lấy danh sách khóa học đã được lọc
    filteredCourses: (state) => {
      let filtered = [...state.courses]
      
      if (state.filters.name) {
        filtered = filtered.filter(course => 
          (course.title || course.name).toLowerCase().includes(state.filters.name.toLowerCase())
        )
      }
      
      if (state.filters.targetAudience) {
        filtered = filtered.filter(course => 
          course.targetAudience.includes(state.filters.targetAudience)
        )
      }
      
      if (state.filters.startDate) {
        filtered = filtered.filter(course => 
          course.startDate >= state.filters.startDate
        )
      }
      
      if (state.filters.endDate) {
        filtered = filtered.filter(course => 
          course.endDate <= state.filters.endDate
        )
      }
      
      return filtered
    },

    // Lấy khóa học theo ID
    getCourseById: (state) => (id) => {
      return state.courses.find(course => course.id === id)
    },

    // Lấy danh sách đối tượng mục tiêu duy nhất
    uniqueTargetAudiences: (state) => {
      const audiences = new Set()
      state.courses.forEach(course => {
        course.targetAudience.forEach(audience => audiences.add(audience))
      })
      return Array.from(audiences)
    },

    // Kiểm tra xem có đang loading không
    isLoading: (state) => state.loading,

    // Kiểm tra có lỗi không
    hasError: (state) => !!state.error
  },

  actions: {
    // Lấy tất cả khóa học
    async fetchCourses() {
      this.loading = true
      this.error = null
      try {
        const courses = await courseService.getAllCourses()
        this.courses = courses
      } catch (error) {
        this.error = error.message || 'Có lỗi xảy ra khi tải danh sách khóa học'
        console.error('Error fetching courses:', error)
      } finally {
        this.loading = false
      }
    },

    // Lấy khóa học theo ID
    async fetchCourseById(id) {
      this.loading = true
      this.error = null
      try {
        const course = await courseService.getCourseById(id)
        this.currentCourse = course
        return course
      } catch (error) {
        this.error = error.message || 'Có lỗi xảy ra khi tải thông tin khóa học'
        console.error('Error fetching course:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Tạo khóa học mới
    async createCourse(courseData) {
      this.loading = true
      this.error = null
      try {
        const newCourse = await courseService.createCourse(courseData)
        this.courses.push(newCourse)
        return newCourse
      } catch (error) {
        this.error = error.message || 'Có lỗi xảy ra khi tạo khóa học'
        console.error('Error creating course:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Cập nhật khóa học
    async updateCourse(id, courseData) {
      this.loading = true
      this.error = null
      try {
        const updatedCourse = await courseService.updateCourse(id, courseData)
        const index = this.courses.findIndex(course => course.id === id)
        if (index !== -1) {
          this.courses[index] = updatedCourse
        }
        if (this.currentCourse && this.currentCourse.id === id) {
          this.currentCourse = updatedCourse
        }
        return updatedCourse
      } catch (error) {
        this.error = error.message || 'Có lỗi xảy ra khi cập nhật khóa học'
        console.error('Error updating course:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Xóa khóa học
    async deleteCourse(id) {
      this.loading = true
      this.error = null
      try {
        await courseService.deleteCourse(id)
        this.courses = this.courses.filter(course => course.id !== id)
        if (this.currentCourse && this.currentCourse.id === id) {
          this.currentCourse = null
        }
      } catch (error) {
        this.error = error.message || 'Có lỗi xảy ra khi xóa khóa học'
        console.error('Error deleting course:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Tìm kiếm khóa học
    async searchCourses(filters) {
      this.loading = true
      this.error = null
      try {
        const courses = await courseService.searchCourses(filters)
        this.courses = courses
        return courses
      } catch (error) {
        this.error = error.message || 'Có lỗi xảy ra khi tìm kiếm khóa học'
        console.error('Error searching courses:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Lấy khóa học theo đối tượng mục tiêu
    async fetchCoursesByTargetAudience(targetAudience) {
      this.loading = true
      this.error = null
      try {
        const courses = await courseService.getCoursesByTargetAudience(targetAudience)
        this.courses = courses
        return courses
      } catch (error) {
        this.error = error.message || 'Có lỗi xảy ra khi tải khóa học theo đối tượng'
        console.error('Error fetching courses by target audience:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Đăng ký khóa học
    async registerCourse(courseId, userId) {
      this.loading = true
      this.error = null
      try {
        const result = await courseService.registerCourse(courseId, userId)
        // Cập nhật trạng thái khóa học nếu cần
        return result
      } catch (error) {
        this.error = error.message || 'Có lỗi xảy ra khi đăng ký khóa học'
        console.error('Error registering course:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Hủy đăng ký khóa học
    async unregisterCourse(courseId, userId) {
      this.loading = true
      this.error = null
      try {
        const result = await courseService.unregisterCourse(courseId, userId)
        // Cập nhật trạng thái khóa học nếu cần
        return result
      } catch (error) {
        this.error = error.message || 'Có lỗi xảy ra khi hủy đăng ký khóa học'
        console.error('Error unregistering course:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Cập nhật filters
    updateFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters }
    },

    // Reset filters
    resetFilters() {
      this.filters = {
        name: '',
        targetAudience: '',
        startDate: '',
        endDate: ''
      }
    },

    // Clear error
    clearError() {
      this.error = null
    },

    // Clear current course
    clearCurrentCourse() {
      this.currentCourse = null
    }
  }
}) 