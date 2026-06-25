<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const isOpen = ref(false)

const tabs = [
  { path: '/trees', label: 'Кодирование' },
  { path: '/cipher', label: 'Шифрование' },
  { path: '/compression', label: 'Сжатие' }
]

const isHomePage = computed(() => route.path === '/')

const currentTab = computed(() => {
  return tabs.find(tab => tab.path === route.path) || tabs[0]
})

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const navigate = (path: string) => {
  router.push(path)
  isOpen.value = false
}

const goHome = () => {
  router.push('/')
  isOpen.value = false
}
</script>

<template>
  <div v-if="!isHomePage" class="mobile-nav-container">
    <Transition name="fade">
      <div v-if="isOpen" class="nav-overlay" @click="isOpen = false"></div>
    </Transition>

    <Transition name="slide-up">
      <div v-if="isOpen" class="nav-popup">
        <button
          v-for="tab in tabs"
          :key="tab.path"
          class="popup-item"
          :class="{ active: currentTab.path === tab.path }"
          @click="navigate(tab.path)"
        >
          <span class="popup-label">{{ tab.label }}</span>
          <span v-if="currentTab.path === tab.path" class="checkmark">✓</span>
        </button>
      </div>
    </Transition>

    <div class="floating-controls">
      <button class="control-btn btn-home" @click="goHome">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </button>

      <button class="control-btn btn-pill" @click="toggleMenu">
        <span class="current-label">{{ currentTab.label }}</span>
        <span class="arrow-icon" :class="{ rotated: isOpen }">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.mobile-nav-container {
  display: none;
}

@media (max-width: 768px) {
  .mobile-nav-container {
    display: block;
    height: calc(72px + env(safe-area-inset-bottom, 0));
  }

  .nav-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    z-index: 99;
  }

  /* Плавающий контейнер кнопок */
  .floating-controls {
    position: fixed;
    bottom: calc(24px + env(safe-area-inset-bottom, 0));
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 12px;
    z-index: 101;
  }

  /* Общий стиль для кнопок-островов */
  .control-btn {
    background: color-mix(in srgb, var(--color-bg-secondary) 85%, transparent);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid color-mix(in srgb, var(--color-border) 60%, transparent);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    color: var(--color-text);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: transform 0.2s ease, background 0.2s ease;
  }

  .control-btn:active {
    transform: scale(0.96);
    background: var(--color-bg-tertiary);
  }

  .btn-home {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .btn-pill {
    min-width: 220px;
    height: 52px;
    padding: 0 24px;
    border-radius: 26px;
    gap: 8px;
    font-weight: 600;
    font-size: 15px;
  }

  .arrow-icon {
    display: flex;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .arrow-icon.rotated {
    transform: rotate(180deg);
  }

  .nav-popup {
    position: fixed;
    bottom: calc(86px + env(safe-area-inset-bottom, 0));
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 48px);
    max-width: 320px;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 20px;
    padding: 8px;
    z-index: 100;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .popup-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    background: transparent;
    border: none;
    border-radius: 12px;
    color: var(--color-text);
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .popup-item:active {
    background: var(--color-bg-tertiary);
  }

  .popup-item.active {
    color: var(--color-primary);
    background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  }

  .checkmark {
    font-weight: bold;
    font-size: 16px;
  }

  .fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
  .fade-enter-from, .fade-leave-to { opacity: 0; }

  .slide-up-enter-active, .slide-up-leave-active { 
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
  }
  .slide-up-enter-from, .slide-up-leave-to { 
    opacity: 0;
    transform: translate(-50%, 20px) scale(0.95);
  }
}
</style>