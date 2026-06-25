<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useSettingsStore } from '../../stores/compression/useSettingsStore'
import { useDecompressionStore } from '../../stores/compression/useDecompressionStore'
import { parseMassInput } from '../../core/compression/codesParser'
import Textarea from '../ui/Textarea.vue'

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

const PLACEHOLDERS: Record<string, string> = {
  lzw: 'Введите коды через запятую или пробел (например: 65, 66, 256)...',
  lz77: 'Введите тройки <смещение, длина, символ> (например: <0,0,\'а\'>, <3,2,\'б\'>)...',
  lz78: 'Введите пары <индекс, символ> (например: <0,\'а\'>, <1,\'б\'>)...',
  lzss: 'Введите коды \"флаг, \'символ\'/<смещение, длина>\" (например: 0, \'а\' или 1, <1,3>)...'
};

const inputPlaceholder = computed(() => {
  return PLACEHOLDERS[settings.algorithm] || 'Введите входные данные...';
});

</script>

<template>
  <div class="mass-input-wrapper">
    <Textarea
      v-model="rawInput"
      @input="handleInput"
      :placeholder="inputPlaceholder"
    />
  </div>
</template>

<style scoped>
.mass-input-wrapper {
  width: 100%;
}
</style>