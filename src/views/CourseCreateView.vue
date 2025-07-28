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
    const newCourse = await coursesStore.createCourse(courseData)
    // Redirect to the edit page of the newly created course
    router.push(`/admin/courses/edit/${newCourse.id}`)
  } catch (error) {
    console.error('Error creating course:', error)
    // You might want to show an error toast here
  }
}

const handleCancel = () => {
  router.push('/courses')
}
</script> 