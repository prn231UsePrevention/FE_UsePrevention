<template>
  <div class="consultant-appointments-wrapper">
    <h2>Quản lý cuộc hẹn</h2>

    <!-- Tạo slot mới + Tạo lịch tái khám -->
    <div class="slot-creator">
      <label>
        Chọn khung giờ:
        <input type="datetime-local" v-model="newSlotTime" />
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
          <button @click="createRevisit"
            :disabled="!revisitModal.selectedUserId || !revisitModal.time || !revisitModal.parentAppointmentId">
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
            <button v-if="app.status === 'Pending'" @click="changeStatus(app.id, 'Confirmed')">Xác nhận</button>
            <button v-if="app.status === 'Confirmed'" @click="changeStatus(app.id, 'Completed')">Hoàn thành</button>
            <button v-if="app.status !== 'Cancelled' && app.status !== 'Completed'"
              @click="cancelAppointment(app.id)">Hủy</button>
            <button v-if="app.status === 'Completed' && !app.hasResult" @click="openResultModal(app)">
              Ghi kết quả tư vấn
            </button>
            <button v-if="app.status === 'Completed' && app.hasResult" @click="openResultModal(app, 'view')">
              Xem kết quả
            </button>
          </td>
        </tr>
        <tr v-if="allSlots.length === 0">
          <td colspan="5" class="no-data">Chưa có khung giờ hoặc cuộc hẹn nào</td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- Modal quản lý kết quả -->
  <div v-if="resultModal.visible" class="modal-overlay">
    <div class="modal-content card">
      <button class="modal-close" @click="closeResultModal">×</button>
      <h3 v-if="resultModal.mode === 'create'">Ghi kết quả tư vấn</h3>
      <h3 v-else-if="resultModal.mode === 'edit'">Chỉnh sửa kết quả tư vấn</h3>
      <h3 v-else>Xem kết quả tư vấn</h3>
      <div v-if="resultModal.loading">Đang xử lý...</div>
      <div v-else>
        <label>
          Chẩn đoán:
          <input v-model="resultModal.diagnosis" :readonly="resultModal.mode === 'view'" type="text" placeholder="Chẩn đoán" />
        </label>
        <label>
          Kết luận/Hướng dẫn:
          <textarea v-model="resultModal.recommendation" :readonly="resultModal.mode === 'view'" placeholder="Kết luận, hướng dẫn..."></textarea>
        </label>
        <div v-if="resultModal.mode === 'create'">
          <button @click="submitResult" :disabled="!resultModal.diagnosis || !resultModal.recommendation">
            Lưu kết quả
          </button>
          <button @click="closeResultModal" style="margin-left:1rem">Hủy</button>
        </div>
        <div v-else-if="resultModal.mode === 'edit'">
          <button @click="updateResult" :disabled="!resultModal.diagnosis || !resultModal.recommendation">Lưu chỉnh sửa</button>
          <button @click="() => resultModal.mode = 'view'" style="margin-left:1rem">Hủy</button>
        </div>
        <div v-else>
          <button @click="() => resultModal.mode = 'edit'">Sửa</button>
          <button @click="deleteResult" style="margin-left:1rem">Xóa</button>
        </div>
        <div v-if="resultModal.error" style="color:red">{{ resultModal.error }}</div>
        <div v-if="resultModal.success" style="color:green">{{ resultModal.success }}</div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppointmentsStore } from '@/stores/appointments'
import appointmentService from '@/services/appointmentService'
import { getMyUserInfo, getConsultantByUserId } from '@/services/userService'

const resultModal = ref({
  visible: false,
  loading: false,
  error: '',
  success: '',
  appointmentId: null,
  userId: null,
  diagnosis: '',
  recommendation: '',
  resultId: null, 
  mode: 'create' // 'create', 'edit', 'view'
});

// Mở modal theo mode: create, view, edit
function openResultModal(app, mode = 'create') {
  resultModal.value = {
    visible: true,
    loading: false,
    error: '',
    success: '',
    appointmentId: app.id,
    userId: app.userId,
    resultId: app.resultId || null,
    diagnosis: '',
    recommendation: '',
    mode
  }
  console.log('Opening result modal in mode:', mode, 'for appointment:', app.id, app.resultId)
  if (mode === 'view' && app.resultId) {
    fetchResultDetail(app.resultId)
  }
}

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
    userId: null,
    userFullName: '',
    startTime: slot.start,
    endTime: slot.end,
    status: 'Available'
  }))
  const sch = consultantAppointments.value.map(a => ({
    id: a.id,
    userId: a.userId,
    userFullName: a.userFullName,
    startTime: a.startTime,
    endTime: a.endTime,
    status: a.status,
    hasResult: a.hasResult,
    resultId: a.resultId || null,
  }))
  console.log('All slots:', av, sch)
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

