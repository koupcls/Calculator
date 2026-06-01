import { Tree } from './Tree'
import type { TreeNode, FreqEntry } from './types'

export class ShannonFanoTree extends Tree {
  protected buildTree(node: TreeNode, entries: FreqEntry[]): void {
    node.symbols = entries.map(([c]) => c)
    if (entries.length <= 1) {
      if (entries.length === 1) node.symbol = entries[0][0]
      return
    }

    const total = entries.reduce((s, [, f]) => s + f, 0)
    const half = total / 2
    let cur = 0, split = 0

    if (entries.length === 2) split = 1
    else {
      for (const [, freq] of entries) {
        cur += freq; split++
        if (cur >= half) {
          const dA = cur - half, dB = freq - dA
          if (dA > dB) split--
          break
        }
      }
    }
    split = Math.max(1, Math.min(split, entries.length - 1))

    node.left = { code: node.code + '0', symbol: null, symbols: [], left: null, right: null }
    node.right = { code: node.code + '1', symbol: null, symbols: [], left: null, right: null }

    this.buildTree(node.left, entries.slice(0, split))
    this.buildTree(node.right, entries.slice(split))
  }
}