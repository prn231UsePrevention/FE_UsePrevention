<template>
  <footer class="main-footer">
    <div class="container footer-content">
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
  background-color: var(--primary-dark); /* Darker primary color for a strong footer */
  color: var(--surface-color); /* White text for contrast */
  padding: var(--spacing-lg) 0; /* Generous padding */
  text-align: center;
  margin-top: auto; /* Push footer to the bottom */
  font-size: var(--font-size-md);
  box-shadow: var(--shadow-2); /* Subtle shadow */
  width: 100%; /* Full width */
}
.footer-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  align-items: center;
  justify-content: center;
}
.footer-content a {
  color: var(--accent-color); /* Accent color for links */
  text-decoration: none;
  transition: text-decoration 0.2s ease-in-out;
}
.footer-content a:hover {
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .main-footer {
    padding: var(--spacing-md) 0;
  }
}
</style> 