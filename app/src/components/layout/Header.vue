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
const isHomePage = computed(() => route.path === '/')

const navigate = (path: string) => router.push(path)
</script>

<template>
  <header class="header-wrapper">
    <div class="header-glass">
      <div class="header-content">
        <!-- Логотип -->
        <div class="header-left" @click="navigate('/')">
          <span class="title">Calculator</span>
        </div>

        <!-- Навигация -->
        <nav v-if="!isHomePage" class="desktop-nav">
          <div class="nav-container">
            <button
              v-for="tab in tabs"
              :key="tab.path"
              class="nav-tab"
              :class="{ active: currentPath === tab.path }"
              @click="navigate(tab.path)"
            >
              {{ tab.label }}
              <!-- Индикатор активной вкладки -->
              <span v-if="currentPath === tab.path" class="active-indicator"></span>
            </button>
          </div>
        </nav>

        <!-- Правая часть -->
        <div class="header-right">
          <ThemeToggle />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header-wrapper {
  position: sticky;
  top: 8px;
  z-index: 100;
  width: 100%;
  padding: 0 var(--spacing-md);
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.header-glass {
  pointer-events: auto;
  width: 100%;
  max-width: 1200px;
  background: color-mix(in srgb, var(--color-bg-secondary) 75%, transparent);
  backdrop-filter: blur(20px) saturate(150%);
  border: 1px solid color-mix(in srgb, var(--color-border) 50%, transparent);
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease;
}

.header-glass:hover {
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.08);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  gap: var(--spacing-md);
}

.header-left {
  display: flex;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
}

.header-left:hover .title {
  transform: scale(1.05);
}

.title {
  display: inline-block;
  font-size: 18px;
  font-weight: 750;
  letter-spacing: -0.5px;
  color: var(--color-text);
  user-select: none;
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.desktop-nav {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-container {
  display: flex;
  gap: 4px;
  background: color-mix(in srgb, var(--color-bg-secondary) 50%, transparent);
  padding: 4px;
  border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--color-border) 30%, transparent);
}

.nav-tab {
  position: relative;
  padding: 8px 20px;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

.nav-tab:hover {
  color: var(--color-text);
  background: color-mix(in srgb, var(--color-text) 5%, transparent);
}

.nav-tab.active {
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
}

.active-indicator {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  border-radius: 4px;
  background: var(--color-primary);
}

.header-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

@media (max-width: 768px) {
.header-wrapper {
    padding: 0 0;
    top: 0px;
  }
  .header-glass{
    border-radius: 0px;
  }
  .desktop-nav {
    display: none;
  }
}
</style>
