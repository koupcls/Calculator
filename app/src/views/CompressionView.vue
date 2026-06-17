<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '../stores/compression/useSettingsStore.ts'
import { useCompressionStore } from '../stores/compression/useCompressionStore.ts'
import { useDecompressionStore } from '../stores/compression/useDecompressionStore.ts'
import type { CompressionAlgorithm } from '../stores/compression/useSettingsStore.ts'
import Input from '../components/ui/Input.vue'
import Tabs from '../components/ui/Tabs.vue'
import Switcher from '../components/ui/Switcher.vue'
import AlphabetEditor from '../components/cipher/AlphabetEditor.vue'
import DataTable from '../components/ui/DataTable.vue'
import ExpandableCell from '../components/ui/ExpandableCell.vue'
import CopyButton from '../components/ui/CopyButton.vue'
import MassCodeInput from '../components/compression/MassCodeInput.vue'
import type { LZWStep } from '../core/compression/lzw.ts'
import type { LZ78Step } from '../core/compression/lz78.ts'

const settings = useSettingsStore()
const compression = useCompressionStore()
const decompression = useDecompressionStore()

const currentSteps = computed(() => 
  settings.mode === 'compress' ? compression.currentSteps : decompression.currentSteps
)

const formattedCodesString = computed(() => 
  settings.mode === 'compress' ? compression.formattedCodesString : decompression.formattedCodesString
)

const currentError = computed(() => 
  settings.mode === 'compress' ? compression.error : decompression.error
)

const modes = [
  { id: 'compress', label: 'Сжатие' },
  { id: 'decompress', label: 'Расшифровка' }
]

const algorithms = [
  { id: 'lz77' as CompressionAlgorithm, label: 'LZ77' },
  { id: 'lzss' as CompressionAlgorithm, label: 'LZSS' },
  { id: 'lz78' as CompressionAlgorithm, label: 'LZ78' },
  { id: 'lzw' as CompressionAlgorithm, label: 'LZW' }
]

interface TableDataRow {
  index?: number;
  stepIndex?: number;
  dictionary: any;
  stringCode?: string;
  input?: string;
  dictLast?: string;
  _arrayIndex: number;
}

interface TableConfig {
  columns: Array<{ key: string; title: string; align?: 'center' | 'left' | 'right' }>;
  data: TableDataRow[];
}

const tableConfig = computed<TableConfig>(() => {
  const steps = currentSteps.value
  
  let columns: TableConfig['columns'] = []
  let data: TableDataRow[] = []

  switch (settings.algorithm) {
    case 'lz77':
    case 'lzss':
      columns = [
        { key: 'index', title: 'Шаг', align: 'center' },
        { key: 'dictionary', title: 'Словарь' },
        { key: 'input', title: 'Вход' },
        { key: 'stringCode', title: 'Код' }
      ]
      data = steps.map((step: any, idx: number) => ({
        ...step,
        index: idx + 1,
        dictionary: Array.isArray(step.dictionary) ? step.dictionary.join(', ') : step.dictionary,
        _arrayIndex: idx
      }))
      break
      
    case 'lz78':
      columns = [
        { key: 'index', title: 'Позиция', align: 'center' },
        { key: 'dictLast', title: 'Словарь' },
        { key: 'stringCode', title: 'Код' }
      ]
      data = steps.map((step: LZ78Step, idx: number) => ({
        ...step,
        index: idx,
        dictLast: step.dictionary[step.dictionary.length - 1] || '-',
        _arrayIndex: idx
      }))
      break
      
    case 'lzw':
      columns = [
        { key: 'stepIndex', title: 'Позиция', align: 'center' },
        { key: 'dictLast', title: 'Словарь' },
        { key: 'stringCode', title: 'Код' }
      ]        
      data = steps.map((step: LZWStep, idx: number) => ({
        ...step,
        dictLast: step.dictionary[step.stepIndex - 1] || '-',
        _arrayIndex: idx
      }))
      break
  }

  return { columns, data }
})
</script>

