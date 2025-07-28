<template>
  <div class="auth-container">
    <form class="auth-form card" @submit.prevent="handleRegister">
      <h2>Đăng ký</h2>
      <div class="form-group">
        <label for="fullName">Họ và tên</label>
        <input v-model="fullName" type="text" id="fullName" required placeholder="Nhập họ và tên" />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="email" type="email" id="email" required placeholder="Nhập email" />
      </div>
      <div class="form-group">
        <label for="password">Mật khẩu</label>
        <input v-model="password" type="password" id="password" required placeholder="Nhập mật khẩu" />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Nhập lại mật khẩu</label>
        <input v-model="confirmPassword" type="password" id="confirmPassword" required placeholder="Nhập lại mật khẩu" />
      </div>
      <div class="form-group">
        <label for="dateOfBirth">Ngày sinh</label>
        <input v-model="dateOfBirth" type="date" id="dateOfBirth" required />
      </div>
      <div class="form-group">
        <label for="gender">Giới tính</label>
        <select v-model="gender" id="gender" required>
          <option value="">Chọn giới tính</option>
          <option value="Male">Nam</option>
          <option value="Female">Nữ</option>
          <option value="Other">Khác</option>
        </select>
      </div>
      <button type="submit" :disabled="loading" class="btn primary">Đăng ký</button>
      <p class="switch-link">Đã có tài khoản? <router-link to="/login">Đăng nhập</router-link></p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const dateOfBirth = ref('')
const gender = ref('')
const loading = ref(false)
const router = useRouter()
const toast = useToast()

const API_URL = 'https://localhost:7233/api/Users/register' // Đổi lại đúng endpoint BE nếu khác

async function handleRegister() {
  loading.value = true
  if (password.value !== confirmPassword.value) {
    toast.error('Mật khẩu nhập lại không khớp!')
    loading.value = false
    return
  }
  try {
    await axios.post(API_URL, {
      fullName: fullName.value,
      email: email.value,
      password: password.value,
      dateOfBirth: dateOfBirth.value,
      gender: gender.value,
      roleId: 0 // Mặc định roleId là 0
    })
    toast.success('Đăng ký thành công! Vui lòng đăng nhập.')
    setTimeout(() => {
      router.push('/login')
    }, 1200)
  } catch (err) {
    toast.error(err.response?.data?.message || 'Đăng ký thất bại!')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
}
.auth-form {
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-3);
  min-width: 340px;
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
.auth-form h2 {
  text-align: center;
  color: var(--primary-color);
  margin-bottom: var(--spacing-lg);
  font-size: var(--font-size-h3);
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}
label {
  font-size: var(--font-size-md);
  color: var(--text-color-primary);
  font-weight: 500;
}
input, select {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  border: 1px solid #b0c6e8;
  font-size: var(--font-size-md);
  outline: none;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
input:focus, select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-color), 0.2);
}
button {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md) 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
}
button:disabled {
  background: var(--background-color);
  color: var(--text-color-secondary);
  cursor: not-allowed;
  box-shadow: none;
}

.switch-link {
  text-align: center;
  font-size: var(--font-size-md);
  margin-top: var(--spacing-md);
}
.switch-link a {
  color: var(--primary-color);
  font-weight: 500;
}
</style>
 