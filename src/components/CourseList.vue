<template>
  <div class="netflix-bg py-8 min-h-screen">
    <div v-for="section in courseSections" :key="section.title" class="mb-10">
      <h2 class="text-white text-2xl font-bold mb-4 px-8">{{ section.title }}</h2>
      <div class="netflix-scroll flex flex-nowrap space-x-6 overflow-x-auto px-8 pb-4">
        <div
          v-for="(course, idx) in section.courses"
          :key="course.id"
          class="netflix-card relative rounded-lg overflow-hidden shadow-lg bg-gray-800 min-w-[260px] max-w-[260px] h-[340px] flex flex-col cursor-pointer"
          @click="viewCourse(course.id)"
        >
          <div class="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
            <img :src="course.imageUrl" :alt="course.title || course.name" class="object-cover w-full h-full" @error="handleImageError" />
          </div>
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
            <div class="text-white font-bold text-lg line-clamp-2">{{ course.title || course.name }}</div>
            <div class="text-gray-300 text-xs mt-1 line-clamp-1">{{ course.description }}</div>
          </div>
          <div v-if="course.tag" class="absolute top-2 left-2 z-10 bg-yellow-300 text-xs font-bold px-2 py-1 rounded">
            {{ course.tag }}
          </div>
          <button v-if="!isAdmin" class="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow hover:bg-blue-100 transition" @click.stop.prevent="addToCart(course)" title="Thêm vào giỏ hàng">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V6a2 2 0 10-4 0v3m4 0H9" /></svg>
          </button>
        </div>
      </div>
    </div>
    <!-- Admin action buttons (outside the scroll area) -->
    <div v-if="isAdmin" class="flex flex-wrap gap-2 mt-4 justify-center">
      <div v-for="course in filteredCourses" :key="'admin-' + course.id" class="flex space-x-2">
        <button @click="editCourse(course.id)"
          class="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition-colors text-sm">
          Sửa
        </button>
        <button @click="deleteCourse(course.id)"
          class="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors text-sm">
          Xóa
        </button>
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

const courseSections = computed(() => [
  {
    title: 'Khóa học nổi bật',
    courses: coursesStore.courses.slice(0, 10)
  },
  {
    title: 'Khóa học mới',
    courses: coursesStore.courses.slice(0, 10)
  },
  {
    title: 'Khóa học phổ biến',
    courses: coursesStore.courses.slice(0, 10)
  }
])

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

const cardColors = [
  '#22c55e', // green
  '#3b82f6', // blue
  '#f59e42', // orange
  '#a855f7', // purple
]

function addToCart(course) {
  // TODO: Implement add to cart logic
  alert(`Đã thêm ${course.title || course.name} vào giỏ hàng!`)
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
.netflix-bg {
  background: #181818;
  min-height: 100vh;
}
.netflix-scroll {
  scrollbar-width: thin;
  scrollbar-color: #888 #222;
}
.netflix-scroll::-webkit-scrollbar {
  height: 10px;
}
.netflix-scroll::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 6px;
}
.netflix-card {
  min-width: 260px;
  max-width: 260px;
  height: 340px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.12);
  transition: box-shadow 0.2s, transform 0.2s;
  border: none;
}
.netflix-card:hover, .netflix-card:focus {
  box-shadow: 0 8px 32px 0 rgba(59,130,246,0.25);
  transform: scale(1.08);
  z-index: 2;
}
</style>