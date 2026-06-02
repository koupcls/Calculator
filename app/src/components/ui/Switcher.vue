<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  label?: string
  icon?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const isChecked = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<template>
  <label class="switcher" :class="{ 'is-active': modelValue }">
    <div class="switch-box">
      <input
        type="checkbox"
        :checked="isChecked"
        @change="isChecked = ($event.target as HTMLInputElement).checked"
        class="sr-only"
      />
      <span class="switch-slider"></span>
    </div>
    <span v-if="icon" class="switch-icon">{{ icon }}</span>
    <span v-if="label" class="switch-label">{{ label }}</span>
  </label>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.switcher {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 12px;
  color: var(--color-text-secondary);
  cursor: pointer;
  user-select: none;
  transition: all var(--transition);
}

.switcher:hover {
  border-color: var(--color-primary);
}

.switcher.is-active {
  color: var(--color-text);
  border-color: var(--color-primary);
}

.switch-box {
  position: relative;
  width: 28px;
  height: 16px;
  flex-shrink: 0;
}

.switch-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-border);
  border-radius: 100px;
  transition: background-color var(--transition);
}

.switch-slider::before {
  position: absolute;
  content: "";
  height: 12px;
  width: 12px;
  left: 2px;
  bottom: 2px;
  background-color: var(--color-bg-secondary);
  border-radius: 50%;
  transition: transform var(--transition);
}

.switcher input:checked + .switch-slider {
  background-color: var(--color-primary);
}

.switcher input:checked + .switch-slider::before {
  transform: translateX(12px);
}

.switch-icon {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 11px;
  color: var(--color-primary);
  letter-spacing: -0.5px;
}

.switch-label {
  font-weight: 500;
}

@media (max-width: 768px) {
  .switcher {
    width: 100%;
    justify-content: center;
    padding: 8px;
  }
}

@media (max-width: 480px) {
  .switcher {
    padding: 6px;
    font-size: 11px;
  }
  
  .switch-icon {
    font-size: 10px;
  }
}
</style>