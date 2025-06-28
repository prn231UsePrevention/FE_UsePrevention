<template>
  <div class="container mx-auto py-8 max-w-2xl">
    <h1 class="text-2xl font-bold mb-6 text-center">Tạo mới khóa học</h1>
    <CourseForm @submit="handleCreate" @cancel="handleCancel" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'
import CourseForm from '@/components/CourseForm.vue'

const router = useRouter()
const coursesStore = useCoursesStore()

const handleCreate = async (courseData) => {
  try {
    await coursesStore.createCourse(courseData)
    router.push('/courses')
  } catch {
    // handle error
  }
}

const handleCancel = () => {
  router.push('/courses')
}
</script> 