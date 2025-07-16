
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)

  console.log("//////////////////////");
  console.log(user)



  // Getters
  const isLoggedIn = computed(() => !!token.value)
  const userRole = computed(() => (user.value ? (user.value.role === 'user' ? 'customer' : user.value.role) : null))

  // Actions
  function parseJwt(token) {
    if (!token) return null
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
  }

  function login(userData, userToken) {
    // Normalize role to lowercase before storing
    if (userData && userData.role) {
      userData.role = userData.role.toLowerCase();
    } else if (userData && userData.Role) { // Fallback for PascalCase
      userData.role = userData.Role.toLowerCase();
      delete userData.Role; // Remove the PascalCase property
      if (userData.role === 'user') userData.role = 'customer'
      userData.role = userData.role.toLowerCase()
    }
    console.log("/////////////////")
    console.log(userData)
    // Store all user data received from the API
    user.value = userData
    token.value = userToken
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', userToken)

    // Parse userId from token and save to store
    const payload = parseJwt(userToken)
    if (payload) {
      // Lấy sub hoặc nameidentifier
      const id = payload.sub || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
      if (id) {
        user.value = {
          ...user.value,
          id: id
        }
        localStorage.setItem('user', JSON.stringify(user.value))
      }
    }

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
