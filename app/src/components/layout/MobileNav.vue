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

// Определяем текущую вкладку
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
</script>

<template>
  <div class="mobile-nav-container">
    <Transition name="fade">
      <div v-if="isOpen" class="nav-overlay" @click="isOpen = false"></div>
    </Transition>

    <div class="nav-popup" :class="{ 'is-open': isOpen }">
      <div class="popup-header">Выберите раздел</div>
      <div class="popup-list">
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
    </div>

    <nav class="mobile-bottom-nav" @click="toggleMenu">
      <div class="current-info">
        <span class="current-label">{{ currentTab.label }}</span>
        <span class="arrow-icon" :class="{ rotated: isOpen }">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
        </span>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.mobile-nav-container {
  display: none;
}

@media (max-width: 768px) {
  .mobile-nav-container {
    display: block;
    height: calc(56px + env(safe-area-inset-bottom, 0));
  }
  .nav-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 30px;
    background: rgba(0, 0, 0, 0.4);
    z-index: 99;
  }

  .nav-popup {
    position: fixed;
    bottom: 30px;
    left: 0;
    right: 0;
    background: var(--color-bg-secondary);
    border-radius: 16px 16px 0 0;
    border-top: 1px solid var(--color-border);
    z-index: 100;
    padding: 16px 16px calc(75px + env(safe-area-inset-bottom, 0)) 16px;
    transform: translateY(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  }

  .nav-popup.is-open {
    transform: translateY(0);
  }

  .popup-header {
    font-size: 13px;
    color: var(--color-text-muted);
    text-align: center;
    margin-bottom: 12px;
    font-weight: 500;
  }

  .popup-list {
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
    border-radius: 10px;
    color: var(--color-text);
    font-size: 16px;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .popup-item:active {
    background: color-mix(in srgb, var(--color-border) 50%, transparent);
  }

  .popup-item.active {
    color: var(--color-primary);
    background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  }

  .checkmark {
    font-weight: bold;
    font-size: 18px;
  }

  .mobile-bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: color-mix(in srgb, var(--color-bg-secondary) 90%, transparent);
    backdrop-filter: blur(10px);
    border-top: 1px solid var(--color-border);
    z-index: 101;
    padding-bottom: env(safe-area-inset-bottom, 0);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .current-info {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--color-primary);
    font-weight: 600;
    font-size: 16px;
  }

  .arrow-icon {
    display: flex;
    align-items: center;
    transition: transform 0.2s ease;
  }

  .arrow-icon.rotated {
    transform: rotate(180deg);
  }

  /* Анимация плавного появления оверлея */
  .fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
  .fade-enter-from, .fade-leave-to { opacity: 0; }
}
</style>