<template>
  <div class="course-rating-component">
    <!-- Rating Form for Enrolled Users -->
    <div v-if="canRate && !userRating" class="rating-form-section">
      <h3 class="rating-form-title">Đánh giá khóa học</h3>
      <p class="rating-form-subtitle">Chia sẻ trải nghiệm của bạn về khóa học này</p>
      
      <form @submit.prevent="submitRating" class="rating-form">
        <div class="rating-stars-section">
          <label class="rating-label">Đánh giá của bạn:</label>
          <div class="star-rating">
            <span
              v-for="star in 5"
              :key="star"
              class="star"
              :class="{ 
                'filled': star <= ratingForm.stars,
                'hover': star <= hoverRating 
              }"
              @click="setRating(star)"
              @mouseenter="hoverRating = star"
              @mouseleave="hoverRating = 0"
            >
              ★
            </span>
          </div>
          <span class="rating-text">{{ ratingForm.stars }}/5 sao</span>
        </div>
        
        <div class="comment-section">
          <label for="rating-comment" class="rating-label">Nhận xét (tùy chọn):</label>
          <textarea
            id="rating-comment"
            v-model="ratingForm.comment"
            rows="4"
            placeholder="Chia sẻ trải nghiệm của bạn về khóa học..."
            maxlength="500"
            class="rating-comment"
          ></textarea>
          <span class="char-count">{{ ratingForm.comment.length }}/500</span>
        </div>
        
        <div class="rating-actions">
          <button 
            type="submit" 
            :disabled="isSubmitting || ratingForm.stars === 0"
            class="submit-rating-btn"
          >
            <span v-if="isSubmitting">Đang gửi...</span>
            <span v-else>Gửi đánh giá</span>
          </button>
        </div>
      </form>
    </div>

    <!-- User's Existing Rating -->
    <div v-if="userRating" class="user-rating-section">
      <h3 class="user-rating-title">Đánh giá của bạn</h3>
      <div class="user-rating-display">
        <div class="user-rating-stars">
          <span
            v-for="star in 5"
            :key="star"
            class="star"
            :class="{ 'filled': star <= userRating.rating }"
          >
            ★
          </span>
        </div>
        <p class="user-rating-comment">{{ userRating.comment }}</p>
      </div>
    </div>

    <!-- Not Enrolled Message -->
    <div v-if="!canRate && !userRating" class="not-enrolled-message">
      <p>Bạn cần đăng ký khóa học để có thể đánh giá.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { ratingService } from '@/services/ratingService'
import { useToast } from 'vue-toastification'

const props = defineProps({
  courseId: {
    type: [String, Number],
    required: true
  },
  isEnrolled: {
    type: Boolean,
    default: false
  },
  courseRatings: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['rating-submitted'])

const authStore = useAuthStore()
const toast = useToast()

const ratingForm = ref({
  stars: 0,
  comment: ''
})

const userRating = ref(null)
const isSubmitting = ref(false)
const hoverRating = ref(0)

// Computed properties
const canRate = computed(() => {
  return authStore.userRole === 'customer' && props.isEnrolled && authStore.user?.id
})

// Methods
const setRating = (stars) => {
  ratingForm.value.stars = stars
}



const checkUserRating = () => {
  if (!authStore.user?.id || !props.courseRatings) return
  
  // Tìm rating của user hiện tại trong danh sách ratings
  const userRatingFound = props.courseRatings.find(rating => rating.userId === authStore.user.id)
  userRating.value = userRatingFound || null
}

const submitRating = async () => {
  if (!canRate.value || ratingForm.value.stars === 0) return
  
  isSubmitting.value = true
  try {
    const ratingData = {
      stars: ratingForm.value.stars,
      comment: ratingForm.value.comment.trim() || null
    }
    
    await ratingService.addRating(props.courseId, ratingData)
    
    // Reset form
    ratingForm.value = {
      stars: 0,
      comment: ''
    }
    
    // Check for updated user rating
    checkUserRating()
    
    toast.success('Đánh giá của bạn đã được gửi thành công!')
    emit('rating-submitted')
  } catch (error) {
    console.error('Error submitting rating:', error)
    const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá'
    toast.error(errorMessage)
  } finally {
    isSubmitting.value = false
  }
}

// Lifecycle
onMounted(() => {
  checkUserRating()
})

// Watch for courseRatings changes
watch(() => props.courseRatings, () => {
  checkUserRating()
}, { immediate: true })
</script>

<style scoped>
.course-rating-component {
  margin: 2rem 0;
}

.rating-form-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #e9ecef;
  margin-bottom: 2rem;
}

.rating-form-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.rating-form-subtitle {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.rating-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.rating-stars-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rating-label {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.star-rating {
  display: flex;
  gap: 0.25rem;
  font-size: 2rem;
  color: #d1d5db;
  cursor: pointer;
}

.star {
  transition: color 0.2s ease;
  user-select: none;
}

.star.filled {
  color: #fbbf24;
}

.star.hover {
  color: #f59e0b;
}

.rating-text {
  color: #6b7280;
  font-size: 0.875rem;
}

.comment-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rating-comment {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s ease;
}

.rating-comment:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.char-count {
  text-align: right;
  color: #6b7280;
  font-size: 0.75rem;
}

.rating-actions {
  display: flex;
  justify-content: flex-end;
}

.submit-rating-btn {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-rating-btn:hover:not(:disabled) {
  background: #2563eb;
}

.submit-rating-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.user-rating-section {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.user-rating-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.user-rating-display {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.user-rating-stars {
  display: flex;
  gap: 0.25rem;
  font-size: 1.5rem;
  color: #fbbf24;
}

.user-rating-comment {
  color: #374151;
  line-height: 1.6;
  margin: 0.5rem 0;
}

.user-rating-date {
  color: #6b7280;
  font-size: 0.875rem;
}

.not-enrolled-message {
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  color: #92400e;
}

@media (max-width: 768px) {
  .rating-form-section {
    padding: 1.5rem;
  }
  
  .star-rating {
    font-size: 1.75rem;
  }
  
  .submit-rating-btn {
    width: 100%;
  }
}
</style> 