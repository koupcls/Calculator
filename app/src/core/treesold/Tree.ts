import type { TreeNode, FreqWithOrder } from './types'

export abstract class Tree {
  protected root: TreeNode

  constructor(frequencies: Record<string, { freq: number; order: number }>) {
    if (Object.keys(frequencies).length === 0) {
      throw new Error('Frequencies map cannot be empty')
    }
    
    this.root = { code: '', symbol: null, symbols: [], left: null, right: null }
    
    // Сортируем: по частоте (убывание), затем по порядку появления (возрастание)
    const sorted: [string, number][] = Object.entries(frequencies)
      .sort((a, b) => {
        const freqDiff = b[1].freq - a[1].freq
        if (freqDiff !== 0) return freqDiff
        return a[1].order - b[1].order
      })
      .map(([symbol, data]) => [symbol, data.freq])

    this.buildTree(this.root, sorted)
  }

  protected abstract buildTree(node: TreeNode, entries: [string, number][]): void

  public toWebTree(): TreeNode {
    return this.root
  }

  public toCodeMap(): Record<string, string> {
    const map: Record<string, string> = {}
    const traverse = (n: TreeNode | null) => {
      if (!n) return
      if (n.left === null && n.right === null && n.symbol !== null) {
        map[n.symbol] = n.code
      }
      traverse(n.left)
      traverse(n.right)
    }
    traverse(this.root)
    return map
  }
}