<script setup lang="ts">
import { ref, computed } from 'vue'
// Обновленный путь к типу
import type { CompressionAlgorithm } from '../../stores/compression/useSettingsStore'

const props = defineProps<{
  algorithm: CompressionAlgorithm
  modelValue: any // Лежит объект: LZ77Code | LZSSCode | LZ78Code | LZWCode | null
  dictionaryLength: number
  isDraft?: boolean 
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'submit', value: any): void
}>()

const isEditing = ref(props.isDraft)

const lz77 = ref({ offset: 0, length: 0, nextChar: '' })
const lzss = ref({ isLiteral: true, offset: 0, length: 1, symbol: '' })
const lz78 = ref({ dictIndex: 0, symbol: '' })
const lzw = ref({ code: 0 }) // Локальная копия структуры LZW { code: X }

const initEdit = () => {
  if (props.modelValue) {
    if (props.algorithm === 'lz77') lz77.value = { ...props.modelValue }
    if (props.algorithm === 'lzss') lzss.value = { ...props.modelValue }
    if (props.algorithm === 'lz78') lz78.value = { ...props.modelValue }
    if (props.algorithm === 'lzw') lzw.value = { ...props.modelValue }
  }
  isEditing.value = true
}

const displayString = computed(() => {
  if (!props.modelValue) return '< _, _, _ >'
  switch (props.algorithm) {
    case 'lz77': return `<${props.modelValue.offset}, ${props.modelValue.length}, '${props.modelValue.nextChar}'>`
    case 'lzss': return props.modelValue.isLiteral 
      ? `0, '${props.modelValue.symbol}'` 
      : `1, <${props.modelValue.offset}, ${props.modelValue.length}>`
    case 'lz78': return `<${props.modelValue.dictIndex}, '${props.modelValue.symbol}'>`
    case 'lzw': return props.modelValue.code // Спокойно читает .code из объекта
    default: return ''
  }
})

const submit = () => {
  let result = null

  switch (props.algorithm) {
    case 'lz77':
      if (lz77.value.nextChar.length > 1) return
      lz77.value.offset = Math.min(Math.max(0, lz77.value.offset), Math.max(0, props.dictionaryLength - 1))
      result = { ...lz77.value }
      break
    case 'lzss':
      if (lzss.value.isLiteral && lzss.value.symbol.length > 1) return
      lzss.value.offset = Math.min(Math.max(0, lzss.value.offset), Math.max(0, props.dictionaryLength - 1))
      lzss.value.length = Math.max(1, lzss.value.length)
      result = { ...lzss.value }
      break
    case 'lz78':
      if (lz78.value.symbol.length > 1) return
      lz78.value.dictIndex = Math.min(Math.max(0, lz78.value.dictIndex), props.dictionaryLength)
      result = { ...lz78.value }
      break
    case 'lzw':
      lzw.value.code = Math.max(0, lzw.value.code)
      result = { ...lzw.value } // Передаем объект { code: number }
      break
  }

  if (result) {
    emit('update:modelValue', result)
    emit('submit', result)
    if (!props.isDraft) isEditing.value = false
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') submit()
  if (e.key === 'Escape' && !props.isDraft) isEditing.value = false
}
</script>

<template>
  <div class="code-editor" @click="!isEditing && initEdit()">
    <div v-if="!isEditing" class="code-view">
      <span class="mono code">{{ displayString }}</span>
    </div>

    <div v-else class="code-inputs" @keydown="handleKeydown">
      
      <template v-if="algorithm === 'lz77'">
        <span>&lt;</span>
        <input type="number" v-model.number="lz77.offset" min="0" :max="Math.max(0, dictionaryLength - 1)" class="num-input" />
        <span>,</span>
        <input type="number" v-model.number="lz77.length" min="0" class="num-input" />
        <span>, '</span>
        <input type="text" v-model="lz77.nextChar" maxlength="1" class="char-input" />
        <span>'&gt;</span>
      </template>

      <template v-if="algorithm === 'lzss'">
        <select v-model="lzss.isLiteral" class="select-input">
          <option :value="true">0 (Символ)</option>
          <option :value="false">1 (Ссылка)</option>
        </select>
        <span>, </span>
        <template v-if="lzss.isLiteral">
          <span>'</span><input type="text" v-model="lzss.symbol" maxlength="1" class="char-input" /><span>'</span>
        </template>
        <template v-else>
          <span>&lt;</span>
          <input type="number" v-model.number="lzss.offset" min="0" :max="Math.max(0, dictionaryLength - 1)" class="num-input" />
          <span>,</span>
          <input type="number" v-model.number="lzss.length" min="1" class="num-input" />
          <span>&gt;</span>
        </template>
      </template>

      <template v-if="algorithm === 'lz78'">
        <span>&lt;</span>
        <input type="number" v-model.number="lz78.dictIndex" min="0" :max="dictionaryLength" class="num-input" />
        <span>, '</span>
        <input type="text" v-model="lz78.symbol" maxlength="1" class="char-input" />
        <span>'&gt;</span>
      </template>

      <template v-if="algorithm === 'lzw'">
        <input type="number" v-model.number="lzw.code" min="0" class="num-input lzw-input" placeholder="Код" />
      </template>

      <button @click.stop="submit" class="submit-btn" title="Сохранить (Enter)">✓</button>
    </div>
  </div>
</template>

<style scoped>
.code-editor {
  display: inline-block;
  cursor: pointer;
  min-height: 28px;
}
.code-view:hover .code {
  background: var(--color-bg-secondary);
  border-color: var(--color-primary);
}
.code-inputs {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: 13px;
  background: var(--color-bg);
  padding: 2px 6px;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
}
input, select {
  font-family: inherit;
  font-size: inherit;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 2px 4px;
  text-align: center;
  background: var(--color-bg-secondary);
  color: var(--color-text);
  outline: none;
}
input:focus, select:focus {
  border-color: var(--color-primary);
}
.num-input { width: 45px; }
.char-input { width: 30px; }
.lzw-input { width: 60px; }
.submit-btn {
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
}
.submit-btn:hover { opacity: 0.9; }
</style>