<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useCipherStore } from '../../stores/cipherStore';
import type { CipherType, CipherMode } from '../../core/cipher/storeTypes';
import Textarea from '../ui/Textarea.vue';
import Button from '../ui/Button.vue';
import Tabs from '../ui/Tabs.vue';
import AlphabetEditor from './AlphabetEditor.vue';

const store = useCipherStore();

const initialText = ref('');
const newKeyType = ref<CipherType>('vigenere');
const newKeyMode = ref<CipherMode>('encrypt');
const newKey = ref('');

const cipherTabs = [
  { id: 'vigenere' as const, label: 'Смещение' },
  { id: 'columnar' as const, label: 'Перестановка' }
];

const modeTabs = [
  { id: 'encrypt' as const, label: 'Шифровать' },
  { id: 'decrypt' as const, label: 'Расшифровать' }
];

watch(initialText, (newVal) => {
  if (store.steps.length > 0) {
    store.steps[0].input = newVal;
  }
});

const addStep = () => {
  if (!newKey.value.trim()) return;
  
  const input = store.steps.length === 0 ? initialText.value : undefined;
  const stepId = store.addStep(newKeyType.value, newKeyMode.value, newKey.value, input);
  
  newKey.value = '';
  store.runStep(stepId);
};

const getStepLabel = (step: any) => {
  const icon = step.mode === 'encrypt' ? '' : '';
  const name = step.type === 'vigenere' ? 'Виженер' : 'Перестановка';
  return `${icon} ${name} "${step.key}"`;
};

const finalOutput = computed(() => 
  store.steps.length > 0 ? store.steps[store.steps.length - 1].output : null
);

// Хелпер для визуализации: порядок столбца (1-based)
const getColumnOrder = (sortedOrder: number[], colIndex: number): number => {
  return sortedOrder.indexOf(colIndex) + 1;
};
</script>

<template>
  <div class="cipher-page">
    <!-- Алфавит -->
    <AlphabetEditor v-model="store.alphabet" placeholder="Введите символ" />

    <!-- 🔹 Начальный текст -->
    <div class="initial-input-section">
      <label>Начальный текст</label>
      <Textarea 
        v-model="initialText" 
        :rows="3" 
        placeholder="Введите слово или фразу для шифрования..." 
      />
    </div>

    <!-- 🔹 Цепочка шагов -->
    <div class="chain-section">
      <h3>Цепочка операций</h3>
      
      <div v-if="store.steps.length === 0" class="empty-chain">
        <p>Добавьте первый шаг шифрования или расшифровки</p>
      </div>

      <div v-for="(step, idx) in store.steps" :key="step.id" class="step-card">
        <div class="step-header">
          <span class="step-num">#{{ idx + 1 }}</span>
          <span class="step-title">{{ getStepLabel(step) }}</span>
          <Button variant="ghost" size="sm" @click="store.removeStep(step.id)">✕</Button>
        </div>

        <div class="step-io">
          <div class="io-block">
            <span class="io-label">Вход</span>
            <code class="mono">{{ step.input || '—' }}</code>
          </div>
          <div class="io-arrow">↓</div>
          <div class="io-block">
            <span class="io-label">Выход</span>
            <code v-if="step.isLoading" class="mono text-muted">Обработка...</code>
            <code v-else-if="step.error" class="mono text-error">{{ step.error }}</code>
            <code v-else class="mono">{{ step.output || '—' }}</code>
          </div>
        </div>

        <!-- 🔹 Визуализация для перестановки -->
        <div v-if="step.visualization && step.type === 'columnar'" class="columnar-viz-rotated">
        <div class="viz-header-bar">
            <span class="viz-title">
            {{ step.mode === 'encrypt' ? 'Шифрование' : 'Расшифровка' }}
            </span>
            <span class="viz-key">
            Ключ: <code>"{{ step.key }}"</code>
            </span>
        </div>

          <!-- Таблица -->
        <div class="vertical-table">
            <!-- Заголовки столбцов -->
            <div class="table-header">
            <div class="col-header">Ключ</div>
            <div class="col-header"></div>
            <div class="col-header">Символы</div>
            </div>

            <!-- Строки для каждого столбца ключа -->
            <div 
            v-for="(keyChar, colIdx) in step.key.split('')" 
            :key="colIdx"
            class="table-row"
            >
            <div class="cell order-cell">
                {{ getColumnOrder(step.visualization!.sortedOrder, colIdx) }}
            </div>
            <div class="cell key-cell">
                {{ keyChar === ' ' ? '_' : keyChar }}
            </div>
            <div class="cell symbols-cell">
                <span 
                v-for="(row, rowIdx) in step.visualization!.table" 
                :key="rowIdx"
                class="symbol-char"
                :class="{ filled: row[colIdx] }"
                >
                {{ row[colIdx] === ' ' ? '_' : (row[colIdx] || '') }}
                </span>
            </div>
            </div>
        </div>

        </div>
      </div>

      <!-- Форма добавления нового шага -->
      <div class="add-step-form">
        <Tabs v-model="newKeyType" :tabs="cipherTabs" />
        <Tabs v-model="newKeyMode" :tabs="modeTabs" />
        <Textarea v-model="newKey" placeholder="Ключ" :rows="1" />
        <Button 
          @click="addStep" 
          :disabled="!newKey.trim() || (store.steps.length > 0 && !store.steps[store.steps.length - 1].output)"
        >
          + Добавить шаг
        </Button>
      </div>
    </div>

    <!-- 🔹 Финальный результат -->
    <div v-if="finalOutput" class="final-output">
      <label>Итоговый результат</label>
      <code class="mono result">{{ finalOutput }}</code>
      <div class="output-actions">
      </div>
    </div>

  </div>
