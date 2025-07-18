<template>
  <div class="appointment-form">
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="consultant">Tư vấn viên</label>
        <select v-model="appointmentData.consultantId" id="consultant" required>
          <option value="" disabled>Chọn tư vấn viên</option>
          <option
            v-for="consultant in consultants"
            :key="consultant.id"
            :value="consultant.id"
          >
            {{ consultant.fullName }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="date">Ngày</label>
        <input
          type="date"
          v-model="appointmentData.date"
          id="date"
          required
        />
      </div>

      <div class="form-group">
        <label for="slot">Khung giờ</label>
        <select v-model="appointmentData.slotId" id="slot" required>
          <option value="" disabled>Chọn khung giờ</option>
          <option
            v-for="slot in availableSlots"
            :key="slot.slotId"
            :value="slot.slotId"
          >
            {{ formatTime(slot.start) }} – {{ formatTime(slot.end) }}
          </option>
        </select>
        <div v-if="loadingSlots" class="loading">Đang tải khung giờ...</div>
        <div v-if="slotsError" class="error">{{ slotsError }}</div>
      </div>

      <div class="form-group">
        <label for="note">Ghi chú</label>
        <textarea v-model="appointmentData.note" id="note" rows="3"></textarea>
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-btn">
          {{ isEditing ? 'Cập nhật' : 'Đặt lịch' }}
        </button>
        <button type="button" class="cancel-btn" @click="handleCancel">
          Hủy
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, defineProps, defineEmits } from 'vue'
import { useAppointmentsStore } from '@/stores/appointments'
import appointmentService from '@/services/appointmentService'
// import { getMyUserInfo, getConsultantByUserId } from '@/services/userService'

const props = defineProps({
  isEditing: Boolean,
  appointment: Object,
})

const emit = defineEmits(['submit','cancel'])

const store = useAppointmentsStore()
const consultants = ref([])
const availableSlots = ref([])
const loadingSlots = ref(false)
const slotsError = ref('')

const appointmentData = ref({
  consultantId: '',
  date: '',
  slotId: '',
  note: ''
})

// format helper
const formatTime = dt =>
  new Date(dt).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  })

// load consultants list once
onMounted(async () => {
  const consultantList = await appointmentService.getConsultants()
  consultants.value = consultantList.data
  console.log('Consultants loaded:', consultants.value)
})

// when editing, populate form
watch(() => props.appointment, (a) => {
  if (props.isEditing && a) {
    appointmentData.value = {
      consultantId: a.consultantId,
      date: a.startTime.split('T')[0],
      slotId: a.id,
      note: a.note || ''
    }
    fetchSlots()
  }
}, { immediate: true })

// when consultant or date changes, reload slots
watch(
  () => [appointmentData.value.consultantId, appointmentData.value.date],
  () => {
    appointmentData.value.slotId = ''
    if (appointmentData.value.consultantId && appointmentData.value.date) {
      fetchSlots()
    } else {
      availableSlots.value = []
    }
  }
)

// fetch available slots for chosen consultant & date
async function fetchSlots() {
  loadingSlots.value = true
  slotsError.value = ''
  try {
    const token = localStorage.getItem('token')
    const dateStr = appointmentData.value.date
    console.log('Consultant ID:', appointmentData.value.consultantId, 'Date:', dateStr)
    const res = await appointmentService.getAvailableSlots(
      token,
      appointmentData.value.consultantId,
      dateStr
    )
    availableSlots.value = res.data
  } catch (err) {
    slotsError.value =
      err.response?.data?.message || err.message || 'Không tải được khung giờ'
  } finally {
    loadingSlots.value = false
  }
}

// handle submit
function handleSubmit() {
  console.log('Submitting appointment:', appointmentData.value)
  const payload = {
    slotId: appointmentData.value.slotId,
    note: appointmentData.value.note
  }
  emit('submit', payload)
}

// handle cancel
function handleCancel() {
  emit('cancel')
}
</script>

<style scoped>
.appointment-form {
  display: flex;
  flex-direction: column;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  font-weight: 600;
  display: block;
  margin-bottom: 0.4rem;
}
.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}
.loading {
  margin-top: 0.5rem;
  color: #888;
}
.error {
  margin-top: 0.5rem;
  color: #e53935;
}
.form-actions {
  display: flex;
  gap: 0.5rem;
}
.submit-btn,
.cancel-btn {
  flex: 1;
  padding: 0.7rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.submit-btn {
  background: #4caf50;
  color: #fff;
}
.submit-btn:hover {
  background: #388e3c;
}
.cancel-btn {
  background: #f44336;
  color: #fff;
}
.cancel-btn:hover {
  background: #d32f2f;
}
</style>
