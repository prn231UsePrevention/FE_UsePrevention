<template>
  <div class="my-participation-container card">
    <h1>Chương trình đã tham gia</h1>
    <div v-if="loading">Đang tải...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <table v-if="participations.length" class="participation-table">
        <thead>
          <tr>
            <th>Tên chương trình</th>
            <th>Ngày tham gia</th>
            <th>Pre Survey</th>
            <th>Post Survey</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in participations" :key="p.id">
            <td>{{ getProgramName(p.programId) }}</td>
            <td>{{ formatDate(p.joinedAt) }}</td>
            <td>{{ p.preSurvey }}</td>
            <td>{{ p.postSurvey }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="status-message">Bạn chưa tham gia chương trình nào.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMyParticipations } from '@/services/participationService'
import { getAllCommunityPrograms } from '@/services/communityProgramService'

const participations = ref([])
const programs = ref([])
const loading = ref(false)
const error = ref('')

const getProgramName = (programId) => {
  const program = programs.value.find(p => p.id === programId)
  return program ? program.name : 'N/A'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const d = new Date(dateString)
  return d.toLocaleString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

onMounted(async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const [res, progRes] = await Promise.all([
      getMyParticipations(token),
      getAllCommunityPrograms(token)
    ])
    participations.value = Array.isArray(res.data) ? res.data : []
    programs.value = Array.isArray(progRes.data) ? progRes.data : []
  } catch (err) {
    error.value = err.response?.data?.message || 'Lỗi tải dữ liệu!'
  } finally {
    loading.value = false
  }
})
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