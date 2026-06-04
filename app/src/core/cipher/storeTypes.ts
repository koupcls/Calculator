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
  table: string[][];
  sortedOrder: number[];
}

export interface CipherState {
  alphabet: string;
  defaultAlphabet: string;
  caseSensitive: boolean;
  steps: CipherStep[];
  isLoading: boolean;
  error: string | null;
}