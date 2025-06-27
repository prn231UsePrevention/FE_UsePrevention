<template>
  <div class="admin-surveys-container card">
    <h1>Quản lý Khảo sát</h1>
    <p>Thêm, chỉnh sửa hoặc xóa các bài khảo sát.</p>

    <div class="action-bar">
      <button @click="addNewSurvey" class="btn primary">Thêm Khảo sát Mới</button>
    </div>

    <div v-if="mockSurveys.length" class="surveys-table">
      <table>
        <thead>
          <tr>
            <th>Tên Khảo sát</th>
            <th>Mô tả</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="survey in mockSurveys" :key="survey.id">
            <td>{{ survey.name }}</td>
            <td>{{ survey.description }}</td>
            <td>
              <button @click="editSurvey(survey.id)" class="btn secondary small">Sửa</button>
              <button @click="deleteSurvey(survey.id)" class="btn danger small">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="status-message">
      Hiện chưa có khảo sát nào.
    </div>
  </div>
</template>

<script setup>
import { mockSurveys } from '@/data/mockData'

const addNewSurvey = () => {
  alert('Chức năng thêm khảo sát mới sẽ được phát triển.')
}

const editSurvey = (id) => {
  alert(`Chức năng sửa khảo sát ${id} sẽ được phát triển.`) 
}

const deleteSurvey = (id) => {
  if (confirm(`Bạn có chắc chắn muốn xóa khảo sát ${id} này không?`)) {
    alert(`Chức năng xóa khảo sát ${id} sẽ được phát triển.`) 
  }
}
</script>

<style scoped>
.admin-surveys-container {
  width: 100%;
  padding: var(--spacing-lg);
  text-align: center;
}

.admin-surveys-container h1 {
  font-size: var(--font-size-h2);
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-sm);
}

.admin-surveys-container p {
  font-size: var(--font-size-lg);
  color: var(--text-color-secondary);
  margin-bottom: var(--spacing-xl);
}

.action-bar {
  margin-bottom: var(--spacing-lg);
  text-align: right;
}

.surveys-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: var(--spacing-md);
  box-shadow: var(--shadow-1);
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

thead {
  background-color: var(--primary-color);
  color: var(--surface-color);
}

th,
td {
  padding: var(--spacing-md);
  border: 1px solid var(--background-color);
  text-align: left;
}

tbody tr:nth-child(even) {
  background-color: var(--background-color);
}

tbody tr:hover {
  background-color: #e0e0e0;
}

.btn.small {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  margin-right: var(--spacing-xs);
}

.btn.secondary {
  background-color: var(--text-color-secondary);
  color: var(--surface-color);
}

.btn.secondary:hover {
  background-color: #616161;
}

.btn.danger {
  background-color: var(--error-color);
  color: var(--surface-color);
}

.btn.danger:hover {
  background-color: #d32f2f;
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
}
</style>
