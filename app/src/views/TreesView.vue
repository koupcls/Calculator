<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { debounce } from 'lodash-es'
import { useTreeStore } from '../stores/treeStore'
import TreeVisualizer from '../components/tree/TreeVisualizer.vue'
import MetricsPanel from '../components/tree/MetricsPanel.vue'
import DataTable from '../components/ui/DataTable.vue'
import Tabs from '../components/ui/Tabs.vue'
import Textarea from '../components/ui/Textarea.vue'
import Switcher from '../components/ui/Switcher.vue'
import ResultSection from '../components/ui/ResultSection.vue'
import Section from '../components/ui/Section.vue'

const treeStore = useTreeStore()
const activeTab = ref<'huffman' | 'shannon'>('huffman')

const tabs = [
  { id: 'huffman' as const, label: 'Хаффман' },
  { id: 'shannon' as const, label: 'Шеннон-Фано' }
] 

const columnsConfig = [
  { key: 'symbol', title: 'Символ', align: 'left' as const },
  { key: 'count', title: 'Кол-во', align: 'center' as const },
  { key: 'prob', title: 'Частота (p)', align: 'center' as const },
  { key: 'code', title: 'Код', align: 'left' as const }
]

function toFractionString(numerator: number, denominator: number): string {
  if (numerator === 0) return '0'
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
  const d = gcd(numerator, denominator)
  const n = numerator / d, den = denominator / d
  return den === 1 ? `${n}` : `${n}/${den}`
}

const currentTableData = computed(() => {
  const total = treeStore.input.length
  if (total === 0) return []
  const codes = activeTab.value === 'huffman' 
    ? treeStore.huffman?.codes 
    : treeStore.shannonFano?.codes
  return Object.entries(treeStore.frequencies).map(([symbol, count]) => ({
    symbol: symbol === ' ' ? '␣' : symbol,
    count,
    prob: toFractionString(count, total),
    code: codes?.[symbol] || '—'
  }))
})

const currentCodedLine = computed(() => {
  return (activeTab.value === 'huffman' 
    ? treeStore.huffman?.codedLine 
    : treeStore.shannonFano?.codedLine) || ''
})

const triggerAnalyze = () => {
  const v = treeStore.input
  v.trim() ? treeStore.analyze(v) : treeStore.resetResults()
}

const debouncedAnalyze = debounce(triggerAnalyze, 250)

watch(() => treeStore.input, debouncedAnalyze)
watch(() => treeStore.caseSensitive, triggerAnalyze)

onUnmounted(() => debouncedAnalyze.cancel())
</script>

<template>
  <div class="page">

    <Section title="Ввод текста">
      <template #svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
      </template> 

      <template #action>
        <Switcher
          v-model="treeStore.caseSensitive"
          icon=""
          label="Учитывать регистр"
        />
      </template>

      <template #content>
        <Textarea 
          v-model="treeStore.input" 
          placeholder="Введите текст..." 
          :rows="4"
          class="main-input"
        />
      </template>
    </Section>

    <Section title="Числовые характеристики">
      <template #svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
      </template>

      <template #content>
        <MetricsPanel :active-tab="activeTab" :store="treeStore" />
      </template>
    </Section>

    <Section title="Алгоритм">
      <template #svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20"/><path d="m4.93 4.93 14.14 14.14M4.93 19.07 19.07 4.93"/></svg>
      </template>

      <template #content>
        <Tabs v-model="activeTab" :tabs="tabs" />
      </template>
    </Section>

    <Section v-if="treeStore.input.length > 0" title="Таблица символов">
      <template #svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
      </template>

      <template #content>
        <DataTable :columns="columnsConfig" :data="currentTableData">
          <template #symbol="{ value }">
            <span class="mono">{{ value }}</span>
          </template>
          <template #code="{ value }">
            <span class="mono code">{{ value }}</span>
          </template>
        </DataTable>
      </template>
    </Section>

    <Section title="Дерево кодирования">
      <template #svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
      </template>

      <template #content>
        <div class="visualization">
          <TreeVisualizer 
            :tree-data="(activeTab === 'huffman' 
              ? treeStore.huffman?.treeJson 
              : treeStore.shannonFano?.treeJson) ?? null" 
          />
        </div>
      </template>
    </Section>

    <ResultSection title="Закодировання строка" :result="currentCodedLine"/>    
  </div>
</template>

<style scoped>
.main-input {
  width: 100%;
}

.code {
  color: var(--color-primary);
  font-weight: 600;
}

.visualization {
  min-height: 500px;
  background: var(--color-bg);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

@media (max-width: 768px) {
  .visualization {
    min-height: 400px;
  }
}
</style>