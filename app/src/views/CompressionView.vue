<script setup lang="ts">
import { useCompressionStore } from '../stores/compressionStore.ts'
import type { CompressionAlgorithm } from '../stores/compressionStore'
import Textarea from '../components/ui/Textarea.vue'
import Button from '../components/ui/Button.vue'
import Tabs from '../components/ui/Tabs.vue'
import AlphabetEditor from '../components/cipher/AlphabetEditor.vue'

const store = useCompressionStore()

const algorithms = [
  { id: 'lz77' as CompressionAlgorithm, label: '📦 LZ77' },
  { id: 'lzss' as CompressionAlgorithm, label: '🗜️ LZSS' },
  { id: 'lz78' as CompressionAlgorithm, label: '📚 LZ78' },
  { id: 'lzw' as CompressionAlgorithm, label: '⚡ LZW' }
]

const handleProcess = () => {
  store.process()
}

// Хелперы для отображения
const formatDict = (dict: string | string[]) => {
  if (Array.isArray(dict)) {
    return dict.join(', ') || '-'
  }
  return dict || '-'
}
</script>

<template>
  <div class="compression-container">
    <!-- Алфавит (только для LZW) -->
    <div v-if="store.algorithm === 'lzw'" class="alphabet-section">
      <label>Алфавит (для LZW)</label>
      <AlphabetEditor v-model="store.alphabet" placeholder="Введите символ" />
    </div>

    <!-- Входная строка -->
    <div class="input-section">
      <label>📥 Входная строка</label>
      <Textarea 
        v-model="store.input" 
        placeholder="Введите текст для сжатия..." 
        :rows="2" 
      />
      <div class="actions">
        <Button 
          variant="primary" 
          @click="handleProcess" 
          :disabled="!store.input.trim() || store.isLoading"
        >
          {{ store.isLoading ? 'Обработка...' : '▶ Сжать' }}
        </Button>
        <Button variant="ghost" @click="store.clearAll()">🗑 Сброс</Button>
      </div>
    </div>

    <!-- Вкладки алгоритмов -->
    <Tabs v-model="store.algorithm" :tabs="algorithms" />

    <!-- Таблица результатов -->
    <div v-if="store.hasResults" class="table-section">
      <!-- LZ77 -->
      <table v-if="store.algorithm === 'lz77'" class="compression-table">
        <thead>
          <tr>
            <th>Шаг</th>
            <th>Словарь</th>
            <th>Вход</th>
            <th>Код</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(step, idx) in store.lz77Steps" :key="idx">
            <td class="step-num">{{ idx + 1 }}</td>
            <td class="mono">{{ step.dictionary }}</td>
            <td class="mono">{{ step.input }}</td>
            <td class="mono code">{{ step.code }}</td>
          </tr>
        </tbody>
      </table>

      <!-- LZSS -->
      <table v-else-if="store.algorithm === 'lzss'" class="compression-table">
        <thead>
          <tr>
            <th>Шаг</th>
            <th>Словарь</th>
            <th>Вход</th>
            <th>Код</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(step, idx) in store.lzssSteps" :key="idx">
            <td class="step-num">{{ idx + 1 }}</td>
            <td class="mono">{{ step.dictionary }}</td>
            <td class="mono">{{ step.input }}</td>
            <td class="mono code" :class="{ literal: step.isLiteral }">
              {{ step.code }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- LZ78 -->
      <table v-else-if="store.algorithm === 'lz78'" class="compression-table">
        <thead>
          <tr>
            <th>Позиция</th>
            <th>Словарь</th>
            <th>Код</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(step, idx) in store.lz78Steps" :key="idx">
            <td class="step-num">{{ step.position }}</td>
            <td class="mono dict-list">{{ formatDict(step.dictionary) }}</td>
            <td class="mono code">{{ step.code }}</td>
          </tr>
        </tbody>
      </table>

      <!-- LZW -->
      <table v-else-if="store.algorithm === 'lzw'" class="compression-table">
        <thead>
          <tr>
            <th>Позиция</th>
            <th>Словарь</th>
            <th>Код</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(step, idx) in store.lzwSteps" :key="idx">
            <td class="step-num">{{ step.position }}</td>
            <td class="mono dict-list">{{ formatDict(step.dictionary) }}</td>
            <td class="mono code">{{ step.code }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Пустое состояние -->
    <div v-else-if="!store.isLoading && !store.input" class="empty-state">
      <span class="emoji">📦</span>
      <p>Выберите алгоритм и введите строку для сжатия</p>
    </div>
  </div>
</template>

<style scoped>
.compression-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.alphabet-section label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 600;
  color: var(--color-text);
}

.input-section {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}

.input-section label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 600;
  color: var(--color-text);
}

.actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

.table-section {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
}

.compression-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-sans);
  min-width: 600px;
}

.compression-table th {
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  font-weight: 600;
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: left;
  border-bottom: 2px solid var(--color-border);
  white-space: nowrap;
}

.compression-table td {
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  vertical-align: middle;
}

.compression-table tr:last-child td {
  border-bottom: none;
}

.compression-table tr:hover td {
  background: var(--color-bg-tertiary);
}

.step-num {
  font-weight: 700;
  color: var(--color-primary);
  text-align: center;
  min-width: 50px;
}

.mono {
  font-family: var(--font-mono);
  font-size: 13px;
}

.code {
  color: var(--color-primary);
  font-weight: 600;
  background: var(--color-bg);
  border-radius: var(--radius-sm);
  padding: 4px 8px;
  display: inline-block;
}

.code.literal {
  color: var(--color-success);
}

.dict-list {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-muted);
  background: var(--color-bg-secondary);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
}

.empty-state .emoji {
  font-size: 32px;
  display: block;
  margin-bottom: var(--spacing-sm);
}

@media (max-width: 768px) {
  .compression-table th,
  .compression-table td {
    padding: 8px;
    font-size: 12px;
  }
  
  .dict-list {
    max-width: 150px;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style>