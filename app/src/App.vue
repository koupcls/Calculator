<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ThemeToggle from './components/ui/ThemeToggle.vue';

const route = useRoute();
const router = useRouter();

const tabs = [
  { path: '/trees', label: 'Кодирование' },
  { path: '/cipher', label: 'Шифрование' },
  { path: '/compression', label: 'Сжатие' },
];

const currentPath = computed(() => route.path);

const navigate = (path: string) => {
  router.push(path);
};
</script>

<template>
  <ThemeToggle />
  
  <header class="app-header">
    <h1 class="app-title">Crypto Lab</h1>
    
    <nav class="app-nav">
      <button
        v-for="tab in tabs"
        :key="tab.path"
        class="nav-tab"
        :class="{ active: currentPath === tab.path }"
        @click="navigate(tab.path)"
      >
        {{ tab.label }}
      </button>
    </nav>
  </header>

  <main class="app-main">
    <RouterView />
  </main>
</template>

<style>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.app-nav {
  display: flex;
  gap: var(--spacing-xs);
  background: var(--color-bg);
  padding: 4px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.nav-tab {
  padding: var(--spacing-sm) var(--spacing-md);
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition);
}

.nav-tab:hover {
  color: var(--color-text);
  background: var(--color-bg-tertiary);
}

.nav-tab.active {
  background: var(--color-primary);
  color: #fff;
}

.app-main {
  padding: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: flex-start;
  }
  
  .app-nav {
    width: 100%;
  }
  
  .nav-tab {
    flex: 1;
    text-align: center;
  }
}
</style>