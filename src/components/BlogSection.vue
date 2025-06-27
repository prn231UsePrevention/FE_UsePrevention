<template>
  <section class="blog-section card">
    <h2><span class="icon">📝</span> Blog Chia sẻ Kinh nghiệm</h2>
    <div v-if="mockBlogPosts.length" class="blog-grid">
      <div v-for="post in mockBlogPosts" :key="post.id" class="blog-card">
        <h3>{{ post.title }}</h3>
        <p class="blog-meta">Bởi {{ post.author }} vào ngày {{ formatDate(post.date) }}</p>
        <p class="blog-excerpt">{{ post.excerpt }}</p>
        <router-link :to="`/blog/${post.id}`" class="btn primary">Đọc thêm</router-link>
      </div>
    </div>
    <div v-else class="status-message">
      Hiện chưa có bài viết blog nào.
    </div>
  </section>
</template>

<script setup>
import { mockBlogPosts } from '@/data/mockData'

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('vi-VN', options)
}
</script>

<style scoped>
.blog-section {
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.blog-section h2 {
  color: var(--primary-color);
  margin-bottom: var(--spacing-lg);
  font-size: var(--font-size-h3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  max-width: 900px;
  margin: 0 auto;
}

.blog-card {
  background: var(--surface-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-2);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  text-align: left;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.blog-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-3);
}

.blog-card h3 {
  font-size: var(--font-size-xl);
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-sm);
}

.blog-meta {
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  margin-bottom: var(--spacing-md);
}

.blog-excerpt {
  font-size: var(--font-size-md);
  color: var(--text-color-primary);
  flex-grow: 1;
  margin-bottom: var(--spacing-lg);
}

.btn {
  align-self: flex-end; /* Align button to the right */
}

.status-message {
  font-size: var(--font-size-lg);
  color: var(--text-color-secondary);
  padding: var(--spacing-xl);
  background: var(--surface-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-1);
  max-width: 600px;
  margin: 0 auto;
}
</style>
