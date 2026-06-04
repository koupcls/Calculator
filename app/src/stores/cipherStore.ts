import { defineStore } from 'pinia'
import { vigenereCipher, columnarTransposition } from '../core/cipher/algorithms'
import type { CipherState, CipherStep, CipherMode, CipherType } from '../core/cipher/storeTypes'

function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

export const useCipherStore = defineStore('cipher', {
  state: (): CipherState => ({
    alphabet: 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя ',
    defaultAlphabet: 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя ',
    caseSensitive: false,
    steps: [],
    isLoading: false,
    error: null
  }),

  getters: {
    canAddStep: (state) => state.steps.length === 0 || state.steps[state.steps.length - 1].output !== null,
    lastOutput: (state): string | null => 
      state.steps.length > 0 ? state.steps[state.steps.length - 1].output : null
  },

  actions: {
    setAlphabet(alphabet: string) {
      this.alphabet = [...new Set(alphabet)].join('')
    },

    addStep(type: CipherType, mode: CipherMode, key: string, input?: string) {
      const stepInput = input !== undefined ? input : (this.lastOutput ?? '')
      
      const newStep: CipherStep = {
        id: generateId(),
        type,
        mode,
        key: this.caseSensitive ? key : key.toLowerCase(),
        input: this.caseSensitive ? stepInput : stepInput.toLowerCase(),
        output: null,
        isLoading: false,
        error: null,
        alphabet: this.alphabet
      }
      
      this.steps.push(newStep)
      return newStep.id
    },

    removeStep(stepId: string) {
      const index = this.steps.findIndex(s => s.id === stepId)
      if (index !== -1) {
        this.steps.splice(index, 1)
      }
    },

    async runStep(stepId: string) {
      const step = this.steps.find(s => s.id === stepId)
      if (!step || !step.input) return

      step.isLoading = true
      step.error = null

      try {
        if (step.type === 'vigenere') {
          step.output = vigenereCipher(step.input, step.key, this.alphabet, step.mode)
        } else {
          const data = columnarTransposition(step.input, step.key, this.alphabet, step.mode)
          step.output = data.result
          step.visualization = data.visualization
        }
      } catch (err) {
        step.error = err instanceof Error ? err.message : 'Ошибка шифрования'
        step.output = null
      } finally {
        step.isLoading = false
      }
    },

    async recalculateFrom(startIndex: number) {
      if (startIndex < 0 || startIndex >= this.steps.length) return

      for (let i = startIndex; i < this.steps.length; i++) {
        const step = this.steps[i]
      
        if (i > 0) {
          const prevStep = this.steps[i - 1]
          if (!prevStep?.output) break
          step.input = prevStep.output
        }
        
        await this.runStep(step.id)
        if (step.error) break
      }
    }
  }
})