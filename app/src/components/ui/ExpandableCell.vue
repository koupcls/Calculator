<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  text: string | null | undefined
}>()

const isExpanded = ref(false)
</script>

<template>
  <div 
    v-if="text" 
    class="expandable-cell" 
    :class="{ 'is-expanded': isExpanded }"
    @click="isExpanded = !isExpanded"
    :title="isExpanded ? 'Кликните, чтобы свернуть' : 'Кликните, чтобы развернуть'"
  >
    {{ text }}
  </div>
  <span v-else class="empty-dash">-</span>
</template>

<style scoped>
.expandable-cell {
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease-in-out;
  font-family: var(--font-mono);
  font-size: 13px;
}

/* Свернутое состояние (Ограничение по ширине + троеточие) */
.expandable-cell:not(.is-expanded) {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.expandable-cell:not(.is-expanded):hover {
  color: var(--color-primary);
  text-decoration: underline;
}

/* Развернутое состояние (Растет вниз + внутренний вертикальный скролл) */
.expandable-cell.is-expanded {
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 150px;
  overflow-y: auto;
  background: var(--color-bg);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-sm);
  padding: 6px var(--spacing-sm);
  box-shadow: inset var(--shadow-sm);
}

/* Кастомизация встроенного скроллбара для раскрытой ячейки */
.expandable-cell.is-expanded::-webkit-scrollbar {
  width: 4px;
}
.expandable-cell.is-expanded::-webkit-scrollbar-track {
  background: transparent;
}
.expandable-cell.is-expanded::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--radius-sm);
}

.empty-dash {
  color: var(--color-text-muted);
}
</style>