import type { CompressionStep, DecompressionResult } from "./types";

export interface LZ77Code { 
  offset: number;
  length: number;
  nextChar: string;
}

export interface LZ77Step extends CompressionStep<LZ77Code> {
  dictionary: string; 
  input: string; 
}

export function lz77Compress(inputText: string): LZ77Step[] {
  if (!inputText) return [];
  
  const steps: LZ77Step[] = [];
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
        code: { offset: 0, length: 0, nextChar: currentChar },
        stringCode: `<0, 0, '${currentChar}'>`
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

    if (currentPosition + maxMatchLength + 1 >= textLength) {
      maxMatchLength -= 1;
    }

    const nextCharPosition = currentPosition + maxMatchLength;
    const nextChar = nextCharPosition < textLength ? inputText[nextCharPosition] : '';
    const calculatedOffset = maxMatchLength === 0 ? 0 : dictionaryLength - bestMatchIndex - 1;

    steps.push({
      dictionary,
      input: inputText.slice(currentPosition),
      code: { offset: calculatedOffset, length: maxMatchLength, nextChar },
      stringCode: `<${calculatedOffset}, ${maxMatchLength}, '${nextChar}'>`
    });

    dictionary += inputText.slice(currentPosition, currentPosition + maxMatchLength + 1);
    currentPosition += maxMatchLength + 1;
  }

  return steps;
}

export function lz77Decompress(codes: LZ77Code[]): DecompressionResult<LZ77Step> {
  const steps: LZ77Step[] = [];
  let currentText = '';

  for (const code of codes) {
    const { offset, length, nextChar } = code;
    const dictionaryBeforeStep = currentText;
    
    let matchStr = '';
    
    if (length > 0) {
      const startIndex = dictionaryBeforeStep.length - offset - 1;
      
      for (let i = 0; i < length; i++) {
        matchStr += dictionaryBeforeStep[startIndex + i];
      }
    }
    
    const addedString = matchStr + nextChar;
    currentText += addedString;

    steps.push({
      dictionary: dictionaryBeforeStep,
      input: addedString, 
      code: { offset, length, nextChar },
      stringCode: `<${offset}, ${length}, '${nextChar}'>`
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