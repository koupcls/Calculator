<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const isDark = ref(false)

onMounted(() => {
  const saved = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDark.value = saved === 'dark' || (!saved && prefersDark)
  applyTheme()
})

watch(isDark, applyTheme)

function applyTheme() {
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}
</script>

<template>
  <button 
    class="theme-toggle" 
    :class="{ 'is-dark': isDark }"
    @click="isDark = !isDark" 
    :aria-label="isDark ? 'Включить светлую тему' : 'Включить темную тему'"
    :title="isDark ? 'Светлая тема' : 'Темная тема'"
  >
    <div class="icon-wrapper">
      <svg class="icon icon-sun" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2"/>
        <path d="M12 20v2"/>
        <path d="m4.93 4.93 1.41 1.41"/>
        <path d="m17.66 17.66 1.41 1.41"/>
        <path d="M2 12h2"/>
        <path d="M20 12h2"/>
        <path d="m6.34 17.66-1.41 1.41"/>
        <path d="m19.07 4.93-1.41 1.41"/>
      </svg>
      
      <!-- Луна (показывается при светлой теме, чтобы переключить на темную) -->
      <svg class="icon icon-moon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    </div>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: color-mix(in srgb, var(--color-bg-secondary) 50%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-border) 30%, transparent);
  border-radius: 12px;
  color: var(--color-text-secondary);
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-toggle:hover {
  background: color-mix(in srgb, var(--color-text) 5%, transparent);
  color: var(--color-primary);
  border-color: color-mix(in srgb, var(--color-primary) 30%, transparent);
  box-shadow: 0 0 12px color-mix(in srgb, var(--color-primary) 20%, transparent);
}

.theme-toggle:active {
  transform: scale(0.92);
}

.icon-wrapper {
  position: relative;
  width: 20px;
  height: 20px;
}

.icon {
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease;
}

.icon-sun {
  transform: translateY(0) rotate(0);
  opacity: 1;
}
.is-dark .icon-sun {
  transform: translateY(-30px) rotate(-90deg);
  opacity: 0;
}

.icon-moon {
  transform: translateY(30px) rotate(90deg);
  opacity: 0;
}
.is-dark .icon-moon {
  transform: translateY(0) rotate(0);
  opacity: 1;
}
</style>