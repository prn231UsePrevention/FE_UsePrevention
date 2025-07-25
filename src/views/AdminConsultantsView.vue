<template>
  <div class="admin-consultants-container card">
    <h1>Quản lý Chuyên viên Tư vấn</h1>
    <p>Thêm, chỉnh sửa hoặc xóa thông tin các chuyên viên tư vấn.</p>

    <div class="action-bar">
      <input v-model="searchQuery" type="text" placeholder="Tìm kiếm theo tên chuyên viên..." class="search-input" />
      <button @click="openAddModal" class="btn primary">Thêm Chuyên viên Mới</button>
    </div>

    <div v-if="filteredConsultants.length" class="consultants-table">
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
          <tr v-for="consultant in filteredConsultants" :key="consultant.id">
            <td>
              <span @click="viewConsultant(consultant)" class="consultant-link">{{ consultant.fullName || 'Chuyên viên #' + consultant.id }}</span>
            </td>
            <td>{{ consultant.specialty }}</td>
            <td>{{ consultant.degree }}</td>
            <td>
              <button @click="openEditModal(consultant)" class="btn secondary small">Sửa</button>
              <button @click="deleteConsultant(consultant)" class="btn danger small">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="status-message">
      Hiện chưa có chuyên viên tư vấn nào.
    </div>

    <!-- Modal Thêm/Sửa -->
    <div v-if="modal.visible && (modal.mode === 'add' || modal.mode === 'edit')" class="modal-overlay">
      <div class="modal-content card">
        <h2>{{ modal.mode === 'add' ? 'Thêm Chuyên viên' : 'Sửa Chuyên viên' }}</h2>
        <button class="modal-close" @click="closeModal">×</button>
        <form @submit.prevent="modal.mode === 'add' ? submitAdd() : submitEdit()">
          <label>User ID:
            <input v-model="modal.form.userId" type="number" required />
          </label>
          <label>Bằng cấp:
            <input v-model="modal.form.degree" type="text" required />
          </label>
          <label>Chuyên môn:
            <input v-model="modal.form.specialty" type="text" required />
          </label>
          <label>Lịch làm việc:
            <input v-model="modal.form.workSchedule" type="text" required />
          </label>
          <div v-if="modal.error" style="color:red">{{ modal.error }}</div>
          <button type="submit" class="btn primary" :disabled="modal.loading">
            {{ modal.loading ? 'Đang lưu...' : 'Lưu' }}
          </button>
          <button type="button" class="btn" @click="closeModal" style="margin-left:1rem">Hủy</button>
        </form>
      </div>
    </div>

    <!-- Modal Chi tiết -->
    <div v-if="modal.visible && modal.mode === 'view'" class="modal-overlay">
      <div class="modal-content card">
        <h2>Chi tiết Chuyên viên</h2>
        <button class="modal-close" @click="closeModal">×</button>
        <div v-if="modal.loading">Đang tải...</div>
        <div v-else>
          <div><strong>ID:</strong> {{ modal.form.id }}</div>
          <div><strong>User ID:</strong> {{ modal.form.userId }}</div>
          <div><strong>Tên:</strong> {{ modal.form.fullName }}</div>
          <div><strong>Bằng cấp:</strong> {{ modal.form.degree }}</div>
          <div><strong>Chuyên môn:</strong> {{ modal.form.specialty }}</div>
          <div><strong>Lịch làm việc:</strong> {{ modal.form.workSchedule }}</div>
        </div>
        <button class="btn" @click="closeModal" style="margin-top:1rem">Đóng</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const consultants = ref([])
const isLoading = ref(false)
const error = ref('')

const modal = ref({
  visible: false,
  mode: '', // 'add' | 'edit' | 'view'
  form: {},
  loading: false,
  error: ''
})

const searchQuery = ref('')
const filteredConsultants = computed(() => {
  if (!searchQuery.value.trim()) return consultants.value
  return consultants.value.filter(c =>
    (c.fullName || '').toLowerCase().includes(searchQuery.value.trim().toLowerCase())
  )
})

