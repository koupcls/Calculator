<script setup lang="ts">
import { useTreeStore } from '../../stores/treeStore';

type TreeStoreInstance = ReturnType<typeof useTreeStore>;

interface Props {
  activeTab: 'huffman' | 'shannon'
  store: TreeStoreInstance
}

defineProps<Props>()
</script>

<template>
  <div v-if="store.isAnalyzed" class="metrics-panel">
    <!-- Верхний блок: Общие метрики -->
    <div class="metrics-group">
      <h4>Метрики источника</h4>
      <div class="formulas-row">
        <span class="formula-item">n = {{ store.metrics?.n }}</span>
        <span class="formula-item">m = {{ store.metrics?.m }}</span>
        <span class="formula-item">E = {{ store.metrics?.entropy?.toFixed(4) }}</span>
        <span class="formula-item">H₀ = {{ store.metrics?.H_max?.toFixed(4) }}</span>
        <span class="formula-item">R = {{ store.metrics?.R?.toFixed(4) }}</span>
        <span class="formula-item">r₀ = {{ store.metrics?.r0?.toFixed(4) }}</span>
      </div>
      <div class="formula mono">{{ store.entropyFormula }}</div>
      <div class="formula mono">{{ store.maxEntropyFormula }}</div>
      <div class="formula mono">{{ store.redundancyFormula }}</div>
      <div class="formula mono">{{ store.relativeRedundancyFormula }}</div>
    </div>

    <!-- Нижний блок: Метрики конкретного алгоритма -->
    <div class="metrics-group">
        <h4>{{ activeTab === 'huffman' ? 'Эффективность Хаффмана' : 'Эффективность Шеннона-Фано' }}</h4>
        <div class="formulas-row">
            <span class="formula-item">M = {{ activeTab === 'huffman' ? store.huffman?.expectedLength : store.shannonFano?.expectedLength  }}</span>
        </div>
      <div class="formula mono">
        {{ activeTab === 'huffman' ? store.huffmanMeanFormula : store.shannonMeanFormula }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.metrics-panel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.metrics-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: var(--color-bg);
  border-radius: var(--radius-sm);
}

h4 {
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--color-text);
  font-size: 14px;
  font-family: var(--font-sans);
  font-weight: 600;
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--color-border);
}

.formulas-row {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.formula-item {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-text-secondary);
  padding: 2px 8px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
}

.formula {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  padding: var(--spacing-xs) 0;
}
</style>