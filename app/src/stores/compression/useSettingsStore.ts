import { defineStore } from 'pinia'

export type CompressionAlgorithm = 'lz77' | 'lzss' | 'lz78' | 'lzw'
export type AppMode = 'compress' | 'decompress'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    mode: 'compress' as AppMode,
    algorithm: 'lz77' as CompressionAlgorithm,
    alphabet: 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя -',
    caseSensitive: false,
  }),
  actions: {
    setMode(mode: AppMode) { this.mode = mode },
    setAlgorithm(algo: CompressionAlgorithm) { this.algorithm = algo },
    setAlphabet(newAlphabet: string) { this.alphabet = [...new Set(newAlphabet)].join('') },
    toggleCaseSensitivity() { this.caseSensitive = !this.caseSensitive }
  }
})