<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { debounce } from 'lodash-es'
import { useTreeStore } from '../stores/treeStore'
import TreeVisualizer from '../components/tree/TreeVisualizer.vue'
import MetricsPanel from '../components/tree/MetricsPanel.vue'
import DataTable from '../components/ui/DataTable.vue'
import Tabs from '../components/ui/Tabs.vue'
import Textarea from '../components/ui/Textarea.vue'
import ThemeToggle from '../components/ui/ThemeToggle.vue'

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

const debouncedAnalyze = debounce((v: string) => {
  v.trim() ? treeStore.analyze(v) : treeStore.resetResults()
}, 250)

watch(() => treeStore.input, debouncedAnalyze)
onUnmounted(() => debouncedAnalyze.cancel())
</script>

<template>
  <ThemeToggle />
  
  <div class="page">
    <Textarea 
      v-model="treeStore.input" 
      placeholder="Введите текст..." 
      :rows="3"
    />

    <MetricsPanel :active-tab="activeTab" :store="treeStore" />

    <Tabs v-model="activeTab" :tabs="tabs" />

    <div v-if="treeStore.input.length > 0" class="table-section">
      <DataTable :columns="columnsConfig" :data="currentTableData">
        <template #symbol="{ value }">
          <span class="mono">{{ value }}</span>
        </template>
        <template #code="{ value }">
          <span class="mono code">{{ value }}</span>
        </template>
      </DataTable>
    </div>

    <div class="visualization">
      <TreeVisualizer 
        :tree-data="(activeTab === 'huffman' 
          ? treeStore.huffman?.treeJson 
          : treeStore.shannonFano?.treeJson) ?? null" 
      />
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

.table-section {
  overflow-x: auto;
}

.code {
  color: var(--color-primary);
  font-weight: 600;
}

.visualization {
  min-height: 500px;
}

@media (max-width: 768px) {
  body { padding: var(--spacing-md); }
  .page { padding: var(--spacing-sm); gap: var(--spacing-md); }
  .visualization { min-height: 400px; }
}
</style>