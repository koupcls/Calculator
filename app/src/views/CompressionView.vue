<script setup lang="ts">
import { computed } from 'vue'
import { useCompressionStore } from '../stores/compressionStore'
import type { CompressionAlgorithm } from '../stores/compressionStore'
import Input from '../components/ui/Input.vue'
import Tabs from '../components/ui/Tabs.vue'
import Switcher from '../components/ui/Switcher.vue'
import AlphabetEditor from '../components/cipher/AlphabetEditor.vue'
import DataTable from '../components/ui/DataTable.vue'
import ExpandableCell from '../components/ui/ExpandableCell.vue'
import CopyButton from '../components/ui/CopyButton.vue'

const store = useCompressionStore()

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
  stringCode: string;
  input?: string;
  dictLast?: string;
}

interface TableConfig {
  columns: Array<{ key: string; title: string; align?: 'center' | 'left' | 'right' }>;
  data: TableDataRow[];
}

const tableConfig = computed<TableConfig>(() => {
  switch (store.algorithm) {
    case 'lz77':
    case 'lzss':
      return {
        columns: [
          { key: 'index', title: 'Шаг', align: 'center' },
          { key: 'dictionary', title: 'Словарь' },
          { key: 'input', title: 'Вход' },
          { key: 'stringCode', title: 'Код' }
        ],
        data: ((store.algorithm === 'lz77' ? store.lz77Steps : store.lzssSteps) as any[]).map((step, idx) => ({
          ...step,
          index: idx + 1,
          dictionary: Array.isArray(step.dictionary) ? step.dictionary.join(', ') : step.dictionary
        })) satisfies TableDataRow[]
      }
      
    case 'lz78':
      return {
        columns: [
          { key: 'index', title: 'Позиция', align: 'center' },
          { key: 'dictLast', title: 'Словарь' },
          { key: 'stringCode', title: 'Код' }
        ],
        data: store.lz78Steps.map((step, idx) => ({
          ...step,
          index: idx,
          dictLast: step.dictionary[step.dictionary.length - 1] || '-'
        })) satisfies TableDataRow[]
      }
      
    case 'lzw':
      return {
        columns: [
          { key: 'stepIndex', title: 'Позиция', align: 'center' },
          { key: 'dictLast', title: 'Словарь' },
          { key: 'stringCode', title: 'Код' }
        ],        
        data: store.lzwSteps.map((step) => ({
          ...step,
          dictLast: step.dictionary[step.dictionary.length - 1] || '-'
        })) satisfies TableDataRow[]
      }
      
    default:
      return { columns: [], data: [] }
  }
})
</script>

<template>
  <div class="page">
    <!-- Секция алфавита (для LZW) -->
    <div v-if="store.algorithm === 'lzw'" class="section">
      <div class="section-header">
        <div class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>
          <span>Алфавит (для LZW)</span>
        </div>
      </div>
      <AlphabetEditor 
        v-model="store.alphabet" 
        :default-alphabet="store.defaultAlphabet" 
        :case-sensetive="store.caseSensitive" 
        @update:modelValue="store.process()"
        placeholder="Введите символ" 
      />
    </div>

    <!-- Секция ввода текста -->
    <div class="section">
      <div class="section-header">
        <div class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
          <span>Ввод текста</span>
        </div>
        <Switcher 
          v-model="store.caseSensitive" 
          @update:modelValue="store.process()"
          label="Учитывать регистр" 
          icon="Aa"
        />
      </div>
      <Input 
        v-model="store.input" 
        @input="store.process()"
        placeholder="Введите текст для сжатия..." 
      />
    </div>

    <!-- Секция выбора алгоритма -->
    <div class="section">
      <div class="section-header">
        <div class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          <span>Алгоритм</span>
        </div>
      </div>
      <Tabs v-model="store.algorithm" :tabs="algorithms" />
    </div>

    <!-- Секция таблицы шагов -->
    <div class="section">
      <div class="section-header">
        <div class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
          <span>Таблица шагов</span>
        </div>
        <CopyButton 
          v-if="store.formattedCodesString" 
          :text="store.formattedCodesString" 
        />
      </div>
      
      <DataTable
        v-if="store.hasResults"
        :columns="tableConfig.columns"
        :data="tableConfig.data"
      >
        <template #index="{ value }">
          <span class="step-num">{{ value }}</span>
        </template>

        <template #stepIndex="{ value }">
          <span class="step-num">{{ value }}</span>
        </template>

        <template #dictionary="{ value }">
          <ExpandableCell :text="value" />
        </template>

        <template #input="{ value }">
          <ExpandableCell :text="value" />
        </template>

        <template #dictLast="{ value }">
          <ExpandableCell :text="value" />
        </template>

        <template #stringCode="{ value }">
          <span class="step-num">{{ value }}</span>
        </template>
      </DataTable>

      <div v-else class="empty-state">
        <span class="emoji"></span>
        <p>Введите строку для мгновенного расчета всех алгоритмов сжатия</p>
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

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
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

.actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}

.step-num {
  font-weight: 700;
  color: var(--color-primary);
  display: block;
  text-align: center;
}

.mono {
  font-family: var(--font-mono);
  font-size: 13px;
}

.code {
  color: var(--color-primary);
  font-weight: 600;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 4px 8px;
  display: inline-block;
  white-space: nowrap; 
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-muted);
  background: var(--color-bg);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
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
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .actions {
    flex-direction: column-reverse;
    width: 100%;
  }
  
  .actions .copy-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 14px;
  }
}
</style>