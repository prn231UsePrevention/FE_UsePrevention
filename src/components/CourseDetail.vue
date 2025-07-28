<template>
  <div class="course-detail-page bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p class="loading-text">Đang tải thông tin khóa học...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="error-container">
      <div class="error-content">
        <div class="error-icon">⚠️</div>
        <h2 class="error-title">Có lỗi xảy ra</h2>
        <p class="error-message">{{ error }}</p>
        <button @click="retryLoad" class="retry-button">
          <span class="retry-icon">🔄</span>
          Thử lại
        </button>
      </div>
    </div>

    <!-- Course Content -->
    <div v-else-if="course && Object.keys(course).length > 0" class="course-content">
      <!-- HERO SECTION -->
      <section class="hero-section">
        <div class="hero-background"></div>
        <div class="hero-content">
          <div class="hero-left">
            <div class="course-badges">
              <span v-for="aud in course.targetAudience || []" :key="aud" class="badge">
                {{ aud }}
              </span>
            </div>
            <h1 class="course-title">{{ course.title || course.name }}</h1>
            <div class="course-rating">
              <div class="stars">
                <span
                  v-for="i in 5"
                  :key="i"
                  class="star"
                  :class="renderStarType(i, averageRating)"
                >
                  <template v-if="renderStarType(i, averageRating) === 'full'">★</template>
                  <template v-else-if="renderStarType(i, averageRating) === 'half'">
                    <!-- SVG nửa sao hoặc ký tự -->
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;"><defs><linearGradient id="half"><stop offset="50%" stop-color="#fbbf24"/><stop offset="50%" stop-color="#ccc"/></linearGradient></defs><path d="M10 15.27L16.18 18l-1.64-7.03L19 7.24l-7.19-.61L10 0 8.19 6.63 1 7.24l5.46 3.73L4.82 18z" fill="url(#half)"/></svg>
                  </template>
                  <template v-else>☆</template>
                </span>
              </div>
              <span class="rating-text">{{ averageRating }} ({{ ratingsCount }} đánh giá)</span>
            </div>
            <p class="course-description">{{ course.description }}</p>
            <div class="course-actions">
              <button 
                v-if="!isEnrolled" 
                class="btn-primary" 
                @click="handleEnroll" 
                :disabled="enrollLoading || checkingEnrollment"
              >
                <span class="btn-icon">📚</span>
                <span v-if="!enrollLoading && !checkingEnrollment">Đăng ký học</span>
                <span v-else-if="checkingEnrollment">Đang kiểm tra...</span>
                <span v-else>Đang đăng ký...</span>
              </button>
              <button 
                v-else 
                class="btn-enrolled" 
                disabled
              >
                <span class="btn-icon">✅</span>
                Đã đăng ký
              </button>
              <button v-if="isAdmin" @click="editCourse(course.id)" class="btn-admin">
                <span class="btn-icon">✏️</span>
                Chỉnh sửa
              </button>
            </div>
            
            
            <div class="course-features">
              <span class="feature">🌐 Trực tuyến</span>
              <span class="feature">🎓 Chứng chỉ hoàn thành</span>
              <span class="feature">📝 3+ bài kiểm tra</span>
              <span v-if="course.duration" class="feature">⏱️ {{ course.duration }}</span>
            </div>
          </div>
          <div class="hero-right">
            <div class="course-media">
              <template v-if="isYoutubeUrl(course.imageUrl)">
                <iframe :src="getYoutubeEmbedUrl(course.imageUrl)" frameborder="0" allowfullscreen class="video-frame"></iframe>
              </template>
              <template v-else>
                <div class="course-image-container">
                  <img 
                    v-if="hasValidImage"
                    :src="course.imageUrl || course.image" 
                    :alt="course.title || course.name" 
                    class="course-image" 
                    @error="handleImageError" 
                  />
                  <div v-else class="course-placeholder">
                    <div class="placeholder-icon">📚</div>
                    <div class="placeholder-title">{{ course.title || course.name || 'Khóa học' }}</div>
                    <div class="placeholder-subtitle">Học tập trực tuyến</div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </section>

      <!-- WHAT'S INCLUDED -->
      <section class="section">
        <div class="container">
          <h2 class="section-title">Nội dung khóa học</h2>
          <div class="features-grid">
            <div class="feature-card" v-for="(feature, index) in courseFeatures" :key="index">
              <div class="feature-icon">{{ feature.icon }}</div>
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-description">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- DESCRIPTION -->
      <section class="section">
        <div class="container">
          <h2 class="section-title">Mô tả khóa học</h2>
          <div class="description-grid">
            <div class="description-card">
              <div class="description-icon">📝</div>
              <h3 class="description-title">Mô tả chính</h3>
              <p class="description-text">{{ course.description }}</p>
            </div>
            <div v-if="course.additionalInfo" class="description-card">
              <div class="description-icon">📋</div>
              <h3 class="description-title">Thông tin bổ sung</h3>
              <p class="description-text">{{ course.additionalInfo }}</p>
            </div>
            <div v-if="course.targetAudience && course.targetAudience.length > 0" class="description-card">
              <div class="description-icon">👥</div>
              <h3 class="description-title">Đối tượng học viên</h3>
              <div class="audience-tags">
                <span v-for="audience in course.targetAudience" :key="audience" class="audience-tag">
                  {{ audience }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CURRICULUM -->
      <section class="section">
        <div class="container">
          <h2 class="section-title">Chương trình học</h2>
          <div class="modules-carousel">
            <div
              v-for="(module, mIdx) in course.modules || []"
              :key="module.id || mIdx"
              class="module-card-carousel"
            >
              <div class="curriculum-icon">📚</div>
              <h3 class="module-title-carousel">{{ module.title }}</h3>
              <div class="lesson-list-carousel">
                <div
                  v-for="(lesson, lIdx) in module.lessons || []"
                  :key="lesson.id || lIdx"
                  class="lesson-block-carousel"
                >
                  <img
                    v-if="getLessonThumbnail(lesson)"
                    :src="getLessonThumbnail(lesson)"
                    class="lesson-thumb-large"
                    :alt="lesson.title"
                  />
                  <div v-else class="lesson-thumb-placeholder">
                    <span class="lesson-icon">📖</span>
                  </div>
                  <div class="lesson-info-block">
                    <div class="lesson-title">{{ lesson.title }}</div>
                    <div v-if="lesson.description" class="lesson-desc">{{ lesson.description }}</div>
                    <button
                      v-if="lesson.videoUrl"
                      class="lesson-play-btn"
                      @click.stop="openVideoModal(lesson.videoUrl)"
                    >▶ Xem video</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- RATINGS & REVIEWS -->
      <section class="section">
        <div class="container">
          <h2 class="section-title">Đánh giá & Nhận xét</h2>
          
          <!-- Rating Summary -->
          <div class="rating-summary">
            <div class="rating-score">
              <span class="score">{{ averageRating }}</span>
              <div class="rating-stars">
                <span
                  v-for="i in 5"
                  :key="i"
                  class="star"
                  :class="renderStarType(i, averageRating)"
                >
                  <template v-if="renderStarType(i, averageRating) === 'full'">★</template>
                  <template v-else-if="renderStarType(i, averageRating) === 'half'">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;"><defs><linearGradient id="half2"><stop offset="50%" stop-color="#fbbf24"/><stop offset="50%" stop-color="#ccc"/></linearGradient></defs><path d="M10 15.27L16.18 18l-1.64-7.03L19 7.24l-7.19-.61L10 0 8.19 6.63 1 7.24l5.46 3.73L4.82 18z" fill="url(#half2)"/></svg>
                  </template>
                  <template v-else>☆</template>
                </span>
              </div>
              <span class="rating-count">{{ ratingsCount }} đánh giá</span>
            </div>
          </div>

          <!-- Course Rating Component -->
          <CourseRating 
            :courseId="courseId" 
            :isEnrolled="isEnrolled" 
            :courseRatings="course?.ratings || []"
            @rating-submitted="refreshCourseData"
          />

          <!-- Reviews Grid -->
          <div class="reviews-grid" v-if="course?.ratings && course.ratings.length > 0">
            <div
              v-for="review in course.ratings"
              :key="review.id"
              class="review-card"
            >
              <div class="review-header">
                <img
                  :src="review.avatar || defaultAvatar"
                  :alt="review.userName"
                  class="reviewer-avatar"
                />
                              <div class="reviewer-info">
                <h4 class="reviewer-name">{{ getUserName(review.userId) }}</h4>
                  <div class="review-stars">
                    <span
                      v-for="i in 5"
                      :key="i"
                      class="star"
                      :class="renderStarType(i, review.rating)"
                    >
                      <template v-if="renderStarType(i, review.rating) === 'full'">★</template>
                      <template v-else-if="renderStarType(i, review.rating) === 'half'">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;"><defs><linearGradient id="half3"><stop offset="50%" stop-color="#fbbf24"/><stop offset="50%" stop-color="#ccc"/></linearGradient></defs><path d="M10 15.27L16.18 18l-1.64-7.03L19 7.24l-7.19-.61L10 0 8.19 6.63 1 7.24l5.46 3.73L4.82 18z" fill="url(#half3)"/></svg>
                      </template>
                      <template v-else>☆</template>
                    </span>
                  </div>
                </div>
              </div>
              <p class="review-text">{{ review.comment }}</p>
            </div>
          </div>
          
          <!-- No Reviews Message -->
          <div v-if="!course?.ratings || course.ratings.length === 0" class="no-reviews">
            <p>Chưa có đánh giá nào cho khóa học này.</p>
          </div>
        </div>
      </section>

      <!-- RELATED COURSES -->
      <section class="section" v-if="relatedCourses.length > 0">
        <div class="container">
          <h2 class="section-title">Khóa học khác</h2>
          <div class="related-courses">
            <div
              v-for="(course, idx) in relatedCourses"
              :key="course.id"
              class="related-course-card"
              @click="viewCourse(course.id)"
            >
              <div class="course-thumbnail">
                <div class="thumbnail-container">
                  <img v-if="hasValidThumbnailImage(course)" :src="course.image" :alt="course.title" class="thumbnail-image" @error="handleThumbnailError" />
                  <div v-else class="thumbnail-placeholder">
                    <div class="thumbnail-icon">📚</div>
                    <div class="thumbnail-text">{{ course.title }}</div>
                  </div>
                </div>
                <div class="course-overlay">
                  <div class="course-info">
                    <h3 class="course-name">{{ course.title }}</h3>
                    <p class="course-instructor">{{ course.instructor }}</p>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- No Course Found -->
    <div v-else class="not-found-container">
      <div class="not-found-content">
        <div class="not-found-icon">🔍</div>
        <h2 class="not-found-title">Không tìm thấy khóa học</h2>
        <p class="not-found-message">Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <router-link to="/courses" class="back-button">
          <span class="back-icon">←</span>
          Quay lại danh sách khóa học
        </router-link>
      </div>
    </div>
    
    <div v-if="enrollError" class="alert-error">
      {{ enrollError }}
    </div>

    <!-- Video Modal Popup -->
    <transition name="fade">
      <div v-if="videoModal.show" class="video-modal-overlay" @click.self="closeVideoModal">
        <div class="video-modal-content">
          <button class="video-modal-close" @click="closeVideoModal">×</button>
          <iframe
            v-if="isYoutubeUrl(videoModal.url)"
            :src="getYoutubeEmbedUrl(videoModal.url)"
            frameborder="0"
            allowfullscreen
          ></iframe>
          <a v-else :href="videoModal.url" target="_blank" rel="noopener">Xem video</a>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useCoursesStore } from '@/stores/courses'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { enrollCourse } from '@/services/enrollmentService'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { courseService } from '@/services/courseService'
