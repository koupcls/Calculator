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
  <button class="theme-toggle" @click="isDark = !isDark" aria-label="Переключить тему">
    <span v-if="isDark">☀️</span>
    <span v-else>🌙</span>
  </button>
</template>

<style scoped>
.theme-toggle {
  position: fixed;
  top: var(--spacing-md);
  right: var(--spacing-md);
  width: 40px;
  height: 40px;
  font-size: 18px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition);
  z-index: 100;
}

.theme-toggle:hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-primary);
}
</style>