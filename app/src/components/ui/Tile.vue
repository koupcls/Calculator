<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  symbol: string
  index: number
  highlight?: boolean
  showNumber?: boolean
}>()

const displaySymbol = computed(() =>
  props.symbol === ' ' ? '_' : props.symbol
)

const shouldShowNumber = computed(() => props.showNumber !== false)
</script>

<template>
  <div class="tile" :class="{ highlighted: highlight, 'square': !shouldShowNumber }">
    <span class="tile-symbol">{{ displaySymbol }}</span>
    <span v-if="shouldShowNumber" class="tile-index">{{ index }}</span>
  </div>
</template>

<style scoped>
.tile {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 52px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  transition: all var(--transition);
}

.tile.square {
  height: 40px; /* Квадратный */
}

.tile.highlighted {
  background: var(--color-bg-tertiary);
  border-color: var(--color-primary);
}

.tile-symbol {
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1;
}

.tile-index {
  font-family: var(--font-sans);
  font-size: 9px;
  color: var(--color-text-muted);
  margin-top: 2px;
  font-weight: 500;
}
</style>