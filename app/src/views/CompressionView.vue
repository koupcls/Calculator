<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSettingsStore } from '../stores/compression/useSettingsStore.ts'
import { useCompressionStore } from '../stores/compression/useCompressionStore.ts'
import { useDecompressionStore } from '../stores/compression/useDecompressionStore.ts'
import type { CompressionAlgorithm } from '../stores/compression/useSettingsStore.ts'
import Tabs from '../components/ui/Tabs.vue'
import Switcher from '../components/ui/Switcher.vue'
import AlphabetEditor from '../components/cipher/AlphabetEditor.vue'
import DataTable from '../components/ui/DataTable.vue'
import ExpandableCell from '../components/ui/ExpandableCell.vue'
import MassCodeInput from '../components/compression/MassCodeInput.vue'
import type { LZWStep } from '../core/compression/lzw.ts'
import type { LZ78Step } from '../core/compression/lz78.ts'
import { formateSpaces } from '../core/utils/spaceFormaters.ts'
import Section from '../components/ui/Section.vue'
import ResultSection from '../components/ui/ResultSection.vue'
import Textarea from '../components/ui/Textarea.vue'

const settings = useSettingsStore()
const compression = useCompressionStore()
const decompression = useDecompressionStore()

const currentSteps = computed(() => 
  settings.mode === 'compress' ? compression.currentSteps : decompression.currentSteps
)

const currentError = computed(() => 
  settings.mode === 'compress' ? compression.error : decompression.error
)

const showSpaces = ref(true)

function formateSpacesWrapper(input: string, isCode: boolean = false): string {
  if (showSpaces.value) {
    if (isCode) return formateSpaces(input, '\' \'')
    else return formateSpaces(input)
  }
  return input
}

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
    
    <Section title="Алгоритм" class="settings-section">
      <template #svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      </template>
      <template #content>
        <div class="row-group">
          <Tabs v-model="settings.algorithm" :tabs="algorithms" />
          <Tabs v-model="settings.mode" :tabs="modes" />
        </div>
      </template>
    </Section>

    <Section v-if="settings.algorithm === 'lzw'" title="Алфавит">
      <template #svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>
      </template>
      <template #content>
        <AlphabetEditor 
          v-model="settings.alphabet" 
          :case-sensetive="settings.caseSensitive" 
          @update:modelValue="compression.process()"
          placeholder="Введите символ" 
        />
      </template>
    </Section>

    <Section :title="settings.mode === 'compress' ? 'Ввод текста для сжатия' : 'Ввод кодов для расшифровки'">
      <template #svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      </template>
      <template #action>
        <Switcher 
          v-if="settings.mode === 'compress'"
          v-model="settings.caseSensitive" 
          @update:modelValue="compression.process()"
          label="Учитывать регистр" 
          icon=""
        />
      </template>
      <template #content>
        <Textarea 
          v-if="settings.mode === 'compress'"
          v-model="compression.input" 
          @input="compression.process()"
          placeholder="Введите текст для сжатия..." 
        />
        <MassCodeInput v-else />
      </template>
    </Section>

    <Section title="Таблица шагов">
      <template #svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
      </template>
      <template #action>
        <div class="action-group">
          <div v-if="currentError" class="error-msg">{{ currentError }}</div>
          <Switcher
            v-model="showSpaces" 
            label="Выделять пробелы" 
            icon=""
          />
        </div>
      </template>
      <template #content>
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
            <ExpandableCell v-if="value !== '-'" :text="formateSpacesWrapper(value)" />
            <span v-else class="empty-cell">{{ value }}</span>
          </template>

          <template #input="{ value }">
            <ExpandableCell v-if="value !== '-'" :text="formateSpacesWrapper(value)" />
            <span v-else class="empty-cell">{{ value }}</span>
          </template>

          <template #dictLast="{ value }">
            <ExpandableCell v-if="value !== '-'" :text="value" />
            <span v-else class="empty-cell">{{ value }}</span>
          </template>

          <template #stringCode="{ value }">
            <span class="step-num">{{ formateSpacesWrapper(value, true) }}</span>
          </template>
        </DataTable>

        <div v-else class="empty-state">
          <p>{{ settings.mode === 'compress' ? 'Введите строку для расчета алгоритмов сжатия' : 'Введите коды для отображения шагов расшифровки' }}</p>
        </div>
      </template>
    </Section>

    <ResultSection 
    :title="settings.mode === 'compress' ? 'Итоговые коды' : 'Итоговый текст'" 
    :result="settings.mode === 'compress' ? formateSpacesWrapper(compression.formattedCodesString, true) : formateSpacesWrapper(decompression.decompressedText, true)"
    />

  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-md);
}

.row-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.action-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
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

  .action-group {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
}
</style>