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
          <td 
            v-for="col in columns" 
            :key="col.key"
            :style="{ textAlign: col.align || 'left' }"
          >
            <slot :name="col.key" :value="row[col.key]" :row="row">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
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
  max-height: 380px; 
  overflow-x: auto;
  overflow-y: auto;
  padding-right: 4px;
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

/* Стили заголовков (шапка) */
.base-dynamic-table th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  font-weight: 600;
  padding: var(--spacing-sm) var(--spacing-md);
  /* Четкая нижняя и боковые границы для ячеек шапки */
  border-bottom: 2px solid var(--color-border);
  border-right: 1px solid var(--color-border);
  white-space: nowrap;
}

/* Убираем крайнюю правую границу у последнего заголовка */
.base-dynamic-table th:last-child {
  border-right: none;
}

/* Стили обычных ячеек данных */
.base-dynamic-table td {
  padding: var(--spacing-sm) var(--spacing-md);
  /* Четкая нижняя и боковые границы для ячеек тела */
  border-bottom: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
  color: var(--color-text);
}

/* Убираем крайнюю правую границу у последних ячеек в строках */
.base-dynamic-table td:last-child {
  border-right: none;
}

/* Подсветка строки при наведении */
.base-dynamic-table tr:hover td {
  background: var(--color-bg-tertiary);
}

/* Для последней строки убираем только нижнюю границу ячеек */
.base-dynamic-table tr:last-child td {
  border-bottom: none;
}

/* Специфичный стиль для пустой ячейки (без боковых границ) */
.empty-cell {
  text-align: center;
  color: var(--color-text-muted);
  padding: var(--spacing-lg) 0;
  font-style: italic;
  border-right: none !important;
}

@media (max-width: 768px) {
  .base-dynamic-table {
    font-size: 12px; 
  }

  .base-dynamic-table th,
  .base-dynamic-table td {
    padding: var(--spacing-xs, 6px) var(--spacing-sm, 8px); 
  }

  .base-dynamic-table th {
    white-space: normal; 
  }

  .base-dynamic-table td {
    word-break: break-word;
  }
}
</style>