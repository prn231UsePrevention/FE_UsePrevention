import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import appointmentService from '@/services/appointmentService'

export const useAppointmentsStore = defineStore('appointments', () => {
  // state
  const appointments = ref([])
  const consultantAppointments = ref([])
  const allAvailableSlots = ref([]) // mới: tất cả khung giờ trống
  const isLoading = ref(false)
  const hasError = ref(false)
  const error = ref('')

  // getters
  const userAppointments = computed(() => appointments.value)
  const consultantAppts = computed(() => consultantAppointments.value)
  const availableSlots = computed(() => allAvailableSlots.value) // getter cho all slots

  // helper: lấy token
  function getToken() {
    const t = localStorage.getItem('token')
    if (!t) throw new Error('Chưa có token, vui lòng đăng nhập')
    return t
  }

  // actions
  async function fetchAppointments() {
    isLoading.value = true
    hasError.value = false
    try {
      const token = getToken()
      const res = await appointmentService.getUserAppointments(token)
      console.log('Appointments fetched:', res.data)  // log để kiểm tra dữ liệu
      appointments.value = res.data
    } catch (e) {
      hasError.value = true
      error.value = e.response?.data?.message || e.message || 'Lỗi khi lấy lịch người dùng'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchConsultantAppointments(consultantId) {
    isLoading.value = true
    hasError.value = false
    try {
      const token = getToken()
      const res = await appointmentService.getConsultantAppointments(token, consultantId)
      consultantAppointments.value = res.data
    } catch (e) {
      hasError.value = true
      error.value = e.response?.data?.message || e.message || 'Lỗi khi lấy lịch consultant'
    } finally {
      isLoading.value = false
    }
  }

  // mới: lấy tất cả khung giờ trống
  async function fetchAllAvailableSlots() {
    isLoading.value = true
    hasError.value = false
    try {
      const token = getToken()
      const res = await appointmentService.getAllAvailableSlots(token)
      allAvailableSlots.value = res.data
    } catch (e) {
      hasError.value = true
      error.value = e.response?.data?.message || e.message || 'Lỗi khi lấy tất cả khung giờ trống'
    } finally {
      isLoading.value = false
    }
  }

  async function createSlot(payload) {
    isLoading.value = true
    hasError.value = false
    try {
      const token = getToken()
      await appointmentService.createSlot(token, payload)
    } catch (e) {
      hasError.value = true
      error.value = e.response?.data?.message || e.message || 'Lỗi khi tạo slot'
    } finally {
      isLoading.value = false
    }
  }

  async function bookSlot(payload) {
    isLoading.value = true
    hasError.value = false
    try {
      const token = getToken()
      const res = await appointmentService.bookSlot(token, payload)
      appointments.value.push(res.data)
    } catch (e) {
      hasError.value = true
      error.value = e.response?.data?.message || e.message || 'Lỗi khi đặt lịch'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function updateAppointmentStatus(appointmentId, status) {
    isLoading.value = true
    hasError.value = false
    try {
      const token = getToken()
      await appointmentService.updateAppointmentStatus(token, appointmentId, status)
      const idx = consultantAppointments.value.findIndex(a => a.id === appointmentId)
      if (idx !== -1) consultantAppointments.value[idx].status = status
    } catch (e) {
      hasError.value = true
      error.value = e.response?.data?.message || e.message || 'Lỗi khi cập nhật trạng thái'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function cancelAppointment(appointmentId) {
    isLoading.value = true
    hasError.value = false
    try {
      const token = getToken()
      await appointmentService.cancelAppointment(token, appointmentId)
      appointments.value = appointments.value.filter(a => a.id !== appointmentId)
      consultantAppointments.value = consultantAppointments.value.filter(a => a.id !== appointmentId)
      allAvailableSlots.value = allAvailableSlots.value.filter(s => s.slotId !== appointmentId)
    } catch (e) {
      hasError.value = true
      error.value = e.response?.data?.message || e.message || 'Lỗi khi hủy lịch'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    // state
    appointments,
    consultantAppointments,
    allAvailableSlots,
    isLoading,
    hasError,
    error,
    // getters
    userAppointments,
    consultantAppts,
    availableSlots,
    // actions
    fetchAppointments,
    fetchConsultantAppointments,
    fetchAllAvailableSlots,
    createSlot,
    bookSlot,
    updateAppointmentStatus,
    cancelAppointment
  }
})
