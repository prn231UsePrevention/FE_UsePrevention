<template>
  <div class="consultant-booking-container">
    <h1>Đặt Lịch Hẹn Trực Tuyến với Chuyên viên Tư vấn</h1>
    <p>Chọn chuyên viên bạn muốn tư vấn và đặt lịch hẹn phù hợp.</p>

    <div v-if="consultants.length" class="consultant-grid">
      <div v-for="consultant in consultants" :key="consultant.id" class="consultant-card card">
        <h3>{{ consultant.name }}</h3>
        <p><strong>Chuyên môn:</strong> {{ consultant.specialization }}</p>
        <p><strong>Bằng cấp:</strong> {{ consultant.degree }}</p>
        <p v-if="consultant.bio" class="bio">{{ consultant.bio }}</p>
        <p v-else-if="consultant.workSchedule"><strong>Lịch làm việc:</strong> {{ consultant.workSchedule }}</p>
        <button @click="viewConsultantDetails(consultant.id)" class="btn primary">Xem Lịch & Đặt hẹn</button>
        <button @click="showFeedback(consultant.id)" class="btn secondary" style="margin-top: 0.5rem">Xem đánh giá</button>
      </div>
    </div>
    <div v-else class="status-message card">
      Hiện chưa có chuyên viên tư vấn nào.
    </div>

    <!-- Modal hiển thị feedback -->
    <div v-if="feedbackModal.visible" class="modal-overlay">
      <div class="modal-content card">
        <h2>Đánh giá của chuyên viên</h2>
        <button class="modal-close" @click="closeFeedback">×</button>
        <div v-if="feedbackModal.loading">Đang tải đánh giá...</div>
        <div v-else-if="feedbackModal.error" style="color:red">{{ feedbackModal.error }}</div>
        <div v-else>
          <div v-if="feedbackModal.feedbacks.length">
            <div v-for="fb in feedbackModal.feedbacks" :key="fb.id" class="feedback-item">
              <div><strong>Đánh giá:</strong> {{ fb.rating }}/5</div>
              <div><strong>Bình luận:</strong> {{ fb.comment }}</div>
              <div><strong>Tóm tắt:</strong> {{ fb.assessmentSummary }}</div>
              <div><em>{{ formatDateTime(fb.createdAt) }}</em></div>
              <hr />
            </div>
          </div>
          <div v-else>Chưa có đánh giá nào cho chuyên viên này.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const consultants = ref([])
const router = useRouter()

const feedbackModal = ref({
  visible: false,
  loading: false,
  error: '',
  feedbacks: []
})

function formatDateTime(dt) {
  if (!dt) return ''
  const d = new Date(dt)
  return d.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
}

async function fetchUserFullName(userId) {
  try {
    const response = await fetch(`https://localhost:7233/api/Users/${userId}`)
    if (response.ok) {
      const user = await response.json()
      return user.fullName || `User #${userId}`
    }
  } catch (e) {}
  return `User #${userId}`
}

onMounted(async () => {
  try {
    const response = await fetch('https://localhost:7233/api/Consultant')
    if (response.ok) {
      const data = await response.json()
      // Lấy fullName cho từng consultant
      const consultantList = await Promise.all(data.map(async item => {
        const name = await fetchUserFullName(item.userId)
        return {
          id: item.id,
          name,
          specialization: item.specialty || '',
          degree: item.degree || '',
          bio: item.bio || '',
          workSchedule: item.workSchedule || ''
        }
      }))
      consultants.value = consultantList
    } else {
      alert('Không lấy được danh sách chuyên viên tư vấn')
    }
  } catch (error) {
    alert('Lỗi kết nối tới server')
  }
})

const viewConsultantDetails = (consultantId) => {
  router.push(`/consultants/${consultantId}/slots`)
}

function closeFeedback() {
  feedbackModal.value.visible = false
}

async function showFeedback(consultantId) {
  feedbackModal.value.visible = true
  feedbackModal.value.loading = true
  feedbackModal.value.error = ''
  feedbackModal.value.feedbacks = []
  try {
    const res = await fetch('https://localhost:7233/api/Feedback')
    if (!res.ok) throw new Error('Không lấy được đánh giá.')
    const allFeedback = await res.json()
    feedbackModal.value.feedbacks = allFeedback.filter(fb => fb.consultantId === consultantId)
  } catch (e) {
    feedbackModal.value.error = e.message || 'Lỗi khi tải đánh giá.'
  } finally {
    feedbackModal.value.loading = false
  }
}
</script>

<style scoped>
.consultant-booking-container {
  width: 100%;
  padding: var(--spacing-lg);
  text-align: center;
}

.consultant-booking-container h1 {
  font-size: var(--font-size-h2);
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-sm);
}

.consultant-booking-container p {
  font-size: var(--font-size-lg);
  color: var(--text-color-secondary);
  margin-bottom: var(--spacing-xl);
}

.consultant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  max-width: 900px;
  margin: 0 auto;
}

.consultant-card {
  background: var(--surface-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-2);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.consultant-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-3);
}

.consultant-card h3 {
  font-size: var(--font-size-xl);
  color: var(--primary-color);
  margin-bottom: var(--spacing-md);
}

.consultant-card p {
  font-size: var(--font-size-md);
  color: var(--text-color-secondary);
  margin-bottom: var(--spacing-xs);
}

.consultant-card .bio {
  font-style: italic;
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  margin-top: var(--spacing-md);
  flex-grow: 1;
}

.btn-details {
  background-color: var(--primary-color);
  color: var(--surface-color);
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  box-shadow: var(--shadow-1);
  margin-top: var(--spacing-md);
}

.btn-details:hover {
  background-color: var(--primary-dark);
  box-shadow: var(--shadow-2);
}

.status-message {
  font-size: var(--font-size-lg);
  color: var(--text-color-secondary);
  padding: var(--spacing-xl);
  background: var(--surface-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-1);
  max-width: 600px;
  margin: 0 auto;
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  min-width: 350px;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}
.modal-close {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}
.feedback-item {
  text-align: left;
  margin-bottom: 1rem;
}
</style>

