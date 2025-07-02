<template>
  <div class="course-detail">
    <router-link to="/courses">← Quay lại danh sách</router-link>
    <div v-if="loading">
      <p>Đang tải thông tin khóa học...</p>
    </div>
    <div v-else-if="course">
      <h2>{{ course.title || course.name }}</h2>
      <img :src="course.imageUrl || course.image" :alt="course.title || course.name" class="course-image" />
      <p>{{ course.description }}</p>
      <p><strong>ID:</strong> {{ course.id }}</p>
    </div>
    <div v-else>
      <p>Không tìm thấy khóa học.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'

const route = useRoute()
const coursesStore = useCoursesStore()
const loading = ref(true)

const course = computed(() => coursesStore.currentCourse)

onMounted(async () => {
  loading.value = true
  try {
    await coursesStore.fetchCourseById(route.params.id)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.course-detail {
  max-width: 600px;
  margin: 40px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  padding: 32px;
}
.course-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 16px;
}
</style> 