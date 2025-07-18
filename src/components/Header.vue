<template>
  <header class="main-header">
    <div class="container">
      <div class="logo">
        <router-link to="/">UsePrevention</router-link>
      </div>
      <nav class="navbar">
        <!-- Guest Links -->
        <template v-if="!isLoggedIn">
          <router-link to="/login" exact-active-class="active">Đăng nhập</router-link>
          <router-link to="/register" exact-active-class="active">Đăng ký</router-link>
        </template>

        <!-- User Links -->
        <template v-if="isLoggedIn && (userRole === 'user' || userRole === 'customer')">
          <router-link to="/" exact-active-class="active">Trang chủ</router-link>
          <router-link to="/courses" exact-active-class="active">Các khóa học</router-link>
          <router-link to="/community-programs" exact-active-class="active">Chương trình cộng đồng</router-link>
          <router-link to="/surveys" exact-active-class="active">Khảo sát</router-link>
          <router-link to="/consultants" exact-active-class="active">Tư vấn</router-link>
          <router-link to="/my-participations" exact-active-class="active">Chương trình của tôi</router-link>
          <router-link to="/appointments" exact-active-class="active">Cuộc hẹn</router-link>
        </template>

        <!-- Admin Links -->
        <template v-if="isLoggedIn && userRole === 'admin'">
          <router-link to="/admin/dashboard" exact-active-class="active">Dashboard</router-link>
          <router-link to="/admin/courses" exact-active-class="active">Quản lý khóa học</router-link>
          <router-link to="/community-programs" exact-active-class="active">Quản lý chương trình</router-link>
          <router-link to="/admin/surveys" exact-active-class="active">Quản lý khảo sát</router-link>
          <router-link to="/admin/consultants" exact-active-class="active">Quản lý chuyên viên</router-link>
        </template>
        <!-- Consultant Links -->
        <template v-if="isLoggedIn && userRole === 'consultant'">
          <router-link to="/appointment" exact-active-class="active">Cuộc hẹn</router-link>
        </template>
        <!-- User Info & Logout -->
        <div v-if="isLoggedIn" class="user-info">
          <router-link to="/profile" class="user-name">{{ authStore.user?.email || 'Người dùng' }}</router-link>
          <a href="#" @click.prevent="authStore.logout" class="logout-link">Đăng xuất</a>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { isLoggedIn, userRole } = storeToRefs(authStore)
</script>

<script>
export default {
  name: 'AppHeader'
}
</script>

<style scoped>
.main-header {
  background-color: rgba(255, 255, 255, 0.9);
  /* Subtle transparency */
  box-shadow: var(--shadow-1);
  /* Light shadow */
  padding: var(--spacing-md) 0;
  /* More vertical padding */
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  /* Full width */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-lg);
  /* More horizontal padding */
}

.logo a {
  font-size: var(--font-size-xl);
  font-weight: bold;
  color: var(--primary-color);
  text-decoration: none;
  letter-spacing: 1px;
  font-family: var(--font-family-sans);
  transition: color 0.2s ease-in-out;
}

.logo a:hover {
  color: var(--primary-dark);
}

.navbar {
  display: flex;
  gap: var(--spacing-xs);
  /* Further reduced gap */
  align-items: center;
  flex-wrap: nowrap;
  /* Ensure no wrapping */
  overflow-x: auto;
  /* Allow horizontal scroll if content overflows */
  -webkit-overflow-scrolling: touch;
}

.navbar a {
  white-space: nowrap;
  /* Prevent text from wrapping */
  color: var(--text-color-primary);
  text-decoration: none;
  font-weight: 500;
  font-size: var(--font-size-sm);
  /* Reduced font size */
  padding: var(--spacing-xs) var(--spacing-sm);
  /* Reduced horizontal padding */
  border-radius: var(--border-radius-md);
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  font-family: var(--font-family-sans);
  background: transparent;
}

.navbar a.active,
.navbar a:hover {
  background-color: var(--primary-light);
  color: var(--surface-color);
  box-shadow: var(--shadow-1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  /* Reduced gap */
  margin-left: var(--spacing-md);
  /* Adjusted space from other nav items */
  white-space: nowrap;
  /* Prevent text from wrapping */
}

.user-name {
  font-weight: bold;
  color: var(--primary-dark);
  cursor: pointer;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  transition: background-color 0.2s ease-in-out;
}

.user-name:hover {
  background-color: var(--background-color);
}

.logout-link {
  color: var(--error-color);
  font-weight: 500;
  cursor: pointer;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  transition: background-color 0.2s ease-in-out;
}

.logout-link:hover {
  background-color: rgba(var(--error-color), 0.1);
}

/* Adjustments for smaller screens */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .navbar {
    width: 100%;
    flex-wrap: nowrap;
    /* Prevent wrapping */
    overflow-x: auto;
    /* Enable horizontal scrolling if needed */
    -webkit-overflow-scrolling: touch;
    /* Smooth scrolling on iOS */
    gap: var(--spacing-xs);
    /* Smaller gap on mobile */
    padding-bottom: var(--spacing-xs);
    /* Add some padding for scrollbar */
  }

  .navbar a,
  .user-info {
    flex-shrink: 0;
    /* Prevent items from shrinking */
    text-align: center;
    justify-content: center;
  }

  .user-info {
    margin-left: 0;
    /* Remove left margin on mobile */
    width: 100%;
    /* Take full width */
    padding: var(--spacing-xs) 0;
    /* Add some padding */
    border-top: 1px solid var(--background-color);
    /* Separator */
  }
}
</style>
