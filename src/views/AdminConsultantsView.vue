<template>
  <div class="admin-consultants-container card">
    <h1>Quản lý Chuyên viên Tư vấn</h1>
    <p>Thêm, chỉnh sửa hoặc xóa thông tin các chuyên viên tư vấn.</p>

    <div class="action-bar">
      <button @click="addNewConsultant" class="btn primary">Thêm Chuyên viên Mới</button>
    </div>

    <div v-if="mockConsultants.length" class="consultants-table">
      <table>
        <thead>
          <tr>
            <th>Tên Chuyên viên</th>
            <th>Chuyên môn</th>
            <th>Bằng cấp</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="consultant in mockConsultants" :key="consultant.id">
            <td>{{ consultant.name }}</td>
            <td>{{ consultant.specialization }}</td>
            <td>{{ consultant.degree }}</td>
            <td>
              <button @click="editConsultant(consultant.id)" class="btn secondary small">Sửa</button>
              <button @click="deleteConsultant(consultant.id)" class="btn danger small">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="status-message">
      Hiện chưa có chuyên viên tư vấn nào.
    </div>
  </div>
</template>

<script setup>
import { mockConsultants } from '@/data/mockData'

const addNewConsultant = () => {
  alert('Chức năng thêm chuyên viên mới sẽ được phát triển.')
}

const editConsultant = (id) => {
  alert(`Chức năng sửa chuyên viên ${id} sẽ được phát triển.`) 
}

const deleteConsultant = (id) => {
  if (confirm(`Bạn có chắc chắn muốn xóa chuyên viên ${id} này không?`)) {
    alert(`Chức năng xóa chuyên viên ${id} sẽ được phát triển.`) 
  }
}
</script>

<style scoped>
.admin-consultants-container {
  width: 100%;
  padding: var(--spacing-lg);
  text-align: center;
}

.admin-consultants-container h1 {
  font-size: var(--font-size-h2);
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-sm);
}

.admin-consultants-container p {
  font-size: var(--font-size-lg);
  color: var(--text-color-secondary);
  margin-bottom: var(--spacing-xl);
}

.action-bar {
  margin-bottom: var(--spacing-lg);
  text-align: right;
}

.consultants-table {
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
