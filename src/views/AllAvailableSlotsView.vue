<template>
  <div class="all-slots-container card">
    <h1>Danh sách tất cả lịch trống của các chuyên viên</h1>
    <div v-if="loading">Đang tải dữ liệu...</div>
    <div v-else-if="error" style="color:red">{{ error }}</div>
    <div v-else>
      <div v-if="Object.keys(groupedSlots).length">
        <div v-for="(slots, consultantId) in groupedSlots" :key="consultantId" class="consultant-group">
          <h2 class="consultant-name">{{ consultantNames[consultantId] || 'Chuyên viên #' + consultantId }}</h2>
          <table class="slots-table" v-if="slots.length">
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
          <div v-else>Không có slot trống nào.</div>
        </div>
      </div>
      <div v-else>Không có slot trống nào.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)
const error = ref('')
const groupedSlots = ref({})
const consultantNames = ref({})
const bookingSlotId = ref(null)

function formatDateTime(dt) {
  if (!dt) return ''
  const d = new Date(dt)
  return d.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
}

async function fetchAllData() {
  loading.value = true
  try {
    // Lấy toàn bộ slot
    const slotRes = await fetch('https://localhost:7233/api/Appointments/all-available-slots')
    if (!slotRes.ok) throw new Error('Không lấy được danh sách slot.')
    const slots = await slotRes.json()

    // Lấy toàn bộ consultant
    const consultantRes = await fetch('https://localhost:7233/api/Consultant')
    if (!consultantRes.ok) throw new Error('Không lấy được danh sách chuyên viên.')
    const consultants = await consultantRes.json()

    // Map consultantId -> userId
    const consultantIdToUserId = {}
    consultants.forEach(c => { consultantIdToUserId[c.id] = c.userId })

    // Lấy tên từng user
    const userIdSet = new Set(consultants.map(c => c.userId))
    const userIdToName = {}
    await Promise.all(Array.from(userIdSet).map(async userId => {
      try {
        const userRes = await fetch(`https://localhost:7233/api/Users/${userId}`)
        if (userRes.ok) {
          const user = await userRes.json()
          userIdToName[userId] = user.fullName || `User #${userId}`
        } else {
          userIdToName[userId] = `User #${userId}`
        }
      } catch {
        userIdToName[userId] = `User #${userId}`
      }
    }))

    // Gom slot theo consultantId
    const grouped = {}
    slots.forEach(slot => {
      if (!grouped[slot.consultantId]) grouped[slot.consultantId] = []
      grouped[slot.consultantId].push(slot)
    })
    groupedSlots.value = grouped

    // Map consultantId -> tên
    const consultantIdToName = {}
    Object.keys(grouped).forEach(cid => {
      const userId = consultantIdToUserId[cid]
      consultantIdToName[cid] = userIdToName[userId] || `User #${userId}`
    })
    consultantNames.value = consultantIdToName
  } catch (e) {
    error.value = e.message || 'Lỗi kết nối tới server.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchAllData)

async function bookSlot(slotId) {
  if (!confirm('Bạn chắc chắn muốn đặt lịch cho slot này?')) return
  bookingSlotId.value = slotId
  try {
    const res = await fetch('https://localhost:7233/api/Appointments/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slotId })
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
.all-slots-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 6px rgba(0,0,0,0.1);
}
.consultant-group {
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}
.consultant-name {
  color: #1976d2;
  font-size: 1.2rem;
  margin-bottom: 0.7rem;
  margin-top: 1.5rem;
  text-align: left;
}
.slots-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
}
.slots-table th, .slots-table td {
  border: 1px solid #ddd;
  padding: 8px;
}
.slots-table th {
  background: #f5f5f5;
}
</style> 