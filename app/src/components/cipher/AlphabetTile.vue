<script setup lang="ts">
import Tile from '../ui/Tile.vue';

const props = defineProps<{
  symbol: string
  index: number
  removable?: boolean
}>()

const emit = defineEmits<{
  (e: 'remove'): void
}>()

const handleClick = (e: MouseEvent) => {
  if ((e.target as HTMLElement).closest('.tile-remove')) return
  if (props.removable) emit('remove')
}
</script>

<template>
  <div class="alphabet-tile" :class="{ removable }" @click="handleClick">
    <Tile :symbol="symbol" :index="index + 1" />
    <button v-if="removable" class="tile-remove" @click.stop="$emit('remove')">×</button>
  </div>
</template>

<style scoped>
.alphabet-tile {
  position: relative;
  display: inline-flex;
  cursor: pointer;
}

.alphabet-tile:hover {
  transform: translateY(-2px);
}

.tile-remove {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 16px;
  height: 16px;
  font-size: 12px;
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

.alphabet-tile:hover .tile-remove {
  opacity: 1;
}
</style>