<template>
  <div class="consultant-booking-container">
    <h1>Đặt Lịch Hẹn Trực Tuyến với Chuyên viên Tư vấn</h1>
    <p>Chọn chuyên viên bạn muốn tư vấn và đặt lịch hẹn phù hợp.</p>

    <div v-if="mockConsultants.length" class="consultant-grid">
      <div v-for="consultant in mockConsultants" :key="consultant.id" class="consultant-card card">
        <h3>{{ consultant.name }}</h3>
        <p><strong>Chuyên môn:</strong> {{ consultant.specialization }}</p>
        <p><strong>Bằng cấp:</strong> {{ consultant.degree }}</p>
        <p class="bio">{{ consultant.bio }}</p>
        <button @click="viewConsultantDetails(consultant.id)" class="btn primary">Xem Lịch & Đặt hẹn</button>
      </div>
    </div>
    <div v-else class="status-message card">
      Hiện chưa có chuyên viên tư vấn nào.
    </div>
  </div>
</template>

<script setup>
import { mockConsultants } from '@/data/mockData'
import { useRouter } from 'vue-router'

const router = useRouter()

const viewConsultantDetails = (consultantId) => {
  // In a real application, this would navigate to a detailed consultant page
  // For now, just log the consultant ID
  console.log(`Viewing details for consultant with ID: ${consultantId}`)
  alert(`Bạn đã chọn chuyên viên: ${mockConsultants.find(c => c.id === consultantId).name}. Chức năng đặt lịch hẹn sẽ được phát triển chi tiết sau.`)
}
</script>

<style scoped>
.consultant-booking-container {
  width: 100%;
  padding: var(--spacing-lg);
  text-align: center;
}

.consultant-booking-container h1 {
  font-size: var(--font-size-h2);
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-sm);
}

.consultant-booking-container p {
  font-size: var(--font-size-lg);
  color: var(--text-color-secondary);
  margin-bottom: var(--spacing-xl);
}

.consultant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  max-width: 900px;
  margin: 0 auto;
}

.consultant-card {
  background: var(--surface-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-2);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.consultant-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-3);
}

.consultant-card h3 {
  font-size: var(--font-size-xl);
  color: var(--primary-color);
  margin-bottom: var(--spacing-md);
}

.consultant-card p {
  font-size: var(--font-size-md);
  color: var(--text-color-secondary);
  margin-bottom: var(--spacing-xs);
}

.consultant-card .bio {
  font-style: italic;
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  margin-top: var(--spacing-md);
  flex-grow: 1;
}

.btn-details {
  background-color: var(--primary-color);
  color: var(--surface-color);
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  box-shadow: var(--shadow-1);
  margin-top: var(--spacing-md);
}

.btn-details:hover {
  background-color: var(--primary-dark);
  box-shadow: var(--shadow-2);
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

