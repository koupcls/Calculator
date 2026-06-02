export type CipherMode = 'encrypt' | 'decrypt';
export type CipherType = 'vigenere' | 'columnar';

export interface CipherStep {
  id: string;
  type: CipherType;
  mode: CipherMode;
  key: string;
  input: string;
  output: string | null;
  isLoading: boolean;
  error: string | null;
  visualization?: ColumnarVisualization;
  alphabet?: string;
}

export interface ColumnarVisualization {
  keyIndices: number[];
  sortedOrder: number[];
  table: string[][];
  colLengths?: number[];
  readOrder: 'columns' | 'rows';
}

export interface CipherState {
  alphabet: string;
  steps: CipherStep[];
  isLoading: boolean;
  error: string | null;
}