import CourseRating from '@/components/CourseRating.vue'
import axios from 'axios'

const coursesStore = useCoursesStore()
const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const props = defineProps({
  courseId: { type: String, required: true }
})

const course = computed(() => coursesStore.currentCourse || {})
const isAdmin = computed(() => authStore.userRole === 'admin')
const isLoading = computed(() => coursesStore.isLoading)
const hasError = computed(() => coursesStore.hasError)
const error = computed(() => coursesStore.error)

// Debug computed để theo dõi trạng thái enrollment
const enrollmentDebug = computed(() => ({
  courseId: props.courseId,
  courseIdType: typeof props.courseId,
  isEnrolled: isEnrolled.value,
  userEnrollments: userEnrollments.value,
  userEnrollmentsCount: userEnrollments.value.length
}))

// Computed để kiểm tra có hình ảnh hợp lệ không
const hasValidImage = computed(() => {
  const imageUrl = course.value.imageUrl || course.value.image
  return imageUrl && imageUrl.trim() !== '' && imageUrl !== 'null' && imageUrl !== 'undefined'
})

const handleImageError = (event) => {
  // Ẩn hình ảnh lỗi và hiển thị placeholder
  event.target.style.display = 'none'
  const container = event.target.parentElement
  if (container) {
    container.innerHTML = `
      <div class="course-placeholder">
        <div class="placeholder-icon">📚</div>
        <div class="placeholder-title">${course.value.title || course.value.name || 'Khóa học'}</div>
        <div class="placeholder-subtitle">Học tập trực tuyến</div>
      </div>
    `
  }
}

