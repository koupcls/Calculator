<script setup lang="ts" generic="T extends string">
import { computed } from 'vue'

const props = defineProps<{
  tabs: { id: T; label: string }[]
  modelValue: T
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: T): void
}>()

const activeIndex = computed(() => 
  props.tabs.findIndex(t => t.id === props.modelValue)
)
</script>

<template>
  <div class="tabs" role="tablist">
    <button
      v-for="(tab, i) in tabs"
      :key="tab.id"
      role="tab"
      :aria-selected="i === activeIndex"
      class="tab"
      :class="{ active: i === activeIndex }"
      @click="emit('update:modelValue', tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.tab {
  flex: 1;
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

.tab:hover {
  color: var(--color-text);
  background: var(--color-bg-tertiary);
}

.tab.active {
  background: var(--color-primary);
  color: #fff;
}
</style>