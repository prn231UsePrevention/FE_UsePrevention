<template>
  <header class="main-header">
    <div class="container">
      <div class="logo">
        <router-link to="/">UsePrevention</router-link>
      </div>
      <nav class="navbar">
        <router-link to="/" exact-active-class="active">Trang chủ</router-link>
        <router-link to="/about" exact-active-class="active">Về chúng tôi</router-link>
        <router-link to="/login" exact-active-class="active">Đăng nhập</router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
// Không cần logic đặc biệt
</script>

<style scoped>
.main-header {
  background: transparent;
  box-shadow: none;
  padding: 0.5rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}
.container {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
}
.logo a {
  font-size: 2rem;
  font-weight: bold;
  color: #2196f3;
  text-decoration: none;
  letter-spacing: 1px;
  font-family: 'Segoe UI', Arial, sans-serif;
  transition: color 0.2s;
}
.logo a:hover {
  color: #38c6ff;
}
.navbar {
  display: flex;
  gap: 2.2rem;
}
.navbar a {
  color: #222;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.08rem;
  padding: 0.3rem 1.1rem;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  font-family: 'Segoe UI', Arial, sans-serif;
  background: transparent;
}
.navbar a.active, .navbar a:hover {
  background: #e3f0ffcc;
  color: #2196f3;
  box-shadow: 0 2px 8px #4f8cff22;
}
@media (max-width: 700px) {
  .container {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  .navbar {
    width: 100%;
    gap: 0.5rem;
  }
}
</style> 