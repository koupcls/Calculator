<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSettingsStore } from '../../stores/compression/useSettingsStore'
import { useDecompressionStore } from '../../stores/compression/useDecompressionStore'
import { parseMassInput } from '../../core/compression/codesParser'

const settings = useSettingsStore()
const decompression = useDecompressionStore()
const rawInput = ref('')

const handleInput = () => {
  const parsedCodes = parseMassInput(rawInput.value, settings.algorithm)
  decompression.setDecompressionCodes(parsedCodes)
}

watch(() => settings.algorithm, () => {
  rawInput.value = ''
})
</script>

<template>
  <div class="mass-input-wrapper">
    <textarea
      v-model="rawInput"
      @input="handleInput"
      class="mass-textarea"
      :placeholder="
        settings.algorithm === 'lzw' 
          ? 'Введите коды через запятую или пробел (например: 65, 66, 256)...' 
          : 'Введите строку кодов (например: <0,0,\'к\'>, <0,0,\'о\'>)...'
      "
      rows="3"
    ></textarea>
  </div>
</template>

<style scoped>
.mass-input-wrapper {
  width: 100%;
}
.mass-textarea {
  width: 100%;
  font-family: var(--font-mono, monospace);
  font-size: 14px;
  padding: var(--spacing-sm, 10px);
  background: var(--color-bg, #ffffff);
  color: var(--color-text, #000000);
  border: 1px solid var(--color-border, #ccc);
  border-radius: var(--radius-md, 6px);
  outline: none;
  resize: vertical;
  line-height: 1.4;
  transition: border-color 0.2s ease;
}
.mass-textarea:focus {
  border-color: var(--color-primary, #4f46e5);
}
</style>