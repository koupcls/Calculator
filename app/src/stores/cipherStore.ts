import { defineStore } from 'pinia'
import { vigenereCipher, columnarTransposition } from '../core/cipher/algorithms'
import type { CipherStep, CipherMode, CipherType } from '../core/cipher/storeTypes'

function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

export const useCipherStore = defineStore('cipher', {
  state: () => ({
    alphabet: 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя ',
    defaultAlphabet: 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя ',
    caseSensitive: false,
    steps: [] as CipherStep[],
    keys: [
      { id: generateId(), value: '', idx: 1 }
    ] as { id: string; value: string; idx: number }[],
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

    addKeyInput() {
      this.keys.push({ id: generateId(), value: '', idx: this.keys.length + 1 })
    },

    removeKeyInput(id: string) {
      if (this.keys.length > 1) {
        this.keys = this.keys.filter(k => k.id !== id)
        this.keys.forEach((k, idx) => k.idx = idx)
      }
    },

    async updateKey(id: string, newValue: string) {

      

      const keyObj = this.keys.find(k => k.id === id)
      if (!keyObj) return
      
      keyObj.value = newValue

      const formattedKey = this.caseSensitive ? newValue : newValue.toLowerCase()
      this.steps.forEach(step => {
        if (step.keyId === id) {
          step.key = formattedKey
        }
      })

      await this.recalculateFrom(0)
    },

    addStep(type: CipherType, mode: CipherMode, id: string, input?: string) {
      const stepInput = input !== undefined ? input : (this.lastOutput ?? '')
      const keyObj = this.keys.find(k => k.id === id)
      const keyIdx = keyObj ? keyObj.idx : -1
      const rawKey = keyObj ? keyObj.value : ''

      const newStep: CipherStep = {
        id: generateId(),
        type,
        mode,
        keyId: id,
        keyIdx: keyIdx,
        key: this.caseSensitive ? rawKey : rawKey.toLowerCase(),
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
      if (!step) return

      if (!step.input || !step.key.trim()) {
        step.output = null
        return
      }

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
          if (!prevStep?.output) {
            step.output = null
            break
          }
          step.input = prevStep.output
        }
        
        await this.runStep(step.id)
        if (step.error) {
          for (let j = i + 1; j < this.steps.length; j++) {
            this.steps[j].output = null
          }
          break
        }
      }
    }
  }
})