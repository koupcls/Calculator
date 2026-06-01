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
  padding: var(--spacing-md);
  font-family: var(--font-mono);
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  resize: vertical;
  transition: border-color var(--transition), box-shadow var(--transition);
}

.textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
}

.textarea--error {
  border-color: var(--color-error);
}

.error-msg {
  font-size: 12px;
  color: var(--color-error);
}
</style>