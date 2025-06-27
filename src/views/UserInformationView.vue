<template>
  <div class="user-profile-container card">
    <h1>Thông tin Hồ sơ Người dùng</h1>
    <div v-if="authStore.user" class="profile-details">
      <p><strong>Họ và tên:</strong> {{ authStore.user.fullName }}</p>
      <p><strong>Email:</strong> {{ authStore.user.email }}</p>
      <p><strong>Ngày sinh:</strong> {{ formatDate(authStore.user.dateOfBirth) }}</p>
      <p><strong>Giới tính:</strong> {{ authStore.user.gender }}</p>
      <p><strong>Ngày tạo tài khoản:</strong> {{ formatDate(authStore.user.createdAt) }}</p>
      <p><strong>Trạng thái hoạt động:</strong> {{ authStore.user.isActive ? 'Hoạt động' : 'Không hoạt động' }}</p>
      <p><strong>Vai trò:</strong> {{ authStore.user.role }}</p>
    </div>
    <div v-else>
      <p>Không có thông tin người dùng.</p>
    </div>
    <button @click="goBack" class="btn primary">Quay lại</button>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const goBack = () => {
  router.go(-1) // Go back to the previous page
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('vi-VN', options)
}
</script>

<style scoped>
.user-profile-container {
  max-width: 600px;
  margin: var(--spacing-xl) auto;
  padding: var(--spacing-xl);
  text-align: left; /* Align text to left for better readability */
}

.user-profile-container h1 {
  font-size: var(--font-size-h2);
  color: var(--primary-color);
  margin-bottom: var(--spacing-lg);
  text-align: center; /* Center the heading */
}

.profile-details p {
  font-size: var(--font-size-lg);
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-sm);
  line-height: 1.5;
}

.profile-details strong {
  color: var(--primary-dark);
}

.btn {
  margin-top: var(--spacing-xl);
  display: block; /* Make button a block element */
  margin-left: auto; /* Center button */
  margin-right: auto; /* Center button */
  width: fit-content; /* Adjust width to content */
}
</style>
