<template>Add commentMore actions
  <div class="community-programs">
    <h2>Danh sách chương trình cộng đồng</h2>
    <button v-if="isAdmin" class="add-btn" @click="openFormModal()">Thêm chương trình mới</button>
    <div class="event-list">
      <div
        v-for="event in programs.filter(p => p && p.name)"
        :key="event.id"
        class="event-card"
        @click="openModal(event)"
      >
        <img v-if="event.imgUrl" :src="event.imgUrl" alt="Ảnh chương trình" class="event-img" />
        <div class="event-title">
          {{ event.name }}
        </div>
      </div>
    </div>
    <div v-if="programs.filter(p => p && p.name).length === 0">Không có dữ liệu</div>
    <div v-if="error" style="color:red">{{ error }}</div>

    <!-- Modal chi tiết -->
    <div v-if="selectedEvent && !showForm && programs.some(p => p.id === selectedEvent.id)" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="modal-close" @click="closeModal">×</button>
        <h3>{{ selectedEvent.name }}</h3>
        <img v-if="selectedEvent.imgUrl" :src="selectedEvent.imgUrl" alt="Ảnh chương trình" class="event-img-modal" style="max-width: 100%; margin-bottom: 1rem; border-radius: 8px;" />
        <div class="detail-row"><span class="detail-label">Mô tả:</span>{{ selectedEvent.description }}</div>
        <div class="detail-row"><span class="detail-label">Bắt đầu:</span>{{ formatDate(selectedEvent.startDate, true) }}</div>
        <div class="detail-row"><span class="detail-label">Kết thúc:</span>{{ formatDate(selectedEvent.endDate, true) }}</div>
        <!-- User: Tham gia chương trình -->
        <div v-if="!isAdmin">
          <button v-if="joinedStatus === false && canJoinProgram" :disabled="loadingJoin" @click="openJoinModal(selectedEvent.id)">
            {{ loadingJoin ? 'Đang tham gia...' : 'Tham gia chương trình' }}
          </button>
          <div v-else-if="joinedStatus && joinedStatus.joinedAt">
            <span style="color: #43a047; font-weight: 600;">Đã tham gia ngày {{ formatDate(joinedStatus.joinedAt) }}</span>
          </div>
        </div>
        <!-- Admin: Danh sách người tham gia -->
        <div v-if="isAdmin">
          <h4 style="margin-top:1.2rem; color:#1976d2;">Danh sách người tham gia</h4>
          <div v-if="loadingParticipants">Đang tải...</div>
          <table v-else style="width:100%; margin-top:0.5rem; border-collapse:collapse;">
            <thead>
              <tr style="background:#e3f0ff;">
                <th style="padding:0.5rem; border:1px solid #b0c6e8;">Tên</th>
                <th style="padding:0.5rem; border:1px solid #b0c6e8;">Email</th>
                <th style="padding:0.5rem; border:1px solid #b0c6e8;">Ngày tham gia</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in participants" :key="p.id">
                <td style="padding:0.5rem; border:1px solid #b0c6e8;">{{ p.userName }}</td>
                <td style="padding:0.5rem; border:1px solid #b0c6e8;">{{ p.userEmail }}</td>
                <td style="padding:0.5rem; border:1px solid #b0c6e8;">{{ formatDate(p.joinedAt) }}</td>
              </tr>
              <tr v-if="participants.length === 0">
                <td colspan="3" style="text-align:center; color:#888;">Chưa có ai tham gia</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="isAdmin" class="modal-actions">
          <button @click="openFormModal(selectedEvent)">Chỉnh sửa</button>
          <button @click="removeProgram(selectedEvent.id)">Xóa</button>
        </div>
      </div>
    </div>

    <!-- Modal form thêm/sửa -->
    <div v-if="showForm" class="modal-overlay" @click.self="closeFormModal">
      <div class="modal-content">
        <button class="modal-close" @click="closeFormModal">×</button>
        <h3>{{ formMode === 'add' ? 'Thêm chương trình mới' : 'Chỉnh sửa chương trình' }}</h3>
        <form @submit.prevent="formMode === 'add' ? addProgram() : updateProgram()" style="width:100%">
          <div class="form-row">
            <div class="form-col">
              <label for="name">Tên chương trình</label>
              <input id="name" v-model="form.name" placeholder="Tên chương trình" required />
            </div>
            <div class="form-col">
              <label for="desc">Mô tả</label>
              <input id="desc" v-model="form.description" placeholder="Mô tả" required />
            </div>
          </div>
          <label for="start">Bắt đầu</label>
          <input id="start" v-model="form.startDate" type="datetime-local" required />
          <label for="end">Kết thúc</label>
          <input id="end" v-model="form.endDate" type="datetime-local" required />
          <div class="modal-actions">
            <button type="submit">{{ formMode === 'add' ? 'Thêm' : 'Cập nhật' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal nhập survey -->
    <div v-if="showJoinModal" class="modal-overlay" @click.self="closeJoinModal">
      <div class="modal-content">
        <button class="modal-close" @click="closeJoinModal">×</button>
        <h3>Tham gia chương trình</h3>
        <form @submit.prevent="submitJoinProgram">
          <label>Pre Survey</label>
          <input v-model="joinForm.preSurvey" required placeholder="Nhập preSurvey" />
          <label>Post Survey</label>
          <input v-model="joinForm.postSurvey" required placeholder="Nhập postSurvey" />
          <div class="modal-actions">
            <button type="submit" :disabled="loadingJoin">Xác nhận</button>
            <button type="button" @click="closeJoinModal">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';
import { useAuthStore } from '@/stores/auth';
import {
  getAllCommunityPrograms,
  createCommunityProgram,
  updateCommunityProgram,
  deleteCommunityProgram
} from '../services/communityProgramService';
import {
  joinProgram,
  getParticipantsByProgram
} from '../services/participationService';
import { getAllUsers } from '../services/userService';

const authStore = useAuthStore();
const isAdmin = computed(() => authStore.userRole === 'admin');
const canJoinProgram = computed(() => ['user', 'customer'].includes(authStore.userRole));

const programs = ref([]);
const error = ref('');
const form = ref({ name: '', description: '', startDate: '', endDate: '' });
const selectedEvent = ref(null);
const showForm = ref(false);
const formMode = ref('add'); // 'add' hoặc 'edit'
const joinedStatus = ref(null); // null: chưa kiểm tra, false: chưa tham gia, object: đã tham gia
const participants = ref([]); // admin: danh sách người tham gia
const loadingJoin = ref(false);
const loadingParticipants = ref(false);
const showJoinModal = ref(false);
const joinForm = ref({ preSurvey: '', postSurvey: '' });
const joinProgramId = ref(null);

const fetchPrograms = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await getAllCommunityPrograms(token);
    programs.value = Array.isArray(res.data) ? res.data.filter(p => p && typeof p === 'object') : [];
    error.value = '';
  } catch (err) {
    error.value = err.response?.data?.message || 'Lỗi tải dữ liệu!';
    programs.value = [];
  }
};

