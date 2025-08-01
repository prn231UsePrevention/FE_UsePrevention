<template>
  <form @submit.prevent="handleSubmit" class="course-form">
    <!-- Tên khóa học -->
    <div class="form-group">
      <label for="title">Tên khóa học <span class="required">*</span></label>
      <input id="title" v-model="formData.title" type="text" required placeholder="Nhập tên khóa học..." />
    </div>
    <!-- Mô tả -->
    <div class="form-group">
      <label for="description">Mô tả khóa học <span class="required">*</span></label>
      <textarea id="description" v-model="formData.description" rows="3" required
        placeholder="Mô tả chi tiết về khóa học..."></textarea>
    </div>
    <!-- Đối tượng mục tiêu -->
    <div class="form-group">
      <label>Đối tượng mục tiêu <span class="required">*</span></label>
      <div class="checkbox-group">
        <label v-for="audience in availableAudiences" :key="audience">
          <input type="checkbox" :value="audience" v-model="formData.targetAudience" />
          {{ audience }}
        </label>
      </div>
    </div>
    <!-- Địa điểm -->
    <div class="form-group">
      <label for="location">Địa điểm <span class="required">*</span></label>
      <input id="location" v-model="formData.location" type="text" required
        placeholder="Ví dụ: Online, Trường học..." />
    </div>
    <!-- Ngày bắt đầu & kết thúc -->
    <div class="form-row">
      <div class="form-group">
        <label for="startDate">Ngày bắt đầu <span class="required">*</span></label>
        <input id="startDate" v-model="formData.startDate" type="date" required />
      </div>
      <div class="form-group">
        <label for="endDate">Ngày kết thúc <span class="required">*</span></label>
        <input id="endDate" v-model="formData.endDate" type="date" required />
      </div>
    </div>
    <!-- Cấp độ khóa học -->
    <div class="form-group">
      <label for="courseGrade">Cấp độ khóa học <span class="required">*</span></label>
      <select id="courseGrade" v-model="formData.courseGrade" required>
        <option value="">Chọn cấp độ</option>
        <option value="A">A - Cơ bản</option>
        <option value="B">B - Trung bình</option>
        <option value="C">C - Nâng cao</option>
        <option value="D">D - Chuyên sâu</option>
      </select>
    </div>
    <!-- Hình ảnh -->
    <div class="form-group">
      <label for="imageUrl">URL hình ảnh</label>
      <input id="imageUrl" v-model="formData.imageUrl" type="url" placeholder="https://example.com/image.jpg" />
    </div>
    <!-- Thông tin bổ sung -->
    <div class="form-group">
      <label for="additionalInfo">Thông tin bổ sung</label>
      <textarea id="additionalInfo" v-model="formData.additionalInfo" rows="2"
        placeholder="Thông tin bổ sung về khóa học (không bắt buộc)..."></textarea>
    </div>
    <!-- Trạng thái hoạt động -->
    <div class="form-group">
      <label class="checkbox-label">
        <input type="checkbox" v-model="formData.isActive" />
        Khóa học đang hoạt động
      </label>
    </div>

    <!-- Nút -->
    <div class="form-actions">
      <button type="button" @click="$emit('cancel')">Hủy</button>
      <button type="submit" :disabled="isLoading">
        <span v-if="isLoading">Đang xử lý...</span>
        <span v-else>{{ isEditing ? 'Cập nhật' : 'Tạo khóa học' }}</span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useCoursesStore } from '@/stores/courses'

