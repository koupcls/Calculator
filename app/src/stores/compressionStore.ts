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
      switch (state.algorithm) {
        case 'lz77': return state.lz77Steps
        case 'lzss': return state.lzssSteps
        case 'lz78': return state.lz78Steps
        case 'lzw': return state.lzwSteps
        default: return []
      }
    },
    
    hasResults(): boolean {
    return this.currentSteps.length > 0
    }
  },

  actions: {
    setAlgorithm(algo: CompressionAlgorithm) {
      this.algorithm = algo
    },

    setAlphabet(alphabet: string) {
      this.alphabet = [...new Set(alphabet)].join('')
    },

    async process() {
      if (!this.input.trim()) {
        this.error = 'Введите текст'
        return
      }

      this.isLoading = true
      this.error = null

      try {
        await new Promise(res => setTimeout(res, 50))

        switch (this.algorithm) {
          case 'lz77':
            this.lz77Steps = lz77Compress(this.input)
            break
          case 'lzss':
            this.lzssSteps = lzssCompress(this.input)
            break
          case 'lz78':
            this.lz78Steps = lz78Compress(this.input)
            break
          case 'lzw':
            this.lzwSteps = lzwCompress(this.input, this.alphabet)
            break
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Ошибка сжатия'
      } finally {
        this.isLoading = false
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