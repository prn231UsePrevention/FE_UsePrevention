<template>
  <div class="auth-container">
    <form class="auth-form" @submit.prevent="handleLogin">
      <h2>Đăng nhập</h2>
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="email" type="email" id="email" required placeholder="Nhập email" />
      </div>
      <div class="form-group">
        <label for="password">Mật khẩu</label>
        <input v-model="password" type="password" id="password" required placeholder="Nhập mật khẩu" />
      </div>
      <button type="submit" :disabled="loading">Đăng nhập</button>
      <p class="error" v-if="error">{{ error }}</p>
      <p class="success" v-if="success">Đăng nhập thành công!</p>
      <p class="switch-link">Chưa có tài khoản? <router-link to="/register">Đăng ký</router-link></p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const success = ref(false)
const loading = ref(false)
const router = useRouter()

const API_URL = 'https://localhost:7233/api/Users/login' // Đã cập nhật theo BE mới

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return {};
  }
}

async function handleLogin() {
  error.value = ''
  success.value = false
  loading.value = true
  try {
    const res = await axios.post(API_URL, { email: email.value, password: password.value })
    localStorage.setItem('token', res.data.token)
    const payload = parseJwt(res.data.token);
    const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    localStorage.setItem('role', role);
    success.value = true
    setTimeout(() => {
      router.push('/community-programs')
    }, 1000)
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
}
.auth-form {
  background: rgba(255,255,255,0.95);
  padding: 2.5rem 2rem 2rem 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 24px #0001;
  min-width: 340px;
  max-width: 95vw;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
.auth-form h2 {
  text-align: center;
  color: #2196f3;
  margin-bottom: 0.5rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
input {
  padding: 0.7rem 1rem;
  border-radius: 7px;
  border: 1px solid #b0c6e8;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
}
input:focus {
  border: 1.5px solid #2196f3;
}
button {
  background: #2196f3;
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 0.8rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s;
}
button:disabled {
  background: #b0c6e8;
  cursor: not-allowed;
}
.error {
  color: #e53935;
  text-align: center;
  font-size: 0.98rem;
}
.success {
  color: #43a047;
  text-align: center;
  font-size: 0.98rem;
}
.switch-link {
  text-align: center;
  font-size: 0.97rem;
  margin-top: 0.5rem;
}
</style> 