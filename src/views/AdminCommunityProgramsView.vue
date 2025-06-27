<template>
  <div class="admin-community-programs-container card">
    <h1>Quản lý Chương trình Cộng đồng</h1>
    <p>Thêm, chỉnh sửa hoặc xóa các chương trình truyền thông và giáo dục cộng đồng.</p>

    <div class="action-bar">
      <button @click="addNewProgram" class="btn primary">Thêm Chương trình Mới</button>
    </div>

    <div v-if="mockCourses.length" class="programs-table">
      <table>
        <thead>
          <tr>
            <th>Tên Chương trình</th>
            <th>Đối tượng</th>
            <th>Địa điểm</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="program in mockCourses" :key="program.id">
            <td>{{ program.name }}</td>
            <td>{{ program.targetAudience.join(', ') }}</td>
            <td>{{ program.location }}</td>
            <td>{{ formatDate(program.startDate) }}</td>
            <td>{{ formatDate(program.endDate) }}</td>
            <td>
              <button @click="editProgram(program.id)" class="btn secondary small">Sửa</button>
              <button @click="deleteProgram(program.id)" class="btn danger small">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="status-message">
      Hiện chưa có chương trình nào.
    </div>
  </div>
</template>

<script setup>
import { mockCourses } from '@/data/mockData'

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('vi-VN', options)
}

const addNewProgram = () => {
  alert('Chức năng thêm chương trình mới sẽ được phát triển.')
}

const editProgram = (id) => {
  alert(`Chức năng sửa chương trình ${id} sẽ được phát triển.`) 
}

const deleteProgram = (id) => {
  if (confirm(`Bạn có chắc chắn muốn xóa chương trình ${id} này không?`)) {
    alert(`Chức năng xóa chương trình ${id} sẽ được phát triển.`) 
  }
}
</script>

<style scoped>
.admin-community-programs-container {
  width: 100%;
  padding: var(--spacing-lg);
  text-align: center;
}

.admin-community-programs-container h1 {
  font-size: var(--font-size-h2);
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-sm);
}

.admin-community-programs-container p {
  font-size: var(--font-size-lg);
  color: var(--text-color-secondary);
  margin-bottom: var(--spacing-xl);
}

.action-bar {
  margin-bottom: var(--spacing-lg);
  text-align: right;
}

.programs-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: var(--spacing-md);
  box-shadow: var(--shadow-1);
  border-radius: var(--border-radius-md);
  overflow: hidden; /* Ensures rounded corners apply to table */
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
