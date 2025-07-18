// src/services/appointmentService.js

import axios from 'axios'

const API_BASE = '/api/Appointments'

export default {
  // 1. Lấy danh sách bác sĩ (consultants)
  async getConsultants(token) {
    return axios.get(`${API_BASE}/consultants`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  },

  // 2. Lấy các slot có sẵn của bác sĩ vào ngày cụ thể
  //    date: chuỗi 'YYYY-MM-DD'
  async getAvailableSlots(token, consultantId, date) {
    console.log('getAvailableSlots', { consultantId, date })
    const isoWithSeconds = new Date(date)
      .toISOString()            
      .split('.')[0] + 'Z'      
    console.log(isoWithSeconds) 
    // Gọi API để lấy các slot có sẵn   
    return axios.get(`${API_BASE}/available-slots`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { consultantId, date }
    })
  },

  async getAllAvailableSlots(token) {
    return axios.get(`${API_BASE}/all-available-slots`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  },

  // 3. Đặt slot (book) cho user
  //    payload: { slotId, note }
  async bookSlot(token, payload) {
    return axios.post(`${API_BASE}/book`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    })
  },

  // 4. Lấy lịch của một user hiện tại
  async getUserAppointments(token) {
    return axios.get(`${API_BASE}/user`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  },

  // 5. Xem lịch của từng bác sĩ
  async getConsultantAppointments(token, consultantId) {
    return axios.get(`${API_BASE}/consultant/${consultantId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  },

  // 6. Đổi status của cuộc hẹn (chỉ consultant)
  //    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed'
  async updateAppointmentStatus(token, appointmentId, status) {
    return axios.put(
      `${API_BASE}/${appointmentId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  },

  // 7. Hủy cuộc hẹn (consultant hoặc user)
  async cancelAppointment(token, appointmentId) {
    return axios.put(
      `${API_BASE}/${appointmentId}/cancel`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
  },

  // 8. Lấy chi tiết của một cuộc hẹn
  async getAppointmentById(token, appointmentId) {
    return axios.get(`${API_BASE}/${appointmentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  },

  // 9. Tạo slot tương lai cho consultant
  //    payload: { startTime: 'YYYY-MM-DDTHH:mm:ss' }
  async createSlot(token, payload) {
    return axios.post(`${API_BASE}/slots`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    })
  }
}
