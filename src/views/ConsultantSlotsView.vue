<template>
  <div class="consultant-slots-container card">
    <h1>Danh sách lịch trống của chuyên viên</h1>
    <div v-if="loading">Đang tải dữ liệu...</div>
    <div v-else-if="error" style="color:red">{{ error }}</div>
    <div v-else>
      <div class="consultant-name" v-if="consultantName">
        <strong>Tên chuyên viên:</strong> {{ consultantName }}
      </div>
      <div v-if="slots.length">
        <table class="slots-table">
          <thead>
            <tr>
              <th>Thời gian bắt đầu</th>
              <th>Thời gian kết thúc</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="slot in slots" :key="slot.slotId">
              <td>{{ formatDateTime(slot.start) }}</td>
              <td>{{ formatDateTime(slot.end) }}</td>
              <td>
                <button class="btn primary" @click="bookSlot(slot.slotId)" :disabled="bookingSlotId === slot.slotId">
                  {{ bookingSlotId === slot.slotId ? 'Đang đặt...' : 'Đặt lịch' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>Không có slot trống nào cho chuyên viên này.</div>
    </div>
    <button @click="goBack" class="btn primary" style="margin-top:2rem">Quay lại</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const consultantId = Number(route.params.id)
const slots = ref([])
const loading = ref(true)
const error = ref('')
const consultantName = ref('')
const bookingSlotId = ref(null)

function formatDateTime(dt) {
  if (!dt) return ''
  const d = new Date(dt)
  return d.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
}

function goBack() {
  router.push('/consultants')
}

async function fetchAllData() {
  loading.value = true
  try {
    // Lấy thông tin consultant để lấy userId
    const consultantRes = await fetch(`https://localhost:7233/api/Consultant/${consultantId}`)
    if (consultantRes.ok) {
      const consultant = await consultantRes.json()
      if (consultant.userId) {
        // Lấy tên user
        const userRes = await fetch(`https://localhost:7233/api/Users/${consultant.userId}`)
        if (userRes.ok) {
          const user = await userRes.json()
          consultantName.value = user.fullName || `User #${consultant.userId}`
        } else {
          consultantName.value = `User #${consultant.userId}`
        }
      }
    }
    // Lấy slot
    const response = await fetch('https://localhost:7233/api/Appointments/all-available-slots')
    if (response.ok) {
      const data = await response.json()
      slots.value = data.filter(slot => slot.consultantId === consultantId)
    } else {
      error.value = 'Không lấy được danh sách slot.'
    }
  } catch (e) {
    error.value = 'Lỗi kết nối tới server.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchAllData)

async function bookSlot(slotId) {
  if (!confirm('Bạn chắc chắn muốn đặt lịch cho slot này?')) return
  bookingSlotId.value = slotId
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('https://localhost:7233/api/Appointments/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ slotId, note: 'Đặt lịch từ web' })
    })
    if (res.ok) {
      alert('Đặt lịch thành công!')
      await fetchAllData()
    } else {
      const err = await res.json().catch(() => ({}))
      alert('Đặt lịch thất bại! ' + (err.message || ''))
    }
  } catch (e) {
    alert('Lỗi kết nối khi đặt lịch!')
  } finally {
    bookingSlotId.value = null
  }
}
</script>

<style scoped>
.consultant-slots-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 6px rgba(0,0,0,0.1);
  text-align: center;
}
.consultant-name {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #1976d2;
}
.slots-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.slots-table th, .slots-table td {
  border: 1px solid #ddd;
  padding: 8px;
}
.slots-table th {
  background: #f5f5f5;
}
</style> 