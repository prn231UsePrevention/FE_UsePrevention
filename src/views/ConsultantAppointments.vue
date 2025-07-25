<template>
  <div class="consultant-appointments-wrapper">
    <h2>Quản lý cuộc hẹn</h2>

    <!-- Tạo slot mới + Tạo lịch tái khám -->
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
      <button @click="openRevisitModal" style="margin-left: 1rem">
        Tạo lịch tái khám
      </button>
    </div>

    <!-- Modal tạo lịch tái khám -->
    <div v-if="revisitModal.visible" class="modal-overlay">
      <div class="modal-content card">
        <h3>Tạo lịch tái khám</h3>
        <button class="modal-close" @click="closeRevisitModal">×</button>
        <div v-if="revisitModal.loading">Đang tạo lịch tái khám...</div>
        <div v-else>
          <label>Chọn khách hàng:
            <select v-model="revisitModal.selectedUserId">
              <option v-for="user in revisitModal.userOptions" :key="user.userId" :value="user.userId">
                {{ user.userFullName }}
              </option>
            </select>
          </label>
          <br />
          <label>Chọn thời gian:
            <input type="datetime-local" v-model="revisitModal.time" />
          </label>
          <br />
          <label>Ghi chú:
            <input type="text" v-model="revisitModal.note" placeholder="Ghi chú (tùy chọn)" />
          </label>
          <br />
          <label>Chọn cuộc hẹn gốc:
            <select v-model="revisitModal.parentAppointmentId">
              <option v-for="app in revisitModal.parentAppointments" :key="app.id" :value="app.id">
                {{ app.userFullName }} - {{ formatDate(app.startTime) }} {{ formatTime(app.startTime) }}
              </option>
            </select>
          </label>
          <br />
          <button @click="createRevisit" :disabled="!revisitModal.selectedUserId || !revisitModal.time || !revisitModal.parentAppointmentId">
            Xác nhận
          </button>
          <button @click="closeRevisitModal" style="margin-left: 1rem">Hủy</button>
        </div>
        <div v-if="revisitModal.error" style="color:red">{{ revisitModal.error }}</div>
      </div>
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
import { ref, computed, onMounted, watch } from 'vue'
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

const revisitModal = ref({
  visible: false,
  loading: false,
  error: '',
  selectedUserId: '',
  time: '',
  note: '',
  userOptions: [],
  parentAppointments: [],
  parentAppointmentId: ''
})

function openRevisitModal() {
  revisitModal.value.visible = true
  revisitModal.value.loading = false
  revisitModal.value.error = ''
  revisitModal.value.selectedUserId = ''
  revisitModal.value.time = ''
  revisitModal.value.note = ''
  revisitModal.value.parentAppointments = []
  revisitModal.value.parentAppointmentId = ''
  // Lấy danh sách khách hàng đã từng có appointment với consultant này
  const users = []
  consultantAppointments.value.forEach(app => {
    if (app.userId && app.userFullName) {
      if (!users.find(u => u.userId === app.userId)) {
        users.push({ userId: app.userId, userFullName: app.userFullName })
      }
    }
  })
  revisitModal.value.userOptions = users
}

// Theo dõi khi chọn user để filter lại parentAppointments
watch(
  () => revisitModal.value.selectedUserId,
  (userId) => {
    if (!userId) {
      revisitModal.value.parentAppointments = []
      revisitModal.value.parentAppointmentId = ''
      return
    }
    // Lọc appointment của user đã chọn và đã hoàn thành
    const apps = consultantAppointments.value.filter(app => String(app.userId) === String(userId) && app.status === 'Completed')
    revisitModal.value.parentAppointments = apps
    revisitModal.value.parentAppointmentId = apps.length ? apps[0].id : ''
  }
)

function closeRevisitModal() {
  revisitModal.value.visible = false
}

async function createRevisit() {
  revisitModal.value.loading = true
  revisitModal.value.error = ''
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('https://localhost:7233/api/Appointments/revisit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        previousAppointmentId: Number(revisitModal.value.parentAppointmentId),
        newTime: new Date(revisitModal.value.time).toISOString()
      })
    })
    if (res.ok) {
      alert('Tạo lịch tái khám thành công!')
      revisitModal.value.visible = false
      await loadSlots()
    } else {
      const err = await res.json().catch(() => ({}))
      revisitModal.value.error = 'Tạo lịch tái khám thất bại! ' + (err.message || '')
    }
  } catch (e) {
    revisitModal.value.error = 'Lỗi kết nối khi tạo lịch tái khám!'
  } finally {
    revisitModal.value.loading = false
  }
}

function parentAppsConsultantId() {
  // Lấy consultantId từ appointment đầu tiên (vì tất cả đều cùng consultant)
  const app = consultantAppointments.value.find(a => a.consultantId)
  return app ? app.consultantId : null
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

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  padding: 2.2rem 2.5rem 2rem 2.5rem;
  border-radius: 16px;
  min-width: 350px;
  max-width: 95vw;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
}
.modal-content h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1976d2;
  text-align: center;
}
.modal-content label {
  display: block;
  margin-bottom: 1rem;
  font-weight: 500;
  color: #333;
}
.modal-content select,
.modal-content input[type="datetime-local"],
.modal-content input[type="text"] {
  width: 100%;
  padding: 0.5rem 0.7rem;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 1rem;
  margin-top: 0.3rem;
  margin-bottom: 0.5rem;
  transition: border 0.2s;
}
.modal-content select:focus,
.modal-content input[type="datetime-local"]:focus,
.modal-content input[type="text"]:focus {
  border: 1.5px solid #1976d2;
  outline: none;
}
.modal-content button {
  min-width: 100px;
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  margin-top: 1rem;
  background: #1976d2;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}
.modal-content button:disabled {
  background: #b0b0b0;
  color: #fff;
  cursor: not-allowed;
}
.modal-content button + button {
  background: #e0e0e0;
  color: #333;
  margin-left: 1rem;
}
.modal-content button + button:hover {
  background: #d0d0d0;
}
.modal-close {
  position: absolute;
  top: 12px;
  right: 18px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #888;
  cursor: pointer;
  transition: color 0.2s;
}
.modal-close:hover {
  color: #1976d2;
}
@media (max-width: 600px) {
  .modal-content {
    padding: 1.2rem 0.7rem 1rem 0.7rem;
    min-width: 0;
  }
  .modal-content h3 {
    font-size: 1.1rem;
  }
}
</style>
