import { defineStore } from 'pinia'
import {
  calculateFrequencies,
  calculateEntropy,
  calculateMaxEntropy,
  calculateAbsoluteRedundancy,
  calculateRelativeRedundancy,
  calculateMean
} from '../core/trees/metrics'
import {
  formatEntropyFormula, 
  formatMaxEntropyFormula, 
  formatMeanFormula, 
  formatRedundancyFormula, 
  formatRelativeRedundancyFormula
} from '../core/utils/formatters'
import { HuffmanTree } from '../core/trees/HuffmanTree'
import { ShanonFanoTree } from '../core/trees/ShanonFanoTree'
import type { CodingState } from '../core/trees/storeTypes'

export const useTreeStore = defineStore('tree-coding', {
  state: (): CodingState => ({
    input: '',
    caseSensitive: false,
    frequencies: {},
    metrics: null,
    huffman: null,
    shannonFano: null,
    isLoading: false,
    error: null
  }),

  getters: {
    isAnalyzed: (state): boolean => !!state.metrics && !!state.huffman,
    redundancyPercent: (state): string => 
      state.metrics ? (state.metrics.r0 * 100).toFixed(2) + '%' : '—',
    entropyFormula: (state): string => 
      state.metrics ? formatEntropyFormula(state.frequencies, state.metrics.n) : '',
    maxEntropyFormula: (state): string => 
      state.metrics ? formatMaxEntropyFormula(state.metrics.m) : '',
    redundancyFormula: (state): string => 
      state.metrics ? formatRedundancyFormula(state.metrics.entropy, state.metrics.H_max) : '',
    relativeRedundancyFormula: (state): string => 
      state.metrics ? formatRelativeRedundancyFormula(state.metrics.entropy, state.metrics.H_max) : '',
    huffmanMeanFormula: (state): string => 
      state.huffman && state.metrics
        ? formatMeanFormula(state.huffman.codes, state.frequencies, state.metrics.n)
        : '',
    shannonMeanFormula: (state): string => 
      state.shannonFano && state.metrics
        ? formatMeanFormula(state.shannonFano.codes, state.frequencies, state.metrics.n)
        : ''
  },

  actions: {
    async analyze(input: string) {
      if (!input || input.trim() === '') {
        this.error = 'Введите непустую строку'
        return
      }

      this.isLoading = true
      this.error = null

      try {
        const processedInput = this.caseSensitive === true ? input : input.toLowerCase()
        this.input = input
        const freqs = calculateFrequencies(processedInput)
        this.frequencies = freqs

        const n = processedInput.length
        const m = Object.entries(freqs).length
        const entropy = calculateEntropy(n, freqs)
        const H_max = calculateMaxEntropy(m)
        const R = calculateAbsoluteRedundancy(entropy, H_max)
        const r0 = calculateRelativeRedundancy(entropy, H_max)

        this.metrics = { entropy, H_max, R, r0, n, m }

        const huffmanTree = new HuffmanTree(freqs)
        const codes = huffmanTree.toMap()
        const expectedLength = calculateMean(n, codes, freqs)

        this.huffman = {
          expectedLength,
          codes,
          treeJson: huffmanTree.toJson()
        }

        const sfTree = new ShanonFanoTree(freqs)
        const sfCodes = sfTree.toMap()
        const sfExpected = calculateMean(n, sfCodes, freqs)

        this.shannonFano = {
          expectedLength: sfExpected,
          codes: sfCodes,
          treeJson: sfTree.toJson()
        }
      } catch (err) {
        console.error('Analysis error:', err)
        this.error = err instanceof Error ? err.message : 'Неизвестная ошибка'
        this.resetResults()
      } finally {
        this.isLoading = false
      }
    },

    resetResults() {
      this.metrics = null
      this.huffman = null
      this.shannonFano = null
    },

    clear() {
      this.$reset()
    }
  }
})