</template>

<style scoped>
.cipher-page {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-md);
}

.hint {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: var(--spacing-xs);
}

.initial-input-section,
.final-output {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}

.initial-input-section label,
.final-output label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 600;
  color: var(--color-text);
}

.chain-section h3 {
  margin: 0 0 var(--spacing-md) 0;
  color: var(--color-text);
  font-size: 16px;
}

.empty-chain {
  text-align: center;
  padding: var(--spacing-lg);
  color: var(--color-text-muted);
  background: var(--color-bg-secondary);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
}

.empty-chain .emoji {
  font-size: 32px;
  display: block;
  margin-bottom: var(--spacing-sm);
}

.chain-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.step-card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}

.step-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
}

.step-num {
  font-weight: 700;
  color: var(--color-primary);
  min-width: 24px;
}

.step-title {
  flex: 1;
  font-weight: 500;
}

.step-io {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--spacing-sm);
  align-items: center;
}

.io-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.io-label {
  font-size: 11px;
  color: var(--color-text-muted);
  text-transform: uppercase;
}

.io-arrow {
  color: var(--color-text-muted);
  font-size: 18px;
}

code.mono {
  font-family: var(--font-mono);
  font-size: 13px;
  padding: 4px 8px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
  word-break: break-all;
}

code.result {
  display: block;
  margin: var(--spacing-sm) 0;
  padding: var(--spacing-md);
  background: var(--color-success-bg);
  border: 1px solid var(--color-success);
  color: var(--color-text);
}

.text-error { color: var(--color-error); }

.output-actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

/* 🔹 Визуализация перестановки */
/* 🔹 Повёрнутая визуализация перестановки */
.columnar-viz-rotated {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.viz-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.viz-title {
  font-weight: 600;
  color: var(--color-text);
  font-size: 14px;
}

.viz-key {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.viz-key code {
  font-family: var(--font-mono);
  background: var(--color-bg-tertiary);
  padding: 2px 6px;
  border-radius: 3px;
  color: var(--color-primary);
}

/* Вертикальная таблица */
.vertical-table {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: var(--spacing-md);
}

.table-header {
  display: grid;
  grid-template-columns: 60px 80px 1fr;
  gap: 4px;
  padding: var(--spacing-sm);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 12px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-row {
  display: grid;
  grid-template-columns: 60px 80px 1fr;
  gap: 4px;
  padding: 2px;
  border-radius: var(--radius-sm);
  transition: background var(--transition);
}

.table-row:hover {
  background: var(--color-bg-tertiary);
}

.table-row.row-first {
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  border: 1px solid var(--color-primary);
}

.table-row.row-second {
  background: color-mix(in srgb, var(--color-success) 10%, transparent);
  border: 1px solid var(--color-success);
}

.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm);
  font-family: var(--font-mono);
  font-size: 14px;
  border-radius: var(--radius-sm);
}

.key-cell {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  font-weight: 700;
  color: var(--color-primary);
  font-size: 16px;
}

.order-cell {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  font-weight: 600;
  color: var(--color-text-secondary);
  font-family: var(--font-sans);
  font-size: 13px;
}

.symbols-cell {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  justify-content: flex-start;
  gap: 2px;
  padding: var(--spacing-sm) var(--spacing-md);
  overflow-x: auto;
  min-height: 44px;
}

.symbol-char {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 6px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 13px;
  color: var(--color-text-muted);
  transition: all var(--transition);
}

.symbol-char.filled {
  background: var(--color-bg-tertiary);
  border-color: var(--color-primary);
  color: var(--color-text);
  font-weight: 500;
}

.viz-footer {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding-top: var(--spacing-sm);
  border-top: 1px dashed var(--color-border);
  font-size: 13px;
  color: var(--color-text-secondary);
}

.read-direction {
  color: var(--color-text);
}

.read-order {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.order-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-primary);
  font-weight: 600;
}

/* Адаптивность */
@media (max-width: 640px) {
  .table-header,
  .table-row {
    grid-template-columns: 50px 70px 1fr;
  }
  
  .key-cell {
    font-size: 14px;
  }
  
  .symbol-char {
    min-width: 24px;
    height: 24px;
    font-size: 12px;
  }
}

/* 🔹 Форма добавления шага */
.add-step-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
}

.controls {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}
</style>