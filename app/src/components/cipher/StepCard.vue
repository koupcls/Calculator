<script setup lang="ts">
import type { CipherType, CipherMode } from '../../core/cipher/storeTypes'
import VigenereTable from './VigenereTable.vue'

interface Step {
  id: string
  type: CipherType
  mode: CipherMode
  key: string
  input: string
  output: string | null
  isLoading: boolean
  error: string | null
  visualization?: any
  alphabet?: string
}

const props = defineProps<{ step: Step; index: number }>()
defineEmits<{ (e: 'remove'): void }>()

const getCipherLabel = (t: CipherType) => t === 'vigenere' ? 'Смещение' : 'Перестановка'
const getModeLabel = (m: CipherMode) => m === 'encrypt' ? 'Зашифровать' : 'Расшифровать'
const getColumnOrder = (sorted: number[], idx: number) => sorted.indexOf(idx) + 1
</script>

<template>
  <div class="step-card" :class="{ 'has-error': step.error }">
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
        <code class="mono flow-key">{{ step.key }}</code>
      </div>
      
      <div class="flow-block">
        <span class="flow-label">Выход</span>
        <code v-if="step.isLoading" class="mono flow-value loading">Обработка...</code>
        <code v-else-if="step.error" class="mono flow-value error" :title="step.error">Ошибка</code>
        <code v-else class="mono flow-value success">{{ step.output || '—' }}</code>
      </div>
    </div>

    <!-- Визуализация Виженера -->
    <div v-if="step.type === 'vigenere' && step.output && step.alphabet" class="step-viz">
      <VigenereTable
        :input="step.input"
        :modelValue="step.key.trim()"
        :output="step.output"
        :alphabet="step.alphabet"
      />
    </div>

    <!-- Визуализация Перестановки -->
    <div v-if="step.visualization && step.type === 'columnar'" class="step-viz">
      <div class="viz-table">
        <div class="viz-row viz-header">
          <span>Ключ</span>
          <span></span>
          <span>Символы</span>
        </div>
        <div v-for="(keyChar, colIdx) in step.key.split('')" :key="colIdx" class="viz-row">
          <span class="viz-order">{{ getColumnOrder(step.visualization.sortedOrder, colIdx) }}</span>
          <span class="viz-key">{{ keyChar === ' ' ? '_' : keyChar }}</span>
          <span class="viz-symbols">
            <span v-for="(row, rowIdx) in step.visualization.table" :key="rowIdx" class="viz-symbol" :class="{ filled: row[colIdx] }">
              {{ row[colIdx] === ' ' ? '_' : (row[colIdx] || '') }}
            </span>
          </span>
        </div>
      </div>
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

.flow-value:hover {
  border-color: var(--color-primary);
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
  font-size: 11px;
  color: var(--color-text-secondary);
  background: var(--color-bg-tertiary);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  white-space: nowrap;
}

.step-viz {
  padding-top: var(--spacing-md);
  border-top: 1px dashed var(--color-border);
}

/* Перестановка */
.viz-table { display: flex; flex-direction: column; gap: 4px; }
.viz-row { display: grid; grid-template-columns: 50px 70px 1fr; gap: 4px; padding: 2px; }
.viz-header {
  padding: var(--spacing-sm);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 11px;
  color: var(--color-text-muted);
  text-transform: uppercase;
}
.viz-order, .viz-key {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm);
  font-family: var(--font-mono);
  font-size: 13px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
}
.viz-order { color: var(--color-text-secondary); font-family: var(--font-sans); }
.viz-key { color: var(--color-text); font-weight: 600; }
.viz-symbols {
  display: flex;
  gap: 2px;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow-x: auto;
  min-height: 36px;
}
.viz-symbol {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 4px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-muted);
}
.viz-symbol.filled {
  background: var(--color-bg-secondary);
  border-color: var(--color-border);
  color: var(--color-text);
  font-weight: 500;
}

@media (max-width: 900px) {
  .step-flow {
    gap: var(--spacing-md);
  }
}

@media (max-width: 768px) {
  .step-header {
    padding-bottom: var(--spacing-sm);
  }
  
  .step-info {
    gap: 6px;
  }
  
  .cipher-badge {
    padding: 3px 8px;
    font-size: 11px;
  }
  
  .mode-badge {
    padding: 3px 6px;
    font-size: 10px;
  }
  
  .step-remove {
    opacity: 1;
    width: 24px;
    height: 24px;
  }
  
  .step-flow {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
  
  .flow-divider {
    flex-direction: row;
    justify-content: center;
    gap: 6px;
  }
  
  .flow-divider .arrow {
    transform: rotate(90deg);
  }
  
  .flow-value {
    font-size: 12px;
    padding: 6px 10px;
  }
  
  .viz-row {
    grid-template-columns: 40px 60px 1fr;
  }
}

@media (max-width: 480px) {
  .step-card {
    padding: var(--spacing-sm);
  }
  
  .cipher-badge {
    padding: 2px 6px;
    font-size: 10px;
  }
  
  .mode-badge {
    padding: 2px 5px;
    font-size: 9px;
  }
  
  .flow-label {
    font-size: 9px;
  }
  
  .flow-value {
    font-size: 11px;
    padding: 5px 8px;
  }
  
  .flow-key {
    font-size: 10px;
    padding: 3px 6px;
  }
}
</style>