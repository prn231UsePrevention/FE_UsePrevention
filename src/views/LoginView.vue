<template>
    <div class="login-wrapper">
      <div class="login-container">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>Email</label>
            <input v-model="email" type="email" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input v-model="password" type="password" required />
          </div>
          <button type="submit">Login</button>
          <p class="error" v-if="errorMessage">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  
  const email = ref('')
  const password = ref('')
  const errorMessage = ref('')
  const router = useRouter()
  
  const handleLogin = async () => {
    try {
      const response = await axios.post('https://localhost:7233/api/Users/login', {
        email: email.value,
        password: password.value
      })
  
      const token = response.data.token
      localStorage.setItem('token', token)
      router.push('/dashboard')
    } catch (err) {
      errorMessage.value = err.response?.data?.error || 'Login failed'
    }
  }
  </script>
  
  <style scoped>
  .login-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #f4f6f8;
  }
  
  .login-container {
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
  }
  
  .form-group {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
  }
  
  label {
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #555;
  }
  
  input {
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s;
  }
  
  input:focus {
    outline: none;
    border-color: #3b82f6;
  }
  
  button {
    width: 100%;
    padding: 0.75rem;
    background-color: #3b82f6;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 1rem;
  }
  
  button:hover {
    background-color: #2563eb;
  }
  
  .error {
    color: #e53935;
    margin-top: 0.75rem;
    text-align: center;
  }
  </style>
  