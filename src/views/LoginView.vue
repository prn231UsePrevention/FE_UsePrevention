<template>
  <div class="auth-container">
    <form class="auth-form card" @submit.prevent="handleLogin">
      <h2>Đăng nhập</h2>
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="email" type="email" id="email" required placeholder="Nhập email" />
      </div>
      <div class="form-group">
        <label for="password">Mật khẩu</label>
        <input v-model="password" type="password" id="password" required placeholder="Nhập mật khẩu" />
      </div>
      <button type="submit" :disabled="loading" class="btn primary">Đăng nhập</button>
      <p class="error" v-if="error">{{ error }}</p>
      <p class="success" v-if="success">Đăng nhập thành công!</p>
      <p class="switch-link">Chưa có tài khoản? <router-link to="/register">Đăng ký</router-link></p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const success = ref(false)
const loading = ref(false)
const authStore = useAuthStore()

const API_URL = 'https://localhost:7233/api/Users/login'

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (e) {
    console.error('Invalid token:', e)
    return null
  }
}

async function handleLogin() {
  error.value = ''
  success.value = false
  loading.value = true
  try {
    const res = await axios.post(API_URL, { email: email.value, password: password.value })
    const token = res.data.token
    const payload = parseJwt(token)

    if (payload) {
      const user = {
        id: res.data.id, // Assuming res.data.id is the user ID
        fullName: res.data.fullName,
        email: res.data.email,
        dateOfBirth: res.data.dateOfBirth,
        gender: res.data.gender,
        createdAt: res.data.createdAt,
        isActive: res.data.isActive,
        role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      }
      authStore.login(user, token)
      success.value = true
    } else {
      throw new Error('Could not parse token.')
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Đăng nhập thất bại!'
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
input {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  border: 1px solid #b0c6e8;
  font-size: var(--font-size-md);
  outline: none;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
input:focus {
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
.error {
  color: var(--error-color);
  text-align: center;
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-sm);
}
.success {
  color: var(--success-color);
  text-align: center;
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-sm);
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
 