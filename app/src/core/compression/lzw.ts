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


    steps.push({
      stepIndex: alphabet.length,
      dictionary: [...dictionary], 
      code: { code: -1 },
      stringCode: ''
    });

  for (let i = 0; i < dictionary.length; i++) {
    dictionaryMap.set(dictionary[i], i);
  }

  const textLength = inputText.length;
  let currentPosition = 0;
  let nextStepIndex = alphabet.length + 1;

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

    if (currentPosition + matchLength < textLength + 1) {
      const pos = currentPosition + matchLength;
      const nextChar = pos >= inputText.length ?  '' : inputText[currentPosition + matchLength];
      const newPhrase = currentMatch + nextChar;
      
      dictionary.push(newPhrase);
      dictionaryMap.set(newPhrase, dictionary.length - 1);
    }

    steps.push({
      stepIndex: nextStepIndex++,
      dictionary: [...dictionary], 
      code: { code: codeValue },
      stringCode: codeValue.toString()
    });

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

  steps.push({
    stepIndex: nextStepIndex++,
    dictionary: [...dictionary],
    code: { code: -1 },
    stringCode: '-'
  });

  const firstCodeObj = compressedCodes[0];
  const firstDictionaryIndex = firstCodeObj.code - 1;
  
  let currentPhrase = dictionary[firstDictionaryIndex];
  resultString += currentPhrase;

  let pendingCodeValue = firstCodeObj.code;
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
    previousPhrase = currentPhrase;

    steps.push({
      stepIndex: nextStepIndex++,
      dictionary: [...dictionary],
      code: { code: pendingCodeValue },
      stringCode: pendingCodeValue.toString()
    });

    pendingCodeValue = codeValue;
  }

if (pendingCodeValue !== null) {
    dictionary.push(currentPhrase[0]);
    steps.push({
      stepIndex: nextStepIndex,
      dictionary: [...dictionary],
      code: { code: pendingCodeValue },
      stringCode: pendingCodeValue.toString()
    });
  }

  return {
    resultString: resultString,
    steps: steps,
  }
}
