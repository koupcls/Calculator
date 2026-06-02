<script setup lang="ts">
import type { CipherType, CipherMode } from '../../core/cipher/storeTypes'
import Textarea from '../ui/Textarea.vue'
import Button from '../ui/Button.vue'
import SegmentedControl from '../ui/SegmentedControl.vue'

const props = defineProps<{
  modelValue: string
  type: CipherType
  mode: CipherMode
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:type', value: CipherType): void
  (e: 'update:mode', value: CipherMode): void
  (e: 'submit'): void
}>()

const handleSubmit = () => {
  if (props.modelValue.trim() && !props.disabled) {
    emit('submit')
  }
}

const cipherOptions = ['vigenere', 'columnar'] as const
const cipherLabels = ['Смещение', 'Перестановка'] as const
const modeOptions = ['encrypt', 'decrypt'] as const
const modeLabels = ['Зашифровать', 'Расшифровать'] as const
</script>

<template>
  <div class="add-step-form">
    <div class="form-grid">
      <div class="form-left">
        <Textarea
          :model-value="modelValue"
          @update:model-value="emit('update:modelValue', $event)"
          placeholder="Введите ключ..."
          :rows="2"
          @keyup.enter.exact.prevent="handleSubmit"
        />
      </div>
      
      <div class="form-right">
        <SegmentedControl
          :model-value="type"
          :options="cipherOptions"
          :labels="cipherLabels"
          @update:model-value="emit('update:type', $event)"
        />
        <SegmentedControl
          :model-value="mode"
          :options="modeOptions"
          :labels="modeLabels"
          @update:model-value="emit('update:mode', $event)"
        />
      </div>

      <div class="form-action">
        <Button 
          variant="primary" 
          @click="handleSubmit"
          :disabled="!modelValue.trim() || disabled"
          class="add-button"
        >
          Добавить
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.add-step-form {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: var(--spacing-md);
  align-items: stretch;
}

.form-left {
  min-width: 0;
}

.form-left :deep(textarea) {
  height: 100%;
  min-height: 64px;
  resize: none;
}

.form-right {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  min-height: 64px;
}

.form-action {
  display: flex;
  align-items: center;
}

.add-button {
  height: 100%;
  min-height: 64px;
  padding: 0 var(--spacing-lg);
  font-weight: 600;
  white-space: nowrap;
}

@media (max-width: 900px) {
  .form-grid {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      "left action"
      "right action";
    gap: var(--spacing-sm);
  }

  .form-left { grid-area: left; }
  .form-right { grid-area: right; flex-direction: row; min-height: auto; }
  .form-right :deep(.segmented-control) { min-height: 36px; }
  .form-action { grid-area: action; align-self: stretch; }
  .add-button { min-height: auto; height: auto; padding: var(--spacing-sm) var(--spacing-md); }
}

@media (max-width: 640px) {
  .add-step-form { padding: var(--spacing-sm); }
  .form-grid {
    grid-template-columns: 1fr;
    grid-template-areas: "left" "right" "action";
  }
  .form-right { flex-direction: column; }
  .form-action { width: 100%; }
  .add-button { width: 100%; }
  .form-left :deep(textarea) { min-height: 56px; }
}
</style>