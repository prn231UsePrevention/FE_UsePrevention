<template>
  <div class="module-manager">
    <div class="module-header">
      <h3>Quản lý chương trình học</h3>
      <button @click="showAddModuleForm = true" class="btn-add-module">
        <span class="btn-icon">+</span>
        Thêm Module
      </button>
    </div>

    <!-- Module List -->
    <div class="modules-list">
      <div v-for="(module, moduleIndex) in modules" :key="module.id" class="module-item">
        <div class="module-header-item">
          <div class="module-info">
            <span class="module-icon">📚</span>
            <span class="module-title">{{ module.title }}</span>
            <span class="lesson-count">({{ module.lessons?.length || 0 }} bài học)</span>
          </div>
          <div class="module-actions">
            <button @click="editModule(module)" class="btn-edit">✏️</button>
            <button @click="deleteModule(module.id)" class="btn-delete">🗑️</button>
            <button @click="toggleModuleExpanded(moduleIndex)" class="btn-toggle">
              {{ expandedModules.includes(moduleIndex) ? '▼' : '▶' }}
            </button>
          </div>
        </div>

        <!-- Expanded Module Content -->
        <div v-if="expandedModules.includes(moduleIndex)" class="module-content">
          <!-- Lessons List -->
          <div class="lessons-section">
            <div class="lessons-header">
              <h4>Bài học</h4>
              <button @click="openAddLessonForm(module.id)" class="btn-add-lesson">
                <span class="btn-icon">+</span>
                Thêm bài học
              </button>
            </div>

            <div class="lessons-list">
              <div v-for="lesson in module.lessons" :key="lesson.id" class="lesson-item">
                <div class="lesson-info">
                  <span class="lesson-icon">📖</span>
                  <div class="lesson-details">
                    <span class="lesson-title">{{ lesson.title }}</span>
                    <span v-if="lesson.description" class="lesson-desc">{{ lesson.description }}</span>
                    <span class="lesson-order">Thứ tự: {{ lesson.order }}</span>
                  </div>
                </div>
                <div class="lesson-actions">
                  <button @click="editLesson(lesson)" class="btn-edit-small">✏️</button>
                  <button @click="deleteLesson(lesson.id)" class="btn-delete-small">🗑️</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Module Modal -->
    <div v-if="showAddModuleForm || editingModule" class="modal-overlay" @click.self="closeModuleForm">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingModule ? 'Chỉnh sửa Module' : 'Thêm Module Mới' }}</h3>
          <button @click="closeModuleForm" class="btn-close">×</button>
        </div>
        <form @submit.prevent="saveModule" class="module-form">
          <div class="form-group">
            <label for="moduleTitle">Tên module <span class="required">*</span></label>
            <input
              id="moduleTitle"
              v-model="moduleForm.title"
              type="text"
              required
              placeholder="Nhập tên module..."
            />
          </div>
          <div class="form-actions">
            <button type="button" @click="closeModuleForm">Hủy</button>
            <button type="submit" :disabled="isLoading">
              {{ isLoading ? 'Đang xử lý...' : (editingModule ? 'Cập nhật' : 'Thêm') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add/Edit Lesson Modal -->
    <div v-if="showAddLessonForm || editingLesson" class="modal-overlay" @click.self="closeLessonForm">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingLesson ? 'Chỉnh sửa Bài học' : 'Thêm Bài học Mới' }}</h3>
          <button @click="closeLessonForm" class="btn-close">×</button>
        </div>
        <form @submit.prevent="saveLesson" class="lesson-form">
          <div class="form-group">
            <label for="lessonTitle">Tên bài học <span class="required">*</span></label>
            <input
              id="lessonTitle"
              v-model="lessonForm.title"
              type="text"
              required
              placeholder="Nhập tên bài học..."
            />
          </div>
          <div class="form-group">
            <label for="lessonDescription">Mô tả bài học</label>
            <textarea
              id="lessonDescription"
              v-model="lessonForm.description"
              rows="3"
              placeholder="Mô tả bài học..."
            ></textarea>
          </div>
          <div class="form-group">
            <label for="lessonVideoUrl">URL video</label>
            <input
              id="lessonVideoUrl"
              v-model="lessonForm.videoUrl"
              type="url"
              placeholder="https://example.com/video.mp4"
            />
          </div>
          <div class="form-group">
            <label for="lessonOrder">Thứ tự <span class="required">*</span></label>
            <input
              id="lessonOrder"
              v-model="lessonForm.order"
              type="number"
              min="1"
              required
              placeholder="1"
            />
          </div>
          <div class="form-actions">
            <button type="button" @click="closeLessonForm">Hủy</button>
            <button type="submit" :disabled="isLoading">
              {{ isLoading ? 'Đang xử lý...' : (editingLesson ? 'Cập nhật' : 'Thêm') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { courseService } from '@/services/courseService'
import { useToast } from 'vue-toastification'
import ConfirmToast from './ConfirmToast.vue'

const props = defineProps({
  courseId: { type: [String, Number], required: true },
  modules: { type: Array, default: () => [] }
})

const emit = defineEmits(['modules-updated'])

const toast = useToast()

// State
const showAddModuleForm = ref(false)
const showAddLessonForm = ref(false)
const editingModule = ref(null)
const editingLesson = ref(null)
const expandedModules = ref([])
const isLoading = ref(false)
const currentModuleIdForLessonForm = ref(null)

// Forms
const moduleForm = ref({
  title: ''
})

const lessonForm = ref({
  title: '',
  description: '',
  videoUrl: '',
  order: 1
})

// Methods
const toggleModuleExpanded = (moduleIndex) => {
  const index = expandedModules.value.indexOf(moduleIndex)
  if (index > -1) {
    expandedModules.value.splice(index, 1)
  } else {
    expandedModules.value.push(moduleIndex)
  }
}

const editModule = (module) => {
  editingModule.value = module
  moduleForm.value.title = module.title
  showAddModuleForm.value = true
  // Scroll to top to show modal
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const editLesson = (lesson) => {
  editingLesson.value = lesson
  lessonForm.value = {
    title: lesson.title,
    description: lesson.description || '',
    videoUrl: lesson.videoUrl || '',
    order: lesson.order
  }
  showAddLessonForm.value = true
  // Scroll to top to show modal
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const openAddLessonForm = (moduleId) => {
  lessonForm.value = {
    title: '',
    description: '',
    videoUrl: '',
    order: 1
  }
  currentModuleIdForLessonForm.value = moduleId
  showAddLessonForm.value = true
}


const closeModuleForm = () => {
  showAddModuleForm.value = false
  editingModule.value = null
  moduleForm.value.title = ''
}

const closeLessonForm = () => {
  showAddLessonForm.value = false
  editingLesson.value = null
  currentModuleIdForLessonForm.value = null
  lessonForm.value = {
    title: '',
    description: '',
    videoUrl: '',
    order: 1
  }
}


const saveModule = async () => {
  if (!moduleForm.value.title.trim()) return

  isLoading.value = true
  try {
    if (editingModule.value) {
      await courseService.updateModule(editingModule.value.id, {
        title: moduleForm.value.title
      })
      toast.success('Cập nhật module thành công!')
    } else {
      await courseService.addModule(props.courseId, {
        title: moduleForm.value.title
      })
      toast.success('Thêm module thành công!')
    }
    closeModuleForm()
    emit('modules-updated')
  } catch (error) {
    toast.error('Có lỗi xảy ra khi lưu module: ' + (error.response?.data?.message || error.message))
  } finally {
    isLoading.value = false
  }
}


const saveLesson = async () => {
  if (!lessonForm.value.title.trim()) return

  isLoading.value = true
  try {
    if (editingLesson.value) {
      await courseService.updateLesson(editingLesson.value.id, {
        title: lessonForm.value.title,
        description: lessonForm.value.description,
        videoUrl: lessonForm.value.videoUrl,
        order: lessonForm.value.order
      })
      toast.success('Cập nhật bài học thành công!')
    } else {
      await courseService.addLesson(currentModuleIdForLessonForm.value, {
        title: lessonForm.value.title,
        description: lessonForm.value.description,
        videoUrl: lessonForm.value.videoUrl,
        order: lessonForm.value.order
      })
      toast.success('Thêm bài học thành công!')
    }
    closeLessonForm()
    emit('modules-updated')
  } catch (error) {
    toast.error('Có lỗi xảy ra khi lưu bài học: ' + (error.response?.data?.message || error.message))
  } finally {
    isLoading.value = false
  }
}


// Toast xác nhận xóa
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

const deleteModule = async (moduleId) => {
  showConfirmToast('Bạn có chắc muốn xóa module này?', async () => {
    isLoading.value = true;
    try {
      await courseService.deleteModule(moduleId);
      toast.success('Xóa module thành công!');
      emit('modules-updated');
    } catch (error) {
      toast.error('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
    } finally {
      isLoading.value = false;
    }
  });
}

const deleteLesson = async (lessonId) => {
  showConfirmToast('Bạn có chắc muốn xóa bài học này?', async () => {
    isLoading.value = true;
    try {
      await courseService.deleteLesson(lessonId);
      toast.success('Xóa bài học thành công!');
      emit('modules-updated');
    } catch (error) {
      toast.error('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
    } finally {
      isLoading.value = false;
    }
  });
}
</script>

<style scoped>
.module-manager {
  padding: 0;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.module-header h3 {
  margin: 0;
  color: #1f2937;
}

.btn-add-module {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-add-module:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.modules-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.module-item {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.module-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.module-header-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  transition: background 0.2s ease;
}

.module-header-item:hover {
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
}

.module-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.module-title {
  font-weight: 600;
  color: #1f2937;
}

.lesson-count {
  color: #6b7280;
  font-size: 0.9rem;
}

.module-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit, .btn-delete, .btn-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-edit:hover { background: #dbeafe; }
.btn-delete:hover { background: #fee2e2; }
.btn-toggle:hover { background: #f3f4f6; }

.module-content {
  padding: 1rem;
}

.lessons-section {
  margin-top: 1rem;
}

.lessons-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.lessons-header h4 {
  margin: 0;
  color: #374151;
}

.btn-add-lesson {
  background: #10b981;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.8rem;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.lessons-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.lesson-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.lesson-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.lesson-details {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.lesson-title {
  font-weight: 500;
  color: #1f2937;
}

.lesson-desc {
  color: #6b7280;
  font-size: 0.9rem;
}

.lesson-order {
  color: #9ca3af;
  font-size: 0.8rem;
}

.lesson-actions {
  display: flex;
  gap: 0.3rem;
}

.btn-edit-small, .btn-delete-small {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.2rem;
  border-radius: 3px;
  font-size: 0.8rem;
}

.btn-edit-small:hover { background: #dbeafe; }
.btn-delete-small:hover { background: #fee2e2; }

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideIn 0.3s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modal-header h3 {
  margin: 0;
  color: #1f2937;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #6b7280;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
}

.required {
  color: #ef4444;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

.form-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.form-actions button[type="button"] {
  background: #e5e7eb;
  color: #374151;
}

.form-actions button[type="submit"] {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  transition: all 0.3s ease;
}

.form-actions button[type="submit"]:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.form-actions button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style> 