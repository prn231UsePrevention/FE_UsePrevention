<template>
  <div class="container mx-auto py-8 max-w-2xl">
    <h1 class="text-2xl font-bold mb-6 text-center">Chỉnh sửa khóa học</h1>
    <CourseForm :course="course" isEditing @submit="handleUpdate" @cancel="handleCancel" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'
import CourseForm from '@/components/CourseForm.vue'

const router = useRouter()
const route = useRoute()
const coursesStore = useCoursesStore()
const course = ref(null)

onMounted(async () => {
  const id = route.params.id
  await coursesStore.fetchCourseById(id)
  course.value = coursesStore.currentCourse
})

const handleUpdate = async (courseData) => {
  try {
    await coursesStore.updateCourse(course.value.id, courseData)
    router.push('/courses')
  } catch {
    // handle error
  }
}

const handleCancel = () => {
  router.push('/courses')
}
</script> 