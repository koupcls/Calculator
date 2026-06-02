export type Frequencies = Record<string, number>

export interface TreeData {
  expectedLength: number      // Мат. ожидание
  codes: Record<string, string> // Таблица кодов
  treeJson: string            // JSON дерева
}

export interface MetricsData {
  entropy: number             // H
  H_max: number              // H0 (макс. энтропия)
  R: number                  // Абсолютная избыточность
  r0: number                 // Относительная эффективность
  n: number                  // Длина входа
  m: number                  // Размер алфавита
}

export interface CodingState {
  input: string
  caseSensitive: boolean,
  frequencies: Frequencies
  metrics: MetricsData | null
  huffman: TreeData | null
  shannonFano: TreeData | null  // резерв на будущее
  isLoading: boolean
  error: string | null
}