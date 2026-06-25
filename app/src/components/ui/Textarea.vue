<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  error?: string
  rows?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const value = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})
</script>

<template>
  <div class="textarea-wrapper">
    <textarea
      v-model="value"
      :placeholder="placeholder"
      :rows="rows || 4"
      class="textarea"
      :class="{ 'textarea--error': error }"
    />
    <span v-if="error" class="error-msg">{{ error }}</span>
  </div>
</template>

<style scoped>
.textarea-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.textarea {
  width: 100%;
  font-family: var(--font-mono, monospace);
  font-size: 14px;
  padding: var(--spacing-sm, 10px);
  background: var(--color-bg, #ffffff);
  color: var(--color-text, #000000);
  border: 1px solid var(--color-border, #ccc);
  border-radius: var(--radius-md, 6px);
  outline: none;
  resize: vertical;
  line-height: 1.4;
  transition: border-color 0.2s ease;
}

.textarea:focus {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
  border-color: var(--color-primary, #4f46e5);
}

.textarea--error {
  border-color: var(--color-error);
}

.error-msg {
  font-size: 12px;
  color: var(--color-error);
}
</style>