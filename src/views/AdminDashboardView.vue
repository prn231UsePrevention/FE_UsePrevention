<template>
  <div class="admin-dashboard-container">
    <h1>Admin Dashboard</h1>
    <p>Chào mừng, Admin! Đây là tổng quan về hệ thống của bạn.</p>

    <div class="dashboard-stats">
      <div class="stat-card card">
        <h3>Tổng số Người dùng</h3>
        <p class="stat-value">{{ mockAdminDashboardData.totalUsers }}</p>
      </div>
      <div class="stat-card card">
        <h3>Khóa học Đang hoạt động</h3>
        <p class="stat-value">{{ mockAdminDashboardData.activeCourses }}</p>
      </div>
      <div class="stat-card card">
        <h3>Lịch hẹn Chờ duyệt</h3>
        <p class="stat-value">{{ mockAdminDashboardData.pendingAppointments }}</p>
      </div>
      <div class="stat-card card">
        <h3>Khảo sát Đã hoàn thành</h3>
        <p class="stat-value">{{ mockAdminDashboardData.completedSurveys }}</p>
      </div>
    </div>

    <div class="recent-activities card">
      <h2>Hoạt động Gần đây</h2>
      <ul v-if="mockAdminDashboardData.recentActivities.length">
        <li v-for="activity in mockAdminDashboardData.recentActivities" :key="activity.id">
          <strong>{{ activity.user }}</strong> đã {{ activity.type }} về <strong>{{ activity.item }}</strong> vào ngày {{ activity.date }}.
        </li>
      </ul>
      <p v-else>Không có hoạt động gần đây nào.</p>
    </div>
  </div>
</template>

<script setup>
import { mockAdminDashboardData } from '@/data/mockData'
</script>

<style scoped>
.admin-dashboard-container {
  width: 100%;
  padding: var(--spacing-lg);
  text-align: center;
}

.admin-dashboard-container h1 {
  font-size: var(--font-size-h2);
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-sm);
}

.admin-dashboard-container p {
  font-size: var(--font-size-lg);
  color: var(--text-color-secondary);
  margin-bottom: var(--spacing-xl);
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  max-width: 1000px;
  margin: 0 auto var(--spacing-xl) auto;
}

.stat-card {
  background: var(--surface-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-2);
  padding: var(--spacing-lg);
  text-align: center;
}

.stat-card h3 {
  font-size: var(--font-size-xl);
  color: var(--primary-color);
  margin-bottom: var(--spacing-md);
}

.stat-card .stat-value {
  font-size: var(--font-size-h1);
  font-weight: bold;
  color: var(--text-color-primary);
}

.recent-activities {
  background: var(--surface-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-2);
  padding: var(--spacing-lg);
  max-width: 1000px;
  margin: 0 auto;
  text-align: left;
}

.recent-activities h2 {
  font-size: var(--font-size-h3);
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.recent-activities ul {
  list-style: none;
  padding: 0;
}

.recent-activities li {
  background: var(--background-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-md);
  color: var(--text-color-secondary);
}

.recent-activities li:last-child {
  margin-bottom: 0;
}
</style>
