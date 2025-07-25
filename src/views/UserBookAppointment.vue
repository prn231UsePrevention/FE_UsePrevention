<template>
  <div class="user-appointments-wrapper">
    <div class="user-appointments-header">
      <div>
        <h2>Quản Lý Cuộc hẹn</h2>
        <p class="user-appointments-desc">Chọn và đặt cuộc hẹn với các tư vấn viên.</p>
      </div>
      <button class="add-btn" @click="openBookModal">Đặt Cuộc Hẹn Mới</button>
    </div>

    <div class="user-appointments-table-wrapper">
      <table class="user-appointments-table">
        <thead>
          <tr>
            <th>Tên Tư vấn viên</th>
            <th>Ngày</th>
            <th>Khung giờ</th>
            <th>Trạng thái</th>
            <th>Ghi chú</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="appointment in userAppointments" :key="appointment.id">
            <td>{{ appointment.consultantFullName }}</td>
            <td>{{ formatDate(appointment.startTime) }}</td>
            <td>{{ formatTime(appointment.startTime) }} - {{ formatTime(appointment.endTime) }}</td>
            <td>{{ appointment.status }}</td>
            <td>{{ appointment.note }}</td>
          <td>
  <template v-if="appointment.status === 'Completed'">
    <template v-if="appointment.hasFeedback">
      <span class="feedback-done">Đã feedback</span>
    </template>
    <template v-else>
      <button class="feedback-btn" @click="openFeedback(appointment)">Feedback</button>
    </template>
  </template>
  <template v-else>
    <button
      class="delete-btn"
      @click="cancelAppointment(appointment.id)"
      :disabled="appointment.status !== 'Pending'"
    >
      Hủy
    </button>
  </template>
</td>
          </tr>
          <tr v-if="!isLoading && userAppointments.length === 0">
            <td colspan="6" class="no-data">Bạn chưa có cuộc hẹn nào</td>
          </tr>
        </tbody>
      </table>

      <div v-if="isLoading" class="loading-table">Đang tải...</div>
      <div v-if="hasError" class="error-table">{{ error }}</div>
    </div>

    <!-- Modal Book Appointment -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="modal-close" @click="closeModal">×</button>
        <h3 class="modal-title">Đặt cuộc hẹn mới</h3>
        <AppointmentForm
          :availableSlots="availableSlots"
          @submit="handleCreate"
          @cancel="closeModal"
        />
      </div>
    </div>

    <!-- Modal Feedback -->
    <div v-if="showFeedbackModal" class="modal-overlay" @click.self="closeFeedbackModal">
      <div class="modal-content feedback-modal">
        <button class="modal-close" @click="closeFeedbackModal">×</button>
        <h3 class="modal-title">Gửi Feedback cho cuộc hẹn</h3>
        <form @submit.prevent="submitFeedbackForm" class="feedback-form">
          <div class="form-group">
            <label>Đánh giá:</label>
            <div class="star-rating">
              <span
                v-for="star in 5"
                :key="star"
                class="star"
                :class="{ filled: star <= feedback.rating }"
                @click="setRating(star)"
              >&#9733;</span>
            </div>
          </div>
          <div class="form-group">
            <label>Nhận xét:</label>
            <textarea v-model="feedback.comment" required placeholder="Nhận xét của bạn..." />
          </div>
          <div class="form-group">
            <label>Mức độ hài lòng:</label>
            <div class="summary-radio-group">
              <label>
                <input type="radio" value="Thích" v-model="feedback.assessmentSummary" />
                Thích
              </label>
              <label>
                <input type="radio" value="Bình thường" v-model="feedback.assessmentSummary" />
                Bình thường
              </label>
              <label>
                <input type="radio" value="Không thích" v-model="feedback.assessmentSummary" />
                Không thích
              </label>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="feedback-btn">Gửi</button>
            <button @click="closeFeedbackModal" type="button" class="delete-btn">Đóng</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useAppointmentsStore } from '@/stores/appointments'
import AppointmentForm from '@/components/AppointmentForm.vue'
import axios from 'axios'

// store
const store = useAppointmentsStore()
const toast = useToast()
// reactive
const showModal = ref(false)
const showFeedbackModal = ref(false)
const selectedAppointment = ref(null)
const feedback = ref({
  rating: 5,
  comment: '',
  assessmentSummary: ''
})

// computed
const userAppointments = computed(() => store.userAppointments)
const availableSlots = computed(() => store.availableSlots)
const isLoading = computed(() => store.isLoading)
const hasError = computed(() => store.hasError)
const error = computed(() => store.error)

