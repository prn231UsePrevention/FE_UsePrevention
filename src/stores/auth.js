
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)

  // Getters
  const isLoggedIn = computed(() => !!token.value)
  const userRole = computed(() => (user.value ? user.value.role : null))

  // Actions
  function login(userData, userToken) {
    // Normalize role to lowercase before storing
    if (userData && userData.role) {
      userData.role = userData.role.toLowerCase()
    }
    // Store all user data received from the API
    user.value = userData
    token.value = userToken
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', userToken)

    console.log('Auth Store: User logged in.')
    console.log('Auth Store: Token:', token.value ? 'Exists' : 'Does not exist')
    console.log('Auth Store: User Data:', user.value)
    console.log('Auth Store: Is Logged In:', isLoggedIn.value)
    console.log('Auth Store: User Role:', userRole.value)

    // Redirect based on role
    if (user.value.role === 'admin') {
      router.push('/admin/dashboard')
    } else {
      router.push('/')
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    console.log('Auth Store: User logged out.')
    console.log('Auth Store: Is Logged In:', isLoggedIn.value)
    router.push('/login')
  }

  return {
    token,
    user,
    isLoggedIn,
    userRole,
    login,
    logout
  }
})
