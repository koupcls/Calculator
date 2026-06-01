import { defineStore } from 'pinia';
import { vigenereCipher, columnarTransposition } from '../core/cipher/algorithms';
import type { CipherState, CipherStep, CipherMode, CipherType, ColumnarVisualization } from '../core/cipher/storeTypes';

function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

function buildColumnarVisualization(
  text: string,
  key: string,
  alphabet: string,
  mode: CipherMode
): ColumnarVisualization {
  const keyLength = key.length;
  const keyIndices = Array.from({ length: keyLength }, (_, i) => i);
  
  keyIndices.sort((a, b) => {
    const idxA = alphabet.indexOf(key[a]);
    const idxB = alphabet.indexOf(key[b]);
    return idxA === idxB ? a - b : idxA - idxB;
  });

  const numRows = Math.ceil(text.length / keyLength);
  const table: string[][] = Array.from({ length: numRows }, () => Array(keyLength).fill(''));

  if (mode === 'encrypt') {
    for (let i = 0; i < text.length; i++) {
      table[Math.floor(i / keyLength)][i % keyLength] = text[i];
    }
    return { keyIndices, sortedOrder: keyIndices, table, readOrder: 'columns' };
  } else {
    const remainder = text.length % keyLength || keyLength;
    const colLengths: number[] = Array(keyLength).fill(0);
    for (let i = 0; i < keyLength; i++) {
      colLengths[keyIndices[i]] = i < remainder ? numRows : numRows - 1;
    }
    let idx = 0;
    for (const colIdx of keyIndices) {
      for (let row = 0; row < colLengths[colIdx]; row++) {
        if (idx < text.length) table[row][colIdx] = text[idx++];
      }
    }
    return { keyIndices, sortedOrder: keyIndices, table, colLengths, readOrder: 'rows' };
  }
}

export const useCipherStore = defineStore('cipher', {
  state: (): CipherState => ({
    alphabet: 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя -',
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
        this.alphabet = [...new Set(alphabet)].join('');
    },

    addStep(type: CipherType, mode: CipherMode, key: string, input?: string) {
      const stepInput = input !== undefined ? input : (this.lastOutput ?? '');
      
      const newStep: CipherStep = {
        id: generateId(),
        type,
        mode,
        key,
        input: stepInput,
        output: null,
        isLoading: false,
        error: null
      };
      
      this.steps.push(newStep);
      return newStep.id;
    },

    removeStep(stepId: string) {
      const index = this.steps.findIndex(s => s.id === stepId);
      if (index !== -1) {
        this.steps.splice(index, 1);
      }
    },

    async runStep(stepId: string) {
      const step = this.steps.find(s => s.id === stepId);
      if (!step || !step.input) return;

      step.isLoading = true;
      step.error = null;

      try {
        if (step.type === 'vigenere') {
          step.output = vigenereCipher(step.input, step.key, this.alphabet, step.mode);
        } else {
          step.output = columnarTransposition(step.input, step.key, this.alphabet, step.mode);
          step.visualization = buildColumnarVisualization(step.input, step.key, this.alphabet, step.mode);
        }
      } catch (err) {
        step.error = err instanceof Error ? err.message : 'Ошибка шифрования';
        step.output = null;
      } finally {
        step.isLoading = false;
      }
    },

    async runAll() {
      if (this.steps.length === 0) return;
      
      this.isLoading = true;
      this.error = null;

      try {
        for (const step of this.steps) {
          if (step.input) {
            await this.runStep(step.id);
            if (step.error) break;
          }
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Неизвестная ошибка';
      } finally {
        this.isLoading = false;
      }
    },

    reset() {
      this.steps = [];
      this.error = null;
    },

    clearAll() {
      this.$reset();
    }
  }
});