async function fetchConsultants() {
  isLoading.value = true
  error.value = ''
  try {
    const res = await fetch('https://localhost:7233/api/Consultant')
    if (!res.ok) throw new Error('Không lấy được danh sách chuyên viên')
    let data = await res.json()
    if (!Array.isArray(data)) data = [data]
    for (const c of data) {
      if (c.userId) {
        try {
          const userRes = await fetch(`https://localhost:7233/api/Users/${c.userId}`)
          if (userRes.ok) {
            const user = await userRes.json()
            c.fullName = user.fullName || ''
          }
        } catch {}
      }
    }
    consultants.value = data
  } catch (e) {
    error.value = e.message || 'Lỗi kết nối server'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchConsultants)

function openAddModal() {
  modal.value = {
    visible: true,
    mode: 'add',
    form: { userId: '', degree: '', specialty: '', workSchedule: '' },
    loading: false,
    error: ''
  }
}

function openEditModal(consultant) {
  modal.value = {
    visible: true,
    mode: 'edit',
    form: { ...consultant },
    loading: false,
    error: ''
  }
}

function viewConsultant(consultant) {
  modal.value = {
    visible: true,
    mode: 'view',
    form: { ...consultant },
    loading: false,
    error: ''
  }
  // Optionally, fetch latest detail by id if needed
}

function closeModal() {
  modal.value.visible = false
}

async function submitAdd() {
  modal.value.loading = true
  modal.value.error = ''
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('https://localhost:7233/api/Consultant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        userId: Number(modal.value.form.userId),
        degree: modal.value.form.degree,
        specialty: modal.value.form.specialty,
        workSchedule: modal.value.form.workSchedule
      })
    })
    if (!res.ok) throw new Error('Thêm chuyên viên thất bại!')
    await fetchConsultants()
    closeModal()
  } catch (e) {
    modal.value.error = e.message || 'Lỗi khi thêm chuyên viên.'
  } finally {
    modal.value.loading = false
  }
}

async function submitEdit() {
  modal.value.loading = true
  modal.value.error = ''
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`https://localhost:7233/api/Consultant/${modal.value.form.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        id: modal.value.form.id,
        userId: Number(modal.value.form.userId),
        degree: modal.value.form.degree,
        specialty: modal.value.form.specialty,
        workSchedule: modal.value.form.workSchedule
      })
    })
    if (!res.ok) throw new Error('Sửa chuyên viên thất bại!')
    await fetchConsultants()
    closeModal()
  } catch (e) {
    modal.value.error = e.message || 'Lỗi khi sửa chuyên viên.'
  } finally {
    modal.value.loading = false
  }
}

async function deleteConsultant(consultant) {
  if (!confirm(`Bạn có chắc chắn muốn xóa chuyên viên ${consultant.fullName || consultant.id} này không?`)) return
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`https://localhost:7233/api/Consultant/${consultant.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    if (!res.ok) throw new Error('Xóa chuyên viên thất bại!')
    await fetchConsultants()
  } catch (e) {
    alert(e.message || 'Lỗi khi xóa chuyên viên.')
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
.consultant-link {
  color: #1976d2;
  cursor: pointer;
  text-decoration: underline;
}
.consultant-link:hover {
  color: #0d47a1;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  padding: 2.2rem 2.5rem 2rem 2.5rem;
  border-radius: 16px;
  min-width: 350px;
  max-width: 95vw;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
}
.modal-content h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1976d2;
  text-align: center;
}
.modal-content form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  align-items: stretch;
}
.modal-content label {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-weight: 500;
  color: #333;
  font-size: 1rem;
}
.modal-content input[type="number"],
.modal-content input[type="text"] {
  width: 100%;
  padding: 0.5rem 0.7rem;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 1rem;
  margin-top: 0.3rem;
  transition: border 0.2s;
}
.modal-content input[type="number"]:focus,
.modal-content input[type="text"]:focus {
  border: 1.5px solid #1976d2;
  outline: none;
}
.modal-content button[type="submit"].btn.primary {
  min-width: 100px;
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  background: #1976d2;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 0.5rem;
}
.modal-content button[type="submit"].btn.primary:disabled {
  background: #b0b0b0;
  color: #fff;
  cursor: not-allowed;
}
.modal-content button.btn {
  min-width: 100px;
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  background: #e0e0e0;
  color: #333;
  margin-left: 0;
  margin-top: 0.5rem;
  transition: background 0.2s;
}
.modal-content button.btn:hover {
  background: #d0d0d0;
}
.modal-close {
  position: absolute;
  top: 12px;
  right: 18px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #888;
  cursor: pointer;
  transition: color 0.2s;
}
.modal-close:hover {
  color: #1976d2;
}
@media (max-width: 600px) {
  .modal-content {
    padding: 1.2rem 0.7rem 1rem 0.7rem;
    min-width: 0;
  }
  .modal-content h2 {
    font-size: 1.1rem;
  }
}
.search-input {
  padding: 0.5rem 1rem;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 1rem;
  margin-right: 1rem;
  min-width: 220px;
  max-width: 350px;
}
</style>
