<template>
  <div class="blog-detail-container card">
    <div v-if="post">
      <h1>{{ post.title }}</h1>
      <p class="blog-meta">Bởi {{ post.author }} vào ngày {{ formatDate(post.date) }}</p>
      <div class="blog-content" v-html="post.content"></div>
      <button @click="goBack" class="btn primary">Quay lại Blog</button>
    </div>
    <div v-else class="status-message">
      Không tìm thấy bài viết blog này.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mockBlogPosts } from '@/data/mockData'

const route = useRoute()
const router = useRouter()
const post = ref(null)

onMounted(() => {
  const postId = route.params.id
  post.value = mockBlogPosts.find(p => p.id === postId)
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('vi-VN', options)
}

const goBack = () => {
  router.push('/') // Navigate back to the main blog section on the homepage
}
</script>

<style scoped>
.blog-detail-container {
  max-width: 800px;
  margin: var(--spacing-xl) auto;
  padding: var(--spacing-xl);
  text-align: left;
}

.blog-detail-container h1 {
  font-size: var(--font-size-h2);
  color: var(--primary-color);
  margin-bottom: var(--spacing-md);
}

.blog-meta {
  font-size: var(--font-size-md);
  color: var(--text-color-secondary);
  margin-bottom: var(--spacing-lg);
}

.blog-content {
  font-size: var(--font-size-lg);
  line-height: 1.8;
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-xl);
}

.blog-content p {
  margin-bottom: var(--spacing-md);
}

.blog-content ul {
  list-style: disc;
  margin-left: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

.blog-content li {
  margin-bottom: var(--spacing-xs);
}

.btn {
  display: inline-block;
  margin-top: var(--spacing-lg);
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
  text-align: center;
}
</style>