const props = defineProps({
  course: {
    type: Object,
    default: null
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const coursesStore = useCoursesStore()

// Available target audiences
const availableAudiences = [
  'Học sinh',
  'Sinh viên',
  'Phụ huynh',
  'Giáo viên',
  'Cộng đồng',
  'Thanh thiếu niên',
  'Gia đình'
]

// Form data matching CourseRequestDto structure
const formData = ref({
  title: '',
  description: '',
  targetAudience: [],
  location: '',
  startDate: '',
  endDate: '',
  imageUrl: '',
  additionalInfo: '',
  isActive: true,
  courseGrade: '',
})

// Validation errors
const errors = ref({})

// Computed properties
const isLoading = computed(() => coursesStore.isLoading)

// Methods
const validateForm = () => {
  errors.value = {}

  if (!formData.value.title.trim()) {
    errors.value.title = 'Tên khóa học không được để trống'
  }

  if (!formData.value.description.trim()) {
    errors.value.description = 'Mô tả khóa học không được để trống'
  }

  if (!formData.value.location.trim()) {
    errors.value.location = 'Địa điểm không được để trống'
  }

  if (!formData.value.startDate) {
    errors.value.startDate = 'Ngày bắt đầu không được để trống'
  }

  if (!formData.value.endDate) {
    errors.value.endDate = 'Ngày kết thúc không được để trống'
  }

  if (formData.value.startDate && formData.value.endDate) {
    if (new Date(formData.value.startDate) >= new Date(formData.value.endDate)) {
      errors.value.endDate = 'Ngày kết thúc phải sau ngày bắt đầu'
    }
  }

  if (formData.value.targetAudience.length === 0) {
    errors.value.targetAudience = 'Vui lòng chọn ít nhất một đối tượng mục tiêu'
  }

  if (!formData.value.courseGrade) {
    errors.value.courseGrade = 'Vui lòng chọn cấp độ khóa học'
  }

  if (formData.value.imageUrl && !isValidUrl(formData.value.imageUrl)) {
    errors.value.imageUrl = 'URL hình ảnh không hợp lệ'
  }

  return Object.keys(errors.value).length === 0
}

const isValidUrl = (string) => {
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  try {
    // Map to CourseRequestDto format
    const courseData = {
      title: formData.value.title.trim(),
      description: formData.value.description.trim(),
      targetAudience: formData.value.targetAudience,
      location: formData.value.location.trim(),
      startDate: formData.value.startDate,
      endDate: formData.value.endDate,
      imageUrl: formData.value.imageUrl?.trim() || null,
      additionalInfo: formData.value.additionalInfo?.trim() || null,
      isActive: formData.value.isActive,
      courseGrade: formData.value.courseGrade
    }

    // Additional validation for required fields
    if (!courseData.title || !courseData.description || !courseData.location || 
        !courseData.startDate || !courseData.endDate || !courseData.courseGrade ||
        courseData.targetAudience.length === 0) {
      console.error('Missing required fields')
      return
    }

    emit('submit', courseData)
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/300x200?text=Khóa+học'
}

// Helper function để format date cho input
function formatDateForInput(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
}

// Helper function để parse targetAudience từ string/array thành array chuẩn
function parseTargetAudience(targetAudience) {
  if (!targetAudience) return [];
  if (Array.isArray(targetAudience)) {
    // Nếu là mảng nhưng phần tử là chuỗi có dấu phẩy, tách tiếp
    return targetAudience.flatMap(item =>
      typeof item === 'string'
        ? item.split(',').map(i => i.trim()).filter(i => i)
        : []
    );
  }
  // Nếu là string, split theo dấu phẩy và trim
  return targetAudience.split(',').map(item => item.trim()).filter(item => item);
}

const initializeForm = () => {
  if (props.course) {
    // Parse targetAudience từ string thành array
    const targetAudienceArray = parseTargetAudience(props.course.targetAudience);

    formData.value = {
      title: props.course.title || props.course.name || '',
      description: props.course.description || '',
      location: props.course.location || '',
      startDate: formatDateForInput(props.course.startDate),
      endDate: formatDateForInput(props.course.endDate),
      targetAudience: targetAudienceArray,
      imageUrl: props.course.imageUrl || '',
      additionalInfo: props.course.additionalInfo || '',
      isActive: props.course.isActive !== undefined ? props.course.isActive : true,
      courseGrade: props.course.courseGrade || ''
    }
  } else {
    formData.value = {
      title: '',
      description: '',
      location: 'Online',
      startDate: '',
      endDate: '',
      targetAudience: [],
      imageUrl: '',
      additionalInfo: '',
      isActive: true,
      courseGrade: ''
    }
  }
}

// Lifecycle
onMounted(() => {
  initializeForm()
})

// Watch for course prop changes
watch(() => props.course, () => {
  initializeForm()
}, { immediate: true })
</script>

<style scoped>
.course-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  width: 100%;
  background: transparent;
  border-radius: 12px;
  padding: 0;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  overflow: visible !important;
  height: auto !important;
  max-height: none !important;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-row {
  display: flex;
  gap: 1.2rem;
}

.form-row .form-group {
  flex: 1 1 0;
}

label {
  font-weight: 600;
  color: #1976d2;
  margin-bottom: 0.1rem;
}

input[type="text"],
input[type="date"],
input[type="url"],
input[type="number"],
textarea,
select {
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1.5px solid #b0c6e8;
  font-size: 1.08rem;
  background: #f7faff;
  transition: border 0.2s, background 0.2s;
}

input:focus,
textarea:focus,
select:focus {
  border: 1.5px solid #2196f3;
  background: #f0f7ff;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem 1.2rem;
  margin-top: 0.2rem;
}

.checkbox-group label {
  font-weight: 400;
  color: #333;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.checkbox-label {
  font-weight: 400;
  color: #333;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin: 0;
}

/* Modules Section */
.modules-section {
  border-top: 2px solid #e3eaf3;
  padding-top: 1.5rem;
  margin-top: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h3 {
  color: #1976d2;
  margin: 0;
  font-size: 1.2rem;
}

.btn-add {
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: background 0.2s;
}

.btn-add:hover {
  background: #388e3c;
}

.btn-add-small {
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.8rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  transition: background 0.2s;
}

.btn-add-small:hover {
  background: #1769aa;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  background: #f5f5f5;
  border-radius: 8px;
  color: #666;
}

.modules-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.module-card {
  background: #f8f9fa;
  border: 1px solid #e3eaf3;
  border-radius: 8px;
  padding: 1.5rem;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.module-header h4 {
  color: #1976d2;
  margin: 0;
  font-size: 1.1rem;
}

.btn-remove {
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-remove:hover {
  background: #d32f2f;
}

.btn-remove-small {
  background: #ff5722;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 0.2rem 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-remove-small:hover {
  background: #e64a19;
}

/* Lessons Section */
.lessons-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e3eaf3;
}

.lessons-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.lessons-header h5 {
  color: #333;
  margin: 0;
  font-size: 1rem;
}

.empty-lessons {
  text-align: center;
  padding: 1rem;
  background: #fff;
  border-radius: 6px;
  color: #666;
  font-size: 0.9rem;
}

.lessons-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lesson-card {
  background: white;
  border: 1px solid #e3eaf3;
  border-radius: 6px;
  padding: 1rem;
}

.lesson-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.lesson-header h6 {
  color: #333;
  margin: 0;
  font-size: 0.95rem;
}

.lesson-fields {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.btn-icon {
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.2rem;
  border-top: 1px solid #e3eaf3;
  padding-top: 1.2rem;
}

button[type="submit"] {
  background: #2196f3;
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 0.8rem 1.5rem;
  font-weight: 600;
  font-size: 1.05rem;
  cursor: pointer;
  transition: background 0.2s;
}

button[type="submit"]:hover {
  background: #1769aa;
}

button[type="button"] {
  background: #e3eaf3;
  color: #333;
  border: none;
  border-radius: 7px;
  padding: 0.8rem 1.5rem;
  font-weight: 600;
  font-size: 1.05rem;
  cursor: pointer;
  transition: background 0.2s;
}

button[type="button"]:hover {
  background: #b0c6e8;
}

.required {
  color: #e53935;
  font-weight: 700;
}

@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
    gap: 0.5rem;
  }



  .section-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }

  .btn-add {
    width: 100%;
    justify-content: center;
  }
}
</style>