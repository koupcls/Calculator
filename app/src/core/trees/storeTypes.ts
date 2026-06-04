export type Frequencies = Record<string, number>
export type Codes = Record<string, string>

export interface TreeData {
  expectedLength: number      // Мат. ожидание
  codes: Codes                // Таблица кодов
  treeJson: string            // JSON дерева
  codedLine: string           // Закодированная строка
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
  shannonFano: TreeData | null
  isLoading: boolean
  error: string | null
}