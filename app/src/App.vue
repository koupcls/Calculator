<script setup lang="ts">
import Header from './components/layout/Header.vue';
import MobileNav from './components/layout/MobileNav.vue'; // Импортируем нашу мобильную панель
</script>

<template>
  <div class="app-wrapper">
    <Header />
    
    <main class="app-main">
      <RouterView />
    </main>

    <MobileNav /> 
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
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .app-main {
    padding: var(--spacing-md);
    padding-bottom: calc(90px + env(safe-area-inset-bottom, 0)) !important; 
  }
}

@media (max-width: 480px) {
  .app-main {
    padding: var(--spacing-sm);
    padding-bottom: calc(85px + env(safe-area-inset-bottom, 0)) !important;
  }
}
</style>