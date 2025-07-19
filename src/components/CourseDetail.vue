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
                <span v-for="i in 5" :key="i" class="star">★</span>
              </div>
              <span class="rating-text">4.7 (1,234 đánh giá)</span>
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
          <div class="curriculum-grid">
            <div v-for="(chapter, index) in mockCurriculum" :key="chapter.title" class="curriculum-card">
              <div class="curriculum-icon">📚</div>
              <h3 class="curriculum-title">{{ chapter.title }}</h3>
              <div class="lesson-list">
                <div v-for="lesson in chapter.lessons" :key="lesson" class="lesson-item">
                  <span class="lesson-icon">📖</span>
                  <span class="lesson-text">{{ lesson }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- INSTRUCTORS -->
      <section class="section">
        <div class="container">
          <h2 class="section-title">Giảng viên</h2>
          <div class="instructors-grid">
            <div v-for="instructor in mockInstructors" :key="instructor.name" class="instructor-card">
              <div class="instructor-avatar">
                <img :src="instructor.avatar" :alt="instructor.name" class="avatar-image" />
              </div>
              <div class="instructor-info">
                <h3 class="instructor-name">{{ instructor.name }}</h3>
                <p class="instructor-title">{{ instructor.title }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- RATINGS & REVIEWS -->
      <section class="section">
        <div class="container">
          <h2 class="section-title">Đánh giá & Nhận xét</h2>
          <div class="rating-summary">
            <div class="rating-score">
              <span class="score">4.7</span>
              <div class="rating-stars">
                <span v-for="i in 5" :key="i" class="star">★</span>
              </div>
              <span class="rating-count">1,234 đánh giá</span>
            </div>
          </div>
          <div class="reviews-grid">
            <div v-for="review in mockReviews" :key="review.name" class="review-card">
              <div class="review-header">
                <img :src="review.avatar" :alt="review.name" class="reviewer-avatar" />
                <div class="reviewer-info">
                  <h4 class="reviewer-name">{{ review.name }}</h4>
                  <div class="review-stars">★★★★★</div>
                </div>
              </div>
              <p class="review-text">{{ review.text }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- RELATED COURSES -->
      <section class="section" v-if="relatedCourses.length > 0">
        <div class="container">
          <h2 class="section-title">Khóa học liên quan</h2>
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
    <div v-if="enrollSuccess" class="alert-success">
      Đăng ký thành công!
    </div>
    <div v-if="enrollError" class="alert-error">
      {{ enrollError }}
    </div>
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
  
  // Kiểm tra trạng thái đăng ký của user
  await Promise.all([
    checkEnrollmentStatus(),
    checkUserEnrollments()
  ])
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

/* Instructors */
.instructors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.instructor-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.instructor-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.instructor-avatar {
  margin-bottom: 1rem;
}

.avatar-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e5e7eb;
}

.instructor-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.instructor-title {
  color: #6b7280;
  font-size: 0.875rem;
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
</style>