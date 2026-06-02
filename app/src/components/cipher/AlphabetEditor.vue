<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import AlphabetTile from './AlphabetTile.vue'

const DEFAULT_ALPHABET = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя -'

const props = defineProps<{ 
  modelValue: string,
  defaultAlphabet?: string
}>()

const emit = defineEmits<{ 
  (e: 'update:modelValue', value: string): void 
}>()

const editing = ref(false)
const focusedIndex = ref<number | null>(null)
const tempChar = ref('')
const inputRef = ref<HTMLInputElement>()

const alphabetChars = computed(() => {
  const seen = new Set<string>()
  return props.modelValue.split('').filter(char => {
    if (seen.has(char)) return false
    seen.add(char)
    return true
  })
})

const plusIndex = computed(() => alphabetChars.value.length)
const isValidChar = (char: string) => char.length === 1 && !props.modelValue.includes(char)

const startAdding = () => {
  editing.value = true
  tempChar.value = ''
  focusedIndex.value = plusIndex.value
  nextTick(() => inputRef.value?.focus())
}

const confirmAdd = () => {
  if (isValidChar(tempChar.value)) {
    emit('update:modelValue', props.modelValue + tempChar.value)
    tempChar.value = ''
    nextTick(() => inputRef.value?.focus())
  }
}

const cancelAdd = () => {
  editing.value = false
  tempChar.value = ''
}

const removeChar = (index: number) => {
  const seen = new Set<string>()
  const chars = props.modelValue.split('')
  const unique = chars.filter(c => {
    if (seen.has(c)) return false
    seen.add(c)
    return true
  })
  unique.splice(index, 1)
  emit('update:modelValue', unique.join(''))
  
  if (focusedIndex.value === index) {
    focusedIndex.value = null
  } else if (focusedIndex.value !== null && focusedIndex.value > index) {
    focusedIndex.value--
  }
}

const resetAlphabet = () => {
  emit('update:modelValue', props.defaultAlphabet || DEFAULT_ALPHABET)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (editing.value) {
    if (e.key === 'Escape') {
      e.preventDefault()
      cancelAdd()
    }
    return
  }

  const max = plusIndex.value
  
  switch (e.key) {
    case 'ArrowRight':
      e.preventDefault()
      focusedIndex.value = focusedIndex.value === null ? 0 : Math.min(focusedIndex.value + 1, max)
      break
    case 'ArrowLeft':
      e.preventDefault()
      focusedIndex.value = focusedIndex.value === null ? max : Math.max(focusedIndex.value - 1, 0)
      break
    case 'Backspace':
    case 'Delete':
      e.preventDefault()
      if (focusedIndex.value !== null && focusedIndex.value >= 0 && focusedIndex.value < alphabetChars.value.length) {
        removeChar(focusedIndex.value)
      }
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      if (focusedIndex.value === plusIndex.value) {
        startAdding()
      } else if (focusedIndex.value !== null && focusedIndex.value >= 0) {
        removeChar(focusedIndex.value)
      }
      break
  }
}

const isFocused = (index: number) => focusedIndex.value === index
const handleFocus = () => {
  if (focusedIndex.value === null) focusedIndex.value = plusIndex.value
}

const isDefault = computed(() => {
  const defaultAlphabet = props.defaultAlphabet || DEFAULT_ALPHABET
  return props.modelValue.split('').sort().join('') === defaultAlphabet.split('').sort().join('')
})
</script>

<template>
  <div 
    class="alphabet-editor" 
    tabindex="0"
    @focus="handleFocus"
    @keydown="handleKeydown"
    @blur="focusedIndex = null"
  >
    <!-- 🔹 Центрируем тайлы по горизонтали -->
    <div class="tiles-container">
      <AlphabetTile
        v-for="(char, idx) in alphabetChars"
        :key="`${char}-${idx}`"
        :symbol="char"
        :index="idx"
        :focused="isFocused(idx)"
        removable
        @remove="removeChar(idx)"
        @click="focusedIndex = idx"
      />
      
      <button
        class="plus-tile tile"
        :class="{ focused: isFocused(plusIndex), editing }"
        @click="!editing ? startAdding() : null"
        tabindex="-1"
        type="button"
      >
        <span class="tile-symbol plus-symbol">+</span>
        <span class="tile-index">{{ alphabetChars.length + 1 }}</span>
        
        <input
          v-if="editing"
          ref="inputRef"
          v-model="tempChar"
          type="text"
          maxlength="1"
          class="tile-input"
          placeholder="?"
          @keyup.enter="confirmAdd"
          @keyup.escape="cancelAdd"
          @blur="cancelAdd"
        />
      </button>
    </div>

    <div v-if="alphabetChars.length === 0" class="empty-hint">
      Нажмите <span class="plus-inline">+</span> чтобы добавить символ
    </div>

    <div class="editor-info">
      <span>Символов: <strong>{{ alphabetChars.length }}</strong></span>
      <div class="editor-actions">
        <button 
          v-if="!isDefault" 
          class="reset-btn" 
          @click="resetAlphabet"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          Сбросить
        </button>
        <button class="clear-btn" @click="emit('update:modelValue', '')" v-if="alphabetChars.length > 0">
          Очистить
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alphabet-editor {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  outline: none;
  transition: border-color var(--transition), box-shadow var(--transition);
}

.alphabet-editor:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
}

/* 🔹 Центрирование тайлов + перенос строк */
.tiles-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) 0;
  justify-content: center;
}

/* 🔹 Плюс-тайл — стиль как у Tile.vue */
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

.empty-hint {
  text-align: center;
  padding: var(--spacing-lg);
  color: var(--color-text-muted);
  font-size: 13px;
}

.empty-hint .plus-inline {
  display: inline-block;
  padding: 2px 8px;
  background: var(--color-bg);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-sm);
  font-weight: 600;
  color: var(--color-primary);
}

.editor-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--color-border);
  font-size: 13px;
  color: var(--color-text-secondary);
}

.editor-actions {
  display: flex;
  gap: var(--spacing-xs);
  flex-shrink: 0;
}

.reset-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  font-size: 12px;
  padding: 4px 10px;
  cursor: pointer;
  transition: all var(--transition);
  white-space: nowrap;
}

.reset-btn:hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.reset-btn svg {
  flex-shrink: 0;
}

.clear-btn {
  background: none;
  border: none;
  color: var(--color-error);
  cursor: pointer;
  font-size: 13px;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: background var(--transition);
  white-space: nowrap;
}

.clear-btn:hover {
  background: var(--color-error);
  color: #fff;
}

/* 🔹 Адаптивность */
@media (max-width: 768px) {
  .plus-tile {
    width: 36px;
    height: 48px;
  }
  
  .plus-symbol {
    font-size: 14px;
  }
  
  .tile-index {
    font-size: 8px;
  }
  
  .editor-info {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .editor-actions {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .editor-info {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }
  
  .editor-actions {
    width: auto;
    justify-content: flex-start;
  }
  
  .reset-btn {
    padding: 3px 8px;
    font-size: 11px;
  }
  
  .clear-btn {
    padding: 3px 6px;
    font-size: 12px;
  }
}
</style>