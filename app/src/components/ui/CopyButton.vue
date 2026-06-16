<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

const props = defineProps<{
  text: string
}>()

const isCopied = ref(false)
let timeoutId: ReturnType<typeof setTimeout> | null = null

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.text)
    isCopied.value = true

    if (timeoutId) clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Не удалось скопировать текст: ', err)
  }
}

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

<template>
  <button
    class="copy-btn"
    :class="{ 'is-copied': isCopied }"
    @click="handleCopy"
    type="button"
    title="Копировать"
  >
    <svg
      v-if="isCopied"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>

    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
</template>

<style scoped>
.copy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition);
}

.copy-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background: var(--color-bg-secondary);
}

.copy-btn.is-copied {
  color: var(--color-success);
  border-color: var(--color-success);
  background: var(--color-success-bg);
}

.icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}
</style>