<template>
  <div class="course-list">
    <!-- Admin Actions -->
    <div v-if="isAdmin" class="admin-actions mb-6">
      <router-link to="/admin/courses/create"
        class="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-medium">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Tạo khóa học mới
      </router-link>
    </div>

    <!-- Search and Filter Section -->
    <div class="search-filter-section bg-white p-6 rounded-lg shadow-md mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search by name -->
        <div>
          <label for="searchName" class="block text-sm font-medium text-gray-700 mb-2">
            Tìm kiếm theo tên
          </label>
          <input id="searchName" v-model="searchFilters.name" type="text" placeholder="Nhập tên khóa học..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="handleSearch" />
        </div>

        <!-- Filter by target audience -->
        <div>
          <label for="targetAudience" class="block text-sm font-medium text-gray-700 mb-2">
            Đối tượng mục tiêu
          </label>
          <select id="targetAudience" v-model="searchFilters.targetAudience"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="handleSearch">
            <option value="">Tất cả đối tượng</option>
            <option v-for="audience in uniqueTargetAudiences" :key="audience" :value="audience">
              {{ audience }}
            </option>
          </select>
        </div>

        <!-- Filter by start date -->
        <div>
          <label for="startDate" class="block text-sm font-medium text-gray-700 mb-2">
            Từ ngày
          </label>
          <input id="startDate" v-model="searchFilters.startDate" type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="handleSearch" />
        </div>

        <!-- Filter by end date -->
        <div>
          <label for="endDate" class="block text-sm font-medium text-gray-700 mb-2">
            Đến ngày
          </label>
          <input id="endDate" v-model="searchFilters.endDate" type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="handleSearch" />
        </div>
      </div>

      <!-- Reset filters button -->
      <div class="mt-4 flex justify-end">
        <button @click="resetFilters"
          class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
          Xóa bộ lọc
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="hasError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
      {{ error }}
    </div>

    <!-- Course grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="course in filteredCourses" :key="course.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <!-- Course image -->
        <div class="relative h-48 bg-gray-200">
          <img :src="course.imageUrl" :alt="course.title || course.name" class="w-full h-full object-cover" @error="handleImageError" />
          <div class="absolute top-2 right-2">
            <span class="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
              {{ course.targetAudience.join(', ') }}
            </span>
          </div>
        </div>

        <!-- Course content -->
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
            {{ course.title || course.name }}
          </h3>

          <p class="text-gray-600 text-sm mb-4 line-clamp-3">
            {{ course.description }}
          </p>

          <!-- Course details -->
          <div class="space-y-2 mb-4">
            <div class="flex items-center text-sm text-gray-500">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              {{ course.location }}
            </div>

            <div class="flex items-center text-sm text-gray-500">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              {{ formatDate(course.startDate) }} - {{ formatDate(course.endDate) }}
            </div>
          </div>

          <!-- Action buttons -->
          <div class="flex space-x-2">
            <button @click="viewCourse(course.id)"
              class="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm">
              Xem chi tiết
            </button>

            <button v-if="isAdmin" @click="editCourse(course.id)"
              class="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition-colors text-sm">
              Sửa
            </button>

            <button v-if="isAdmin" @click="deleteCourse(course.id)"
              class="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors text-sm">
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!isLoading && !hasError && filteredCourses.length === 0" class="text-center py-12">
      <div class="text-gray-500">
        <svg class="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
          </path>
        </svg>
        <p class="text-lg font-medium">Không tìm thấy khóa học nào</p>
        <p class="text-sm">Thử thay đổi bộ lọc tìm kiếm</p>
        <div v-if="isAdmin" class="mt-4">
          <router-link to="/admin/courses/create"
            class="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6">
              </path>
            </svg>
            Tạo khóa học đầu tiên
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const coursesStore = useCoursesStore()
const authStore = useAuthStore()

// Reactive data
const searchFilters = ref({
  name: '',
  targetAudience: '',
  startDate: '',
  endDate: ''
})

// Computed properties
const filteredCourses = computed(() => coursesStore.filteredCourses)
const isLoading = computed(() => coursesStore.isLoading)
const hasError = computed(() => coursesStore.hasError)
const error = computed(() => coursesStore.error)
const uniqueTargetAudiences = computed(() => coursesStore.uniqueTargetAudiences)
const isAdmin = computed(() => authStore.userRole === 'admin')

// Methods
const handleSearch = () => {
  coursesStore.updateFilters(searchFilters.value)
}

const resetFilters = () => {
  searchFilters.value = {
    name: '',
    targetAudience: '',
    startDate: '',
    endDate: ''
  }
  coursesStore.resetFilters()
}

const viewCourse = (courseId) => {
  router.push(`/courses/${courseId}`)
}

const editCourse = (courseId) => {
  router.push(`/admin/courses/edit/${courseId}`)
}

const deleteCourse = async (courseId) => {
  if (confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
    try {
      await coursesStore.deleteCourse(courseId)
      // Show success message or handle as needed
    } catch (error) {
      console.error('Error deleting course:', error)
    }
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/300x200?text=Khóa+học'
}

// Lifecycle
onMounted(async () => {
  await coursesStore.fetchCourses()
})

// Watch for filter changes
watch(searchFilters, () => {
  handleSearch()
}, { deep: true })
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>