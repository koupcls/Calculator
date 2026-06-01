<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import AlphabetTile from './AlphabetTile.vue';

const props = defineProps<{
  modelValue: string
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();

// Состояния
const editing = ref(false);
const focusedIndex = ref<number | null>(null);
const tempChar = ref('');
const inputRef = ref<HTMLInputElement>();

// Уникальные символы алфавита
const alphabetChars = computed(() => {
  const seen = new Set<string>();
  return props.modelValue.split('').filter(char => {
    if (seen.has(char)) return false;
    seen.add(char);
    return true;
  });
});

// Индекс "+" тайла (всегда последний)
const plusIndex = computed(() => alphabetChars.value.length);

// Проверка: можно ли добавить символ
const isValidChar = (char: string) => 
  char.length === 1 && !props.modelValue.includes(char);

// Начало ввода (клик на "+")
const startAdding = () => {
  editing.value = true;
  tempChar.value = '';
  focusedIndex.value = plusIndex.value;
  nextTick(() => inputRef.value?.focus());
};

// Подтверждение добавления
const confirmAdd = () => {
  if (isValidChar(tempChar.value)) {
    emit('update:modelValue', props.modelValue + tempChar.value);
    tempChar.value = '';
    // Остаёмся в режиме ввода для непрерывного добавления
    nextTick(() => inputRef.value?.focus());
  }
};

// Отмена ввода
const cancelAdd = () => {
  editing.value = false;
  tempChar.value = '';
};

// Удаление символа
const removeChar = (index: number) => {
  const seen = new Set<string>();
  const chars = props.modelValue.split('');
  const unique = chars.filter(c => {
    if (seen.has(c)) return false;
    seen.add(c);
    return true;
  });
  
  unique.splice(index, 1);
  emit('update:modelValue', unique.join(''));
  
  // Корректируем фокус после удаления
  if (focusedIndex.value === index) {
    focusedIndex.value = null;
  } else if (focusedIndex.value !== null && focusedIndex.value > index) {
    focusedIndex.value--;
  }
};

// Навигация клавиатурой
const handleKeydown = (e: KeyboardEvent) => {
  if (editing.value) {
    if (e.key === 'Escape') {
      e.preventDefault();
      cancelAdd();
    }
    return;
  }

  const max = plusIndex.value;
  
  switch (e.key) {
    case 'ArrowRight':
      e.preventDefault();
      focusedIndex.value = focusedIndex.value === null ? 0 : Math.min(focusedIndex.value + 1, max);
      break;
    case 'ArrowLeft':
      e.preventDefault();
      focusedIndex.value = focusedIndex.value === null ? max : Math.max(focusedIndex.value - 1, 0);
      break;
    case 'Backspace':
    case 'Delete':
      e.preventDefault();
      if (focusedIndex.value !== null && focusedIndex.value >= 0 && focusedIndex.value < alphabetChars.value.length) {
        removeChar(focusedIndex.value);
      }
      break;
    case 'Enter':
    case ' ':
      e.preventDefault();
      if (focusedIndex.value === plusIndex.value) {
        startAdding();
      } else if (focusedIndex.value !== null && focusedIndex.value >= 0) {
        // Опционально: начать редактирование существующего символа
        removeChar(focusedIndex.value); // Или другая логика
      }
      break;
  }
};

// Проверка фокуса
const isFocused = (index: number) => focusedIndex.value === index;

// Фокус на контейнере
const handleFocus = () => {
  if (focusedIndex.value === null) {
    focusedIndex.value = plusIndex.value;
  }
};
</script>

<template>
  <div 
    class="alphabet-editor" 
    tabindex="0"
    @focus="handleFocus"
    @keydown="handleKeydown"
    @blur="focusedIndex = null"
  >
    <!-- Сетка плиток -->
    <div class="tiles-container">
      <!-- Плитки алфавита -->
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
      
      <!-- Плюс-тайл -->
      <div 
        class="plus-tile"
        :class="{ 
          focused: isFocused(plusIndex), 
          editing: editing 
        }"
        @click="!editing ? startAdding() : null"
        tabindex="-1"
      >
        <template v-if="editing">
          <input
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
        </template>
        <template v-else>
          <span class="plus-symbol">+</span>
          <span class="tile-index">{{ alphabetChars.length + 1 }}</span>
        </template>
      </div>
    </div>

    <!-- Подсказка для пустого алфавита -->
    <div v-if="alphabetChars.length === 0" class="empty-hint">
      Нажмите <span class="plus-inline">+</span> чтобы добавить символ
    </div>

    <!-- Инфо-панель -->
    <div class="editor-info">
      <span>Символов: <strong>{{ alphabetChars.length }}</strong></span>
      <button class="clear-btn" @click="emit('update:modelValue', '')" v-if="alphabetChars.length > 0">
        Очистить
      </button>
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

.tiles-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) 0;
}

.plus-tile {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 64px;
  background: var(--color-bg);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  transition: all var(--transition);
  cursor: pointer;
  user-select: none;
}

.plus-tile:hover {
  border-color: var(--color-primary);
  background: var(--color-bg-tertiary);
}

.plus-tile.focused {
  border-color: var(--color-primary);
  border-style: solid;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
}

.plus-tile.editing {
  border-color: var(--color-primary);
  border-style: solid;
  background: var(--color-bg-tertiary);
}

.plus-symbol {
  font-size: 24px;
  font-weight: 300;
  color: var(--color-text-muted);
  line-height: 1;
}

.tile-index {
  font-family: var(--font-sans);
  font-size: 10px;
  color: var(--color-text-muted);
  margin-top: 2px;
  font-weight: 500;
}

.tile-input {
  width: 100%;
  height: 100%;
  font-family: var(--font-mono);
  font-size: 20px;
  text-align: center;
  background: transparent;
  border: none;
  outline: none;
  color: var(--color-text);
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

.clear-btn {
  background: none;
  border: none;
  color: var(--color-error);
  cursor: pointer;
  font-size: 13px;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: background var(--transition);
}

.clear-btn:hover {
  background: var(--color-error);
  color: #fff;
}
</style>