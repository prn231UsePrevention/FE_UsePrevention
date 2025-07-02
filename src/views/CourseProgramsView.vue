<template>
  <div class="course-list">
    <h2>Danh sách các khóa học</h2>
    <div class="courses">
      <div v-for="course in coursesStore.courses" :key="course.id" class="course-card" @click="goToDetail(course.id)" style="cursor:pointer;">
        <img :src="course.imageUrl || course.image" :alt="course.title || course.name" class="course-image" />
        <h3>{{ course.title || course.name }}</h3>
        <p>{{ course.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'

const router = useRouter()
const coursesStore = useCoursesStore()

function goToDetail(id) {
  router.push(`/courses/${id}`)
}

onMounted(() => {
  coursesStore.fetchCourses()
})
</script>

<style scoped>
.course-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 16px;
  font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
}
.courses {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 600px) {
  .courses {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .courses {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1200px) {
  .courses {
    grid-template-columns: repeat(4, 1fr);
  }
}
.course-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 12px;
  width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.2s, transform 0.2s;
  font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
}
.course-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  transform: translateY(-4px) scale(1.03);
}
.course-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
}
.course-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2196f3;
  margin: 8px 0 4px 0;
  letter-spacing: 0.5px;
  transition: color 0.2s;
  text-align: center;
}
.course-card:hover h3 {
  color: #1769aa;
}
.course-card p {
  font-size: 1rem;
  color: #555;
  margin: 0 0 4px 0;
  text-align: center;
  font-weight: 400;
  line-height: 1.5;
}
.detail-link {
  display: inline-block;
  margin-top: 10px;
  padding: 8px 16px;
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: background 0.2s;
}
.detail-link:hover {
  background: #369870;
}
</style> 