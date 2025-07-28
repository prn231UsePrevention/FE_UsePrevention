<template>
  <div class="admin-course-detail">
    <div class="page-header">
      <h1>{{ isEditing ? 'Chỉnh sửa khóa học' : 'Tạo khóa học mới' }}</h1>
      <button @click="$router.push('/admin/courses')" class="btn-back">
        ← Quay lại danh sách
      </button>
    </div>

    <div class="content-grid">
      <!-- Course Form Section -->
      <div class="course-form-section">
        <h2>Thông tin khóa học</h2>
        <CourseForm 
          :course="course" 
          :isEditing="isEditing" 
          @submit="handleCourseSubmit" 
          @cancel="$router.push('/admin/courses')" 
        />
      </div>

      <!-- Module Management Section -->
      <div v-if="isEditing" class="module-management-section">
        <h2>Quản lý chương trình học</h2>
        <ModuleManager 
          :courseId="route.params.id" 
          :modules="course?.modules || []" 
          @modules-updated="refreshCourseData" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'
import CourseForm from '@/components/CourseForm.vue'
import ModuleManager from '@/components/ModuleManager.vue'
import { useToast } from 'vue-toastification'
const toast = useToast()

const route = useRoute()
const router = useRouter()
const coursesStore = useCoursesStore()

const course = ref(null)
const isLoading = ref(false)

const isEditing = computed(() => !!route.params.id)

const handleCourseSubmit = async (courseData) => {
  isLoading.value = true
  try {
    if (isEditing.value) {
      await coursesStore.updateCourse(course.value.id, courseData)
      toast.success('Cập nhật khóa học thành công!')
    } else {
      const newCourse = await coursesStore.createCourse(courseData)
      toast.success('Tạo khóa học thành công!')
      router.push(`/admin/courses/edit/${newCourse.id}`)
      return
    }
    await refreshCourseData()
  } catch (error) {
    toast.error('Có lỗi xảy ra khi cập nhật khóa học: ' + (error.response?.data?.message || error.message))
  } finally {
    isLoading.value = false
  }
}

const refreshCourseData = async () => {
  if (isEditing.value) {
    await coursesStore.fetchCourseById(route.params.id)
    course.value = coursesStore.currentCourse
    console.log('Course data loaded:', course.value)
    console.log('Modules:', course.value?.modules)
  }
}

onMounted(async () => {
  if (isEditing.value) {
    await refreshCourseData()
  }
})
</script>

<style scoped>
.admin-course-detail {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  background: transparent;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.page-header h1 {
  margin: 0;
  color: #1f2937;
  font-size: 2rem;
  font-weight: 700;
}

.btn-back {
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s;
}

.btn-back:hover {
  background: #4b5563;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

.course-form-section,
.module-management-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;
  overflow: visible;
  height: auto;
  max-height: none;
}

.course-form-section h2,
.module-management-section h2 {
  margin: 0 0 1rem 0;
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .admin-course-detail {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .page-header h1 {
    font-size: 1.5rem;
  }
}
</style> 