<script setup lang="ts">
import { ref, computed } from 'vue'
import Tile from '../ui/Tile.vue'
import { nextTick } from 'vue';

const props = defineProps<{
  symbol?: string
  index: number
  removable?: boolean
  focused?: boolean
}>()

const emit = defineEmits<{
  (e: 'remove'): void
  (e: 'add', char: string): void
  (e: 'click'): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const isPlusMode = computed(() => props.symbol === undefined)

const editing = ref(false)
const tempChar = ref('')

const handleTileClick = () => {
  if (isPlusMode.value) {
    if (!editing.value) {
      editing.value = true
      tempChar.value = ''
      nextTick(() => inputRef.value?.focus())
    }
  } else {
    emit('click')
  }
}

const handleInputConfirm = () => {
  if (isPlusMode.value && tempChar.value && tempChar.value.length === 1) {
    emit('add', tempChar.value)
    tempChar.value = ''
    editing.value = false
  }
}

const handleInputCancel = () => {
  if (isPlusMode.value) {
    editing.value = false
    tempChar.value = ''
  }
}

const handleRemoveClick = (e: Event) => {
  e.stopPropagation()
  emit('remove')
}
</script>

<template>
  <div
    v-if="isPlusMode"
    class="plus-tile tile"
    :class="{ focused, editing }"
    @click="handleTileClick"
    tabindex="-1"
  >
    <span class="tile-symbol plus-symbol">+</span>
    <span class="tile-index">{{ index }}</span>

    <input
      v-if="editing"
      ref="inputRef"
      v-model="tempChar"
      type="text"
      maxlength="1"
      class="tile-input"
      placeholder="?"
      @keyup.enter="handleInputConfirm"
      @keyup.escape="handleInputCancel"
      @blur="handleInputCancel"
    />
  </div>
  <div 
    v-else 
    class="alphabet-tile" 
    :class="{ removable, focused }" 
    @click="handleTileClick"
  >
    <Tile :symbol="symbol!" :index="index" :removable="removable" :show-number="true" />
    <button v-if="removable" class="tile-remove" @click="handleRemoveClick">×</button>
  </div>
</template>

<style scoped>
/* Стили для плюс-тайла */
.plus-tile {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 52px;
  background: var(--color-bg-secondary);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-sm);
  transition: all var(--transition);
  cursor: pointer;
  user-select: none;
  padding: 0;
}

.plus-tile:hover {
  border-style: solid;
  border-color: var(--color-primary);
  background: var(--color-bg-tertiary);
  transform: translateY(-2px);
}

.plus-tile.focused {
  border-style: solid;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
}

.plus-tile.editing {
  border-style: solid;
  border-color: var(--color-primary);
  background: var(--color-bg-tertiary);
}

.plus-symbol {
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-muted);
  line-height: 1;
  transition: color var(--transition);
}

.plus-tile:hover .plus-symbol {
  color: var(--color-primary);
}

.tile-index {
  font-family: var(--font-sans);
  font-size: 9px;
  color: var(--color-text-muted);
  margin-top: 2px;
  font-weight: 500;
}

.tile-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  font-family: var(--font-mono);
  font-size: 16px;
  text-align: center;
  background: var(--color-bg-tertiary);
  border: none;
  outline: none;
  color: var(--color-text);
  border-radius: var(--radius-sm);
  z-index: 1;
}

.tile-input::placeholder {
  color: var(--color-text-muted);
  opacity: 0.6;
}

/* Стили для обычного тайла */
.alphabet-tile {
  position: relative;
  display: inline-flex;
  cursor: pointer;
  transition: all var(--transition);
}

.alphabet-tile:hover {
  transform: translateY(-2px);
}

/* Выделенный тайл */
.alphabet-tile.focused {
  transform: translateY(-2px);
}

.alphabet-tile.focused :deep(.tile) {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
}

/* Крестик в углу */
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

@media (hover: none) {
  .alphabet-tile.focused .tile-remove {
    opacity: 1;
  }
}
</style>