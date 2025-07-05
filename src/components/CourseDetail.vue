<template>
  <div class="course-detail-page bg-gray-50 min-h-screen">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Đang tải thông tin khóa học...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="error">
      <h2 class="text-xl font-bold mb-2">Có lỗi xảy ra</h2>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button @click="retryLoad" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Thử lại
      </button>
    </div>

    <!-- Course Content -->
    <div v-else-if="course && Object.keys(course).length > 0">
      <!-- HERO SECTION -->
      <section class="bg-gradient-to-br from-blue-700 to-indigo-800 text-white pb-12">
        <div class="max-w-6xl mx-auto px-4 pt-10 flex flex-col md:flex-row gap-10 items-center">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span v-for="aud in course.targetAudience || []" :key="aud" class="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
                {{ aud }}
              </span>
            </div>
            <h1 class="text-3xl md:text-5xl font-bold mb-4">{{ course.title || course.name }}</h1>
            <div class="flex items-center gap-2 mb-3">
              <span class="text-yellow-300 text-xl">★</span>
              <span class="font-semibold">4.7</span>
              <span class="text-gray-200">(1,234 đánh giá)</span>
            </div>
            <p class="text-lg text-white/90 mb-6">{{ course.description }}</p>
            <div class="flex gap-4 mb-6">
              <button class="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-lg shadow transition">Đăng ký học</button>
              <button class="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg border border-white/20 transition">Thêm vào giỏ</button>
              <button v-if="isAdmin" @click="editCourse(course.id)" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition">
                Chỉnh sửa
              </button>
            </div>
            <div class="flex gap-2 flex-wrap">
              <span class="bg-white/10 px-3 py-1 rounded text-xs">Trực tuyến</span>
              <span class="bg-white/10 px-3 py-1 rounded text-xs">Chứng chỉ hoàn thành</span>
              <span class="bg-white/10 px-3 py-1 rounded text-xs">3+ bài kiểm tra</span>
              <span v-if="course.duration" class="bg-white/10 px-3 py-1 rounded text-xs">{{ course.duration }}</span>
            </div>
          </div>
          <div class="flex-1 flex justify-center items-center">
            <div class="w-full max-w-md aspect-video rounded-2xl overflow-hidden shadow-lg bg-white/10 flex items-center justify-center">
              <template v-if="isYoutubeUrl(course.imageUrl)">
                <iframe :src="getYoutubeEmbedUrl(course.imageUrl)" frameborder="0" allowfullscreen class="w-full h-full"></iframe>
              </template>
              <template v-else>
                <img :src="course.imageUrl" :alt="course.title || course.name" class="w-full h-full object-cover" @error="handleImageError" />
              </template>
            </div>
          </div>
        </div>
      </section>

      <!-- WHAT'S INCLUDED -->
      <section class="max-w-6xl mx-auto px-4 py-10">
        <h2 class="text-2xl font-bold mb-6">Nội dung khóa học</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span class="text-3xl mb-2">📁</span>
            <span>Tài liệu học tập</span>
          </div>
          <div class="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span class="text-3xl mb-2">📝</span>
            <span>Bài kiểm tra</span>
          </div>
          <div class="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span class="text-3xl mb-2">📱</span>
            <span>Học mọi lúc mọi nơi</span>
          </div>
          <div class="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span class="text-3xl mb-2">🎓</span>
            <span>Chứng chỉ hoàn thành</span>
          </div>
        </div>
      </section>

      <!-- DESCRIPTION -->
      <section class="max-w-6xl mx-auto px-4 py-10">
        <h2 class="text-2xl font-bold mb-4">Mô tả khóa học</h2>
        <p class="text-gray-700 text-lg mb-4">{{ course.description }}</p>
        <div v-if="course.additionalInfo" class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <h4 class="font-semibold text-blue-800 mb-2">Thông tin bổ sung:</h4>
          <p class="text-blue-700">{{ course.additionalInfo }}</p>
        </div>
        <div v-if="course.targetAudience && course.targetAudience.length > 0" class="mt-4">
          <h4 class="font-semibold text-gray-800 mb-2">Đối tượng học viên:</h4>
          <div class="flex flex-wrap gap-2">
            <span v-for="audience in course.targetAudience" :key="audience" 
                  class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {{ audience }}
            </span>
          </div>
        </div>
      </section>

      <!-- CURRICULUM (mock) -->
      <section class="max-w-6xl mx-auto px-4 py-10">
        <h2 class="text-2xl font-bold mb-6">Chương trình học</h2>
        <div class="space-y-4">
          <div v-for="chapter in mockCurriculum" :key="chapter.title" class="bg-white rounded-xl shadow p-6">
            <h3 class="font-semibold text-lg mb-2">{{ chapter.title }}</h3>
            <ul class="list-disc pl-6 text-gray-700">
              <li v-for="lesson in chapter.lessons" :key="lesson">{{ lesson }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- INSTRUCTORS (mock) -->
      <section class="max-w-6xl mx-auto px-4 py-10">
        <h2 class="text-2xl font-bold mb-6">Giảng viên</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="instructor in mockInstructors" :key="instructor.name" class="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <img :src="instructor.avatar" class="w-20 h-20 rounded-full mb-3 object-cover" />
            <div class="font-semibold text-center">{{ instructor.name }}</div>
            <div class="text-gray-500 text-sm text-center">{{ instructor.title }}</div>
          </div>
        </div>
      </section>

      <!-- RATINGS & REVIEWS (mock) -->
      <section class="max-w-6xl mx-auto px-4 py-10">
        <h2 class="text-2xl font-bold mb-6">Đánh giá & Nhận xét</h2>
        <div class="mb-4 font-semibold">Điểm đánh giá trung bình: 4.7 sao</div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="review in mockReviews" :key="review.name" class="bg-white rounded-xl shadow p-6">
            <div class="flex items-center gap-3 mb-2">
              <img :src="review.avatar" class="w-10 h-10 rounded-full object-cover" />
              <div>
                <div class="font-semibold">{{ review.name }}</div>
                <div class="text-yellow-400">★★★★★</div>
              </div>
            </div>
            <div class="text-gray-700 text-sm">{{ review.text }}</div>
          </div>
        </div>
      </section>

      <!-- RELATED COURSES (mock) -->
      <section class="max-w-6xl mx-auto px-4 py-10">
        <h2 class="text-2xl font-bold mb-6">Khóa học liên quan</h2>
        <div class="netflix-scroll flex flex-nowrap space-x-6 overflow-x-auto px-4 pb-4">
          <div
            v-for="(course, idx) in mockRelatedCourses"
            :key="course.title"
            class="netflix-card relative rounded-lg overflow-hidden shadow-lg bg-gray-800 min-w-[260px] max-w-[260px] h-[340px] flex flex-col cursor-pointer"
            @click="viewCourse(course.title)"
            tabindex="0"
            style="position: relative;"
          >
            <div class="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
              <img :src="course.image" class="object-cover w-full h-full" @error="handleImageError" />
            </div>
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
              <div class="text-white font-bold text-lg line-clamp-2">{{ course.title }}</div>
              <div class="text-gray-300 text-xs mt-1 line-clamp-1">{{ course.instructor }}</div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- No Course Found -->
    <div v-else class="error">
      <h2 class="text-xl font-bold mb-2">Không tìm thấy khóa học</h2>
      <p class="text-gray-600 mb-4">Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      <router-link to="/courses" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Quay lại danh sách khóa học
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useCoursesStore } from '@/stores/courses'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const coursesStore = useCoursesStore()
const authStore = useAuthStore()
const router = useRouter()

