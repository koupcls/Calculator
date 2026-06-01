<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}>()
</script>

<template>
  <button
    class="btn"
    :class="[`btn--${variant || 'primary'}`, `btn--${size || 'md'}`]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  font-family: var(--font-sans);
  font-weight: 500;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition);
  background: var(--color-bg-secondary);
  color: var(--color-text);
}

.btn:hover:not(:disabled) {
  background: var(--color-bg-tertiary);
  border-color: var(--color-primary);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn--primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.btn--primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.btn--secondary {
  background: var(--color-bg-secondary);
}

.btn--ghost {
  background: transparent;
  border-color: transparent;
}

.btn--sm { padding: 6px 12px; font-size: 12px; }
.btn--md { padding: 8px 16px; font-size: 14px; }
.btn--lg { padding: 12px 24px; font-size: 16px; }
</style>