<script setup lang="ts">
import Header from './components/layout/Header.vue';
import MobileNav from './components/layout/MobileNav.vue';
</script>

<template>
  <div class="app-wrapper">
    <Header />
    
    <main class="app-main">
      <RouterView v-slot="{ Component }">
        <Transition name="fade-pure" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
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
  /* Важно: предотвращает горизонтальные полосы прокрутки при анимации */
  overflow-x: hidden; 
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

.fade-pure-enter-from,
.fade-pure-leave-to {
  opacity: 0;
}
.fade-pure-enter-active {
  transition: opacity 0.2s cubic-bezier(0.25, 1, 0.5, 1);
}
.fade-pure-leave-active {
  transition: opacity 0.15s cubic-bezier(0.25, 1, 0.5, 1);
}
</style>