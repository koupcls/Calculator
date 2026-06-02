<script setup lang="ts" generic="T extends string">
defineProps<{
  modelValue: T
  options: readonly [T, T]
  labels: readonly [string, string]
}>()

defineEmits<{
  (e: 'update:modelValue', value: T): void
}>()
</script>

<template>
  <div class="segmented-control">
    <button
      type="button"
      class="segment"
      :class="{ active: modelValue === options[0] }"
      @click="$emit('update:modelValue', options[0])"
    >
      {{ labels[0] }}
    </button>
    <button
      type="button"
      class="segment"
      :class="{ active: modelValue === options[1] }"
      @click="$emit('update:modelValue', options[1])"
    >
      {{ labels[1] }}
    </button>
  </div>
</template>

<style scoped>
.segmented-control {
  display: flex;
  flex: 1;
  gap: 2px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  height: 100%;
}

.segment {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--spacing-sm);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all var(--transition);
  min-height: 32px;
}

.segment:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text);
}

.segment.active {
  background: var(--color-primary);
  color: #ffffff;
}
</style>