const hasValidThumbnailImage = (course) => {
  const imageUrl = course.image
  return imageUrl && imageUrl.trim() !== '' && imageUrl !== 'null' && imageUrl !== 'undefined'
}

const handleThumbnailError = (event) => {
  // Ẩn hình ảnh lỗi và hiển thị placeholder cho thumbnail
  event.target.style.display = 'none'
  const container = event.target.parentElement
  if (container) {
    const courseTitle = event.target.alt || 'Khóa học'
    container.innerHTML = `
      <div class="thumbnail-placeholder">
        <div class="thumbnail-icon">📚</div>
        <div class="thumbnail-text">${courseTitle}</div>
      </div>
    `
  }
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

const enrollLoading = ref(false)
const enrollError = ref('')
const enrollSuccess = ref(false)
const isEnrolled = ref(false)
const checkingEnrollment = ref(false)

const checkEnrollmentStatus = async () => {
  if (!authStore.user?.id) return
  
  checkingEnrollment.value = true
  try {
    const userCourses = await courseService.getUserRegisteredCourses(authStore.user.id)
    console.log('User enrollments:', userCourses)
    console.log('Current course ID:', props.courseId, typeof props.courseId)
    
    // So sánh chặt chẽ hơn để tránh lỗi type mismatch
    isEnrolled.value = userCourses.some(enrollment => {
      // API trả về object với 'id' thay vì 'courseId'
      const enrollmentCourseId = enrollment.id || enrollment.courseId
      const currentCourseId = props.courseId
      
      console.log('Comparing:', enrollmentCourseId, 'with', currentCourseId)
      
      const isMatch = enrollmentCourseId === currentCourseId || 
                     enrollmentCourseId === parseInt(currentCourseId) || 
                     enrollmentCourseId === currentCourseId.toString() ||
                     parseInt(enrollmentCourseId) === parseInt(currentCourseId)
      
      if (isMatch) {
        console.log('Found matching enrollment:', enrollment)
      }
      
      return isMatch
    })
    
    console.log('Is enrolled:', isEnrolled.value)
  } catch (err) {
    console.error('Error checking enrollment status:', err)
    isEnrolled.value = false
  } finally {
    checkingEnrollment.value = false
  }
}

const handleEnroll = async () => {
  enrollLoading.value = true
  enrollError.value = ''
  enrollSuccess.value = false
  try {
    const userId = authStore.user?.id
    await enrollCourse(userId, props.courseId)
    enrollSuccess.value = true
    isEnrolled.value = true
    toast.success('Đăng ký thành công!')
  } catch (err) {
    enrollError.value = err?.response?.data?.message || 'Đăng ký thất bại'
    toast.error('Đăng ký thất bại: ' + enrollError.value)
  } finally {
    enrollLoading.value = false
  }
}

const loadCourseData = async () => {
  // Tải khóa học hiện tại
  await coursesStore.fetchCourseById(props.courseId)
  
  // Tải tất cả khóa học để có dữ liệu cho phần khóa học liên quan
  if (coursesStore.courses.length === 0) {
    await coursesStore.fetchCourses()
  }
  
  // Kiểm tra trạng thái đăng ký của user và fetch user names
  await Promise.all([
    checkEnrollmentStatus(),
    checkUserEnrollments(),
    fetchUserNames()
  ])
}

const refreshCourseData = async () => {
  // Refresh course data after rating submission
  await coursesStore.fetchCourseById(props.courseId)
  // Also refresh user names
  await fetchUserNames()
}

onMounted(async () => {
  // Scroll to top when component mounts
  window.scrollTo({ top: 0, behavior: 'smooth' })
  
  await loadCourseData()
})

// Course features data
const courseFeatures = [
  { icon: '📁', title: 'Tài liệu học tập', description: 'Tài liệu chi tiết và dễ hiểu' },
  { icon: '📝', title: 'Bài kiểm tra', description: 'Đánh giá kiến thức định kỳ' },
  { icon: '📱', title: 'Học mọi lúc mọi nơi', description: 'Truy cập từ mọi thiết bị' },
  { icon: '🎓', title: 'Chứng chỉ hoàn thành', description: 'Chứng nhận sau khi hoàn thành' }
]

// MOCK DATA


// Computed property để lấy khóa học liên quan ngẫu nhiên
const relatedCourses = computed(() => {
  const allCourses = coursesStore.courses
  const currentCourseId = props.courseId
  
  console.log('Current course ID:', currentCourseId, typeof currentCourseId)
  console.log('All courses:', allCourses.map(c => ({ id: c.id, title: c.title || c.name })))
  
  // Lọc bỏ khóa học hiện tại và lấy ngẫu nhiên 4 khóa học khác
  const otherCourses = allCourses.filter(course => {
    // So sánh cả string và number để đảm bảo chính xác
    const isCurrentCourse = course.id === currentCourseId || 
                           course.id === parseInt(currentCourseId) || 
                           course.id === currentCourseId.toString()
    
    if (isCurrentCourse) {
      console.log('Filtering out current course:', course.id, course.title || course.name)
    }
    
    return !isCurrentCourse
  })
  
  console.log('Other courses after filtering:', otherCourses.map(c => ({ id: c.id, title: c.title || c.name })))
  
  // Shuffle array để lấy ngẫu nhiên
  const shuffled = [...otherCourses].sort(() => 0.5 - Math.random())
  
  // Lấy 4 khóa học đầu tiên
  const result = shuffled.slice(0, 4).map(course => ({
    title: course.title || course.name,
    instructor: 'Chuyên gia Giáo dục', // Có thể thêm trường instructor vào course sau
    image: course.imageUrl || course.image || null, // Để null để hiển thị placeholder
    id: course.id
  }))
  
  console.log('Related courses result:', result)
  return result
})

// Computed property để kiểm tra trạng thái đăng ký của các khóa học liên quan
const userEnrollments = ref([])

const checkUserEnrollments = async () => {
  if (!authStore.user?.id) return
  
  try {
    const enrollments = await courseService.getUserRegisteredCourses(authStore.user.id)
    userEnrollments.value = enrollments
  } catch (err) {
    console.error('Error fetching user enrollments:', err)
    userEnrollments.value = []
  }
}

const isCourseEnrolled = (courseId) => {
  return userEnrollments.value.some(enrollment => {
    const enrollmentCourseId = enrollment.id || enrollment.courseId
    const targetCourseId = courseId
    
    return enrollmentCourseId === targetCourseId || 
           enrollmentCourseId === parseInt(targetCourseId) || 
           enrollmentCourseId === targetCourseId.toString() ||
           parseInt(enrollmentCourseId) === parseInt(targetCourseId)
  })
}

const viewCourse = (courseId) => {
  console.log('Viewing course:', courseId)
  router.push(`/courses/${courseId}`).then(() => {
    // Scroll to top after navigation
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

const editCourse = (courseId) => {
  router.push(`/admin/courses/edit/${courseId}`)
}

const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/9131/9131529.png';

// Store for user names
const userNames = ref({})

// Function to get user name by ID
const getUserName = (userId) => {
  return userNames.value[userId] || `Người dùng #${userId}`
}

// Function to fetch user names for ratings
const fetchUserNames = async () => {
  if (!course.value?.ratings || course.value.ratings.length === 0) return
  
  const uniqueUserIds = [...new Set(course.value.ratings.map(r => r.userId))]
  
  for (const userId of uniqueUserIds) {
    if (!userNames.value[userId]) {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`https://localhost:7233/api/Users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        userNames.value[userId] = response.data.fullName || response.data.name || response.data.email
      } catch (error) {
        console.error(`Error fetching user ${userId}:`, error)
        userNames.value[userId] = `Người dùng #${userId}`
      }
    }
  }
}

const averageRating = computed(() => {
  if (!course.value?.ratings || course.value.ratings.length === 0) {
    return 0;
  }
  
  const total = course.value.ratings.reduce((sum, r) => sum + r.rating, 0);
  return (total / course.value.ratings.length).toFixed(1);
});
const ratingsCount = computed(() => course.value?.ratings?.length || 0);

function renderStarType(index, rating) {
  if (index <= Math.floor(rating)) return 'full';
  if (index - rating < 1 && index > rating) return 'half';
  return 'empty';
}

const videoModal = ref({ show: false, url: '' })
function openVideoModal(url) {
  videoModal.value = { show: true, url }
}
function closeVideoModal() {
  videoModal.value = { show: false, url: '' }
}

function getLessonThumbnail(lesson) {
  if (lesson.thumbnailUrl) return lesson.thumbnailUrl;
  if (isYoutubeUrl(lesson.videoUrl)) {
    const match = lesson.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/#\s]{11})/);
    if (match && match[1]) {
      return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
    }
  }
  return null;
}
</script>

<style scoped>
/* Ghi đè background của app-bg chỉ cho trang Course Detail */
.course-detail-page {
  background: #f5f5f5 !important;
}

/* Loading States */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.loading-content {
  text-align: center;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.loading-text {
  color: #6b7280;
  font-size: 1.1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error States */
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.error-content {
  text-align: center;
  max-width: 500px;
  padding: 2rem;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ef4444;
  margin-bottom: 0.5rem;
}

.error-message {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.retry-button {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.retry-icon {
  font-size: 1.1rem;
}

/* Hero Section */
.hero-section {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>'); */
  /* opacity: 0.3; */
}

.hero-content {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-left {
  animation: slideInLeft 0.8s ease-out;
}

.course-badges {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.course-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.course-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.stars {
  display: flex;
  gap: 0.125rem;
}

.star {
  color: #fbbf24;
  font-size: 1.25rem;
}

.rating-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
}

.course-description {
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.9);
}

.course-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary, .btn-admin {
  padding: 0.875rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #1f2937;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.btn-admin {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.btn-admin:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.btn-enrolled {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  cursor: not-allowed;
  opacity: 0.9;
}

.btn-enrolled:hover {
  transform: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  font-size: 1.1rem;
}

.course-features {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.feature {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.hero-right {
  animation: slideInRight 0.8s ease-out;
}

.course-media {
  width: 100%;
  max-width: 500px;
  aspect-ratio: 16/9;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.video-frame, .course-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-image-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.course-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 2rem;
  border-radius: 1rem;
}

.placeholder-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.placeholder-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.placeholder-subtitle {
  font-size: 1rem;
  opacity: 0.8;
  font-weight: 400;
}

.thumbnail-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.thumbnail-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 1rem;
}

.thumbnail-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  opacity: 0.8;
}

.thumbnail-text {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.2;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Sections */
.section {
  padding: 4rem 0;
}

.container {
  max-width: 1600px;
  width: 90%;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  color: #1f2937;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 2px;
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.feature-description {
  color: #6b7280;
  line-height: 1.5;
}

/* Description Grid */
.description-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.description-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.description-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.description-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.description-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
}

.description-text {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1rem;
}

/* Curriculum Grid */
.curriculum-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.curriculum-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.curriculum-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.curriculum-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.curriculum-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

/* Description */
.description-content {
  max-width: 800px;
  margin: 0 auto;
}

.description-text {
  font-size: 1.125rem;
  line-height: 1.7;
  color: #374151;
  margin-bottom: 2rem;
}

.info-box {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  border-left: 4px solid #3b82f6;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
}

.info-title {
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 0.5rem;
}

.info-text {
  color: #1e3a8a;
  line-height: 1.6;
}

.audience-section {
  margin-top: 2rem;
}

.audience-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.audience-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.audience-tag {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Curriculum */
.curriculum-list {
  max-width: 800px;
  margin: 0 auto;
}

.curriculum-chapter {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.curriculum-chapter:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.chapter-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.chapter-number {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.125rem;
}

.chapter-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.lesson-list {
  list-style: none;
  padding: 0;
}

.lesson-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
  text-align: left;
}

.lesson-item:last-child {
  border-bottom: none;
}

.lesson-icon {
  font-size: 1.25rem;
  color: #3b82f6;
}

.lesson-text {
  color: #374151;
  font-size: 1rem;
  flex: 1;
}

.lesson-desc {
  font-size: 0.875rem;
  color: #6b7280;
  margin-left: 0.5rem;
}

/* Reviews */
.rating-summary {
  text-align: center;
  margin-bottom: 3rem;
}

.rating-score {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.score {
  font-size: 3rem;
  font-weight: 700;
  color: #1f2937;
}

.rating-stars {
  display: flex;
  gap: 0.125rem;
}

.rating-stars .star {
  color: #fbbf24;
  font-size: 1.5rem;
}

.rating-count {
  color: #6b7280;
  font-size: 0.875rem;
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.review-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.review-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.reviewer-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.reviewer-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.review-stars {
  color: #fbbf24;
  font-size: 1rem;
}

.review-text {
  color: #374151;
  line-height: 1.6;
}

.review-date {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
}

.no-reviews {
  text-align: center;
  padding: 3rem;
  background: #f9fafb;
  border-radius: 1rem;
  color: #6b7280;
  font-size: 1.125rem;
}

/* Related Courses */
.related-courses {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.related-course-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #e5e7eb;
}

.related-course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.course-thumbnail {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.related-course-card:hover .thumbnail-image {
  transform: scale(1.05);
}

.course-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 1.5rem;
  color: white;
}

.course-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.course-instructor {
  font-size: 0.875rem;
  opacity: 0.8;
}

.course-badge {
  background: rgba(59, 130, 246, 0.9);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 0.5rem;
  display: inline-block;
}

.enrollment-badge {
  background: rgba(16, 185, 129, 0.9);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 0.5rem;
  display: inline-block;
}

/* Not Found */
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.not-found-content {
  text-align: center;
  max-width: 500px;
  padding: 2rem;
}

.not-found-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.not-found-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.not-found-message {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.back-button {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  text-decoration: none;
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.back-icon {
  font-size: 1.1rem;
}

/* Animations */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
  
  .course-title {
    font-size: 2rem;
  }
  
  .course-actions {
    justify-content: center;
  }
  
  .course-features {
    justify-content: center;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .instructors-grid {
    grid-template-columns: 1fr;
  }
  
  .reviews-grid {
    grid-template-columns: 1fr;
  }
  
  .related-courses {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }
  
  .hero-content {
    padding: 0 1rem;
  }
  
  .course-actions {
    flex-direction: column;
  }
  
  .btn-primary, .btn-secondary, .btn-admin {
    width: 100%;
    justify-content: center;
  }
}

.alert-success {
  color: #155724;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
}
.alert-error {
  color: #721c24;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
}

.star.full {
  color: #fbbf24;
}
.star.half {
  color: #fbbf24;
}
.star.empty {
  color: #ccc;
}
.lesson-video {
  width: 100%;
  max-width: 480px;
  aspect-ratio: 16/9;
  margin-top: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.lesson-video-link {
  margin-top: 0.5rem;
}

.curriculum-section {
  max-width: 800px;
  margin: 0 auto;
}
.module-accordion {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.module-header {
  padding: 1rem;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.2s;
}
.module-header:hover {
  background: #f3f4f6;
}
.module-title {
  flex: 1;
  margin-left: 0.5rem;
}
.module-toggle {
  font-size: 1.2rem;
  color: #888;
  margin-left: 1rem;
}
.module-lessons {
  padding: 0.5rem 1.5rem 1rem 2.5rem;
}
.lesson-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  position: relative;
}
.lesson-title {
  font-weight: 500;
}
.lesson-desc {
  color: #6b7280;
  font-size: 0.95em;
}
.lesson-play-btn {
  margin-left: 1rem;
  background: #fbbf24;
  color: #1f2937;
  border: none;
  border-radius: 4px;
  padding: 0.2rem 0.7rem;
  cursor: pointer;
  font-size: 0.95em;
  font-weight: 600;
  transition: background 0.2s;
}
.lesson-play-btn:hover {
  background: #f59e0b;
}
.lesson-video-popup {
  margin: 0.5rem 0 1rem 2rem;
}
.lesson-video-popup iframe {
  width: 100%;
  max-width: 700px;
  min-width: 320px;
  aspect-ratio: 16/9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: block;
  margin: 0 auto;
}

@media (max-width: 800px) {
  .lesson-video-popup iframe {
    max-width: 100vw;
    min-width: 0;
  }
}
.lesson-video-link {
  margin: 0.5rem 0 1rem 2rem;
}
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  max-height: 0;
}
.video-modal-overlay {
  position: fixed;
  z-index: 9999;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}
.video-modal-content {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
}
.video-modal-content iframe {
  width: 80vw;
  max-width: 1100px;
  height: 45vw;
  max-height: 62vh;
  border-radius: 8px;
  background: #000;
}
.video-modal-close {
  position: absolute;
  top: 10px;
  right: 18px;
  font-size: 2rem;
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  z-index: 2;
}
@media (max-width: 800px) {
  .video-modal-content iframe {
    width: 98vw;
    height: 56vw;
  }
}
.modules-carousel {
  display: flex;
  overflow-x: auto;
  gap: 2rem;
  scroll-snap-type: x mandatory;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}
.module-card-carousel {
  min-width: 340px;
  max-width: 380px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  padding: 1.5rem 1.2rem 1.2rem 1.2rem;
  scroll-snap-align: start;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.module-title-carousel {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0.5rem 0 1rem 0;
}
.lesson-list-carousel {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
}
.lesson-block-carousel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: #f8fafc;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  padding: 0.7rem 0.7rem 0.9rem 0.7rem;
  margin-bottom: 0.5rem;
}
.lesson-thumb-large {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.7rem;
  background: #e5e7eb;
}
.lesson-thumb-placeholder {
  width: 100%;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e7eb;
  border-radius: 8px;
  margin-bottom: 0.7rem;
}
.lesson-info-block {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.lesson-title {
  font-weight: 600;
  font-size: 1.05rem;
  margin-bottom: 0.1rem;
}
.lesson-desc {
  color: #6b7280;
  font-size: 0.97em;
  margin-bottom: 0.2rem;
}
.lesson-play-btn {
  align-self: flex-end;
  margin-top: 0.2rem;
}
@media (max-width: 600px) {
  .module-card-carousel { min-width: 90vw; max-width: 95vw; }
}
.lesson-thumb {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 0.7rem;
  background: #f3f4f6;
  flex-shrink: 0;
}
</style>