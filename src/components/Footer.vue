<template>
  <footer class="main-footer">
    <div class="footer-content">
      <span>© 2024 UsePrevention. All rights reserved.</span>
      <span>Liên hệ: <a href="mailto:support@useprevention.com">support@useprevention.com</a></span>
    </div>
  </footer>
</template>

<script setup>
// Không cần logic đặc biệt
</script>

<style scoped>
.main-footer {
  background: transparent;
  color: #1565c0;
  padding: 1.2rem 0 1.1rem 0;
  text-align: center;
  margin-top: 3rem;
  font-size: 1rem;
  box-shadow: none;
  border-radius: 10px;
}
.footer-content {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  align-items: center;
  justify-content: center;
}
.footer-content a {
  color: #1976d2;
  text-decoration: none;
}
.footer-content a:hover {
  text-decoration: underline;
}
</style> 