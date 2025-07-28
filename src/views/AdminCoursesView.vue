<template>
    <div class="admin-courses-wrapper">
        <div class="admin-courses-header">
            <div>
                <h2>Quản Lý Khóa học</h2>
                <p class="admin-courses-desc">Thêm, chỉnh sửa hoặc xóa các khóa học đào tạo online về ma túy.</p>
            </div>
            <button @click="goToCreate" class="add-btn">Thêm khóa học</button>
        </div>
        <div class="admin-courses-table-wrapper">
            <table class="admin-courses-table">
                <thead>
                    <tr>
                        <th>Tên Khóa học</th>
                        <th>Đối tượng</th>
                        <th>Địa điểm</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="course in courses" :key="course.id">
                        <td>{{ course.title || course.name }}</td>
                        <td>{{ course.targetAudience.join(', ') }}</td>
                        <td>{{ course.location }}</td>
                        <td>{{ formatDate(course.startDate) }}</td>
                        <td>{{ formatDate(course.endDate) }}</td>
                        <td>
                            <button @click="goToEdit(course.id)" class="edit-btn">Sửa</button>
                            <button @click="deleteCourse(course.id)" class="delete-btn">Xóa</button>
                        </td>
                    </tr>
                    <tr v-if="!isLoading && courses.length === 0">
                        <td colspan="6" style="text-align:center; color:#888;">Không có khóa học nào</td>
                    </tr>
                </tbody>
            </table>
            <div v-if="isLoading" class="loading-table">Đang tải...</div>
            <div v-if="hasError" class="error-table">{{ error }}</div>
        </div>

        <!-- Modal tạo/sửa khóa học -->
        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal-content">
                <button class="modal-close" @click="closeModal">×</button>
                <h3 class="modal-title">{{ isEditing ? 'Chỉnh sửa khóa học' : 'Tạo mới khóa học' }}</h3>
                <CourseForm v-if="!isEditing" @submit="handleCreate" @cancel="closeModal" />
                <CourseForm v-else :course="editingCourse" isEditing @submit="handleUpdate" @cancel="closeModal" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'
import CourseForm from '@/components/CourseForm.vue'
import { useToast } from 'vue-toastification'
import ConfirmToast from '@/components/ConfirmToast.vue'
const toast = useToast()

function showConfirmToast(message, onConfirm) {
  let toastId = null
  toastId = toast(
    {
      component: ConfirmToast,
      props: {
        message,
        onConfirm,
        toastId
      },
      listeners: {
        close: () => toast.dismiss(toastId)
      }
    },
    {
      timeout: false,
      closeOnClick: false,
      hideProgressBar: true,
      position: 'top-center'
    }
  )
}

const router = useRouter()
const coursesStore = useCoursesStore()

const showModal = ref(false)
const isEditing = ref(false)
const editingCourse = ref(null)

const courses = computed(() => coursesStore.courses)
const isLoading = computed(() => coursesStore.isLoading)
const hasError = computed(() => coursesStore.hasError)
const error = computed(() => coursesStore.error)

const formatDate = (dateString) => {
    if (!dateString) return ''
    const d = new Date(dateString)
    return d.toLocaleDateString('vi-VN')
}

function goToCreate() {
  router.push('/admin/courses/create')
}

function goToEdit(id) {
  router.push(`/admin/courses/edit/${id}`)
}

const deleteCourse = (courseId) => {
  showConfirmToast('Bạn có chắc muốn xóa khóa học này?', async () => {
    try {
      await coursesStore.deleteCourse(courseId)
      toast.success('Xóa khóa học thành công!')
      // Cập nhật lại danh sách
      await coursesStore.fetchCourses()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa khóa học: ' + (error.response?.data?.message || error.message))
    }
  })
}

