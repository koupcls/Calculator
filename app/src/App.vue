<script setup lang="ts">
import Header from './components/layout/Header.vue';
</script>

<template>
  <div class="app-wrapper">
    <Header />
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  padding: var(--spacing-lg);
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

@media (max-width: 768px) {
  body {
    padding: var(--spacing-md);
  }
  
  .app-main {
    padding: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  body {
    padding: var(--spacing-sm);
  }
  
  .app-main {
    padding: var(--spacing-sm);
  }
}
</style>