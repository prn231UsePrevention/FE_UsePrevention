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
              <button
                class="delete-btn"
                @click="cancelAppointment(appointment.id)"
                :disabled="appointment.status !== 'Pending'"
              >
                Hủy
              </button>
            </td>
          </tr>
          <tr v-if="!isLoading && userAppointments.length === 0">
            <td colspan="5" class="no-data">Bạn chưa có cuộc hẹn nào</td>
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAppointmentsStore } from '@/stores/appointments'
import AppointmentForm from '@/components/AppointmentForm.vue'

// store
const store = useAppointmentsStore()

// reactive
const showModal = ref(false)

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

// mở modal
function openBookModal() {
  showModal.value = true
}

// đóng modal
function closeModal() {
  showModal.value = false
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
