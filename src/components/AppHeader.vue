<template>
  <header class="main-header">
    <div class="container">
      <div class="logo">
        <router-link to="/">UsePrevention</router-link>
      </div>
      <nav class="navbar">
        <!-- Guest Links -->
        <template v-if="!isLoggedIn">
          <router-link to="/login" class="nav-link" exact-active-class="active">Đăng nhập</router-link>
          <router-link to="/register" class="nav-link" exact-active-class="active">Đăng ký</router-link>
        </template>

        <!-- User Links -->
        <template v-if="isLoggedIn && userRole === 'customer'">
          <router-link to="/" class="nav-link home-btn" exact-active-class="active">Trang chủ</router-link>
          <router-link to="/courses" class="nav-link" exact-active-class="active">Các khóa học</router-link>
          <router-link to="/community-programs" class="nav-link" exact-active-class="active">Chương trình cộng đồng</router-link>
          <router-link to="/assessments" class="nav-link" exact-active-class="active">Khảo sát</router-link>
          <router-link to="/consultants" class="nav-link" exact-active-class="active">Tư vấn</router-link>
          <router-link to="/my-participations" class="nav-link" exact-active-class="active">Chương trình của tôi</router-link>
          <router-link to="/appointments" class="nav-link" exact-active-class="active">Cuộc hẹn</router-link>
        </template>

        <!-- Admin Links -->
        <template v-if="isLoggedIn && userRole === 'admin'">
          <router-link to="/admin/dashboard" class="nav-link" exact-active-class="active">Dashboard</router-link>
          <router-link to="/admin/courses" class="nav-link" exact-active-class="active">Quản lý khóa học</router-link>
          <router-link to="/community-programs" class="nav-link" exact-active-class="active">Quản lý chương trình</router-link>
          <router-link to="/admin/surveys" class="nav-link" exact-active-class="active">Quản lý khảo sát</router-link>
          <router-link to="/admin/consultants" class="nav-link" exact-active-class="active">Quản lý chuyên viên</router-link>
        </template>
        <!-- Consultant Links -->
        <template v-if="isLoggedIn && userRole === 'consultant'">
          <router-link to="/appointment" class="nav-link" exact-active-class="active">Cuộc hẹn</router-link>
        </template>
      </nav>
      
      <!-- User Info & Logout - Moved outside navbar for better layout -->
      <div v-if="isLoggedIn" class="user-info">
        <router-link to="/profile" class="user-name">{{ getUserDisplayName() }}</router-link>
        <a href="#" @click.prevent="authStore.logout" class="logout-link">Đăng xuất</a>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { isLoggedIn, userRole } = storeToRefs(authStore)

// Function to get user display name from various possible fields
const getUserDisplayName = () => {
  const user = authStore.user
  if (!user) return 'Người dùng'
  
  // Check various possible name fields
  return user.fullName || user.name || user.userName || user.email || 'Người dùng'
}
</script>

<script>
export default {
  name: 'AppHeader'
}
</script>

<style scoped>
.main-header {
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 12px 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  border-bottom: 1px solid #e5e7eb;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  gap: 12px;
}

.logo a {
  font-size: 24px;
  font-weight: 700;
  color: #2563eb;
  text-decoration: none;
  letter-spacing: -0.5px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  transition: color 0.2s ease-in-out;
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 140px;
}

.logo a:hover {
  color: #1d4ed8;
}

.navbar {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  flex: 1;
  min-width: 0;
  padding: 0 4px;
  justify-content: flex-start;
}

.navbar::-webkit-scrollbar {
  display: none;
}

.nav-link {
  white-space: nowrap;
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  font-size: 13px;
  padding: 6px 10px;
  border-radius: 6px;
  transition: all 0.2s ease-in-out;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: transparent;
  position: relative;
  flex-shrink: 0;
  display: inline-block;
}

.nav-link:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.nav-link.active {
  background-color: #dbeafe;
  color: #2563eb;
  font-weight: 600;
}

.home-btn {
  background-color: #3b82f6;
  color: white;
  font-weight: 600;
}

.home-btn:hover {
  background-color: #2563eb;
  color: white;
}

.home-btn.active {
  background-color: #1d4ed8;
  color: white;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
  padding-left: 12px;
  border-left: 1px solid #e5e7eb;
  flex-shrink: 0;
  min-width: 160px;
}

.user-name {
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease-in-out;
  font-size: 13px;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.user-name:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.logout-link {
  color: #dc2626;
  font-weight: 500;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;
  font-size: 13px;
  text-decoration: none;
  white-space: nowrap;
}

.logout-link:hover {
  background-color: #fef2f2;
  color: #b91c1c;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .container {
    max-width: 1200px;
    gap: 8px;
    padding: 0 16px;
  }
  
  .user-name {
    max-width: 100px;
  }
  
  .user-info {
    min-width: 140px;
  }
}

@media (max-width: 1024px) {
  .container {
    gap: 6px;
    padding: 0 12px;
  }
  
  .user-name {
    max-width: 80px;
  }
  
  .nav-link {
    font-size: 12px;
    padding: 5px 8px;
  }
  
  .user-info {
    min-width: 120px;
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 0 16px;
  }

  .navbar {
    width: 100%;
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    gap: 4px;
    padding-bottom: 4px;
    justify-content: flex-start;
    padding: 0 2px;
  }

  .nav-link {
    flex-shrink: 0;
    text-align: center;
    justify-content: center;
    font-size: 12px;
    padding: 5px 8px;
  }

  .user-info {
    margin-left: 0;
    width: 100%;
    padding: 8px 0;
    border-top: 1px solid #e5e7eb;
    border-left: none;
    justify-content: space-between;
    gap: 16px;
    min-width: auto;
  }

  .user-name {
    max-width: none;
    flex: 1;
  }

  .logo a {
    font-size: 20px;
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 12px;
  }
  
  .nav-link {
    font-size: 11px;
    padding: 4px 6px;
  }
  
  .user-name,
  .logout-link {
    font-size: 12px;
    padding: 4px 6px;
  }
  
  .user-info {
    gap: 12px;
  }
}
</style>
