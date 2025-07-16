<template>
  <div class="course-detail">
    <CourseDetail :courseId="route.params.id" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import CourseDetail from '@/components/CourseDetail.vue'

const route = useRoute()
</script>

<style scoped>
.course-detail {
  min-height: 100vh;
}
</style> 