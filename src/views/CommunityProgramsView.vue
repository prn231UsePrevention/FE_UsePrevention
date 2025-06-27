<template>
  <div class="community-programs-container card">
    <h1>Chương trình Truyền thông & Giáo dục Cộng đồng</h1>
    <p>Khám phá các chương trình và sự kiện sắp tới trong cộng đồng của chúng ta.</p>

    <div v-if="mockCommunityPrograms.length" class="programs-grid">
      <div v-for="program in mockCommunityPrograms" :key="program.id" class="program-card">
        <img :src="program.imageUrl" alt="Program Image" class="program-image" />
        <div class="program-content">
          <h3>{{ program.name }}</h3>
          <p class="program-meta"><strong>Tổ chức:</strong> {{ program.organizer }}</p>
          <p class="program-meta"><strong>Địa điểm:</strong> {{ program.location }}</p>
          <p class="program-meta"><strong>Ngày:</strong> {{ formatDate(program.date) }}</p>
          <p class="program-description">{{ program.description }}</p>
          <button @click="viewProgramDetails(program.id)" class="btn primary">Xem chi tiết</button>
        </div>
      </div>
    </div>
    <div v-else class="status-message">
      Hiện chưa có chương trình cộng đồng nào.
    </div>
  </div>
</template>

<script setup>
import { mockCommunityPrograms } from '@/data/mockData'

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('vi-VN', options)
}

const viewProgramDetails = (programId) => {
  alert(`Xem chi tiết chương trình ${programId}. Chức năng này sẽ được phát triển sau.`)
}
</script>

<style scoped>
.community-programs-container {
  width: 100%;
  padding: var(--spacing-lg);
  text-align: center;
}

.community-programs-container h1 {
  font-size: var(--font-size-h2);
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-sm);
}

.community-programs-container p {
  font-size: var(--font-size-lg);
  color: var(--text-color-secondary);
  margin-bottom: var(--spacing-xl);
}

.programs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  max-width: 900px;
  margin: 0 auto;
}

.program-card {
  background: var(--surface-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-2);
  overflow: hidden;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
}

.program-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-3);
}

.program-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.program-content {
  padding: var(--spacing-md);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.program-content h3 {
  font-size: var(--font-size-xl);
  color: var(--primary-color);
  margin-bottom: var(--spacing-sm);
}

.program-meta {
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  margin-bottom: var(--spacing-xs);
}

.program-description {
  font-size: var(--font-size-md);
  color: var(--text-color-primary);
  margin-top: var(--spacing-md);
  flex-grow: 1;
}

.btn {
  margin-top: var(--spacing-md);
  align-self: flex-end;
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
