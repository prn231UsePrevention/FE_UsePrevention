<template>
  <div class="survey-container">
    <h1>Các Bài Khảo Sát Đánh Giá Nguy Cơ</h1>
    <p>Hoàn thành các bài khảo sát để xác định mức độ nguy cơ và nhận đề xuất phù hợp.</p>

    <div v-if="mockSurveys.length" class="survey-grid">
      <div v-for="survey in mockSurveys" :key="survey.id" class="survey-card card">
        <h3>{{ survey.name }}</h3>
        <p>{{ survey.description }}</p>
        <button @click="startSurvey(survey.id)" class="btn primary">Bắt đầu Khảo sát</button>
      </div>
    </div>
    <div v-else class="status-message card">
      Hiện chưa có bài khảo sát nào.
    </div>
  </div>
</template>

<script setup>
import { mockSurveys } from '@/data/mockData'

const startSurvey = (surveyId) => {
  // In a real application, this would navigate to a detailed survey page
  // For now, just log the survey ID
  console.log(`Starting survey with ID: ${surveyId}`)
  alert(`Bạn đã chọn khảo sát: ${mockSurveys.find(s => s.id === surveyId).name}. Chức năng này sẽ được phát triển chi tiết sau.`)
}
</script>

<style scoped>
.survey-container {
  width: 100%;
  padding: var(--spacing-lg);
  text-align: center;
}

.survey-container h1 {
  font-size: var(--font-size-h2);
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-sm);
}

.survey-container p {
  font-size: var(--font-size-lg);
  color: var(--text-color-secondary);
  margin-bottom: var(--spacing-xl);
}

.survey-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  max-width: 900px;
  margin: 0 auto;
}

.survey-card {
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

.survey-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-3);
}

.survey-card h3 {
  font-size: var(--font-size-xl);
  color: var(--primary-color);
  margin-bottom: var(--spacing-md);
}

.survey-card p {
  font-size: var(--font-size-md);
  color: var(--text-color-secondary);
  flex-grow: 1;
  margin-bottom: var(--spacing-lg);
}

.btn-start-survey {
  background-color: var(--success-color);
  color: var(--surface-color);
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  box-shadow: var(--shadow-1);
}

.btn-start-survey:hover {
  background-color: darken(var(--success-color), 10%);
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