function closeResultModal() {
  resultModal.value.visible = false
}

async function submitResult() {
  resultModal.value.loading = true
  resultModal.value.error = ''
  resultModal.value.success = ''
  console.log({
    appointmentId: resultModal.value.appointmentId,
    userId: resultModal.value.userId,
    diagnosis: resultModal.value.diagnosis,
    recommendation: resultModal.value.recommendation
  });
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('https://localhost:7233/api/Results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        appointmentId: resultModal.value.appointmentId,
        userId: resultModal.value.userId,
        diagnosis: resultModal.value.diagnosis,
        recommendation: resultModal.value.recommendation
      })
    });
    if (res.ok) {
      resultModal.value.success = 'Lưu kết quả thành công!';
      setTimeout(() => {
        resultModal.value.visible = false;
        loadSlots(); // refresh lại list
      }, 1000);
    } else {
      const err = await res.json().catch(() => ({}));
      resultModal.value.error = err.message || 'Lỗi khi lưu kết quả';
    }
  } catch (e) {
    resultModal.value.error = 'Lỗi khi lưu kết quả';
  } finally {
    resultModal.value.loading = false;
  }
}

// Lấy chi tiết kết quả
async function fetchResultDetail(resultId) {
  resultModal.value.loading = true
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`https://localhost:7233/api/Results/${resultId}`, {
      headers: { 'Authorization': 'Bearer ' + token }
    })
    if (!res.ok) throw new Error('Lỗi khi tải kết quả')
    const data = await res.json()
    resultModal.value.diagnosis = data.diagnosis
    resultModal.value.recommendation = data.recommendation
    resultModal.value.resultId = data.id
    resultModal.value.userId = data.userId
  } catch (e) {
    resultModal.value.error = e.message
  } finally {
    resultModal.value.loading = false
  }
}

// Cập nhật kết quả
async function updateResult() {
  resultModal.value.loading = true
  resultModal.value.error = ''
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`https://localhost:7233/api/Results/${resultModal.value.resultId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        diagnosis: resultModal.value.diagnosis,
        recommendation: resultModal.value.recommendation
      })
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || 'Lỗi khi cập nhật kết quả')
    }
    resultModal.value.success = 'Cập nhật thành công!'
    setTimeout(() => {
      resultModal.value.visible = false
      loadSlots()
    }, 1000)
  } catch (e) {
    resultModal.value.error = e.message
  } finally {
    resultModal.value.loading = false
  }
}

// Xóa kết quả
async function deleteResult() {
  if (!confirm('Bạn chắc chắn muốn xóa kết quả này?')) return
  resultModal.value.loading = true
  resultModal.value.error = ''
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`https://localhost:7233/api/Results/${resultModal.value.resultId}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    })
    if (!res.ok) throw new Error('Lỗi khi xóa kết quả')
    resultModal.value.success = 'Đã xóa kết quả!'
    setTimeout(() => {
      resultModal.value.visible = false
      loadSlots()
    }, 1000)
  } catch (e) {
    resultModal.value.error = e.message
  } finally {
    resultModal.value.loading = false
  }
}

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
  padding: 1.5rem 1rem 2.5rem 1rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 18px 0 rgba(31,41,55,.12);
}

h2 {
  text-align: center;
  margin-bottom: 1.8rem;
  font-weight: 700;
  font-size: 1.7rem;
  color: #2252aa;
  letter-spacing: .2px;
}

.slot-creator {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 1.5rem;
}

.slot-creator input[type="datetime-local"] {
  padding: 0.45rem 0.7rem;
  border: 1.2px solid #b4cae7;
  border-radius: 8px;
  background: #f6f8fc;
  font-size: 1rem;
  margin-left: 0.5rem;
}

