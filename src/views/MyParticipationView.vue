<template>
  <div class="my-participation-container card">
    <h1>Hoạt động của tôi</h1>
    <p>Xem lại các khóa học bạn đã đăng ký và lịch hẹn đã đặt.</p>

    <div class="participation-section">
      <h2><span class="icon">📚</span> Khóa học đã đăng ký</h2>
      <div v-if="mockUserParticipations.registeredCourses.length" class="table-responsive">
        <table class="participation-table">
          <thead>
            <tr>
              <th>Tên khóa học</th>
              <th>Ngày đăng ký</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in mockUserParticipations.registeredCourses" :key="course.id">
              <td>{{ getCourseName(course.courseId) }}</td>
              <td>{{ formatDate(course.registrationDate) }}</td>
              <td><span :class="getStatusClass(course.status)">{{ course.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="status-message">
        Bạn chưa đăng ký khóa học nào.
      </div>
    </div>

    <div class="participation-section">
      <h2><span class="icon">🗓️</span> Lịch hẹn đã đặt</h2>
      <div v-if="mockUserParticipations.bookedAppointments.length" class="table-responsive">
        <table class="participation-table">
          <thead>
            <tr>
              <th>Chuyên viên</th>
              <th>Ngày hẹn</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="appointment in mockUserParticipations.bookedAppointments" :key="appointment.id">
              <td>{{ getConsultantName(appointment.consultantId) }}</td>
              <td>{{ formatDate(appointment.appointmentDate) }}</td>
              <td>{{ appointment.time }}</td>
              <td><span :class="getStatusClass(appointment.status)">{{ appointment.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="status-message">
        Bạn chưa đặt lịch hẹn nào.
      </div>
    </div>
  </div>
</template>

<script setup>
import { mockUserParticipations, mockCourses, mockConsultants } from '@/data/mockData'

const getCourseName = (courseId) => {
  const course = mockCourses.find(c => c.id === courseId)
  return course ? course.name : 'N/A'
}

const getConsultantName = (consultantId) => {
  const consultant = mockConsultants.find(c => c.id === consultantId)
  return consultant ? consultant.name : 'N/A'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('vi-VN', options)
}

const getStatusClass = (status) => {
  switch (status) {
    case 'Đã xác nhận':
    case 'Đã hoàn thành':
      return 'status-success'
    case 'Đã hủy':
      return 'status-danger'
    case 'Đã đăng ký':
    case 'Đang chờ':
    default:
      return 'status-info'
  }
}
</script>

<style scoped>
.my-participation-container {
  width: 100%;
  padding: var(--spacing-lg);
  text-align: center;
}

.my-participation-container h1 {
  font-size: var(--font-size-h2);
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-sm);
}

.my-participation-container p {
  font-size: var(--font-size-lg);
  color: var(--text-color-secondary);
  margin-bottom: var(--spacing-xl);
}

.participation-section {
  margin-bottom: var(--spacing-xl);
  text-align: left;
}

.participation-section h2 {
  font-size: var(--font-size-h3);
  color: var(--primary-color);
  margin-bottom: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.table-responsive {
  overflow-x: auto;
}

.participation-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: var(--spacing-md);
  box-shadow: var(--shadow-1);
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.participation-table th,
.participation-table td {
  padding: var(--spacing-md);
  border: 1px solid var(--background-color);
  text-align: left;
}

.participation-table th {
  background-color: var(--primary-color);
  color: var(--surface-color);
}

.participation-table tbody tr:nth-child(even) {
  background-color: var(--background-color);
}

.participation-table tbody tr:hover {
  background-color: #e0e0e0;
}

.status-success {
  color: var(--success-color);
  font-weight: 600;
}

.status-danger {
  color: var(--error-color);
  font-weight: 600;
}

.status-info {
  color: var(--primary-dark);
  font-weight: 600;
}

.status-message {
  font-size: var(--font-size-lg);
  color: var(--text-color-secondary);
  padding: var(--spacing-xl);
  background: var(--surface-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-1);
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}
</style> 