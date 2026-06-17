import type { CompressionStep, DecompressionResult } from "./types";

export interface LZWCode {
  code: number;
}

export interface LZWStep extends CompressionStep<LZWCode> { 
  stepIndex: number; 
  dictionary: string[]; 
}

export function lzwCompress(inputText: string, alphabet: string): LZWStep[] {
  if (!inputText) return [];

  const dictionary: string[] = alphabet.split('');
  const steps: LZWStep[] = [];
  const dictionaryMap = new Map<string, number>();

  for (let i = 0; i < dictionary.length; i++) {
    dictionaryMap.set(dictionary[i], i);
  }

  const textLength = inputText.length;
  let currentPosition = 0;
  let nextStepIndex = alphabet.length;

  while (currentPosition < textLength) {
    let currentMatch = inputText[currentPosition];
    let matchLength = 1;
    let bestDictionaryIndex = dictionaryMap.get(currentMatch) ?? -1;

    while (currentPosition + matchLength < textLength) {
      const nextChar = inputText[currentPosition + matchLength];
      const combinedPhrase = currentMatch + nextChar;

      if (dictionaryMap.has(combinedPhrase)) {
        currentMatch = combinedPhrase;
        bestDictionaryIndex = dictionaryMap.get(combinedPhrase)!;
        matchLength++;
      } else {
        break;
      }
    }

    const codeValue = bestDictionaryIndex + 1;
    steps.push({
      stepIndex: nextStepIndex++,
      dictionary: [...dictionary], 
      code: { code: codeValue },
      stringCode: codeValue.toString()
    });

    if (currentPosition + matchLength < textLength) {
      const nextChar = inputText[currentPosition + matchLength];
      const newPhrase = currentMatch + nextChar;
      
      dictionary.push(newPhrase);
      dictionaryMap.set(newPhrase, dictionary.length - 1);
    }

    currentPosition += matchLength;
  }

  return steps;
}

export function lzwDecompress(compressedCodes: LZWCode[], alphabet: string): DecompressionResult<LZWStep> {
  if (!compressedCodes || compressedCodes.length === 0) {
    return {
        resultString: '',
        steps: []
    }
  }

  const dictionary: string[] = alphabet.split('');
  const steps: LZWStep[] = [];
  
  let resultString = "";
  let nextStepIndex = alphabet.length;

  const firstCodeObj = compressedCodes[0];
  const firstDictionaryIndex = firstCodeObj.code - 1;
  
  let currentPhrase = dictionary[firstDictionaryIndex];
  resultString += currentPhrase;

  steps.push({
    stepIndex: nextStepIndex++,
    dictionary: [...dictionary],
    code: { code: firstCodeObj.code },
    stringCode: firstCodeObj.code.toString()
  });

  let previousPhrase = currentPhrase;

  for (let i = 1; i < compressedCodes.length; i++) {
    const codeObj = compressedCodes[i];
    const codeValue = codeObj.code;
    const dictionaryIndex = codeValue - 1;

    if (dictionaryIndex < dictionary.length) {
      currentPhrase = dictionary[dictionaryIndex];
    } else if (dictionaryIndex === dictionary.length) {
      currentPhrase = previousPhrase + previousPhrase[0];
    } else {
      throw new Error(`Некорректный код LZW: ${codeValue}`);
    }

    resultString += currentPhrase;

    const newPhrase = previousPhrase + currentPhrase[0];
    dictionary.push(newPhrase);

    steps.push({
      stepIndex: nextStepIndex++,
      dictionary: [...dictionary],
      code: { code: codeValue },
      stringCode: codeValue.toString()
    });

    previousPhrase = currentPhrase;
  }

    return {
    resultString: resultString,
    steps: steps,
  }
}