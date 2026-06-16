<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false
})
</script>

<template>
  <button
    :type="type"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`]"
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
  gap: var(--spacing-xs, 8px);
  
  font-family: var(--font-sans, sans-serif);
  font-weight: 500;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  
  border: 1px solid transparent;
  border-radius: var(--radius-md, 6px);
  cursor: pointer;
  user-select: none;
  transition: 
    background-color var(--transition, 0.2s), 
    border-color var(--transition, 0.2s), 
    color var(--transition, 0.2s), 
    transform 0.1s ease;
}

.btn:active:not(:disabled) {
  transform: scale(0.98);
}

.btn:focus-visible {
  outline: 2px solid var(--color-primary, #3b82f6);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}


.btn--primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}
.btn--primary:hover:not(:disabled) {
  background: var(--color-primary-hover, color-mix(in srgb, var(--color-primary) 85%, #000));
  border-color: var(--color-primary-hover, color-mix(in srgb, var(--color-primary) 85%, #000));
}

.btn--secondary {
  background: var(--color-bg-secondary, #242428);
  border-color: var(--color-border, rgba(255, 255, 255, 0.1));
  color: var(--color-text, #fff);
}
.btn--secondary:hover:not(:disabled) {
  border-color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 5%, var(--color-bg-secondary, #242428));
}

.btn--ghost {
  background: transparent;
  border-color: transparent;
  color: var(--color-text-muted, #a1a1aa);
}
.btn--ghost:hover:not(:disabled) {
  background: var(--color-bg-tertiary, rgba(255, 255, 255, 0.05));
  color: var(--color-text, #fff);
}

.btn--danger {
  background: transparent;
  border-color: var(--color-border, rgba(255, 255, 255, 0.1));
  color: var(--color-error, #ef4444);
}
.btn--danger:hover:not(:disabled) {
  background: var(--color-error, #ef4444);
  border-color: var(--color-error, #ef4444);
  color: #fff;
}


.btn--sm {
  padding: 6px 12px;
  font-size: 12px;
  height: 28px; 
}

.btn--md {
  padding: 8px 16px;
  font-size: 14px;
  height: 36px;
}

.btn--lg {
  padding: 12px 24px;
  font-size: 16px;
  height: 44px;
}
</style>