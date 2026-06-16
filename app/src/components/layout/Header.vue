<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ThemeToggle from '../ui/ThemeToggle.vue'

const route = useRoute()
const router = useRouter()

const tabs = [
  { path: '/trees', label: 'Кодирование' },
  { path: '/cipher', label: 'Шифрование' },
  { path: '/compression', label: 'Сжатие' }
]

const currentPath = computed(() => route.path)
const navigate = (path: string) => router.push(path)
</script>

<template>
  <header class="header">
    <div class="header-content">
      <div class="header-left" @click="navigate('/trees')">
        <span class="title">Calculator</span>
      </div>

      <nav class="desktop-nav">
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

      <div class="header-right">
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: var(--spacing-md, 16px); 
  z-index: 100;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  margin: 0 var(--spacing-md);
  transition: all var(--transition);
  background: color-mix(in srgb, var(--color-bg-secondary) 85%, transparent);
  backdrop-filter: blur(8px);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px var(--spacing-lg);
  gap: var(--spacing-md);
}

.header-left {
  cursor: pointer;
  flex-shrink: 0;
}

.title {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.5px;
  transition: opacity var(--transition);
  user-select: none;
}

.title:hover {
  opacity: 0.7;
}

.desktop-nav {
  display: flex;
  gap: 6px;
  background: var(--color-bg);
  padding: 4px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  flex: 1;
  justify-content: center;
  max-width: 600px;
}

.nav-tab {
  padding: 8px 20px;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition);
  white-space: nowrap;
}

.nav-tab:hover {
  color: var(--color-text);
  background: var(--color-bg-tertiary);
}

.nav-tab.active {
  background: var(--color-primary);
  color: #ffffff;
  box-shadow: var(--shadow-sm);
}

.header-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

@media (min-width: 1400px) {
  .header {
    margin: 0;
    border-left: none;
    border-right: none;
    border-top: none;
    border-radius: var(--radius-md);
  }
  
  .header-content {
    padding: 12px var(--spacing-xl);
  }
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .header {
    top: 0;
    margin: 0;
    border-radius: var(--radius-md);
    border-left: none;
    border-right: none;
    border-top: none;
  }

  .header-content {
    padding: 12px var(--spacing-md);
  }
}
</style>