async function checkParticipation(programId) {
  if (!programId) return;
  joinedStatus.value = null;
  try {
    const token = localStorage.getItem('token');
    const res = await import('../services/participationService').then(m => m.getMyParticipations(token));
    const found = Array.isArray(res.data) ? res.data.find(p => p.programId === programId) : null;
    joinedStatus.value = found || false;
  } catch (err) {
    joinedStatus.value = false;
  }
}

async function handleJoinProgram(programId) {
  loadingJoin.value = true;
  try {
    const token = localStorage.getItem('token');
    await joinProgram(programId, token, '', '');
    await checkParticipation(programId);
    fetchPrograms();
    alert('Tham gia thành công!');
  } catch (err) {
    alert(err.response?.data?.message || 'Lỗi tham gia chương trình!');
  } finally {
    loadingJoin.value = false;
  }
}

async function fetchParticipants(programId) {
  if (!programId) return;
  loadingParticipants.value = true;
  try {
    const token = localStorage.getItem('token');
    const [res, usersRes] = await Promise.all([
      getParticipantsByProgram(programId, token),
      getAllUsers(token)
    ]);
    const users = Array.isArray(usersRes.data) ? usersRes.data : [];
    participants.value = Array.isArray(res.data)
      ? res.data.map(p => {
          const user = users.find(u => Number(u.id) === Number(p.userId)) || {};
          return {
            ...p,
            userName: user.fullName || '',
            userEmail: user.email || ''
          };
        })
      : [];
  } catch (err) {
    participants.value = [];
  } finally {
    loadingParticipants.value = false;
  }
}

