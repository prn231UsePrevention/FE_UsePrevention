<template>
  <div class="user-home-container">
    <div class="header-section">
      <h1>Khám phá các Chương trình Cộng đồng</h1>
      <p>Tìm kiếm và tham gia các hoạt động ý nghĩa.</p>
    </div>

    <!-- Search and Filter Bar -->
    <div class="filter-bar card">
      <input type="text" v-model="searchQuery" placeholder="Tìm kiếm chương trình theo tên..." class="search-input" />
      <select v-model="audienceFilter" class="filter-select">
        <option value="">Tất cả đối tượng</option>
        <option value="Học sinh">Học sinh</option>
        <option value="Sinh viên">Sinh viên</option>
        <option value="Phụ huynh">Phụ huynh</option>
        <option value="Giáo viên">Giáo viên</option>
      </select>
    </div>

    <!-- Programs Grid -->
    <div v-if="filteredPrograms.length" class="programs-grid">
      <div v-for="program in filteredPrograms" :key="program.id" class="program-card card">
        <div class="program-card-header">
          <h3>{{ program.name }}</h3>
        </div>
        <div class="program-card-body">
          <p><strong>Đối tượng:</strong> {{ program.targetAudience.join(', ') }}</p>
          <p><strong>Địa điểm:</strong> {{ program.location }}</p>
          <p><strong>Thời gian:</strong> {{ new Date(program.startDate).toLocaleDateString() }} - {{ new Date(program.endDate).toLocaleDateString() }}</p>
        </div>
        <div class="program-card-footer">
          <router-link :to="`/community-programs/${program.id}`" class="btn primary">Xem chi tiết</router-link>
        </div>
      </div>
    </div>

    <!-- No Results Message -->
    <div v-if="!filteredPrograms.length" class="status-message card">
      Không tìm thấy chương trình nào phù hợp.
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { mockCourses } from '@/data/mockData'

const programs = ref(mockCourses)
const searchQuery = ref('')
const audienceFilter = ref('')

const filteredPrograms = computed(() => {
  let filtered = programs.value

  if (searchQuery.value) {
    filtered = filtered.filter(program =>
      program.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (audienceFilter.value) {
    filtered = filtered.filter(program =>
      program.targetAudience.includes(audienceFilter.value)
    )
  }

  return filtered
})
</script>

<style scoped>
.user-home-container {
  width: 100%;
  padding: var(--spacing-lg);
}

.header-section {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.header-section h1 {
  font-size: var(--font-size-h2);
  color: var(--text-color-primary);
}

.header-section p {
  font-size: var(--font-size-lg);
  color: var(--text-color-secondary);
}

.filter-bar {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-1);
}

.search-input,
.filter-select {
  padding: var(--spacing-sm);
  font-size: var(--font-size-md);
  border: 1px solid #ccc;
  border-radius: var(--border-radius-sm);
}

.search-input {
  width: 40%;
}

.filter-select {
  width: 20%;
}

.status-message {
  text-align: center;
  font-size: var(--font-size-lg);
  color: var(--text-color-secondary);
  padding: var(--spacing-xl);
}

.programs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.program-card {
  background: var(--surface-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-2);
  overflow: hidden;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.program-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-3);
}

.program-card-header {
  background-color: var(--primary-color);
  color: var(--surface-color);
  padding: var(--spacing-md);
}

.program-card-header h3 {
  margin: 0;
  font-size: var(--font-size-xl);
  color: inherit;
}

.program-card-body {
  padding: var(--spacing-md);
}

.program-card-body p {
  margin: var(--spacing-xs) 0;
  color: var(--text-color-secondary);
  font-size: var(--font-size-sm);
}

.program-card-footer {
  padding: var(--spacing-md);
  text-align: right;
  border-top: 1px solid var(--background-color);
}

.btn-details {
  background-color: var(--primary-color);
  color: var(--surface-color);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  box-shadow: var(--shadow-1);
}

.btn-details:hover {
  background-color: var(--primary-dark);
  box-shadow: var(--shadow-2);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    align-items: center;
  }
  .search-input,
  .filter-select {
    width: 80%;
  }
}
</style>