const handleCreate = async (courseData) => {
    try {
        const newCourse = await coursesStore.createCourse(courseData)
        toast.success('Tạo khóa học thành công!')
        router.push(`/admin/courses/edit/${newCourse.id}`)
    } catch (e) {
        toast.error('Có lỗi xảy ra khi tạo khóa học: ' + (e.response?.data?.message || e.message))
    }
}

const handleUpdate = async (courseData) => {
    try {
        await coursesStore.updateCourse(editingCourse.value.id, courseData)
        toast.success('Cập nhật khóa học thành công!')
        showModal.value = false
    } catch (e) {
        toast.error('Có lỗi xảy ra khi cập nhật khóa học: ' + (e.response?.data?.message || e.message))
    }
}

const closeModal = () => {
    showModal.value = false
    isEditing.value = false
    editingCourse.value = null
}

onMounted(() => {
    coursesStore.fetchCourses()
})
</script>

<style scoped>
.admin-courses-wrapper {
    max-width: 1100px;
    margin: 32px auto;
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 2px 16px #0001;
    padding: 32px 24px 24px 24px;
}

.admin-courses-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 18px;
}

.admin-courses-header h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.2rem;
}

.admin-courses-desc {
    color: #888;
    font-size: 1.08rem;
    margin-bottom: 0.5rem;
}

.add-btn {
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 0.8rem 2rem;
    font-weight: 600;
    font-size: 1.08rem;
    cursor: pointer;
    box-shadow: 0 2px 12px rgba(76, 175, 80, 0.3);
    transition: all 0.3s ease;
    display: block;
    text-decoration: none;
    text-align: center;
}

.add-btn:hover {
    background: linear-gradient(135deg, #45a049, #388e3c);
    color: #fff;
    box-shadow: 0 4px 18px rgba(76, 175, 80, 0.4);
    transform: translateY(-2px);
}

.admin-courses-table-wrapper {
    margin-top: 12px;
    overflow-x: auto;
}

.admin-courses-table {
    width: 100%;
    border-collapse: collapse;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 1px 6px #0001;
}

.admin-courses-table th {
    background: #2196f3;
    color: #fff;
    font-weight: 600;
    padding: 12px 8px;
    text-align: left;
    font-size: 1rem;
}

.admin-courses-table td {
    padding: 12px 8px;
    font-size: 1rem;
    background: #fff;
}

.admin-courses-table tr:nth-child(even) td {
    background: #f7faff;
}

.edit-btn {
    background: linear-gradient(135deg, #2196F3, #1976D2);
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 6px 18px;
    font-weight: 600;
    margin-right: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
}

.edit-btn:hover {
    background: linear-gradient(135deg, #1976D2, #1565C0);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
    transform: translateY(-1px);
}

.delete-btn {
    background: linear-gradient(135deg, #f44336, #d32f2f);
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 6px 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
}

.delete-btn:hover {
    background: linear-gradient(135deg, #d32f2f, #c62828);
    box-shadow: 0 4px 12px rgba(244, 67, 54, 0.4);
    transform: translateY(-1px);
}

.loading-table {
    text-align: center;
    color: #1976d2;
    font-weight: 600;
    margin-top: 1rem;
}

.error-table {
    text-align: center;
    color: #e53935;
    font-weight: 600;
    margin-top: 1rem;
}

/* Modal styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: #fff;
    border-radius: 16px;
    padding: 2.2rem 2.7rem 2rem 2.7rem;
    min-width: 340px;
    max-width: 95vw;
    box-shadow: 0 8px 32px #0003;
    position: relative;
    animation: fadeInModal 0.2s;
    color: #222;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.modal-title {
    color: #2196f3;
    font-size: 1.45rem;
    font-weight: 700;
    margin-bottom: 1.2rem;
    width: 100%;
    text-align: center;
}

.modal-close {
    position: absolute;
    top: 0.7rem;
    right: 1.1rem;
    background: none;
    border: none;
    font-size: 2rem;
    color: #888;
    cursor: pointer;
    transition: color 0.2s;
}

.modal-close:hover {
    color: #2196f3;
}
</style>