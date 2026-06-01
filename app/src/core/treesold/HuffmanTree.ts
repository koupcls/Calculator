import { Tree } from './Tree'
import type { TreeNode } from './types'

interface QueueNode {
  treeNode: TreeNode
  freq: number
  order: number // для стабильного сравнения при равных частотах
}

export class HuffmanTree extends Tree {
  protected buildTree(_root: TreeNode, entries: [string, number][]): void {
    // entries уже отсортированы: freq desc → order asc
    const pq: QueueNode[] = entries.map(([symbol, freq], index) => ({
      treeNode: { 
        code: '', 
        symbol, 
        symbols: [symbol],
        left: null, 
        right: null 
      },
      freq,
      order: index // используем индекс в отсортированном списке как порядок
    }))

    while (pq.length > 1) {
      // Сортируем: freq asc → order asc (стабильный выбор при равенстве)
      pq.sort((a, b) => {
        if (a.freq !== b.freq) return a.freq - b.freq
        return a.order - b.order
      })
      
      const first = pq.shift()!
      const second = pq.shift()!

      const parent: TreeNode = {
        code: '',
        symbol: null,
        symbols: [...first.treeNode.symbols, ...second.treeNode.symbols],
        left: first.treeNode,
        right: second.treeNode
      }

      pq.push({ 
        treeNode: parent, 
        freq: first.freq + second.freq,
        order: Math.min(first.order, second.order) // наследуем меньший порядок
      })
    }

    this.root = pq[0]?.treeNode || this.root
    this.generateCodes(this.root, '')

    // Edge-case: один символ
    if (this.root.left === null && this.root.right === null && this.root.code === '') {
      this.root.code = '0'
    }
  }

  private generateCodes(node: TreeNode | null, currentCode: string): void {
    if (!node) return
    node.code = currentCode
    if (node.left === null && node.right === null) return
    this.generateCodes(node.left, currentCode + '0')
    this.generateCodes(node.right, currentCode + '1')
  }
}