.slot-creator button {
  padding: 0.45rem 1.1rem;
  border: none;
  background: linear-gradient(90deg, #2176ff 60%, #3f8efc 100%);
  color: #fff;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 6px #d0e2ff33;
  transition: background 0.17s, box-shadow 0.19s, transform 0.15s;
  font-size: 1.04rem;
}
.slot-creator button:disabled {
  opacity: 0.56;
  cursor: not-allowed;
}
.slot-creator button:not(:disabled):hover {
  background: linear-gradient(90deg, #1b4cc8 60%, #2176ff 100%);
  box-shadow: 0 4px 12px #1451b62e;
  transform: translateY(-2px) scale(1.03);
}

.loading,
.error,
.no-data {
  text-align: center;
  margin: 1.1rem 0;
  color: #888;
  font-size: 1.06rem;
}
.error { color: #e53935; }

.appointments-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 4px;
  margin-top: 1.5rem;
}
.appointments-table th,
.appointments-table td {
  padding: 0.6rem 0.8rem;
  background: #f9fbfe;
  border: 1px solid #e6eefb;
  border-radius: 7px;
  text-align: left;
  font-size: 1.01rem;
}
.appointments-table th {
  background: #e6eefb;
  color: #2252aa;
  font-weight: 700;
}
.appointments-table td.no-data {
  text-align: center;
  color: #aaa;
  font-style: italic;
}

.actions button {
  margin-right: 0.38rem;
  padding: 0.36rem 1rem;
  border: none;
  border-radius: 7px;
  font-size: 0.97rem;
  font-weight: 500;
  cursor: pointer;
  transition: box-shadow 0.15s, background 0.18s;
  box-shadow: 0 2px 7px #b2cdfd2b;
}
.actions button:hover {
  opacity: 0.92;
  box-shadow: 0 3px 12px #1976d246;
}
.actions button:nth-child(1) { background: #3fa354; color: #fff; }
.actions button:nth-child(2) { background: #2176ff; color: #fff; }
.actions button:nth-child(3) { background: #e53935; color: #fff; }
.actions button:last-child { background: #ffb703; color: #232; }

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(31,41,55,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: background 0.18s;
}

.modal-content {
  background: #fff;
  padding: 2.2rem 2.2rem 2rem 2.2rem;
  border-radius: 22px;
  min-width: 350px;
  max-width: 95vw;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 32px rgba(45,62,80,0.17);
  font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
  animation: modalPop 0.21s cubic-bezier(0.38,1.55,0.47,0.92);
}

@keyframes modalPop {
  from { transform: scale(0.95) translateY(16px); opacity: 0; }
  to   { transform: scale(1) translateY(0); opacity: 1; }
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.48rem;
  font-weight: 650;
  color: #2176ff;
  text-align: center;
  letter-spacing: 0.2px;
}

.modal-content label {
  display: block;
  margin-bottom: 1.15rem;
  font-weight: 500;
  color: #222;
}
.modal-content input[type="text"],
.modal-content input[type="datetime-local"],
.modal-content select,
.modal-content textarea {
  width: 100%;
  padding: 0.52rem 0.8rem;
  border: 1.3px solid #d5dbe6;
  border-radius: 7px;
  font-size: 1.04rem;
  margin-top: 0.32rem;
  margin-bottom: 0.3rem;
  background: #f5f8fc;
  transition: border 0.2s;
  resize: none;
}
.modal-content input:focus,
.modal-content select:focus,
.modal-content textarea:focus {
  border: 1.5px solid #2176ff;
  outline: none;
  background: #fff;
}

.modal-content button {
  min-width: 12px;
  padding: 0.5rem 0.9rem;
  border: none;
  border-radius: 7px;
  font-size: 1.06rem;
  font-weight: 500;
  margin-top: 1.05rem;
  background: #2176ff;
  color: #fff;
  cursor: pointer;
  transition: background 0.18s;
}
.modal-content button:disabled {
  background: #b0b0b0;
  color: #fff;
  cursor: not-allowed;
}
.modal-content button+button {
  background: #e0e0e0;
  color: #2b2b2b;
  margin-left: 1rem;
}
.modal-content button+button:hover {
  background: #d0d0d0;
}

.modal-close {
  position: absolute;
  top: 13px;
  right: 16px;
  background: none;
  border: none;
  font-size: 2.2rem;
  color: #adb8cb;
  cursor: pointer;
  transition: color 0.18s, transform 0.18s;
  line-height: 1;
  z-index: 10;
  min-width: 36px;
  min-height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-close:hover {
  color: #fff
  /* transform: scale(1.16); */
}

@media (max-width: 600px) {
  .modal-content {
    padding: 1.2rem 0.7rem 1rem 0.7rem;
    min-width: 0;
  }
  .modal-content h3 {
    font-size: 1.11rem;
  }
  .modal-close {
    font-size: 2.6rem;
    right: 6px;
    top: 4px;
  }
}

</style>
