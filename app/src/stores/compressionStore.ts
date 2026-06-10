import { defineStore } from 'pinia'
import {
  lz77Compress,
  lzssCompress,
  lz78Compress,
  lzwCompress,
  type LZ77Step,
  type LZSSStep,
  type LZ78Step,
  type LZWStep
} from '../core/compression/algorothms'

export type CompressionAlgorithm = 'lz77' | 'lzss' | 'lz78' | 'lzw'

export interface CompressionState {
  input: string
  alphabet: string
  defaultAlphabet: string
  caseSensitive: boolean
  algorithm: CompressionAlgorithm
  lz77Steps: LZ77Step[]
  lzssSteps: LZSSStep[]
  lz78Steps: LZ78Step[]
  lzwSteps: LZWStep[]
  isLoading: boolean
  error: string | null
}

export const useCompressionStore = defineStore('compression', {
  state: (): CompressionState => ({
    input: '',
    alphabet: 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя -',
    defaultAlphabet: 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя -',
    caseSensitive: false,
    algorithm: 'lz77',
    lz77Steps: [],
    lzssSteps: [],
    lz78Steps: [],
    lzwSteps: [],
    isLoading: false,
    error: null
  }),

  getters: {
    currentSteps: (state) => {
      const stepsMap = {
        lz77: state.lz77Steps,
        lzss: state.lzssSteps,
        lz78: state.lz78Steps,
        lzw: state.lzwSteps,
      }
      return stepsMap[state.algorithm] || []
    },
    
    hasResults(): boolean {
      return this.currentSteps.length > 0
    },

    formattedCodesString(): string {
      return this.currentSteps.map(step => step.stringCode).join(', ')
    }
  },

  actions: {
    setAlgorithm(algo: CompressionAlgorithm) {
      this.algorithm = algo
    },

    setAlphabet(newAlphabet: string) {
      this.alphabet = [...new Set(newAlphabet)].join('')
      this.process()
    },

    toggleCaseSensitivity() {
      this.caseSensitive = !this.caseSensitive
      this.process()
    },

    process() {
      const targetText = this.input
      
      if (!targetText) {
        this.reset()
        return
      }

      this.error = null
      
      const processedText = this.caseSensitive ? targetText : targetText.toLowerCase()
      const processedAlphabet = this.caseSensitive ? this.alphabet : this.alphabet.toLowerCase()

      try {
        this.lz77Steps = lz77Compress(processedText)
        this.lzssSteps = lzssCompress(processedText)
        this.lz78Steps = lz78Compress(processedText)
        this.lzwSteps = lzwCompress(processedText, processedAlphabet)
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Ошибка сжатия'
      }
    },

    reset() {
      this.lz77Steps = []
      this.lzssSteps = []
      this.lz78Steps = []
      this.lzwSteps = []
      this.error = null
    },

    clearAll() {
      this.input = ''
      this.reset()
    }
  }
})