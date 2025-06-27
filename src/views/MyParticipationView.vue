<template>
  <div class="my-participation">
    <h2>Chương trình tôi đã tham gia</h2>
    <div v-if="loading">Đang tải...</div>
    <table v-else class="participation-table">
      <thead>
        <tr>
          <th>Tên chương trình</th>
          <th>Ngày tham gia</th>
          <th>Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in participations" :key="p.id">
          <td>{{ p.programName }}</td>
          <td>{{ formatDate(p.joinedAt) }}</td>
          <td><span :class="p.status === 'Approved' ? 'status-approved' : 'status-pending'">{{ p.status }}</span></td>
        </tr>
        <tr v-if="participations.length === 0">
          <td colspan="3" style="text-align:center; color:#888;">Bạn chưa tham gia chương trình nào</td>
        </tr>
      </tbody>
    </table>
    <div v-if="error" style="color:red; margin-top:1rem;">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getMyParticipations } from '../services/participationService';

const participations = ref([]);
const loading = ref(true);
const error = ref('');

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString('vi-VN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
}

onMounted(async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem('token');
    const res = await getMyParticipations(token);
    participations.value = Array.isArray(res.data) ? res.data : [];
    error.value = '';
  } catch (err) {
    error.value = err.response?.data?.message || 'Lỗi tải dữ liệu!';
    participations.value = [];
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.my-participation {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
h2 {
  color: #2196f3;
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
}
.participation-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px #2196f322;
  overflow: hidden;
}
.participation-table th, .participation-table td {
  padding: 0.8rem 1rem;
  border: 1px solid #b0c6e8;
  text-align: left;
}
.participation-table th {
  background: #e3f0ff;
  color: #1976d2;
  font-weight: 600;
}
.status-approved {
  color: #43a047;
  font-weight: 600;
}
.status-pending {
  color: #fbc02d;
  font-weight: 600;
}
</style> 