function openModal(event) {
  selectedEvent.value = event;
  showForm.value = false;
  checkParticipation(event.id);
  if (isAdmin.value) fetchParticipants(event.id);
}
function closeModal() {
  selectedEvent.value = null;
  joinedStatus.value = null;
  participants.value = [];
}

function openFormModal(event = null) {
  showForm.value = true;
  if (event) {
    formMode.value = 'edit';
    form.value = {
      id: event.id,
      name: event.name,
      description: event.description,
      startDate: toDatetimeLocal(event.startDate),
      endDate: toDatetimeLocal(event.endDate)
    };
  } else {
    formMode.value = 'add';
    form.value = { name: '', description: '', startDate: '', endDate: '' };
  }
}
function closeFormModal() {
  showForm.value = false;
  if (formMode.value === 'edit') selectedEvent.value = null;
}

const toUTCISOString = (localStr) => {
  if (!localStr) return '';
  const d = new Date(localStr);
  // Cộng thêm offset để giữ nguyên giờ VN khi lưu UTC
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
};

const addProgram = async () => {
  try {
    const token = localStorage.getItem('token');
    const data = {
      ...form.value,
      startDate: toUTCISOString(form.value.startDate),
      endDate: toUTCISOString(form.value.endDate)
    };
    await createCommunityProgram(data, token);
    closeFormModal();
    fetchPrograms();
  } catch (err) {
    error.value = err.response?.data?.message || 'Lỗi thêm chương trình!';
  }
};

const updateProgram = async () => {
  try {
    const token = localStorage.getItem('token');
    const data = {
      name: form.value.name,
      description: form.value.description,
      startDate: toUTCISOString(form.value.startDate),
      endDate: toUTCISOString(form.value.endDate)
    };
    await updateCommunityProgram(form.value.id, data, token);
    closeFormModal();
    fetchPrograms();
  } catch (err) {
    error.value = err.response?.data?.message || 'Lỗi cập nhật chương trình!';
  }
};

const removeProgram = async (id) => {
  if (!confirm('Bạn chắc chắn muốn xóa?')) return;
  try {
    const token = localStorage.getItem('token');
    await deleteCommunityProgram(id, token);
    // Reset state để tránh fetch lại dữ liệu đã xóa
    selectedEvent.value = null;
    participants.value = [];
    joinedStatus.value = null;
    showForm.value = false;
    fetchPrograms();
  } catch (err) {
    error.value = err.response?.data?.message || 'Lỗi xóa chương trình!';
  }
};

function formatDate(dateStr, isTable = false) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isTable) {
    // yyyy-MM-dd HH:mm:ss.SSS
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0') + ' ' +
      String(d.getHours()).padStart(2, '0') + ':' +
      String(d.getMinutes()).padStart(2, '0') + ':' +
      String(d.getSeconds()).padStart(2, '0') + '.' +
      String(d.getMilliseconds()).padStart(3, '0');
  }
  return d.toLocaleString('vi-VN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
}

// Chuyển ISO string sang format cho input datetime-local
function toDatetimeLocal(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 19);
}

function openJoinModal(programId) {
  joinProgramId.value = programId;
  joinForm.value = { preSurvey: '', postSurvey: '' };
  showJoinModal.value = true;
}
function closeJoinModal() {
  showJoinModal.value = false;
  joinProgramId.value = null;
}

