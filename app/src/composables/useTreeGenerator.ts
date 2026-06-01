import { ref, computed } from 'vue'
import { HuffmanTree } from '../core/trees/HuffmanTree'
import { ShannonFanoTree } from '../core/trees/ShanonFanoTree'

export function useTreeGenerator() {
  const text = ref('')
  const algorithm = ref<'huffman' | 'shannon'>('huffman')
  const frequencies = ref<Record<string, { freq: number; order: number }>>({})
  const treeRoot = ref<any>(null)
  const codeMap = ref<Record<string, string>>({})

  const compute = () => {
    if (!text.value.trim()) return
    
    // Считаем частоты + порядок первого появления
    const freq: Record<string, { freq: number; order: number }> = {}
    let orderCounter = 0
    
    for (const char of text.value) {
      if (!freq[char]) {
        freq[char] = { freq: 0, order: orderCounter++ }
      }
      freq[char].freq++
    }
    
    frequencies.value = freq

    const TreeClass = algorithm.value === 'huffman' ? HuffmanTree : ShannonFanoTree
    const treeInstance = new TreeClass(freq)
    treeRoot.value = treeInstance.toWebTree()
    codeMap.value = treeInstance.toCodeMap()
  }

  const freqTableData = computed(() =>
    Object.entries(frequencies.value)
      .sort((a, b) => a[1].order - b[1].order) // сортируем по порядку для таблицы
      .map(([char, data]) => ({
        symbol: char === ' ' ? '␣' : char,
        frequency: data.freq,
        probability: text.value.length > 0 
          ? `${((data.freq / text.value.length) * 100).toFixed(1)}%` 
          : '0%'
      }))
  )

  const codeTableData = computed(() =>
    Object.entries(codeMap.value).map(([char, code]) => ({
      symbol: char === ' ' ? '␣' : char,
      code,
      length: code.length
    }))
  )

  return { text, algorithm, compute, treeRoot, freqTableData, codeTableData }
}