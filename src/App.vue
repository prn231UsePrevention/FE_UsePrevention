<template>
  <div class="app-bg">
    <AppHeader />
    <div class="app-wrapper">
      <main class="app-content">
        <RouterView />
      </main>
      <Footer />
    </div>
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
import Footer from './components/Footer.vue'
import { RouterView } from 'vue-router'
</script>

<style scoped>
.app-bg {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, rgba(230, 200, 160, 0.32), rgba(200, 180, 140, 0.28)), url('https://images.unsplash.com/photo-1470219556762-1771e7f9427d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2089&q=80') center/cover no-repeat;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
}
.app-wrapper {
  width: 100vw;
  max-width: none;
  margin: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  box-sizing: border-box;
  background: none;
  box-shadow: none;
  padding: 0;
}

.app-content {
  flex-grow: 1;
  width: 100vw;
  max-width: none;
  padding: 0;
  background: none;
}

/* Remove old header/nav styles as they are now handled by Header.vue component or global styles */
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
