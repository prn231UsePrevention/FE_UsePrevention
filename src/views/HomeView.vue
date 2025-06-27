<template>
  <div class="homepage">
    <section class="banner">
      <div class="banner-content">
        <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Welcome Icon" class="banner-icon" />
        <h1>Chào mừng đến với <span class="brand">UsePrevention!</span></h1>
        <p>Giải pháp quản lý và phòng ngừa sử dụng hiệu quả.</p>
        <div class="actions">
          <router-link to="/login" class="btn">Đăng nhập</router-link>
          <!-- <router-link to="/about" class="btn btn-outline">Về chúng tôi</router-link> -->
        </div>
      </div>
    </section>
    <section class="about">
      <h2><span class="icon">🛡️</span> Về dự án</h2>
      <p class="about-text">
        Dự án <b>UsePrevention</b> cung cấp các công cụ và giải pháp giúp bạn quản lý, theo dõi và phòng ngừa việc sử dụng tài nguyên một cách hiệu quả, an toàn và thông minh.
      </p>
    </section>
    <section class="features">
      <h2><span class="icon">✨</span> Tính năng nổi bật</h2>
      <ul>
        <li><span class="icon">✔️</span> Quản lý người dùng và phân quyền</li>
        <li><span class="icon">✔️</span> Thống kê, báo cáo trực quan</li>
        <li><span class="icon">✔️</span> Cảnh báo và nhắc nhở thông minh</li>
        <li><span class="icon">✔️</span> Bảo mật và dễ sử dụng</li>
      </ul>
    </section>
  </div>
</template>

<script setup>
// Không cần logic đặc biệt cho homepage
</script>

<style scoped>
.homepage {
  max-width: 900px;
  margin: 0 auto;
  padding: 2.5rem 1rem 1.5rem 1rem;
  font-family: 'Segoe UI', Arial, sans-serif;
}
.banner {
  background: linear-gradient(90deg, #4f8cff 0%, #38c6ff 100%);
  color: #fff;
  padding: 3.5rem 2rem 3rem 2rem;
  border-radius: 22px;
  text-align: center;
  margin-bottom: 2.5rem;
  box-shadow: 0 6px 32px rgba(79,140,255,0.13);
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
  margin-bottom: 1.2rem;
  filter: drop-shadow(0 2px 8px #38c6ff44);
}
.banner h1 {
  font-size: 2.7rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}
.brand {
  color: #fff;
  text-shadow: 0 2px 8px #38c6ff55;
}
.banner p {
  font-size: 1.25rem;
  margin-bottom: 1.7rem;
  opacity: 0.95;
}
.actions {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
}
.btn {
  background: #fff;
  color: #4f8cff;
  border: none;
  padding: 0.8rem 1.7rem;
  border-radius: 9px;
  font-weight: 600;
  text-decoration: none;
  font-size: 1.08rem;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(79,140,255,0.10);
}
.btn:hover {
  background: #e6f0ff;
  color: #2b6edb;
  box-shadow: 0 4px 16px rgba(79,140,255,0.13);
}
.btn-outline {
  background: transparent;
  color: #fff;
  border: 2px solid #fff;
}
.btn-outline:hover {
  background: #fff;
  color: #4f8cff;
}
.about, .features {
  background: #f7faff;
  border-radius: 14px;
  padding: 2rem 1.5rem;
  margin-bottom: 1.7rem;
  box-shadow: 0 2px 8px rgba(79,140,255,0.06);
  text-align: left;
  animation: fadeInUp 1.1s;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
.about h2, .features h2 {
  color: #4f8cff;
  margin-bottom: 0.7rem;
  font-size: 1.35rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.about-text {
  color: #222;
  font-size: 1.08rem;
  font-weight: 500;
  opacity: 0.95;
  padding-top: 0.2rem;
}
.features ul {
  padding-left: 1.2rem;
}
.features li {
  margin-bottom: 0.5rem;
  font-size: 1.08rem;
  color: #2b6edb;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.icon {
  font-size: 1.2em;
  margin-right: 0.3em;
}
@media (max-width: 700px) {
  .homepage {
    padding: 1rem 0.2rem;
  }
  .banner {
    padding: 2rem 0.5rem 1.5rem 0.5rem;
  }
  .about, .features {
    padding: 1.2rem 0.5rem;
    text-align: center;
  }
  .about h2, .features h2 {
    justify-content: center;
  }
  .banner h1 {
    font-size: 2rem;
  }
}
</style>