async function submitJoinProgram() {
  loadingJoin.value = true;
  try {
    const token = localStorage.getItem('token');
    await joinProgram(joinProgramId.value, token, joinForm.value.preSurvey, joinForm.value.postSurvey);
    await checkParticipation(joinProgramId.value);
    fetchPrograms();
    alert('Tham gia thành công!');
    closeJoinModal();
  } catch (err) {
    alert(err.response?.data?.message || 'Lỗi tham gia chương trình!');
  } finally {
    loadingJoin.value = false;
  }
}

fetchPrograms();
</script>

<style scoped>
.community-programs {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
.add-btn {
  background: #2196f3;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 2rem;
  font-weight: 600;
  font-size: 1.08rem;
  cursor: pointer;
  margin-bottom: 1.2rem;
  box-shadow: 0 2px 12px #2196f322;
  transition: background 0.2s, box-shadow 0.2s, color 0.2s;
  display: block;
}
.add-btn:hover {
  background: #1769aa;
  color: #fff;
  box-shadow: 0 4px 18px #2196f344;
}
.event-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;
  margin: 1.5rem 0;
}
@media (max-width: 900px) {
  .event-list {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .event-list {
    grid-template-columns: 1fr;
  }
}
.event-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px #4f8cff11;
  padding: 1rem;
  cursor: pointer;
  transition: box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 120px;
}
.event-card:hover {
  box-shadow: 0 4px 16px #4f8cff22;
}
.event-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2196f3;
  text-align: center;
  width: 100%;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.event-details {
  margin-top: 0.7rem;
  color: #222;
  font-size: 1rem;
}
/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  border-radius: 16px;
  padding: 2.2rem 2.7rem 2rem 2.7rem;
  min-width: 340px;
  max-width: 95vw;
  box-shadow: 0 8px 32px #0003;
  position: relative;
  animation: fadeInModal 0.2s;
  color: #222;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.modal-content h3 {
  color: #2196f3;
  font-size: 1.45rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  width: 100%;
  text-align: center;
}
.modal-content label {
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #2196f3;
  display: block;
}
.modal-content input {
  margin-bottom: 1.1rem !important;
  padding: 0.7rem 1rem !important;
  border-radius: 8px !important;
  border: 1.5px solid #b0c6e8 !important;
  width: 100% !important;
  font-size: 1.08rem !important;
  background: #f7faff !important;
  transition: border 0.2s, background 0.2s;
}
.modal-content input:focus {
  border: 1.5px solid #2196f3 !important;
  background: #f0f7ff !important;
}
.modal-content .modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.2rem;
  width: 100%;
  justify-content: flex-end;
}
.modal-content button[type="submit"],
.modal-content .modal-actions button {
  background: #2196f3;
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 0.8rem 1.5rem;
  font-weight: 600;
  font-size: 1.05rem;
  cursor: pointer;
  transition: background 0.2s;
}
.modal-content .modal-actions button:last-child {
  background: #e53935;
}
.modal-content .modal-actions button:hover {
  background: #1769aa;
}
.modal-content .modal-actions button:last-child:hover {
  background: #b71c1c;
}
.modal-close {
  position: absolute;
  top: 0.7rem;
  right: 1.1rem;
  background: none;
  border: none;
  font-size: 2rem;
  color: #888;
  cursor: pointer;
  transition: color 0.2s;
}
.modal-close:hover {
  color: #2196f3;
}
/* Detail modal info */
.modal-content .detail-label {
  color: #2196f3;
  font-weight: 600;
  margin-right: 0.3rem;
}
.modal-content .detail-row {
  margin-bottom: 0.7rem;
  font-size: 1.08rem;
}
.community-programs h2 {
  color: #111;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
}
/* Form row for 2 inputs ngang hàng */
.form-row {
  display: flex;
  gap: 1.2rem;
  width: 100%;
  margin-bottom: 1.1rem;
}
.form-col {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
}
@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
    gap: 0.5rem;
  }
}
.event-img {
  width: 100%;
  max-height: 140px;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
  margin-bottom: 0.5rem;
  background: #f7f7f7;
}
.event-img-modal {
  width: 100%;
  max-height: 260px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: #f7f7f7;
}
</style> 