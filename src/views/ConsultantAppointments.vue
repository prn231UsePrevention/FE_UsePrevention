<template>
  <div class="consultant-appointments-wrapper">
    <h2>Quản lý cuộc hẹn</h2>

    <!-- Tạo slot mới -->
    <div class="slot-creator">
      <label>
        Chọn khung giờ:
        <input
          type="datetime-local"
          v-model="newSlotTime"
        />
      </label>
      <button @click="createNewSlot" :disabled="!newSlotTime">
        Tạo slot
      </button>
    </div>

    <div v-if="isLoading" class="loading">Đang tải...</div>
    <div v-if="hasError" class="error">{{ error }}</div>

    <table v-if="!isLoading && !hasError" class="appointments-table">
      <thead>
        <tr>
          <th>Khách hàng</th>
          <th>Ngày</th>
          <th>Giờ</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="app in allSlots" :key="`${app.status}-${app.id}`">
          <td>{{ app.status === 'Available' ? '—' : app.userFullName }}</td>
          <td>{{ formatDate(app.startTime) }}</td>
          <td>{{ formatTime(app.startTime) }} – {{ formatTime(app.endTime) }}</td>
          <td>{{ app.status }}</td>
          <td class="actions">
            <button
              v-if="app.status === 'Pending'"
              @click="changeStatus(app.id, 'Confirmed')"
            >Xác nhận</button>
            <button
              v-if="app.status === 'Confirmed'"
              @click="changeStatus(app.id, 'Completed')"
            >Hoàn thành</button>
            <button
              v-if="app.status !== 'Cancelled' && app.status !== 'Completed'"
              @click="cancelAppointment(app.id)"
            >Hủy</button>
          </td>
        </tr>
        <tr v-if="allSlots.length === 0">
          <td colspan="5" class="no-data">Chưa có khung giờ hoặc cuộc hẹn nào</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppointmentsStore } from '@/stores/appointments'
import appointmentService from '@/services/appointmentService'
import { getMyUserInfo, getConsultantByUserId } from '@/services/userService'

// store
const store = useAppointmentsStore()
const { consultantAppointments, isLoading, hasError, error } = storeToRefs(store)

// chuẩn bị slot available và newSlotTime
const availableSlots = ref([])
const newSlotTime = ref('')  // format "YYYY-MM-DDThh:mm"

// computed gộp tất cả slots
const allSlots = computed(() => {
  const av = availableSlots.value.map(slot => ({
    id: slot.slotId,
    userFullName: '',
    startTime: slot.start,
    endTime: slot.end,
    status: 'Available'
  }))
  const sch = consultantAppointments.value.map(a => ({
    id: a.id,
    userFullName: a.userFullName,
    startTime: a.startTime,
    endTime: a.endTime,
    status: a.status
  }))
  return [...av, ...sch].sort((a, b) =>
    new Date(a.startTime) - new Date(b.startTime)
  )
})

// helpers format
const formatDate = dt => new Date(dt).toLocaleDateString('vi-VN')
const formatTime = dt =>
  new Date(dt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })

// hành động
const changeStatus = async (id, status) => {
  try {
    await store.updateAppointmentStatus(id, status)
  } catch (e) {
    alert(e.message || 'Lỗi khi cập nhật trạng thái')
  }
}
const cancelAppointment = async id => {
  if (!confirm('Bạn chắc chắn muốn hủy?')) return
  try {
    await store.cancelAppointment(id);
    await loadSlots()
  } catch (e) {
    alert(e.message || 'Lỗi khi hủy cuộc hẹn')
  }
}

// tạo slot mới
const createNewSlot = async () => {
  if (!newSlotTime.value) return
  try {
    // Tạo đối tượng Date từ thời gian người dùng nhập vào
    const localDate = new Date(newSlotTime.value)

    // Chuyển giờ về UTC (thêm 7 giờ cho múi giờ Việt Nam)
    const utcDate = new Date(localDate.getTime() + (7 * 60 * 60 * 1000)) // Cộng thêm 7 giờ (7 tiếng x 60 phút x 60 giây x 1000 ms)
    
    // Convert to ISO string with seconds
    const iso = utcDate.toISOString() 

    console.log('Creating new slot at:', iso)
    await store.createSlot({ startTime: iso })

    // sau khi tạo xong, refresh cả scheduled và available
    await loadSlots()
    newSlotTime.value = ''  // reset input
    alert('Tạo slot thành công!')
  } catch (e) {
    alert(e.response?.data?.message || e.message || 'Lỗi khi tạo slot')
  }
}


// chung hàm load cả scheduled + available
const loadSlots = async () => {
  const token = localStorage.getItem('token')
  const userRes = await getMyUserInfo(token)
  const userId = userRes.data.userId
  const consRes = await getConsultantByUserId(token, userId)
  const consultantId = consRes.data.id

  // fetch scheduled
  await store.fetchConsultantAppointments(consultantId)
  // fetch available cho ngày của newSlotTime hoặc hôm nay
  const date = (newSlotTime.value || new Date().toISOString()).split('T')[0]
  const slotsRes = await appointmentService.getAvailableSlots(
    token,
    consultantId,
    date
  )
  availableSlots.value = slotsRes.data
}

// mount lần đầu
onMounted(() => {
  loadSlots().catch(e => {
    console.error(e)
    store.$patch({ hasError: true, error: e.message })
  })
})
</script>

<style scoped>
.consultant-appointments-wrapper {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 6px rgba(0,0,0,0.1);
}
h2 { text-align: center; margin-bottom: 1rem; }

.slot-creator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.slot-creator input {
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.slot-creator button {
  padding: 0.4rem 0.8rem;
  border: none;
  background: #1976d2;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
.slot-creator button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading, .error, .no-data {
  text-align: center;
  margin: 1rem 0;
  color: #888;
}
.error { color: #e53935; }

.appointments-table {
  width: 100%;
  border-collapse: collapse;
}
.appointments-table th,
.appointments-table td {
  padding: 0.6rem;
  border: 1px solid #ddd;
  text-align: left;
}
.actions button {
  margin-right: 0.5rem;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.actions button:hover { opacity: 0.9; }
.actions button:nth-child(1) { background: #4caf50; color: white; }
.actions button:nth-child(2) { background: #1976d2; color: white; }
.actions button:nth-child(3) { background: #e53935; color: white; }
</style>
