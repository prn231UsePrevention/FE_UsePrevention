<template>
  <div class="homepage">
    <section class="banner card">
      <div class="banner-content">
        <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Welcome Icon" class="banner-icon" />
        <h1>Chào mừng đến với <span class="brand">UsePrevention!</span></h1>
        <p>Giải pháp quản lý và phòng ngừa sử dụng hiệu quả.</p>
        <div class="actions">
          <router-link to="/login" class="btn primary">Đăng nhập</router-link>
          <!-- <router-link to="/about" class="btn btn-outline">Về chúng tôi</router-link> -->
        </div>
      </div>
    </section>
    <section class="about card">
      <h2><span class="icon">🛡️</span> Về dự án</h2>
      <p class="about-text">
        Dự án <b>UsePrevention</b> cung cấp các công cụ và giải pháp giúp bạn quản lý, theo dõi và phòng ngừa việc sử dụng tài nguyên một cách hiệu quả, an toàn và thông minh.
      </p>
    </section>
    <section class="features card">
      <h2><span class="icon">✨</span> Tính năng nổi bật</h2>
      <ul>
        <li><span class="icon">✔️</span> Quản lý người dùng và phân quyền</li>
        <li><span class="icon">✔️</span> Thống kê, báo cáo trực quan</li>
        <li><span class="icon">✔️</span> Cảnh báo và nhắc nhở thông minh</li>
        <li><span class="icon">✔️</span> Bảo mật và dễ sử dụng</li>
      </ul>
    </section>
    <BlogSection />
  </div>
</template>

<script setup>
import BlogSection from './BlogSection.vue'
// Không cần logic đặc biệt cho homepage
</script>

<style scoped>
.homepage {
  max-width: 900px;
  margin: var(--spacing-lg) auto;
  padding: var(--spacing-md);
}
.banner {
  background: linear-gradient(90deg, var(--primary-color) 0%, var(--primary-light) 100%);
  color: var(--surface-color);
  padding: var(--spacing-xl) var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  text-align: center;
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-2);
  position: relative;
  overflow: hidden;
  animation: fadeInDown 1s;
}
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-40px); }
  to { opacity: 1; transform: translateY(0); }
}
.banner-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.banner-icon {
  width: 70px;
  height: 70px;
  margin-bottom: var(--spacing-md);
  filter: drop-shadow(0 2px 8px rgba(var(--primary-color), 0.4));
}
.banner h1 {
  font-size: var(--font-size-h1);
  margin-bottom: var(--spacing-sm);
  font-weight: 700;
  color: inherit; /* Inherit color from parent (white) */
}
.brand {
  color: var(--accent-color);
  text-shadow: 0 2px 8px rgba(var(--accent-color), 0.5);
}
.banner p {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-lg);
  opacity: 0.95;
  color: inherit;
}
.actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
}
.btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  font-weight: 600;
  text-decoration: none;
  font-size: var(--font-size-md);
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
}
.btn.primary {
  background: var(--surface-color);
  color: var(--primary-color);
  border: none;
  box-shadow: var(--shadow-1);
}
.btn.primary:hover {
  background: var(--background-color);
  color: var(--primary-dark);
  box-shadow: var(--shadow-2);
}
.btn-outline {
  background: transparent;
  color: var(--surface-color);
  border: 2px solid var(--surface-color);
}
.btn-outline:hover {
  background: var(--surface-color);
  color: var(--primary-color);
}
.about, .features {
  background: var(--surface-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-1);
  text-align: left;
  animation: fadeInUp 1.1s;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
.about h2, .features h2 {
  color: var(--primary-color);
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-xl);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}
.about-text {
  color: var(--text-color-primary);
  font-size: var(--font-size-md);
  font-weight: 500;
  opacity: 0.95;
  padding-top: var(--spacing-xs);
}
.features ul {
  list-style: none;
  padding-left: 0;
}
.features li {
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-md);
  color: var(--text-color-primary);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}
.icon {
  font-size: 1.2em;
  margin-right: var(--spacing-xs);
  color: var(--primary-color);
}
@media (max-width: 768px) {
  .homepage {
    padding: var(--spacing-sm);
  }
  .banner {
    padding: var(--spacing-lg) var(--spacing-md);
  }
  .about, .features {
    padding: var(--spacing-md);
    text-align: center;
  }
  .about h2, .features h2 {
    justify-content: center;
  }
  .banner h1 {
    font-size: var(--font-size-h2);
  }
}
</style>