const props = defineProps({
  courseId: { type: String, required: true }
})

const course = computed(() => coursesStore.currentCourse || {})
const isAdmin = computed(() => authStore.userRole === 'admin')
const isLoading = computed(() => coursesStore.isLoading)
const hasError = computed(() => coursesStore.hasError)
const error = computed(() => coursesStore.error)

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/800x400?text=Khóa+học'
}
const isYoutubeUrl = (url) => /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url || '')
const getYoutubeEmbedUrl = (url) => {
  let videoId = ''
  if (!url) return ''
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/#\s]{11})/)
  if (ytMatch && ytMatch[1]) videoId = ytMatch[1]
  return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
}

const retryLoad = async () => {
  await coursesStore.fetchCourseById(props.courseId)
}

onMounted(async () => {
  await coursesStore.fetchCourseById(props.courseId)
})

// MOCK DATA
const mockCurriculum = [
  { title: 'Chương 1: Giới thiệu', lessons: ['Bài 1: Tổng quan', 'Bài 2: Mục tiêu', 'Bài 3: Lộ trình học'] },
  { title: 'Chương 2: Kỹ năng cơ bản', lessons: ['Bài 1: Kỹ năng 1', 'Bài 2: Kỹ năng 2'] },
  { title: 'Chương 3: Ứng dụng thực tế', lessons: ['Bài 1: Tình huống thực tế', 'Bài 2: Tổng kết'] }
]
const mockInstructors = [
  { name: 'Nguyễn Văn A', title: 'Chuyên gia Tâm lý', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Trần Thị B', title: 'Giảng viên Đại học', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Lê Văn C', title: 'Chuyên gia Giáo dục', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
  { name: 'Phạm Thị D', title: 'Chuyên gia Xã hội', avatar: 'https://randomuser.me/api/portraits/women/46.jpg' }
]
const mockReviews = [
  { name: 'Nguyễn Minh', avatar: 'https://randomuser.me/api/portraits/men/12.jpg', text: 'Khóa học rất bổ ích, giảng viên nhiệt tình.' },
  { name: 'Lê Hồng', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', text: 'Nội dung dễ hiểu, thực tế, áp dụng được ngay.' },
  { name: 'Trần Quốc', avatar: 'https://randomuser.me/api/portraits/men/23.jpg', text: 'Rất hài lòng với chất lượng khóa học.' }
]
const mockRelatedCourses = [
  { title: 'Kỹ năng sống cho học sinh', instructor: 'Nguyễn Văn A', image: 'https://via.placeholder.com/300x200?text=Course+1' },
  { title: 'Phòng chống bạo lực học đường', instructor: 'Trần Thị B', image: 'https://via.placeholder.com/300x200?text=Course+2' },
  { title: 'Giáo dục giới tính', instructor: 'Lê Văn C', image: 'https://via.placeholder.com/300x200?text=Course+3' },
  { title: 'Kỹ năng giao tiếp', instructor: 'Phạm Thị D', image: 'https://via.placeholder.com/300x200?text=Course+4' }
]

const courseSections = [
  {
    title: "Khóa học nổi bật",
    courses: [/* array các course nổi bật */]
  },
  {
    title: "Khóa học mới",
    courses: [/* array các course mới */]
  },
  // ... các nhóm khác
]

const viewCourse = (courseTitle) => {
  // Navigate to course detail or search for course by title
  console.log('Viewing course:', courseTitle)
  // For now, just show an alert
  alert(`Đang xem khóa học: ${courseTitle}`)
}

const editCourse = (courseId) => {
  router.push(`/admin/courses/edit/${courseId}`)
}
</script>

<style scoped>
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

.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

/* Loading state */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

/* Error state */
.error {
  text-align: center;
  padding: 2rem;
  color: #ef4444;
}
</style>