<script setup lang="ts">
import { useCipherStore } from '../../stores/cipherStore'
import type { CipherType, CipherMode } from '../../core/cipher/storeTypes'
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

const store = useCipherStore()

const handleSubmit = () => {
  if (props.modelValue && !props.disabled) {
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
        <span class="field-label">Выберите ключ:</span>
        <div class="chips-container">
          <button
            v-for="(keyItem, idx) in store.keys"
            :key="keyItem.id"
            type="button"
            class="key-chip"
            :class="{
              'selected': modelValue === keyItem.id && keyItem.value.trim(),
              'invalid': !keyItem.value.trim()
            }"
            :disabled="!keyItem.value.trim()"
            @click="emit('update:modelValue', keyItem.id)"
          >

            <span class="chip-title">{{ idx + 1 }}</span>
            <span v-if="keyItem.value.trim()" class="chip-preview">{{ keyItem.value }}</span>
          </button>
        </div>
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
          :disabled="!modelValue || disabled"
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
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  min-width: 0;
}

.field-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; 
  gap: var(--spacing-sm) var(--spacing-xs); 
  width: 100%;
}

.chips-container::after {
  content: "";
  flex: auto;
}

.chip-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.key-chip {
  flex: 0 1 auto; 
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  cursor: pointer;
  font-size: 13px;
  transition: all var(--transition);
  min-width: 0; 
}


.key-chip:hover {
  border-color: var(--color-primary);
}

.key-chip:hover:not(:disabled) {
  border-color: var(--color-primary);
}

.key-chip.selected {
  border-color: var(--color-primary);
  font-weight: 500;
}

.key-chip.invalid:hover {
  border-color: var(--color-error);
  background: color-mix(in srgb, var(--color-error) 4%, var(--color-bg));
  cursor: not-allowed;
}

.chip-preview {
  font-family: var(--font-mono);
  font-size: 14px;
  opacity: 1;
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chip-error-msg {
  font-size: 11px;
  color: var(--color-error);
  font-weight: 600;
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
  .form-grid {
    grid-template-columns: 1fr;
    grid-template-areas: "left" "right" "action";
  }
  .form-right { flex-direction: column; }
  .form-action { width: 100%; }
  .add-button { width: 100%; }
}
</style>