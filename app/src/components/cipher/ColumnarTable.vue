<script setup lang="ts">
import Tile from '../ui/Tile.vue'

interface ColumnarVisualization {
  sortedOrder: number[]
  table: string[][]
}

defineProps<{
  visualization: ColumnarVisualization
  cipherKey: string
}>()

const getColumnOrder = (sorted: number[], idx: number) => sorted.indexOf(idx) + 1
</script>

<template>
  <div class="step-table">
    <div class="table">
      <div class="table-row table-header">
        <span>Ключ</span>
        <span></span>
        <span>Символы</span>
      </div>
      <div v-for="(keyChar, colIdx) in cipherKey.split('')" :key="colIdx" class="table-row">
        <span class="table-order">
          {{ getColumnOrder(visualization.sortedOrder, colIdx) }}
        </span>
        <span class="table-key">
          {{ keyChar === ' ' ? '_' : keyChar }}
        </span>
        <div class="table-symbols">
          <Tile
            v-for="(row, rowIdx) in visualization.table"
            :key="rowIdx"
            :symbol="row[colIdx] === ' ' ? '_' : (row[colIdx] || '')"
            :index="Number(rowIdx) + 1"
            :showNumber="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 380px; 
  overflow-y: auto;
  padding-right: 4px;
}

.table-row {
  display: grid;
  grid-template-columns: 50px 70px 1fr;
  gap: 4px;
  padding: 2px;
}

.table-header {
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--color-bg-tertiary);
  padding: var(--spacing-sm);
  font-weight: 600;
  font-size: 11px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); 
}

.table-order,
.table-key {
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

.table-order {
  color: var(--color-text-secondary);
  font-family: var(--font-sans);
}

.table-key {
  color: var(--color-text);
  font-weight: 300;
}

.table-symbols {
  display: flex;
  gap: 2px;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow-x: auto;
  min-height: 36px;
}
</style>