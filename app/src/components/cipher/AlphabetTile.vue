<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  symbol: string
  index: number
  removable?: boolean
}>();

const emit = defineEmits<{
  (e: 'remove'): void
}>();

// Отображаем пробел как подчёркивание
const displaySymbol = computed(() => 
  props.symbol === ' ' ? '_' : props.symbol
);

// Обработчик клика — удаляем только если не нажали на крестик
const handleClick = (e: MouseEvent) => {
  // Если клик был по кнопке удаления — не дублируем событие
  if ((e.target as HTMLElement).closest('.tile-remove')) {
    return;
  }
  if (props.removable) {
    emit('remove');
  }
};
</script>

<template>
  <div 
    class="alphabet-tile" 
    :class="{ removable }"
    @click="handleClick"
    :title="removable ? 'Нажмите для удаления' : ''"
  >
    <span class="tile-symbol">{{ displaySymbol }}</span>
    <span class="tile-index">{{ index + 1 }}</span>
    <button 
      v-if="removable" 
      class="tile-remove" 
      @click.stop="$emit('remove')"
      aria-label="Удалить символ"
    >
      ×
    </button>
  </div>
</template>

<style scoped>
.alphabet-tile {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 64px;
  background: var(--color-bg-secondary);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: all var(--transition);
  user-select: none;
  cursor: pointer;
}

.alphabet-tile:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  background: var(--color-bg-tertiary);
}

.alphabet-tile:active {
  transform: translateY(0);
}

.tile-symbol {
  font-family: var(--font-mono);
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1;
}

.tile-index {
  font-family: var(--font-sans);
  font-size: 10px;
  color: var(--color-text-muted);
  margin-top: 2px;
  font-weight: 500;
}

.tile-remove {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  font-size: 14px;
  line-height: 1;
  background: var(--color-error);
  color: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition);
  z-index: 1;
}

.alphabet-tile:hover .tile-remove,
.tile-remove:focus {
  opacity: 1;
}

.tile-remove:hover {
  background: #dc2626;
  transform: scale(1.1);
}
</style>