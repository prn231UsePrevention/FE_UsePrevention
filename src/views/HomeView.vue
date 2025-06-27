<template>
  <div>
    <GuestLanding v-if="!authStore.isLoggedIn" />
    <UserDashboard v-else-if="authStore.isLoggedIn && authStore.userRole === 'user'" />
    <AdminDashboardView v-else-if="authStore.isLoggedIn && authStore.userRole === 'admin'" />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import GuestLanding from '@/components/GuestLanding.vue'
import UserDashboard from '@/components/UserDashboard.vue'
import AdminDashboardView from '@/views/AdminDashboardView.vue'

const authStore = useAuthStore()
</script>

<style scoped>
/* No specific styles needed for HomeView itself, as it just acts as a container */
</style>
