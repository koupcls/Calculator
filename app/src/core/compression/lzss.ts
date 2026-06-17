import type { CompressionStep, DecompressionResult } from "./types";

export interface LZSSCode { 
  isLiteral: boolean; 
  offset?: number; 
  length?: number; 
  symbol: string; 
}

export interface LZSSStep extends CompressionStep<LZSSCode> { 
  dictionary: string; 
  input: string; 
}

export function lzssCompress(inputText: string): LZSSStep[] {
  if (!inputText) return [];
  
  const steps: LZSSStep[] = [];
  const textLength = inputText.length;
  let currentPosition = 0;
  let dictionary = '';

  while (currentPosition < textLength) {
    const currentChar = inputText[currentPosition];
    const dictionaryLength = dictionary.length;

    if (dictionary.indexOf(currentChar) === -1) {
      steps.push({
        dictionary,
        input: inputText.slice(currentPosition),
        code: { isLiteral: true, symbol: currentChar },
        stringCode: `0, '${currentChar}'`
      });
      dictionary += currentChar;
      currentPosition++;
      continue;
    }

    let bestMatchIndex = 0;
    let maxMatchLength = 0;

    for (let i = dictionaryLength - 1; i >= 0; i--) {
      if (dictionary[i] === currentChar) {
        let currentMatchLength = 0;
        const matchStartOffset = currentPosition - dictionaryLength + i;
        
        while (matchStartOffset + currentMatchLength < currentPosition) {
          if (inputText[matchStartOffset + currentMatchLength] === inputText[currentPosition + currentMatchLength]) {
            currentMatchLength++;
          } else {
            break;
          }
        }

        if (currentMatchLength > maxMatchLength) {
          maxMatchLength = currentMatchLength;
          bestMatchIndex = i;
        }
      }
    }

    const symbolPosition = currentPosition + maxMatchLength - 1;
    const symbol = symbolPosition < textLength ? inputText[symbolPosition] : '';
    const calculatedOffset = dictionaryLength - bestMatchIndex - 1;

    steps.push({
      dictionary,
      input: inputText.slice(currentPosition),
      code: { isLiteral: false, offset: calculatedOffset, length: maxMatchLength, symbol },
      stringCode: `1, <${calculatedOffset}, ${maxMatchLength}>`
    });

    dictionary += inputText.slice(currentPosition, currentPosition + maxMatchLength);
    currentPosition += maxMatchLength;
  }

  return steps;
}


export function lzssDecompress(codes: LZSSCode[]): DecompressionResult<LZSSStep> {
  const steps: LZSSStep[] = [];
  let currentText = '';

  for (const code of codes) {
    const dictionaryBeforeStep = currentText;
    let addedString = '';

    if (code.isLiteral) {
      addedString = code.symbol;
    } else {
      const startIndex = dictionaryBeforeStep.length - (code.offset || 0) - 1;
      const length = code.length || 0;
      
      for (let i = 0; i < length; i++) {
        addedString += dictionaryBeforeStep[startIndex + (i % ((code.offset || 0) + 1))];
      }
    }

    currentText += addedString;

    steps.push({
      dictionary: dictionaryBeforeStep,
      input: addedString,
      code,
      stringCode: code.isLiteral ? `0, '${code.symbol}'` : `1, <${code.offset}, ${code.length}>`
    });
  }


  for (let i = 0; i < steps.length; i++) {
    steps[i].input = currentText.slice(steps[i].dictionary.length);
  }
  
  return {
    resultString: currentText,
    steps: steps,
  }
}