<template>
  <div class="page">
    <div class="section flex-container">
      <div class="row-group">
        <div class="section-header no-border">
          <div class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            <span>Алгоритм</span>
          </div>
        </div>
        <Tabs v-model="settings.algorithm" :tabs="algorithms" />
        <Tabs v-model="settings.mode" :tabs="modes" />
      </div>
    </div>

    <div v-if="settings.algorithm === 'lzw'" class="section">
      <div class="section-header">
        <div class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>
          <span>Алфавит</span>
        </div>
      </div>
      <AlphabetEditor 
        v-model="settings.alphabet" 
        :case-sensetive="settings.caseSensitive" 
        @update:modelValue="compression.process()"
        placeholder="Введите символ" 
      />
    </div>

    <div class="section">
      <div class="section-header">
        <div class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          <span>{{ settings.mode === 'compress' ? 'Ввод текста для сжатия' : 'Ввод кодов для расшифровки' }}</span>
        </div>
        
        <Switcher 
          v-if="settings.mode === 'compress'"
          v-model="settings.caseSensitive" 
          @update:modelValue="compression.process()"
          label="Учитывать регистр" 
          icon="Aa"
        />
      </div>

      <Input 
        v-if="settings.mode === 'compress'"
        v-model="compression.input" 
        @input="compression.process()"
        placeholder="Введите текст для сжатия..." 
      />

      <MassCodeInput v-else />
    </div>

    <div class="section">
      <div class="section-header">
        <div class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
          <span>Таблица шагов</span>
        </div>
        <div v-if="currentError" class="error-msg">{{ currentError }}</div>
        <CopyButton 
          v-if="formattedCodesString && settings.mode === 'compress'" 
          :text="formattedCodesString" 
        />
      </div>
      
      <DataTable
        v-if="currentSteps.length > 0"
        :columns="tableConfig.columns"
        :data="tableConfig.data"
      >
        <template #index="{ value }">
          <span v-if="value !== undefined" class="step-num">{{ value }}</span>
        </template>

        <template #stepIndex="{ value }">
          <span v-if="value !== undefined" class="step-num">{{ value }}</span>
        </template>

        <template #dictionary="{ value }">
          <ExpandableCell v-if="value !== '-'" :text="value" />
          <span v-else class="empty-cell">{{ value }}</span>
        </template>

        <template #input="{ value }">
          <ExpandableCell v-if="value !== '-'" :text="value" />
          <span v-else class="empty-cell">{{ value }}</span>
        </template>

        <template #dictLast="{ value }">
          <ExpandableCell v-if="value !== '-'" :text="value" />
          <span v-else class="empty-cell">{{ value }}</span>
        </template>

        <template #stringCode="{ value }">
          <span class="step-num">{{ value || '-' }}</span>
        </template>
      </DataTable>

      <div v-else class="empty-state">
        <p>{{ settings.mode === 'compress' ? 'Введите строку для мгновенного расчета всех алгоритмов сжатия' : 'Введите коды в поле выше для отображения шагов расшифровки' }}</p>
      </div>
    </div>

    <div v-if="settings.mode === 'decompress'" class="section">
      <div class="section-header">
        <div class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          <span>Итоговый текст</span>
        </div>
        
        <CopyButton 
          v-if="decompression.decompressedText" 
          :text="decompression.decompressedText" 
        />
      </div>
      
      <div class="result-box">
        <template v-if="decompression.decompressedText">
          <span class="result-text">{{ decompression.decompressedText }}</span>
        </template>
        <template v-else>
          <span class="empty-text">Введите коды для получения результата...</span>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-md);
}

.section {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}

/* Новые хелперы для группировки в первой секции */
.flex-container {
  display: flex;
  flex-direction: column;
}

.row-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.pt-md {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
}

.section-header.no-border {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
}

.section-title svg {
  color: var(--color-primary);
  flex-shrink: 0;
}

.step-num {
  font-weight: 700;
  color: var(--color-primary);
  display: block;
  text-align: center;
}

.empty-cell {
  color: var(--color-text-muted);
  text-align: center;
  display: block;
}

.result-box {
  min-height: 48px;
  padding: var(--spacing-md);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  word-break: break-all;
}

.result-text {
  font-family: var(--font-mono);
  font-size: 15px;
  color: var(--color-text);
  line-height: 1.5;
}

.empty-text {
  color: var(--color-text-muted);
  font-size: 14px;
  font-style: italic;
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-muted);
  background: var(--color-bg);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
}

.error-msg {
  color: var(--color-error, #dc2626);
  font-size: 13px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .page {
    padding: var(--spacing-sm);
    gap: var(--spacing-md);
  }

  .section {
    padding: var(--spacing-sm);
  }

  .section-header {
    flex-direction: row;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 14px;
  }
}
</style>