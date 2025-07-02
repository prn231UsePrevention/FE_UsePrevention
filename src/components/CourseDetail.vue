<template>
  <div class="course-detail-page bg-gray-50 min-h-screen">
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
            <span class="text-gray-200">(1,234 reviews)</span>
          </div>
          <p class="text-lg text-white/90 mb-6">{{ course.description }}</p>
          <div class="flex gap-4 mb-6">
            <button class="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-lg shadow transition">Đăng ký học</button>
            <button class="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg border border-white/20 transition">Thêm vào giỏ</button>
          </div>
          <div class="flex gap-2 flex-wrap">
            <span class="bg-white/10 px-3 py-1 rounded text-xs">Online</span>
            <span class="bg-white/10 px-3 py-1 rounded text-xs">Chứng chỉ hoàn thành</span>
            <span class="bg-white/10 px-3 py-1 rounded text-xs">3+ bài kiểm tra</span>
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
      <h2 class="text-2xl font-bold mb-6">What's included</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span class="text-3xl mb-2">📁</span>
          <span>1 project file</span>
        </div>
        <div class="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span class="text-3xl mb-2">📝</span>
          <span>3 chapter quizzes</span>
        </div>
        <div class="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span class="text-3xl mb-2">📱</span>
          <span>Access on tablet and phone</span>
        </div>
        <div class="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span class="text-3xl mb-2">🎓</span>
          <span>Certificate of completion</span>
        </div>
      </div>
    </section>

    <!-- DESCRIPTION -->
    <section class="max-w-6xl mx-auto px-4 py-10">
      <h2 class="text-2xl font-bold mb-4">Course description</h2>
      <p class="text-gray-700 text-lg mb-4">{{ course.description }}</p>
      <div v-if="course.additionalInfo" class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <h4 class="font-semibold text-blue-800 mb-2">Thông tin bổ sung:</h4>
        <p class="text-blue-700">{{ course.additionalInfo }}</p>
      </div>
    </section>

    <!-- CURRICULUM (mock) -->
    <section class="max-w-6xl mx-auto px-4 py-10">
      <h2 class="text-2xl font-bold mb-6">Course Curriculum</h2>
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
      <h2 class="text-2xl font-bold mb-6">Taught By The Best</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div v-for="instructor in mockInstructors" :key="instructor.name" class="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <img :src="instructor.avatar" class="w-20 h-20 rounded-full mb-3 object-cover" />
          <div class="font-semibold">{{ instructor.name }}</div>
          <div class="text-gray-500 text-sm">{{ instructor.title }}</div>
        </div>
      </div>
    </section>

    <!-- RATINGS & REVIEWS (mock) -->
    <section class="max-w-6xl mx-auto px-4 py-10">
      <h2 class="text-2xl font-bold mb-6">Ratings & Reviews</h2>
      <div class="mb-4 font-semibold">Average Rating: 4.7 Stars</div>
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
      <h2 class="text-2xl font-bold mb-6">Related Courses</h2>
      <div class="netflix-scroll flex flex-nowrap space-x-6 overflow-x-auto px-4 pb-4">
        <div
          v-for="(course, idx) in mockRelatedCourses"
          :key="course.title"
          class="netflix-card relative rounded-lg overflow-hidden shadow-lg bg-gray-800 min-w-[260px] max-w-[260px] h-[340px] flex flex-col"
          @click="viewCourse(course.title)"
          tabindex="0"
          style="position: relative;"
        >
          <div class="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
            <img :src="course.image" class="object-cover w-full h-full" @error="handleImageError" />
          </div>
          <!-- thử comment overlay này nếu nghi ngờ -->
          <!--
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
            <div class="text-white font-bold text-lg line-clamp-2">{{ course.title }}</div>
            <div class="text-gray-300 text-xs mt-1 line-clamp-1">{{ course.instructor }}</div>
          </div>
          -->
        </div>
      </div>
    </section>
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
</script>