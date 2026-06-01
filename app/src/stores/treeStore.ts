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
import type { CodingState, TreeData, MetricsData } from '../core/trees/storeTypes'

export const useTreeStore = defineStore('tree-coding', {
  state: (): CodingState => ({
    input: '',
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
    
    // Формулы метрик
    entropyFormula: (state): string => 
      state.metrics 
        ? formatEntropyFormula(state.frequencies, state.metrics.n) 
        : '',
    maxEntropyFormula: (state): string => 
      state.metrics ? formatMaxEntropyFormula(state.metrics.m) : '',
    redundancyFormula: (state): string => 
      state.metrics 
        ? formatRedundancyFormula(state.metrics.entropy, state.metrics.H_max) 
        : '',
    relativeRedundancyFormula: (state): string => 
      state.metrics 
        ? formatRelativeRedundancyFormula(state.metrics.entropy, state.metrics.H_max) 
        : '',
    
    // Формулы мат. ожидания
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
        this.input = input
        const freqs = calculateFrequencies(input)
        this.frequencies = freqs

        const n = input.length
        const m = Object.entries(freqs).length

        const inputLength = input.length
        const alphabetSize = Object.keys(freqs).length
        
        const entropy = calculateEntropy(inputLength, freqs)
        const H_max = calculateMaxEntropy(alphabetSize)
        const R = calculateAbsoluteRedundancy(entropy, H_max)
        const r0 = calculateRelativeRedundancy(entropy, H_max)

        this.metrics = { entropy, H_max, R, r0, n, m }

        const huffmanTree = new HuffmanTree(freqs)
        const codes = huffmanTree.toMap()
        const expectedLength = calculateMean(inputLength, codes, freqs)
        const treeJson = huffmanTree.toJson()

        this.huffman = {
          expectedLength,
          codes,
          treeJson
        }

        const sfTree = new ShanonFanoTree(freqs)
        const sfCodes = sfTree.toMap()
        const sfExpected = calculateMean(inputLength, sfCodes, freqs)

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