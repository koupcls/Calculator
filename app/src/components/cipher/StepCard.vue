<script setup lang="ts">
import { computed } from 'vue'
import { useCipherStore } from '../../stores/cipherStore'
import type { CipherType, CipherMode } from '../../core/cipher/storeTypes'
import VigenereTable from './VigenereTable.vue'
import type { CipherStep as Step } from '../../core/cipher/storeTypes'
import ColumnarTable from './ColumnarTable.vue'

const props = defineProps<{ step: Step }>()
defineEmits<{ (e: 'remove'): void }>()

const store = useCipherStore()

const originalKey = computed(() => store.keys.find(k => k.id === props.step.keyId))
const isKeyEmpty = computed(() => !originalKey.value?.value?.trim())

const getCipherLabel = (t: CipherType) => t === 'vigenere' ? 'Смещение' : 'Перестановка'
const getModeLabel = (m: CipherMode) => m === 'encrypt' ? 'Зашифровать' : 'Расшифровать'
</script>

<template>
  <div class="step-card" :class="{ 'has-error': step.error || isKeyEmpty }">
    <div class="step-header">
      <div class="step-info">
        <span class="cipher-badge">
          {{ getCipherLabel(step.type) }}
        </span>
        <span class="mode-badge" :class="step.mode">
          {{ getModeLabel(step.mode) }}
        </span>
      </div>
      
      <button class="step-remove" @click="$emit('remove')" aria-label="Удалить шаг">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <div class="step-flow">
      <div class="flow-block">
        <span class="flow-label">Вход</span>
        <code class="mono flow-value">{{ step.input || '—' }}</code>
      </div>
      
      <div class="flow-divider">
        <svg class="arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        <code class="mono flow-key" :class="{ 'key-error': isKeyEmpty }">
          {{ originalKey ? ( isKeyEmpty ? `Ключ ${step.keyIdx} пуст` : step.key ) : 'Ключ удалён' }}
        </code>
      </div>
      
      <div class="flow-block">
        <span class="flow-label">Выход</span>
        <code v-if="step.isLoading" class="mono flow-value loading">Обработка...</code>
        <code v-else-if="isKeyEmpty" class="mono flow-value loading">-</code>
        <code v-else-if="step.error" class="mono flow-value error" :title="step.error ?? undefined">Ошибка</code>
        <code v-else class="mono flow-value success">{{ step.output || '—' }}</code>
      </div>
    </div>

    <div v-if="step.type === 'vigenere' && step.output && step.alphabet && !isKeyEmpty">
      <VigenereTable
        :input="step.input"
        :modelValue="step.key.trim()"
        :output="step.output"
        :alphabet="step.alphabet"
      />
    </div>

    <div v-if="step.visualization && step.type === 'columnar' && !isKeyEmpty">
      <ColumnarTable
        :visualization="step.visualization"
        :cipher-key="step.key"
      />
    </div>
  </div>
</template>

<style scoped>
.step-card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  transition: border-color var(--transition), box-shadow var(--transition);
}

.step-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.step-card.has-error {
  border-color: var(--color-error);
  background: color-mix(in srgb, var(--color-error) 5%, var(--color-bg));
}

.step-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
}

.step-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.cipher-badge {
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.mode-badge {
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-muted);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.mode-badge.encrypt {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.mode-badge.decrypt {
  color: var(--color-success);
  border-color: var(--color-success);
}

.step-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  cursor: pointer;
  opacity: 0;
  transition: all var(--transition);
  flex-shrink: 0;
}

.step-card:hover .step-remove {
  opacity: 1;
}

.step-remove:hover {
  background: var(--color-error);
  border-color: var(--color-error);
  color: #fff;
}

.step-flow {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--spacing-lg);
  align-items: start;
}

.flow-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.flow-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.flow-value {
  font-size: 13px;
  padding: 8px 12px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  word-break: break-all;
  line-height: 1.4;
  transition: border-color var(--transition);
}

.flow-value.loading {
  color: var(--color-text-muted);
  font-style: italic;
}

.flow-value.error {
  color: var(--color-error);
  border-color: var(--color-error);
  background: color-mix(in srgb, var(--color-error) 10%, var(--color-bg-secondary));
  cursor: help;
}

.flow-value.success {
  color: var(--color-text);
  border-color: var(--color-success);
  background: color-mix(in srgb, var(--color-success) 10%, var(--color-bg-secondary));
  font-weight: 500;
}

.flow-divider {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.flow-divider .arrow {
  color: var(--color-primary);
  flex-shrink: 0;
}

.flow-key {
  font-size: 13px;
  color: var(--color-text-secondary);
  background: var(--color-bg-secondary);
  padding: 6px 10px;
  border-radius: calc(var(--radius-sm) * 1.2);
  border: 1px solid var(--color-border);
  max-width: 150px;
  overflow-wrap: break-word;
  word-break: break-all;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04), 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: background 0.2s ease, transform 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.flow-key.key-error {
  border-color: var(--color-error);
  color: var(--color-error);
  background: color-mix(in srgb, var(--color-error) 10%, var(--color-bg));
  font-weight: 600;
}

@media (max-width: 768px) {
  .step-flow {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }

  .flow-divider .arrow {
    transform: rotate(90deg);
  }
}
</style>