import type { ColumnarVisualization } from "./storeTypes";

export type CipherMode = 'encrypt' | 'decrypt';

export function vigenereCipher(
  text: string,
  key: string,
  alphabet: string,
  mode: CipherMode = 'encrypt'
): string {
  if (!alphabet) throw new Error('Alphabet cannot be empty');
  if (!key) return text;

  const len = alphabet.length;
  let result = '';
  let keyIndex = 0;

  for (const char of text) {
    const charIdx = alphabet.indexOf(char);
    if (charIdx === -1) {
      result += char;
      continue;
    }

    const keyChar = key[keyIndex % key.length];
    const keyIdx = alphabet.indexOf(keyChar);

    if (keyIdx === -1) {
      keyIndex++;
      result += char;
      continue;
    }

    const shift = keyIdx + 1;
    const signedShift = mode === 'encrypt' ? shift : -shift;
    
    const newIdx = ((charIdx + signedShift) % len + len) % len;
    
    result += alphabet[newIdx];
    keyIndex++;
  }
  return result;
}

export interface ColumnarOutput {
  result: string;
  visualization: ColumnarVisualization;
}

export function columnarTransposition(
  text: string,
  key: string,
  alphabet: string,
  mode: CipherMode = 'encrypt'
): ColumnarOutput {
  if (!key) throw new Error('Key cannot be empty');

  const keyLength = key.length;
  const keyIndices = Array.from({ length: keyLength }, (_, i) => i);

  keyIndices.sort((a, b) => {
    const idxA = alphabet.indexOf(key[a]);
    const idxB = alphabet.indexOf(key[b]);
    return idxA === idxB ? a - b : idxA - idxB;
  });

  const data = mode === 'encrypt'
    ? encryptColumnar(text, keyLength, keyIndices)
    : decryptColumnar(text, keyLength, keyIndices);

  return {
    result: data?.result!,
    visualization: {
      table: data?.table!,
      sortedOrder: keyIndices
    }
  };
}

function encryptColumnar(text: string, keyLength: number, sortedIndices: number[]) {
  const numRows = Math.ceil(text.length / keyLength);
  const table: string[][] = Array.from({ length: numRows }, () => Array(keyLength).fill(''));

  for (let i = 0; i < text.length; i++) {
    table[Math.floor(i / keyLength)][i % keyLength] = text[i];
  }

  let result = '';
  for (const colIdx of sortedIndices) {
    for (let row = 0; row < numRows; row++) {
      if (table[row][colIdx]) result += table[row][colIdx];
    }
  }

  return { result, table };
}

function decryptColumnar(text: string, keyLength: number, sortedIndices: number[]) {
  const numRows = Math.trunc(text.length / keyLength);
  const remainder = text.length % keyLength;
  
  const colLengths: number[] = Array(keyLength).fill(0);
  for (let i = 0; i < keyLength; i++) {
    if (remainder === 0) colLengths[i] = numRows;
    else colLengths[i] = i < remainder ? numRows + 1 : numRows;
  }

  const maxRows = remainder === 0 ? numRows : numRows + 1;
  const table: string[][] = Array.from({ length: maxRows }, () => Array(keyLength).fill(''));
  let textIndex = 0;

  for (const colIdx of sortedIndices) {
    for (let rowIdx = 0; rowIdx < colLengths[colIdx]; rowIdx++) {
      if (textIndex < text.length) {
        table[rowIdx][colIdx] = text[textIndex++];
      }
    }
  }

  let result = '';
  for (let row = 0; row < maxRows; row++) {
    for (let col = 0; col < keyLength; col++) {
      if (table[row][col] !== '') {
        result += table[row][col];
      }
    }
  }

  return { result, table };
}

