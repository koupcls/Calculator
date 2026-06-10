<script setup lang="ts" generic="T extends Record<string, any>">

interface ColumnConfig {
  key: string
  title: string
  align?: 'left' | 'center' | 'right'
}

defineProps<{
  columns: ColumnConfig[]
  data: T[]
  emptyText?: string
}>()
</script>

<template>
  <div class="table-container">
    <table class="base-dynamic-table">
      <thead>
        <tr>
          <!-- Генерируем заголовки по конфигурации -->
          <th 
            v-for="col in columns" 
            :key="col.key"
            :style="{ textAlign: col.align || 'left' }"
          >
            {{ col.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="rowIndex">
          <!-- Генерируем ячейки для каждой строки -->
          <td 
            v-for="col in columns" 
            :key="col.key"
            :style="{ textAlign: col.align || 'left' }"
          >
            <!-- Использование слота: позволяет кастомизировать ячейку по её ключу снаружи -->
            <slot :name="col.key" :value="row[col.key]" :row="row">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
        <!-- Если данных нет -->
        <tr v-if="data.length === 0">
          <td :colspan="columns.length" class="empty-cell">
            {{ emptyText || 'Нет данных для отображения' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  box-shadow: var(--shadow-sm);
}

.base-dynamic-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-sans);
  font-size: 14px;
}

.base-dynamic-table th {
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  font-weight: 600;
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 2px solid var(--color-border);
  white-space: nowrap;
}

.base-dynamic-table td {
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
}

.base-dynamic-table tr:hover td {
  background: var(--color-bg-tertiary);
}

.base-dynamic-table tr:last-child td {
  border-bottom: none;
}

.empty-cell {
  text-align: center;
  color: var(--color-text-muted);
  padding: var(--spacing-lg) 0;
  font-style: italic;
}
</style>
