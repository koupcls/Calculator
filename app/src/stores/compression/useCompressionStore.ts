import { defineStore } from 'pinia'
import { useSettingsStore } from './useSettingsStore'
import type { LZ77Step } from '../../core/compression/lz77'
import type { LZSSStep } from '../../core/compression/lzss'
import type { LZ78Step } from '../../core/compression/lz78'
import type { LZWStep } from '../../core/compression/lzw'
import { lz77Compress } from '../../core/compression/lz77'
import { lzssCompress } from '../../core/compression/lzss'
import { lz78Compress } from '../../core/compression/lz78'
import { lzwCompress } from '../../core/compression/lzw'

export interface CompressionState {
    input: string
    lz77Steps: LZ77Step[]
    lzssSteps: LZSSStep[]
    lz78Steps: LZ78Step[]
    lzwSteps: LZWStep[]
    error: string | null
}

export const useCompressionStore = defineStore('compression', {
  state: (): CompressionState => ({
    input: '',
    lz77Steps: [],
    lzssSteps: [], 
    lz78Steps: [], 
    lzwSteps: [],
    error: null as string | null
  }),
  getters: {
    currentSteps(): any {
      const settings = useSettingsStore()
      const map = { lz77: this.lz77Steps, lzss: this.lzssSteps, lz78: this.lz78Steps, lzw: this.lzwSteps }
      return map[settings.algorithm] || []
    },

    formattedCodesString(): string {
    return this.currentSteps
        .map((step: { stringCode: any }) => step.stringCode)
        .filter((code: any) => {
        if (typeof code !== 'string') return true;
        const trimmed = code.trim();
        return trimmed !== '' && trimmed !== '-';
        })
        .join(', ');
    },


    currentDictionaryLength(): number {
      const steps = this.currentSteps;
      if (steps.length === 0) return 0;
      
      const lastStep = steps[steps.length - 1];
      return (lastStep.dictionary as string).length;
    },
  },
  actions: {
    process() {
      const settings = useSettingsStore()
      if (!this.input) return this.reset()

      this.error = null
      const text = settings.caseSensitive ? this.input : this.input.toLowerCase()
      const alphabet = settings.caseSensitive ? settings.alphabet : settings.alphabet.toLowerCase()

      try {
        this.lz77Steps = lz77Compress(text)
        this.lzssSteps = lzssCompress(text)
        this.lz78Steps = lz78Compress(text)
        this.lzwSteps = lzwCompress(text, alphabet)
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Ошибка сжатия'
      }
    },
    reset() {
      this.lz77Steps = []; this.lzssSteps = []; this.lz78Steps = []; this.lzwSteps = [];
      this.error = null
    },
    clearAll() { this.input = ''; this.reset() }
  }
})