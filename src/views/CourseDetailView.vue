<template>
  <div class="container mx-auto py-8 max-w-3xl">
    <CourseDetail :courseId="courseId" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import CourseDetail from '@/components/CourseDetail.vue'

const route = useRoute()
const courseId = route.params.id
</script> 