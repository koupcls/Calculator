import { defineStore } from 'pinia'
import { useSettingsStore } from './useSettingsStore'
import type { LZ77Code } from '../../core/compression/lz77' // Добавлены импорты кодов
import type { LZSSCode } from '../../core/compression/lzss'
import type { LZ78Code } from '../../core/compression/lz78' // Проверьте правильность путей для LZ78Code
import type { LZWCode } from '../../core/compression/lzw'
import { lz77Decompress } from '../../core/compression/lz77'
import { lzssDecompress } from '../../core/compression/lzss'
import { lz78Decompress } from '../../core/compression/lz78'
import { lzwDecompress } from '../../core/compression/lzw'

export const useDecompressionStore = defineStore('decompression', {
  state: () => ({
    codesLz77: [] as LZ77Code[], 
    codesLzss: [] as LZSSCode[], 
    codesLz78: [] as LZ78Code[], 
    codesLzw: [] as LZWCode[],
    error: null as string | null
  }),

  getters: {
    decompressionResult(state): { steps: any[], resultString: string } {
      const settings = useSettingsStore()
      
      try {
        const alphabet = settings.caseSensitive ? settings.alphabet : settings.alphabet.toLowerCase()
        switch (settings.algorithm) {
          case 'lz77': return lz77Decompress(state.codesLz77)
          case 'lzss': return lzssDecompress(state.codesLzss)
          case 'lz78': return lz78Decompress(state.codesLz78)
          case 'lzw':  return lzwDecompress(state.codesLzw, alphabet)
          default: return { steps: [], resultString: '' }
        }
      } catch (e) {
        return { steps: [], resultString: '' }
      }
    },
    currentSteps(): any[] { 
      return this.decompressionResult.steps 
    },
    decompressedText(): string { 
      return this.decompressionResult.resultString 
    },
    formattedCodesString(): string { 
      return this.currentSteps.map(s => s.stringCode).join(', ') 
    },
    currentDictionaryLength(): number {
      const steps = this.currentSteps;
      if (steps.length === 0) return 0;
      
      const lastStep = steps[steps.length - 1];
      return (lastStep.dictionary as string).length;
    },
  },

  actions: {
    // Вспомогательный метод, чтобы не дублировать вызовuseSettingsStore()
    getAlgorithm() {
      const settings = useSettingsStore()
      return settings.algorithm
    },

    addDecompressionCode(code: any) {
      this.error = null // Сбрасываем ошибку при вводе новых данных
      switch (this.getAlgorithm()) {
        case 'lz77': this.codesLz77.push(code as LZ77Code); break;
        case 'lzss': this.codesLzss.push(code as LZSSCode); break;
        case 'lz78': this.codesLz78.push(code as LZ78Code); break;
        case 'lzw':  this.codesLzw.push(code as LZWCode); break;
      }
    },

    setDecompressionCodes(codes: any[]) {
      this.error = null
      switch (this.getAlgorithm()) {
        case 'lz77': this.codesLz77 = codes; break;
        case 'lzss': this.codesLzss = codes; break;
        case 'lz78': this.codesLz78 = codes; break;
        case 'lzw':  this.codesLzw = codes; break;
      }
    },

    updateDecompressionCode(index: number, code: any) {
      this.error = null
      switch (this.getAlgorithm()) {
        case 'lz77': this.codesLz77[index] = code as LZ77Code; break;
        case 'lzss': this.codesLzss[index] = code as LZSSCode; break;
        case 'lz78': this.codesLz78[index] = code as LZ78Code; break;
        case 'lzw':  this.codesLzw[index] = code as LZWCode; break;
      }
    },
    
    sliceDecompressionCodes(length: number) {
      switch (this.getAlgorithm()) {
        case 'lz77': this.codesLz77 = this.codesLz77.slice(0, length); break;
        case 'lzss': this.codesLzss = this.codesLzss.slice(0, length); break;
        case 'lz78': this.codesLz78 = this.codesLz78.slice(0, length); break;
        case 'lzw':  this.codesLzw = this.codesLzw.slice(0, length); break;
      }
    },

    reset() {
      this.codesLz77 = []
      this.codesLzss = []
      this.codesLz78 = []
      this.codesLzw = []
      this.error = null
    },

    clearAll() {
      this.reset()
    }
  }
})