import type { CompressionStep, DecompressionResult } from "./types";

export interface LZ78Code { 
  dictIndex: number; 
  symbol: string; 
}

export interface LZ78Step extends CompressionStep<LZ78Code> { 
  stepIndex: number; 
  dictionary: string[]; 
}

export function lz78Compress(inputText: string): LZ78Step[] {
  const dictionary: string[] = [];
  const steps: LZ78Step[] = [];
  const textLength = inputText.length;
  let currentPosition = 0;

  while (currentPosition < textLength) {
    const currentChar = inputText[currentPosition];
    let maxMatchLength = 0;
    let bestDictionaryIndex = -1;

    for (let i = 0; i < dictionary.length; i++) {
      if (dictionary[i][0] === currentChar) {
        const prefix = dictionary[i];
        let matchCount = 0;
        let isPrefixFullyMatched = true;

        for (; matchCount < prefix.length && currentPosition + matchCount < textLength; matchCount++) {
          if (inputText[currentPosition + matchCount] !== prefix[matchCount]) {
            isPrefixFullyMatched = false;
            break;
          }
        }

        if (isPrefixFullyMatched && matchCount > maxMatchLength) {
          maxMatchLength = matchCount;
          bestDictionaryIndex = i;
        }
      }
    }

    if (bestDictionaryIndex === -1) {
      steps.push({
        stepIndex: steps.length,
        dictionary: [...dictionary],
        code: { dictIndex: 0, symbol: currentChar },
        stringCode: `<0, '${currentChar}'>`
      });
      dictionary.push(currentChar);
      currentPosition++;
    } else {
      const nextChar = inputText[currentPosition + maxMatchLength] || '';
      const displayDictIndex = bestDictionaryIndex + 1;

      steps.push({
        stepIndex: steps.length,
        dictionary: [...dictionary],
        code: { dictIndex: displayDictIndex, symbol: nextChar },
        stringCode: `<${displayDictIndex}, '${nextChar}'>`
      });
      dictionary.push(dictionary[bestDictionaryIndex] + nextChar);
      currentPosition += maxMatchLength + 1;
    }
  }

  return steps;
}

export function lz78Decompress(codes: LZ78Code[]): DecompressionResult<LZ78Step> {
  const dictionary: string[] = [];
  const steps: LZ78Step[] = [];
  let currentText = '';

  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];
    let addedString = '';

    if (code.dictIndex === 0) {
      addedString = code.symbol;
    } else {
      // dictIndex в коде начинается с 1 (0 зарезервирован для отсутствия совпадений)
      addedString = dictionary[code.dictIndex - 1] + code.symbol;
    }

    steps.push({
      stepIndex: i,
      dictionary: [...dictionary],
      code,
      stringCode: `<${code.dictIndex}, '${code.symbol}'>`
    });

    dictionary.push(addedString);
    currentText += addedString;
  }

  return {
    resultString: currentText,
    steps: steps,
  }
}