// helpers
const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN')
const formatTime = (d) =>
  new Date(d).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })

function setRating(star){
  feedback.value.rating = star
}
// mở modal
function openBookModal() {
  showModal.value = true
}

// đóng modal
function closeModal() {
  showModal.value = false
}

// mở modal feedback
function openFeedback(appointment) {
  selectedAppointment.value = appointment
  feedback.value = {
    rating: 5,
    comment: '',
    assessmentSummary: ''
  }
  showFeedbackModal.value = true
}

// đóng modal feedback
function closeFeedbackModal() {
  showFeedbackModal.value = false
}

// gửi feedback
async function submitFeedbackForm() {
  try {
    const token = localStorage.getItem('token')
    await axios.post('/api/Feedback', {
      appointmentId: selectedAppointment.value.id,
      consultantId: selectedAppointment.value.consultantId,
      rating: feedback.value.rating,
      comment: feedback.value.comment,
      assessmentSummary: feedback.value.assessmentSummary
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    showFeedbackModal.value = false
    await store.fetchAppointments()
    toast.success('Gửi feedback thành công!')
  } catch (e) {
    if (
      e.response &&
      e.response.status === 400 &&
      e.response.data &&
      e.response.data.message &&
      e.response.data.message.includes('Feedback already exists')
    ) {
      toast.info('Bạn đã gửi feedback cho cuộc hẹn này rồi!')
      showFeedbackModal.value = false
      await store.fetchAppointments()
    } else {
      toast.error('Gửi feedback thất bại!')
    }
    console.error(e)
  }
}

// tạo booking
async function handleCreate(payload) {
  try {
    await store.bookSlot(payload)
    showModal.value = false
    // sau khi đặt xong, làm mới danh sách appointments
    await store.fetchAppointments()
  } catch (e) {
    console.error('Failed to book:', e)
  }
}

// hủy booking
async function cancelAppointment(id) {
  if (!confirm('Bạn chắc chắn muốn hủy cuộc hẹn này?')) return
  try {
    await store.cancelAppointment(id)
    await store.fetchAppointments()
  } catch (e) {
    console.error('Failed to cancel:', e)
  }
}

// mount lần đầu: lấy appointments + tất cả available slots
onMounted(async () => {
  try {
    await store.fetchAppointments()
    //await store.fetchAllAvailableSlots()
  } catch (e) {
    console.error(e)
  }
})
</script>

<style scoped>
.feedback-modal {
  width: 420px;
  max-width: 95vw;
}
.feedback-form .form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}
.feedback-form label {
  font-weight: 500;
  margin-bottom: 0.3rem;
}
.feedback-form textarea {
  min-height: 60px;
  max-height: 120px;
}
.feedback-form textarea,
.feedback-form input[type="text"] {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
  resize: vertical;
}
.summary-radio-group {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.3rem;
}
.summary-radio-group label {
  font-weight: 400;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 1rem;
}
.star-rating {
  font-size: 2rem;
  color: #ffd700;
  margin-bottom: 0.2rem;
  user-select: none;
  display: flex;
  gap: 2px;
}
.star {
  cursor: pointer;
  transition: color 0.2s;
  color: #ccc;
}
.star.filled {
  color: #ffd700;
}
.star:hover,
.star:hover ~ .star {
  color: #ffb300;
}
.user-appointments-wrapper {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
}
.user-appointments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.user-appointments-desc {
  margin: 0;
  color: #555;
}
.add-btn {
  padding: 0.5rem 1rem;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.add-btn:hover {
  opacity: 0.9;
}

.user-appointments-table-wrapper {
  position: relative;
}
.user-appointments-table {
  width: 100%;
  border-collapse: collapse;
}
.user-appointments-table th,
.user-appointments-table td {
  padding: 0.6rem;
  border: 1px solid #ddd;
  text-align: left;
}
.delete-btn {
  padding: 0.4rem 0.8rem;
  background: #e53935;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.feedback-btn {
  padding: 0.4rem 0.8rem;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.feedback-btn:hover {
  opacity: 0.9;
}
.feedback-done {
  color: #43a047;
  font-weight: 500;
}
.loading-table,
.error-table,
.no-data {
  text-align: center;
  margin: 1rem 0;
  color: #888;
}
.error-table {
  color: #e53935;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: #fff;
  padding: 1.5rem;
  border-radius: 6px;
  width: 400px;
  position: relative;
}
.modal-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}
.modal-title {
  margin-bottom: 1rem;
  text-align: center;
}
</style>