export interface TreeNode {
  code: string
  symbol: string | null
  symbols: string[]
  left: TreeNode | null
  right: TreeNode | null
}

export type Frequencies = Record<string, number>
export type FreqEntry = [symbol: string, freq: number]

export interface FreqWithOrder {
  symbol: string
  freq: number
  order: number
}

