<script setup lang="ts">
import Tile from '../ui/Tile.vue'

interface VigenereCell {
  symbol: string
  index: number
  isKey: boolean
}

interface VigenereRow {
  label: string
  cells: VigenereCell[]
}

const props = defineProps<{
  input: string
  modelValue: string
  output: string
  alphabet: string
}>()

const buildRows = (): VigenereRow[] => {
  const { input, modelValue, output, alphabet } = props
  const rows: VigenereRow[] = []

  rows.push({
    label: 'Вход',
    cells: input.split('').map(char => ({
      symbol: char,
      index: alphabet.indexOf(char) + 1,
      isKey: false
    }))
  })

  rows.push({
    label: 'Ключ',
    cells: input.split('').map((_, i) => {
      const keyChar = modelValue[i % modelValue.length]
      return {
        symbol: keyChar,
        index: alphabet.indexOf(keyChar) + 1,
        isKey: true
      }
    })
  })

  rows.push({
    label: 'Выход',
    cells: output.split('').map(char => ({
      symbol: char,
      index: alphabet.indexOf(char) + 1,
      isKey: false
    }))
  })

  return rows
}
</script>

<template>
  <div class="vigenere-table scrollbar-thin">
    <div class="table-rows">
      <div v-for="(row, rIdx) in buildRows()" :key="rIdx" class="table-row">
        <span class="row-label">{{ row.label }}</span>
        <div class="tiles-row">
          <Tile
            v-for="(cell, cIdx) in row.cells"
            :key="cIdx"
            :symbol="cell.symbol"
            :index="cell.index"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vigenere-table {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow-x: auto;
  overflow-y: hidden;
  padding: var(--spacing-sm) 0;
}

.table-rows {
  display: inline-flex;
  flex-direction: column;
  gap: 8px;
  min-width: 100%;
  padding-bottom: 4px;
}

.table-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.row-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text);
  text-transform: uppercase;
  min-width: 50px;
  text-align: right;
}

.tiles-row {
  display: flex;
  gap: 2px;
}

@media (max-width: 768px) {
  .row-label {
    font-size: 10px;
    min-width: 40px;
  }
}
</style>